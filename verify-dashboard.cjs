// Deterministic checks for allocation, valuation and misleading trade signals.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},console,Intl,Date};vm.createContext(ctx);
const layers=['review-data.js','research-audit.js','independent-research.js','new-assets.js','etf-lookthrough.js','opportunity-expansion.js','audit-updates.js','portfolio-data.js','core-validation.js'];
for(const f of layers)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
vm.runInContext(fs.readFileSync('app.js','utf8').split("$('macro').innerHTML")[0],ctx);
const check=code=>vm.runInContext(code,ctx),r=ctx.window.RESEARCH;
assert.equal(r.assets.length,52);assert.equal(new Set(r.assets.map(x=>x.code)).size,52);
assert.equal(new Set(r.assets.map(x=>x.key)).size,52);
const core=r.assets.filter(x=>x.portfolio.included);
assert.equal(core.length,15);assert.equal(core.reduce((s,x)=>s+x.portfolio.weight,0),85);assert.equal(r.portfolio.cash,15);
assert.deepEqual(Array.from(r.assets,x=>x.portfolio.rank).sort((a,b)=>a-b),Array.from({length:52},(_,i)=>i+1));
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
assert.equal((nodes.excludedRows.innerHTML.match(/<tr /g)||[]).length,37);
assert.equal((nodes.rows.innerHTML.match(/<tr /g)||[]).length,52);
assert.equal((nodes.validationRows.innerHTML.match(/<tr /g)||[]).length,15);
vm.runInContext('for(const x of state)openDetail(x)',domCtx);
assert.ok(!nodes.idealGrid.innerHTML.includes('极端错杀区'));
console.log('PASS: 52 unique assets, 15 core, 85% equity + 15% cash, 10 ETF order/coverage checks, all price models, HKD conversion and 5 signal guards.');
