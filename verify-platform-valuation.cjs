'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {loadResearch, classify} = require('./scripts/alert-quotes.cjs');
class ReviewClock extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-11-19T15:00:00Z'])); }
}
const html = fs.readFileSync('index.html', 'utf8');
const nodes = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([,id]) => [id, {
  value:'', innerHTML:'', textContent:'', options:[{},{},{}], showModal(){}, close(){}, remove(){},
}]));
nodes.tier.value = 'all';
const ctx = vm.createContext({
  window:{}, Date:ReviewClock, Intl, console, setTimeout:()=>1,
  document:{getElementById:id=>nodes[id]??null, createElement:()=>({}), body:{appendChild(){}}},
});
const plain = value => JSON.parse(JSON.stringify(value));
let previous;
for (const [,file] of html.matchAll(/<script src="([^"?]+)(?:\?[^"<]*)?"><\/script>/g)) {
  if (file.startsWith('platform-valuation-')) previous = plain(ctx.window.RESEARCH.assets);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, {filename:file});
}
const assets = ctx.window.RESEARCH.assets;
const run = code => vm.runInContext(code, ctx);
assert.equal(assets.length, 61);
for (const asset of assets) {
  const old = previous.find(x=>x.code===asset.code);
  assert.deepEqual(plain(asset.portfolio), old.portfolio);
  if (!['00700','09988'].includes(asset.code)) assert.deepEqual(plain(asset), old);
}
const expected = {
  '00700': {returns:['313.51','487.38','689.22'], band:['337.19','348.50'], ten:'360.44', stress:'178.72', cut:'314.24', close:348.40, inBand:340},
  '09988': {returns:['62.29','113.06','170.62'], band:['74.24','76.73'], ten:'79.36', stress:'47.41', cut:'70.01', close:80.55, inBand:75},
};
const fx = ctx.window.RESEARCH.hkdCny;
const alertCtx = loadResearch();
for (const [code,want] of Object.entries(expected)) {
  const asset = assets.find(x=>x.code===code);
  const find = `state.find(x=>x.code==='${code}')`;
  const v = run(`value(${find})`);
  assert.equal(v.targetDate, '2028-05-19');
  assert.equal(asset.snapshot.price, want.close);
  assert.equal(asset.nextDisclosure, undefined);
  assert.equal(asset.executionHold, true);
  assert.deepEqual(plain(v.cases).map(n=>(n/fx).toFixed(2)), want.returns);
  assert.deepEqual([v.lo,v.hi].map(n=>(n/fx).toFixed(2)), want.band);
  assert.equal(v.thresholds.at(-1).prices[0].toFixed(2), want.ten);
  assert.equal(run(`platformExit(${find}.model,${find}.model.stress)`).toFixed(2), want.stress);
  assert.equal(run(`platformThresholds(${find}.model,1).at(-1).prices[1]`).toFixed(2), want.cut);
  assert.deepEqual(plain(run(`value({...(${find}),quote:{price:1}})`)), plain(v));
  run(`openDetail(${find})`);
  for (const value of [...want.returns,want.ten,want.stress]) assert.ok(nodes.dBody.innerHTML.includes(value), value);
  assert.match(nodes.dBody.innerHTML,/现金流复核/);
  assert.doesNotMatch(nodes.dBody.innerHTML,/undefined|NaN|等待Q3|阿里待11月19日/);
  assert.match(nodes.platformPrices.textContent,new RegExp(want.band.join('–')));
  const row = classify(alertCtx, alertCtx.assets.find(x=>x.code===code), {price:want.inBand,time:'20261119160807'});
  assert.equal(row.bucket, 'zone');
  assert.match(row.condition,/暂不启用/);
  assert.deepEqual([row.low,row.high].map(n=>n.toFixed(2)),want.band);
}
assert.match(nodes.idealGrid.innerHTML,/337\.19–348\.50 HKD/);
assert.match(nodes.excludedRows.innerHTML,/74\.24–76\.73 HKD/);
assert.match(nodes.validationRows.innerHTML,/223\.45–253\.24 HKD/);
console.log('PASS unified Tencent and Alibaba valuation: scenario math, thresholds, UI, alerts, and portfolio preservation.');
