'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Clock extends Date{constructor(...a){super(...(a.length?a:['2026-11-18T11:00:00Z']));}}
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script src="([^?]+)\?/g)].map(m=>m[1]).filter(f=>!f.startsWith('platform-valuation-'));
const nodes={};for(const [,id] of html.matchAll(/id="([^"]+)"/g))nodes[id]={value:'',innerHTML:'',textContent:'',options:[{},{},{}],showModal(){},close(){},remove(){}};
nodes.tier.value='all';
const ctx=vm.createContext({window:{},console,Intl,Date:Clock,setTimeout:()=>1,clearTimeout(){},document:{getElementById:k=>nodes[k]||null,createElement:()=>({}),body:{appendChild(){}}}});
const run=s=>vm.runInContext(s,ctx),plain=x=>JSON.parse(JSON.stringify(x));
let old;
for(const f of scripts){
 if(f.startsWith('tencent-review-'))old=plain(ctx.window.RESEARCH.assets);
 run(fs.readFileSync(f,'utf8'));
}
assert.ok(old);
const r=ctx.window.RESEARCH,t=r.assets.find(x=>x.code==='00700'),a=t.tencentReview.actual;
for(const x of r.assets)if(x.code!=='00700')assert.deepEqual(plain(x),old.find(z=>z.code===x.code));
assert.deepEqual(plain(t.portfolio),old.find(z=>z.code==='00700').portfolio);
assert.equal(r.portfolio.cash,15);
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-8,`${x} != ${y}`);
near(a.q3.operating-a.q3.capexPaid-a.q3.content-a.q3.lease,a.q3.fcf);
near(a.q3.excludingPrepayment-a.q3.fcf,86);
near(a.q1Fcf+a.q2.fcf+a.q3.fcf,-26.2);
near(a.q4PriorFcf+a.q1Fcf+a.q2.fcf+a.q3.fcf,7.8);
assert.equal(t.reportPeriod,'2026-09-30');
assert.equal(t.nextDisclosure,undefined);
assert.equal(t.executionHold,true);
assert.equal(t.conditionStatus,'pending');
assert.equal(t.modelReviewedAt,'2026-11-18');
const base=t.tencentReview.scenarios[1],fx=r.hkdCny;
assert.deepEqual(plain(base.flows),[95,128,155,175,195]);
const manual=(95/1.11+128/1.11**2+155/1.11**3+175/1.11**4+195/1.11**5+195*1.03/.08/1.11**5+505.4*.6)/9.125;
near(base.pv,manual);
const v=run("value(state.find(x=>x.code==='00700'))");
near(v.pv,manual);near(v.lo,.75*manual);near(v.hi,.85*manual);
assert.deepEqual([v.lo,v.hi].map(x=>(x/fx).toFixed(2)),['223.45','253.24']);
for(const price of [150,238,600]){
 const q=run(`(()=>{const x={...state.find(x=>x.code==='00700'),quote:{price:${price},time:'20261118162000'}};return {value:value(x),buy:buyState(x),signal:signal(x)};})()`);
 assert.deepEqual(plain(q.value),plain(v));
 assert.match(q.buy[0],/暂不启用/);
 if(price===238)assert.equal(q.signal[0],'试算达区，暂不建仓');
}
run("openDetail(state.find(x=>x.code==='00700'))");
assert.match(nodes.dBody.innerHTML,/223\.45–253\.24 HKD（暂不建仓）/);
assert.match(nodes.dBody.innerHTML,/TENCENT-Q3-2026-11-18\.md/);
assert.doesNotMatch(nodes.dBody.innerHTML,/等待Q3|待11月18日|原区间仍为历史模型对照/);
assert.match(nodes.idealGrid.innerHTML,/223\.45–253\.24 HKD/);
assert.match(nodes.validationRows.innerHTML,/367\.39–413\.32 HKD/);
assert.ok(run("modelIsDue(state.find(x=>x.code==='00700'),'2027-02-18')"));
console.log('PASS Tencent Q3: cash bridges, DCF, archived prior range, quote-independent values, HTML details, unchanged other assets, and execution lock.');
