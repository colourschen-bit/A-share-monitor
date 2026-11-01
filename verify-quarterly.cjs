'use strict';
// Behavioural regressions from the 2026-10-30 independent consistency review.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class ReviewClock extends Date{constructor(...args){super(...(args.length?args:['2026-11-01T05:00:00Z']));}static now(){return new ReviewClock().getTime();}}
const html=fs.readFileSync('index.html','utf8');
const layers=Array.from(html.matchAll(/<script src="([^?]+)\?/g),m=>m[1]);
const nodes={};for(const m of html.matchAll(/id="([^"]+)"/g))nodes[m[1]]={value:'',innerHTML:'',textContent:'',options:[{},{},{}],showModal(){},close(){},remove(){}};
nodes.tier.value='all';
const ctx={window:{},console,Intl,Date:ReviewClock,setTimeout:()=>1,clearTimeout(){},document:{getElementById:id=>nodes[id]||null,createElement:()=>({}),body:{appendChild(){}}}};
vm.createContext(ctx);for(const f of layers)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
const run=s=>vm.runInContext(s,ctx),r=ctx.window.RESEARCH,by=c=>r.assets.find(x=>x.code===c),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const plain=o=>JSON.parse(JSON.stringify(o));const same=(a,b)=>assert.deepStrictEqual(plain(a),plain(b));
assert.equal(r.assets.length,61);assert.equal(new Set(r.assets.map(x=>x.code)).size,61);
assert.equal(new Set(r.assets.map(x=>x.key)).size,61);
const core=r.assets.filter(x=>x.portfolio.included).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
same(core.map(x=>x.code),['00700','600941','600036','002270','000333','02328','600938','600900','300760','002028','605499','02057','001872','600406','603444']);
assert.equal(core.reduce((s,x)=>s+x.portfolio.weight,0),85);assert.equal(r.portfolio.cash,15);
same(r.assets.map(x=>x.portfolio.rank).sort((a,b)=>a-b),Array.from({length:61},(_,i)=>i+1));
for(const [node,n]of [['idealGrid',15],['excludedRows',46],['rows',61],['validationRows',15]])assert.equal((nodes[node].innerHTML.match(node==='idealGrid'?/data-code=/g:/<tr /g)||[]).length,n,node);
// Coverage counts are research depth, not the presence of a review object.
same(plain(run('reviewCounts()')),{detailed:38,disclosure:23,total:61});
assert.equal(r.assets.filter(x=>x.disclosure).length,13);
assert.match(nodes.stats.innerHTML,/38\/61项/);assert.match(nodes.stats.innerHTML,/23项/);
for(const x of r.assets){
 assert.ok(x.quarterReview&&x.modelReviewDueAt&&typeof x.executionHold==='boolean');
 const v=run(`value(state.find(x=>x.code==='${x.code}'))`);near(v.ev,v.pv);assert.ok(v.lo>0&&v.lo<v.hi&&v.hi<=v.pv);
 if(x.disclosure){assert.equal(x.quarterReview.depth,'disclosure');assert.ok(x.executionHold);assert.equal(x.disclosure.reportPeriod,'2026-09-30');}
 if(x.kind==='ETF'){assert.equal(x.quarterReview.depth,'disclosure');assert.equal(x.model.top10.length,10);assert.ok(x.executionHold);assert.ok(x.model.top10.every((h,i,a)=>!i||a[i-1].weight>=h.weight));}
 run(`openDetail(state.find(x=>x.code==='${x.code}'))`);
 assert.ok(!/undefined|NaN/.test(nodes.dBody.innerHTML),x.code+' detail fields');
 assert.match(nodes.dBody.innerHTML,/执行限制与复核时点/);
}
// Preserve previously verified financial boundaries while changing presentation.
near(by('02328').model.inputs[1],303688000000/22242765303-.34);
same(by('603444').model.inputs,[22,26.5,30]);
for(const x of core.filter(x=>x.validation.cross)){
 const z=x.validation;assert.equal(z.cross.flows.length,10);assert.ok(z.sensitivity[0]<z.cross.pv&&z.sensitivity[1]>z.cross.pv);assert.ok(z.cross.terminalShare>0&&z.cross.terminalShare<1);
}
for(const x of r.assets.filter(x=>x.kind==='ETF')){const m=x.model;assert.ok(m.coverage>0&&m.coverage<=100);assert.equal(new Set(m.top10.map(h=>h.code)).size,10);}

// Report replaces forecast in active facts, without claiming a fresh valuation.
assert.match(by('002463').fact,/正式2026Q3/);assert.match(by('002463').fact,/56.2194/);assert.match(by('002463').fact,/27.0385/);
assert.equal(by('002463').reportPeriod,'2026-09-30');assert.ok(by('002463').executionHold);assert.match(by('002463').model.why,/未由本季数据重建/);
// All bank prices remain non-executable sensitivities, even inside the interval.
for(const [code,bps,low,high]of [['600036',46.87,35.85555,40.07385],['002142',37.12,29.696,33.408],['601838',21.98,17.584,19.782],['601009',16.01,10.8868,12.24765]]){
 near(by(code).model.inputs[1],bps);assert.equal(by(code).bankReconciliation.status,code==='600036'?'reconciled':'pending');
 const v=run(`value(state.find(x=>x.code==='${code}'))`);near(v.lo,low);near(v.hi,high);
 const bankState=run(`(()=>{const x=state.find(x=>x.code==='${code}'),v=value(x);return buyState({...x,gate:'verified',conditionStatus:'verified',quote:{price:(v.lo+v.hi)/2,time:'20261030150000'}})[0]})()`);
 if(code==='600036')assert.equal(bankState,'价格与条件均达标');else assert.match(bankState,/暂不启用.*股息/);
 if(by(code).additionReview?.bank)near(by(code).additionReview.bank.modelBps,bps);
}
same(plain(by('600036').model.inputs),[42,46.87,48]);
// Gate restrictions survive quotes and unrelated condition switches.
for(const code of ['00700','02057','09988','01193','603993','000568','002463'])assert.match(run(`(()=>{const x=state.find(x=>x.code==='${code}'),v=value(x),fx=x.market==='HK'?research.hkdCny:1;return buyState({...x,gate:'verified',conditionStatus:'verified',quote:{price:(v.lo+v.hi)/2/fx,time:'20261030150000'}})[0]})()`),/暂不启用/);
assert.match(run(`(()=>{const x=state.find(x=>x.code==='600938'),v=value(x);return buyState({...x,quote:{price:(v.lo+v.hi)/2,time:'20261030150000'}})[0]})()`),/条件待核验/);
assert.equal(run(`(()=>{const x=state.find(x=>x.code==='600938'),v=value(x);return buyState({...x,gate:'verified',conditionStatus:'verified',quote:{price:(v.lo+v.hi)/2,time:'20261030150000'}})[0]})()`),'价格与条件均达标');
for(const [override,pattern]of [["gate:'failed',quote:{price:1,time:'20261030150000'}",/失效/],["quote:{price:1,time:'20991030150000'}",/日期无效/],["quote:null",/缺有效行情/],["modelReviewDueAt:'2026-10-30'",/复核日/]])assert.match(run(`buyState({...state[0],${override}})[0]`),pattern);
assert.equal(run("modelIsDue({...state[0],modelReviewDueAt:'2027-01-30'},'2027-01-29')"),false);
assert.equal(run("modelIsDue({...state[0],modelReviewDueAt:'2027-01-30'},'2027-01-30')"),true);
assert.match(by('002028').coreEvidence.status,/专题保留/);assert.ok(!by('002028').audit.missing.includes('尚未同步'));
assert.equal(r.window,undefined);assert.equal(by('00700').modelReviewDueAt,'2026-11-18');
// Present value is the threshold, not Tencent's 416 CNY terminal assumption.
assert.equal(run("signal({...state.find(x=>x.code==='00700'),market:'SH',quote:{price:405,time:'20261030150000'}})[0]"),'有溢价');
near(run("value(state.find(x=>x.code==='00700')).terminalValue"),416);
near(run("value(state.find(x=>x.code==='00700')).pv"),416/Math.sqrt(1.12));
// Freeze historical FX; retain exactly one conversion of gas HKD earnings.
near(by('00700').previousReview.fx,.85688);near(r.hkdCny,.85594);
near(run("value(state.find(x=>x.code==='01193')).terminalValue/research.hkdCny"),20.9);
const oldTable=nodes.validationRows.innerHTML;run('research.hkdCny=.8;renderCoreValidation()');
assert.ok(nodes.validationRows.innerHTML.includes((by('00700').previousReview.zone[0]/.85688).toFixed(2)));
assert.notEqual(nodes.validationRows.innerHTML,oldTable);run('research.hkdCny=.85594;renderCoreValidation()');
// Future outcomes without a target date are never presented as comparable returns.
assert.match(run("scenarioReturnText(state.find(x=>x.code==='00700'))"),/目标日未确认/);
assert.match(run("scenarioReturnText(state.find(x=>x.code==='002028'))"),/2027-12-31/);
near(run("value(state.find(x=>x.code==='002028')).pv"),110);
assert.equal(run("safetyText(value(state.find(x=>x.code==='002028')))"),'10.9%–18.2%');
run("(()=>{const x=state.find(x=>x.code==='002028');openDetail({...x,model:{...x.model,reviewValueToday:1000,reviewBuyZone:[700,800],targetDate:'2029-12-31'}})})()");
assert.match(nodes.dBody.innerHTML,/目标日 2029-12-31/);assert.match(nodes.dBody.innerHTML,/对照值 1,000.00元，关注区 700.00–800.00元/);assert.match(nodes.dBody.innerHTML,/20.0%–30.0%/);
// Sorting must be contiguous by canonical grade, independent of display wording.
const excluded=r.assets.filter(x=>!x.portfolio.included).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
same(excluded.slice(0,9).map(x=>x.code),['002142','600660','002032','601838','601899','603993','601009','01193','601318']);
const weights={B:0,C:1,D:2};assert.ok(excluded.every((x,i,a)=>!i||weights[a[i-1].rankReview.group]<=weights[x.rankReview.group]));
same(['B','C','D'].map(g=>excluded.filter(x=>x.rankReview.group===g).length),[9,29,8]);
assert.ok(excluded.every(x=>x.rankReview.date==='2026-10-30'&&x.rankReview.evidenceDate&&x.rankReview.previousRankDate==='2026-10-23'));
assert.equal(new Set(excluded.map(x=>x.rankReview.previousRank)).size,46);
for(const code of ['603195','600690','600096'])assert.ok(by(code).portfolio.rank<by('002318').portfolio.rank);
// The report's frozen old-zone table and the page's historical column agree.
const report=fs.readFileSync('QUARTERLY-REVIEW-2026-10-30.md','utf8');
const reportRows=Array.from(report.matchAll(/^\|\d+\|(\d+) [^|]+\|[^|]+\|([\d.]+)–([\d.]+) (HKD|CNY)\|/gm));
assert.equal(reportRows.length,15);
for(const [,code,lo,hi,currency]of reportRows){const x=by(code),fx=currency==='HKD'?x.previousReview.fx:1;assert.ok(Math.abs(x.previousReview.zone[0]/fx-Number(lo))<.015,code+' historical lower');assert.ok(Math.abs(x.previousReview.zone[1]/fx-Number(hi))<.015,code+' historical upper');}

// Rendered counts track data changes, rather than mirroring a hardcoded headline.
run("state[0].quarterReview={...state[0].quarterReview,depth:'disclosure'};render()");assert.match(nodes.stats.innerHTML,/37\/61项/);assert.match(nodes.stats.innerHTML,/24项/);
// Historical CNY cells must never be translated through the HKD conversion rate.
for(const x of core){
 const row=nodes.validationRows.innerHTML.match(new RegExp('<tr[^>]*data-code="'+x.code+'"[^>]*>(.*?)</tr>'))[1];
 const cells=Array.from(row.matchAll(/<td[^>]*>(.*?)<\/td>/g),m=>m[1]);
 const fx=x.market==='HK'?x.previousReview.fx:1;
 const historical=x.previousReview.zone.map(n=>(n/fx).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})).join('–');
 assert.equal(cells[1],historical+(x.market==='HK'?' HKD':' CNY'));
}
for(const x of core.filter(x=>x.model.multiples))near(run(`(()=>{const x=state.find(x=>x.code==='${x.code}');return impliedInput(x,value(x).pv)})()`),x.model.inputs[1]);
near(run("impliedInput(state.find(x=>x.code==='605499'),108)"),108*Math.sqrt(1.12)/18);
// Independent accounting and execution regressions for the Nov 1 evidence pass.
assert.equal(r.coreEvidence.total,15);assert.equal(core.filter(x=>x.coreEvidence).length,15);
for(const x of core){
 const e=x.coreEvidence;assert.equal(e.date,'2026-11-01');assert.ok(e.resolved.length>=2&&e.missing.length>=2&&e.sources.length);
 assert.equal(x.gate,'pending');assert.equal(x.conditionStatus,'pending');
 run(`openDetail(state.find(x=>x.code==='${x.code}'))`);
 assert.match(nodes.dBody.innerHTML,/买价证据/);assert.match(nodes.dBody.innerHTML,/仍需证据/);
 if(x.model.type==='pb')assert.doesNotMatch(run(`cashHurdleText(state.find(x=>x.code==='${x.code}'))`),/反向现金/);
 if(x.executionHold){const v=run(`value(state.find(x=>x.code==='${x.code}'))`);assert.match(run(`buyState({...state.find(x=>x.code==='${x.code}'),gate:'verified',conditionStatus:'verified',quote:{price:${(v.lo+v.hi)/2/(x.market==='HK'?r.hkdCny:1)},time:'20261030150000'}})[0]`),/暂不启用/);}
}
for(const [code,total]of [['000333',269.28249],['600900',420.0476677808],['605499',45.9213738642],['600406',30.8401499708]]){const t=by(code).coreEvidence.ttm;near(t.ocf-t.capex,total);}
const nari=by('600406').coreEvidence.cashBridge;
near(nari.start+nari.inflows+nari.purchases+nari.employees+nari.taxes+nari.other,nari.end);
// Compute from the original disclosed CNY values, independently of the stored bridge.
near(by('605499').model.inputs[1],(3850956651.20+644312657.10)/734199310);
near(by('600900').model.inputs[1],(26343828523.43+6309934681.44)/24468217716);
near(run("value(state.find(x=>x.code==='605499')).lo"),85.3923743280192);
near(run("value(state.find(x=>x.code==='605499')).hi"),95.80607851436301);
near(run("value(state.find(x=>x.code==='600900')).lo"),20.36546910544224);
near(run("value(state.find(x=>x.code==='600900')).hi"),22.042625384713958);
for(const code of ['605499','600900']){assert.equal(by(code).model.forecastYear,2026);assert.equal(by(code).model.targetDate,null);assert.match(run(`scenarioReturnText(state.find(x=>x.code==='${code}'))`),/不计远期收益/);}
near((1381986-199989)/25220,46.86744647105472);
assert.match(by('600036').bankReconciliation.convention,/含权/);assert.equal(by('600036').executionHold,false);
assert.match(run("bankBridgeText(state.find(x=>x.code==='600036'))"),/不重复扣/);
assert.equal(by('600941').executionHold,true);assert.equal(by('603444').executionHold,true);
near(ctx.window.CORE_EVIDENCE_MATH.cashIntermediate(by('603444').coreEvidence.cashData),17.9921148827);
assert.match(run("evidenceCashText(state.find(x=>x.code==='603444'))"),/负购建增益排除/);
const evidenceReport=fs.readFileSync('CORE-EVIDENCE-2026-11-01.md','utf8');
assert.equal((evidenceReport.match(/^## \d+\. /gm)||[]).length,15);
for(const [code,zone]of [['605499','85.39–95.81'],['600900','20.37–22.04'],['600036','35.86–40.07']])assert.ok(evidenceReport.includes(zone+' CNY'),code+' report zone');
console.log('PASS: Nov 1 / 15 evidence records; 4 independent TTM bridges; NARI payment reconciliation; 2 annual EPS/price bridges; CMB cum-dividend capital; negative capex excluded; future gates retained.');
console.log('PASS: 61 asset/detail renders; 15 core/85% + 15% cash; 38 detailed + 23 disclosure; formal filing replacement; bank/FCF execution holds; present-value threshold; dated returns; dynamic safety/FX/counts; model deadlines; canonical 9/29/8 candidate ordering.');
