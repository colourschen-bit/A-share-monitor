// Deterministic checks for allocation, valuation and misleading trade signals.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},console,Intl,Date};vm.createContext(ctx);
const layers=['review-data.js','research-audit.js','independent-research.js','new-assets.js','etf-lookthrough.js','opportunity-expansion.js','audit-updates.js','watchlist-nine.js','portfolio-data.js','core-validation.js','excluded-review.js'];
for(const f of layers)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
vm.runInContext(fs.readFileSync('app.js','utf8').split("$('macro').innerHTML")[0],ctx);
const check=code=>vm.runInContext(code,ctx),r=ctx.window.RESEARCH;
assert.equal(r.assets.length,61);assert.equal(new Set(r.assets.map(x=>x.code)).size,61);
assert.equal(new Set(r.assets.map(x=>x.key)).size,61);
const core=r.assets.filter(x=>x.portfolio.included);
assert.equal(core.length,15);assert.equal(core.reduce((s,x)=>s+x.portfolio.weight,0),85);assert.equal(r.portfolio.cash,15);
assert.deepEqual(Array.from(r.assets,x=>x.portfolio.rank).sort((a,b)=>a-b),Array.from({length:61},(_,i)=>i+1));
for(const x of r.assets){
 const result=check(`value(state.find(x=>x.code==='${x.code}'))`);
 assert.ok(result&&result.lo>0&&result.hi>result.lo&&Number.isFinite(result.ev),x.code+' valid zone');
 assert.equal(x.tier==='core',x.portfolio.included);
 assert.ok(x.analysis&&x.catalyst&&x.risk&&x.source,x.code+' evidence and disconfirmation');
 if(x.model.type==='lookthrough'){
  const m=x.model;assert.equal(m.top10.length,10);assert.equal(new Set(m.top10.map(h=>h.code)).size,10);
  assert.ok(m.top10.every((h,i,a)=>h.weight>0&&(!i||a[i-1].weight>=h.weight)),x.code+' holding order');
  assert.ok(m.coverage>0&&m.coverage<=100);assert.ok(x.audit.missing.includes('绝对价锚'));
  for(const h of m.top10.filter(h=>h.code==='09988'))assert.match(h.quality,/高资本开支/);
 }
}
// Prices in the zone must not imply that unverified business conditions passed.
assert.match(check(`(()=>{const x=state.find(x=>x.code==='600941'),v=value(x);return buyState({...x,gate:'pending',quote:{price:(v.lo+v.hi)/2,time:'20261022150000'}})[0]})()`),/条件待核验/);
assert.match(check(`buyState({...state[0],gate:'failed',quote:{price:1,time:'20261022150000'}})[0]`),/失效/);
assert.match(check(`buyState({...state[0],quote:{price:1,time:'20991022150000'}})[0]`),/日期无效/);
assert.match(check(`buyState({...state[0],quote:null})[0]`),/缺有效行情/);
assert.match(check(`(()=>{const previous=research.window[1];research.window[1]='2000-01-01';const result=buyState(state[0])[0];research.window[1]=previous;return result})()`),/过期/);
// HKD earnings are converted once: the native fair value is 1.9*11=20.9 HKD.
assert.ok(Math.abs(check(`value(state.find(x=>x.code==='01193')).ev/research.hkdCny`)-20.9)<1e-10);
assert.deepEqual(Array.from(r.assets.find(x=>x.code==='603444').model.inputs),[22,26.5,30]);
assert.ok(!core.some(x=>['001280','603993'].includes(x.code)));
assert.equal(core.filter(x=>x.validation?.priceGrade==='价格依据初步支持').length,4);
assert.equal(core.filter(x=>x.validation?.priceGrade==='需要额外条件').length,5);
assert.equal(core.filter(x=>x.validation?.priceGrade==='原买价依据偏弱').length,6);
assert.equal(r.assets.find(x=>x.code==='605499').model.inputs[1],7.3);
assert.ok(Math.abs(check(`value(state.find(x=>x.code==='600036')).pv`)-45.4*.9)<1e-9);
assert.ok(Math.abs(r.assets.find(x=>x.code==='02328').model.inputs[1]-(303688000000/22242765303-.34))<1e-9);
for(const x of core.filter(x=>x.validation.cross)){
 assert.equal(x.validation.cross.flows.length,10);
 assert.ok(x.validation.sensitivity[0]<x.validation.cross.pv&&x.validation.sensitivity[1]>x.validation.cross.pv);
 assert.ok(x.validation.cross.terminalShare>0&&x.validation.cross.terminalShare<1);
}
// Execute the complete page bootstrap and every detail renderer against DOM stubs.
const nodes={};for(const match of fs.readFileSync('index.html','utf8').matchAll(/id="([^"]+)"/g))nodes[match[1]]={value:'',innerHTML:'',textContent:'',options:[{},{},{}],showModal(){},close(){},remove(){}};
nodes.tier.value='all';
const domCtx={window:{},console,Intl,Date,setTimeout:()=>1,clearTimeout(){},document:{getElementById:id=>nodes[id]||null,createElement:()=>({}),body:{appendChild(){}}}};
vm.createContext(domCtx);for(const f of [...layers,'app.js'])vm.runInContext(fs.readFileSync(f,'utf8'),domCtx,{filename:f});
assert.equal((nodes.idealGrid.innerHTML.match(/data-code=/g)||[]).length,15);
assert.equal((nodes.excludedRows.innerHTML.match(/<tr /g)||[]).length,46);
assert.equal((nodes.rows.innerHTML.match(/<tr /g)||[]).length,61);
assert.equal((nodes.validationRows.innerHTML.match(/<tr /g)||[]).length,15);
assert.ok(!nodes.additionRows);
assert.ok(!/NEW RESEARCH|id="newNine"|value="additions"/.test(fs.readFileSync('index.html','utf8')));
const added=r.assets.filter(x=>x.additionReview).sort((a,b)=>a.additionReview.rank-b.additionReview.rank);
assert.deepEqual(Array.from(added,x=>x.code),['603195','002142','601838','002032','601009','600096','600132','000568','002555']);
assert.ok(added.every(x=>x.gate==='pending'&&!x.portfolio.included&&!x.snapshot));
assert.ok(added.every(x=>x.sources.every(([label,url])=>label&&typeof url==='string'&&url.startsWith('https://'))));
assert.ok(!/\]\((?:undefined|null)\)/.test(fs.readFileSync('WATCHLIST-NINE-2026-10-23.md','utf8')));
assert.equal(added.find(x=>x.code==='002032').reportPeriod,'2026-09-30');
// Ordinary shareholder book values exclude other capital and reserve only the
// specified subsequent dividend, once. PB values are already present values.
for(const [code,bps,pb]of [['002142',36.36,1],['601838',21.271,1],['601009',15.62,.85]]){
 const x=added.find(x=>x.code===code);assert.ok(Math.abs(x.model.inputs[1]-bps)<1e-9);
 assert.ok(Math.abs(check(`value(state.find(x=>x.code==='${code}')).pv`)-bps*pb)<1e-9);
}
assert.ok(Math.abs(added.find(x=>x.code==='600132').additionReview.cashCheck.afterMinority-2.039)<.002);
assert.ok(added.find(x=>x.code==='000568').additionReview.cashCheck.perShare<1);
assert.ok(added.find(x=>x.code==='603195').additionReview.cashCheck.perShare>2.36);
assert.match(check(`(()=>{const x=state.find(x=>x.code==='000568'),v=value(x);return buyState({...x,quote:{price:(v.lo+v.hi)/2,time:'20261022150000'}})[0]})()`),/现金恢复前仅观察/);
nodes.tier.value='core';vm.runInContext('render()',domCtx);
assert.equal((nodes.rows.innerHTML.match(/<tr /g)||[]).length,15);
nodes.tier.value='all';vm.runInContext('render()',domCtx);
const expectedCore=["00700","600941","600036","002270","000333","02328","600938","600900","300760","002028","605499","02057","001872","600406","603444"];
assert.deepEqual(Array.from(core).sort((a,b)=>a.portfolio.rank-b.portfolio.rank).map(x=>x.code),expectedCore);
assert.deepEqual(Object.fromEntries(expectedCore.map(code=>[code,core.find(x=>x.code===code).portfolio.weight])),{'00700':8,'600941':8,'600036':7,'002270':5,'000333':6,'02328':6,'600938':6,'600900':5,'300760':5,'002028':6,'605499':5,'02057':5,'001872':4,'600406':5,'603444':4});
const expectedExcluded=["603195","002142","600660","002032","600690","601838","600096","603993","601899","601009","01193","601318","300124","603345","603606","601058","601728","002472","600132","000807","520550","601816","001280","600583","600875","09988","002463","000792","002555","002438","000568","513260","159928","562550","601872","002318","002335","516120","513090","688313","513120","588000","589720","159530","601012","300207"];
const excluded=r.assets.filter(x=>!x.portfolio.included).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
assert.deepEqual(Array.from(excluded,x=>x.code),expectedExcluded);
assert.ok(excluded.every(x=>x.rankReview&&x.rankReview.reason&&x.rankReview.pricing&&x.rankReview.anchor&&x.rankReview.date==='2026-10-23'));
assert.equal(new Set(excluded.map(x=>x.rankReview.previousRank)).size,46);
assert.equal(excluded.filter(x=>x.rankReview.group==='B').length,12);
assert.equal(excluded.filter(x=>x.rankReview.group==='C').length,27);
assert.equal(excluded.filter(x=>x.rankReview.group==='D').length,7);
assert.ok(excluded.findIndex(x=>x.kind==='ETF')<excluded.findIndex(x=>x.code==='002318'));
assert.ok(!/const grades=i=>/.test(fs.readFileSync('portfolio-data.js','utf8')));
assert.equal(r.assets.find(x=>x.code==='601728').reportPeriod,'2026-09-30');
assert.deepEqual(Array.from(r.assets.find(x=>x.code==='601728').model.inputs),[.32,.37,.43]);
assert.match(r.assets.find(x=>x.code==='601728').fact,/537.55/);
assert.match(r.assets.find(x=>x.code==='01193').analysis.quality,/11.4/);
assert.ok(!r.assets.find(x=>x.code==='01193').analysis.limit.includes('未能读取'));
assert.ok(fs.readFileSync('index.html','utf8').indexOf('id="idealGrid"')<fs.readFileSync('index.html','utf8').indexOf('id="validationRows"'));
for(const x of r.assets){vm.runInContext(`openDetail(state.find(x=>x.code==='${x.code}'))`,domCtx);assert.ok(!nodes.dBody.innerHTML.includes('本轮新增研究'));if(x.rankReview)assert.match(nodes.dBody.innerHTML,/候选排序核验/);}

assert.ok(!nodes.idealGrid.innerHTML.includes('极端错杀区'));
console.log('PASS: 61 unique assets, 46 individually reviewed candidate ranks/grades, 9 detailed reviews retained, no batch panel/filter, 15 core, 85% equity + 15% cash, bank ordinary BPS/dividends/PB, minority cash bridge, cash-recovery gate, 10 ETF order/coverage checks, all price models, HKD conversion and signal guards.');
