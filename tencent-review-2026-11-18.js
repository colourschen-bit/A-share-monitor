'use strict';
{
const r=window.RESEARCH,x=r.assets.find(a=>a.code==='00700');
const date='2026-11-18',period='2026-09-30';
const release='https://www1.hkexnews.hk/listedco/listconews/sehk/2026/1118/2026111800448.pdf';
const q2='https://www.tencent.com/wp-content/uploads/2026/08/E700_IRA.pdf';
const q1='https://static.www.tencent.com/uploads/2026/05/13/e048dfed72bc718f7986a83f23c8e294.pdf';
const fy25='https://static.www.tencent.com/uploads/2026/03/18/2804dbdae364ca25b82d21bc8304f1d3.pdf';
const report='https://github.com/colourschen-bit/A-share-monitor/blob/main/TENCENT-Q3-2026-11-18.md';
const sources=[['港交所2026Q3正式公告',release],['腾讯2026Q2公告',q2],['腾讯2026Q1业绩简报',q1],['腾讯2025年度业绩简报',fy25]];
// All aggregate valuation inputs in CNY billions; per-share values use 9.125 billion shares.
const assumptions=[
 {operating:[285,290,300,310,320],investment:[210,205,195,190,185],other:[60,65,65,70,70],rate:.13,growth:.02,realization:.50},
 {operating:[325,350,375,407,440],investment:[170,160,155,165,175],other:[60,62,65,67,70],rate:.11,growth:.03,realization:.60},
 {operating:[350,390,435,475,510],investment:[155,160,170,180,195],other:[60,63,65,70,75],rate:.10,growth:.035,realization:.70}
];
const shares=9.125,listed=505.4,margin=[.25,.15];
const scenario=(a,rate=a.rate)=>{
 const flows=a.operating.map((n,i)=>n-a.investment[i]-a.other[i]);
 const operations=flows.reduce((s,n,i)=>s+n/(1+rate)**(i+1),0);
 const terminal=flows.at(-1)*(1+a.growth)/(rate-a.growth)/(1+rate)**flows.length;
 const portfolio=listed*a.realization;
 return {...a,rate,flows,operations,terminal,portfolio,pv:(operations+terminal+portfolio)/shares};
};
const scenarios=assumptions.map(a=>scenario(a));
const base=scenarios[1],hk=n=>(n/r.hkdCny).toFixed(2);
const previous=x.model,oldPv=(previous.inputs[1]*previous.multiples[1]+previous.extra[1])/1.12**(previous.discountYears??.5);
const oldZone=previous.margin.map(m=>oldPv*(1-m)),zone=margin.map(m=>base.pv*(1-m));
const bracket=zone.map(hk).join('–')+'港元';
const cash='Q3公司口径实际FCF −691亿元；剔算力预付款后169亿元，隐含预付约860亿元，非已收回现金。Q2对应−138/376亿元。前三季约−262亿元，TTM约78亿元。Q3资本开支814.33亿元，实际付款约651亿元；不可混加或将预付款当永久一次性。';
const fact='2026Q3营收2,073.36亿元（+8%），IFRS经营利润591.47亿元（−7%）、归母636.12亿元（+0.8%）；非IFRS经营利润680.73亿元（−6%）、归母665.19亿元（−6%）。剔除新AI产品后非IFRS经营利润约833亿元（+8%）。';
const judgment='微信的流量、闭环广告与长青游戏继续提供现金底盘，但云增长与AI收益需扣折旧、推理和更新成本。预付款可换来交付、付费客户和使用留存；也可能推升资金压力、削弱回购。广告收入同比增19%，毛利仅增10%，利润率从57%降至52%，已出现增长成本。';
const limitation='采购预付款余额及结转、算力实际利用率与客户续约、增量毛利扣推理成本、归母现金归属及长期资本占用仍待核验。';
const gate='实际FCF连续两个季度为正，且TTM实际FCF至少950亿元作为现金路径首年筛查；预付结转且未被等量或更大新增预付替代；云/应用需有付费续约、利用率及扣算力费用后毛利的证据，资金不持续依赖净新增债务。条件未通过，即使价格达区也只观察。';
const next='下一次正式年度业绩（确切日期待公司公告），并用2027Q1确认是否连续两个季度改善；2027-02-18先检查最新公开经营、债务和采购信号。';
const fail='若预付款滚动增加且实际现金不恢复、债务持续推升，或广告/游戏现金退化且AI不能补足，撤回基准区并按压力现金路径重估；低于区间也不机械补仓。';
const strategy='先核验经营和现金，再核验市场承接（抛压衰竭、杠杆压力缓和、新增买盘）；条件都通过且落在'+bracket+'时，首笔不超过目标权重的1/3（零持仓模型约2.67%组合），随后按新现金证据复核。处于上沿时不放宽条件，跌破下沿先查反证。8%为研究上限。';
const pricing='将旧EPS×PE条件区归档。新基准是五年股东现金敏感性，人民币每股现值折合'+hk(base.pv)+'港元，留15%–25%余量得'+bracket+'。全为研究假设；目前不启用。';
x.tencentReview={date,period,report,oldZone,fx:r.hkdCny,gate,strategy,fail,next,shares,listed,scenarios,
 rateSensitivity:[.10,.11,.12,.13].map(rate=>({rate,pv:scenario(assumptions[1],rate).pv})),
 actual:{q3:{operating:2.6,capexPaid:65.1,content:4.6,lease:2,fcf:-69.1,excludingPrepayment:16.9},q2:{fcf:-13.8,excludingPrepayment:37.6},q1Fcf:56.7,q4PriorFcf:34,fy25Fcf:182.6,netDebt:13.702,unlisted:397.2}};
x.model={type:'cash-dcf',timeBasis:'cash-dcf',valuationDate:date,discountYears:0,margin,evidenceUrl:release,reference:'2026Q3正式业绩及独立现金情景（非公司指引）'};
x.previousReview={...x.previousReview,zone:oldZone,fx:r.hkdCny};
x.reportPeriod=period;x.fact=fact+' '+cash;x.source=release;x.sources=sources;x.verification='2026-11-18港交所三季报；公司合并FCF与估值假设分列';
x.executionHold=true;x.executionHoldReason='实际现金、预付结转与AI变现门槛未通过';x.valuationStatus='sensitivity';x.gate='pending';x.conditionStatus='pending';
x.catalyst=next;x.risk=fail;x.modelReviewedAt=date;x.modelReviewDueAt='2027-02-18';
delete x.nextDisclosure;
x.fullReview={date,reportPeriod:period,kind:'腾讯正式Q3 · 现金情景已重算',facts:fact,cash,judgment,priceDecision:pricing,limitation,source:release,report};
x.quarterReview={date,depth:'detailed',status:'腾讯Q3已核验；现金建仓门槛未通过',fields:{'披露事实':fact,'现金与投资':cash,'独立判断':judgment,'买入策略':strategy,'下一节点':next},sources,report};
x.coreEvidence={date,status:'现金证据更新，经营门槛未通过',priceStatus:'新现金试算 · 暂不建仓',resolved:['实际FCF、剔预付FCF与TTM已核对。','投资账面与分部现金分开，旧EPS倍数不再用。'],fact,cash,pricing,assumptions:judgment,missing:[limitation],next,sources,previousZone:oldZone,previousFx:r.hkdCny,report};
x.analysis={source:release,fact,moat:x.analysis.moat,confirm:gate,fail,limit:limitation,quality:fact+' '+cash,basis:'五年股东现金敏感性；以经营收现减实际再投入、媒体/租赁、融资与股东归属余量，再计折减后的上市投资。终值占基准约64%，不等同可验证公允价值。',reflexivity:judgment,verdict:judgment+' '+pricing};
x.audit={...x.audit,date,stage:'正式Q3及现金情景复核；建仓门槛待验证',done:'财报、实际现金与剔预付口径、五年现金情景及上市投资折算。',missing:limitation,next,conclusion:'主业仍有韧性，AI扩张尚未证明股东现金回报。'};
r.coreValidation.correction=r.coreValidation.correction.replace('腾讯/中通待11月18日','腾讯正式Q3已更新并重算现金区间；中通为11月11日复核时的披露安排');
}
