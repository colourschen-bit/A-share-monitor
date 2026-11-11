'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
class Clock extends Date{constructor(...a){super(...(a.length?a:['2026-11-11T05:00:00Z']));}static now(){return new Clock().getTime();}}
const html=fs.readFileSync('index.html','utf8'),layers=[...html.matchAll(/<script src="([^?]+)\?/g)].map(m=>m[1]);
const nodes={};for(const m of html.matchAll(/id="([^"]+)"/g))nodes[m[1]]={value:'',innerHTML:'',textContent:'',options:[{},{},{}],showModal(){},close(){},remove(){}};nodes.tier.value='all';
const ctx={window:{},console,Intl,Date:Clock,setTimeout:()=>1,clearTimeout(){},document:{getElementById:k=>nodes[k]||null,createElement:()=>({}),body:{appendChild(){}}}};vm.createContext(ctx);
let before;for(const f of layers){if(f.startsWith('full-review-'))before=JSON.parse(JSON.stringify(ctx.window.RESEARCH.assets.map(x=>({code:x.code,model:x.model,gate:x.gate,hold:x.executionHold}))));vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});}
const r=ctx.window.RESEARCH,run=s=>vm.runInContext(s,ctx),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`),records=JSON.parse(fs.readFileSync('financial-evidence-2026-11-11.json')).records;
assert.equal(r.assets.length,61);assert.equal(r.assets.filter(x=>x.fullReview.numeric).length,46);assert.equal(r.assets.filter(x=>x.fullReview).length,61);assert.equal(r.macro.length,12);assert.equal(r.asOf,'2026-11-11');
assert.equal(r.assets.filter(x=>x.portfolio.included).reduce((s,x)=>s+x.portfolio.weight,0),85);assert.equal(r.portfolio.cash,15);
assert.equal((nodes.rows.innerHTML.match(/<tr /g)||[]).length,61);assert.equal((nodes.excludedRows.innerHTML.match(/<tr /g)||[]).length,46);
for(const x of r.assets){const old=before.find(z=>z.code===x.code);assert.deepEqual(JSON.parse(JSON.stringify(x.model)),old.model);assert.notEqual(x.gate,'verified');if(old.hold)assert.equal(x.executionHold,true);run(`openDetail(state.find(x=>x.code==='${x.code}'))`);assert.match(nodes.dBody.innerHTML,/全池财报与宏观复核/);if(x.fullReview.numeric?.financial)assert.match(x.fullReview.cash,/不.*工业/);}
for(const z of records){assert.equal(z.period,'2026-09-30');assert.equal(z.primaryFieldPresence.matched,3);assert.equal(z.primaryFieldPresence.unmatched.length,0);assert.match(z.primaryPdfSha256,/^[a-f0-9]{64}$/);const [year,prior]=z.comparators.cash;if(z.ttmOcf!==null)near(z.ttmOcf,(year.NETCASH_OPERATE-prior.NETCASH_OPERATE)/1e8+z.ocf);if(z.ttmCapex!==null)near(z.ttmCapex,(year.CONSTRUCT_LONG_ASSET-prior.CONSTRUCT_LONG_ASSET)/1e8+z.cashCapex);const [h,py,ph]=z.comparators.income;if(z.q3Recurring!==null)near(z.q3Recurring,z.recurring-h.DEDUCT_PARENT_NETPROFIT/1e8);if(z.q3RecurringYoY!==null){const priorQ=(py.DEDUCT_PARENT_NETPROFIT-ph.DEDUCT_PARENT_NETPROFIT)/1e8;near(z.q3RecurringYoY,(z.q3Recurring/priorQ-1)*100);}}
assert.equal((records.find(x=>x.code==='000568').ttmOcf-records.find(x=>x.code==='000568').ttmCapex).toFixed(4),'0.0268');
assert.equal(r.assets.find(x=>x.code==='09988').nextDisclosure.next,'2026-11-19');assert.equal(r.assets.find(x=>x.code==='02057').nextDisclosure.next,'2026-11-18');
// Rerun the evidence overlay after replacing every quote: financial assumptions and decisions are identical.
const models=JSON.stringify(r.assets.map(x=>x.model));for(const x of r.assets)x.snapshot={price:Math.random()*10000+1,time:'20261111120000'};
vm.runInContext(fs.readFileSync('full-review-2026-11-11.js','utf8'),ctx);assert.equal(JSON.stringify(r.assets.map(x=>x.model)),models);
assert.equal((fs.readFileSync('FULL-REVIEW-2026-11-11.md','utf8').match(/^### #\d+/gm)||[]).length,61);
console.log('PASS current Nov 11: 61 details; 46 primary Q3 field checks and TTM/single-quarter bridges; financial-company exceptions; 12 dated macro sources; original model numbers and cash floor preserved; quote-independent assumptions.');
