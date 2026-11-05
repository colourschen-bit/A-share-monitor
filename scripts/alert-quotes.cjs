'use strict';
// Reuse the dashboard's actual data layers and valuation functions, without its UI.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
function loadResearch() {
  const ctx = vm.createContext({window: {}, Intl, Date, console});
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"<]*)?"><\/script>/g)].map(m => m[1]);
  if (!files.includes('app.js')) throw Error('Dashboard script list not found');
  for (const file of files) {
    if (file === 'app.js') {
      const code = fs.readFileSync(path.join(root, file), 'utf8');
      const end = code.indexOf("\n$('macro').innerHTML");
      if (end < 0) throw Error('Dashboard UI boundary changed; review alert loader');
      vm.runInContext(code.slice(0, end), ctx, {filename: file, timeout: 5000});
    } else {
      if (!/^[a-z-]+\.js$/.test(file)) throw Error('Unexpected data script');
      vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, {filename: file, timeout: 5000});
    }
  }
  ctx.assets = ctx.window.RESEARCH.assets;
  return ctx;
}
function parseQuote(text, key, now) {
  const match = text.match(/v_([a-z]+\d+)="([^"]*)"/);
  if (!match || match[1] !== key) throw Error('Quote symbol mismatch');
  const a = match[2].split('~'), price = Number(a[3]), time = a[30];
  if (a[2] !== key.replace(/^[a-z]+/, '') || !Number.isFinite(price) || price <= 0 || !/^\d{14}$/.test(time || '')) throw Error('Invalid quote fields');
  const iso = `${time.slice(0,4)}-${time.slice(4,6)}-${time.slice(6,8)}T${time.slice(8,10)}:${time.slice(10,12)}:${time.slice(12,14)}+08:00`;
  const stamp = Date.parse(iso), age = now.getTime() - stamp;
  const date = new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Shanghai'}).format(now);
  if (!Number.isFinite(stamp) || iso.slice(0,10) !== date || age < -120000 || age > 20*60000) throw Error('Stale or future quote');
  return {price, time, source:'TENCENT'};
}
function classify(ctx, asset, quote) {
  ctx.asset = {...asset, quote};
  return vm.runInContext(`(() => {
    const x = asset, v = value(x);
    if (!v || modelIsDue(x) || x.gate === 'failed') return null;
    if (![v.lo, v.hi, v.pv].every(Number.isFinite) || !(v.lo > 0 && v.lo <= v.hi && v.hi <= v.pv)) return null;
    const p = price(x), fx = x.market === 'HK' ? research.hkdCny : 1;
    const bucket = p < v.lo ? 'below' : p <= v.hi ? 'zone' : p > v.pv ? 'above' : 'between';
    return {key:x.key, name:x.name, code:x.code, market:x.market, bucket,
      price:x.quote.price, time:x.quote.time, source:x.quote.source,
      low:v.lo/fx, high:v.hi/fx, reference:v.pv/fx,
      modelKey:JSON.stringify([v.lo,v.hi,v.pv,research.hkdCny,x.modelReviewDueAt]),
      condition:executionText(x), next:x.catalyst || '',
      fxDate:research.hkdCnyDate || '见看板汇率说明'};
  })()`, ctx, {timeout:5000});
}
async function main() {
  const ctx = loadResearch(), now = new Date();
  const assets = ctx.assets.filter(x => x.portfolio?.included);
  const rows = [], skipped = [];
  for (const asset of assets) {
    try {
      const response = await fetch('https://qt.gtimg.cn/q=' + asset.key, {signal:AbortSignal.timeout(12000)});
      if (!response.ok) throw Error('Quote HTTP ' + response.status);
      const text = new TextDecoder('gbk').decode(await response.arrayBuffer());
      const quote = parseQuote(text, asset.key, now);
      const row = classify(ctx, asset, quote);
      if (row) rows.push(row); else skipped.push({key:asset.key, reason:'模型缺失、已到复核日、论点失效或区间无效'});
    } catch (e) { skipped.push({key:asset.key, reason:e.message}); }
  }
  process.stdout.write(JSON.stringify({checkedAt:now.toISOString(), rows, skipped}));
}
module.exports = {loadResearch, parseQuote, classify};
if (require.main === module) main().catch(e => {console.error(e.message); process.exitCode=1;});
