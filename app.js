'use strict';
const research=window.RESEARCH;
let scenario=1;
const scenarioNames=['压力','基准','修复'];
let state=research.assets.map(x=>({...x,quote:x.snapshot,quoteOrigin:x.snapshot?(quoteDate(x.snapshot)||'既有')+'历史快照':'尚无有效报价'})).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=0)=>Number.isFinite(n)?n.toLocaleString('zh-CN',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
const pct=n=>Number.isFinite(n)?(n>=0?'+':'')+(n*100).toFixed(0)+'%':'—';
const digits=x=>x.kind==='ETF'?3:2;
function cases(x){
 const m=x.model;if(!m)return null;
 if(m.type==='lookthrough')return m.cases;
 if(m.type==='index')return m.fair.map((v,i)=>m.anchorNav*(v/m.currentMetric)*m.fundamental[i]);
 return m.inputs.map((v,i)=>m.type==='fcf'?v/m.yields[i]+m.extra[i]:v*m.multiples[i]+m.extra[i]);
}
function value(x){
 const v=cases(x);if(!v)return null;
 const m=x.model;
 const pv=m.reviewBuyZone?m.reviewValueToday:m.type==='lookthrough'?v[1]:v[1]/Math.pow(1.12,m.discountYears??.5);
 const zone=m.reviewBuyZone|| (m.type==='lookthrough'?m.buyZone:[pv*(1-m.margin[0]),pv*(1-m.margin[1])]);
 // ev is a compatibility alias for present value everywhere, never a terminal price.
 return {cases:v,terminalValue:v[1],ev:pv,pv,lo:zone[0],hi:zone[1],targetDate:m.targetDate||null,valuationDate:m.valuationDate||null};
}
function chinaToday(){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const part=k=>parts.find(p=>p.type===k).value;return part('year')+'-'+part('month')+'-'+part('day');
}
function modelIsDue(x,today=chinaToday()){return !!x.modelReviewDueAt&&today>=x.modelReviewDueAt;}
function reviewCounts(assets=state){return {detailed:assets.filter(x=>x.quarterReview?.depth==='detailed').length,disclosure:assets.filter(x=>x.quarterReview?.depth==='disclosure').length,total:assets.length};}
function timeLabel(x){
 if(x.model.targetDate)return '目标日 '+x.model.targetDate+' / 盈利年度 '+(x.model.forecastYear||'待确认');
 if(x.model.timeBasis==='present')return '净资产现值情景 / '+x.model.valuationDate;
 return x.model.timeBasis==='historical-basket'?'历史持仓折价情景 / '+x.model.holdingsDate:'旧情景：预测年度、目标日待确认';
}
function scenarioReturnText(x,v=value(x),p=price(x)){
 if(!v||p===null)return '缺有效价格';
 if(!x.model.targetDate||x.model.targetDate<=chinaToday())return '目标日未确认或已到期，不计远期收益';
 return pct(v.cases[0]/p-1)+' / '+pct(v.cases[2]/p-1)+' · 至 '+x.model.targetDate;
}
function safetyText(v){return fmt((1-v.hi/v.pv)*100,1)+'%–'+fmt((1-v.lo/v.pv)*100,1)+'%';}
function valuationLabel(x){return {sensitivity:'报表敏感性，未启用',reference:'旧情景／待核对照',conditional:'条件模型，经营待核'}[x.valuationStatus]||'模型待核';}
function executionText(x){
 if(modelIsDue(x))return '已到模型复核日 '+x.modelReviewDueAt+'，须重新核验';
 if(x.executionHold)return '暂不启用：'+x.executionHoldReason;
 return x.gate==='verified'&&x.conditionStatus==='verified'&&x.valuationStatus==='conditional'?'证据与经营条件已核验，仍须检查价格':'条件观察；经营成立条件未自动通过';
}
function bankBridgeText(x){
 const b=x.bankReconciliation;if(!b)return '';
 return 'Q3普通股BPS '+fmt(b.reportedBps,2)+'元；股息及权益对账'+(b.status==='pending'?'未完成':'已完成')+'。压力/基准/修复BPS：'+x.model.inputs.map(n=>fmt(n,3)).join(' / ')+'元。当前区间仅作敏感性；未额外扣减不代表股息已核清。';
}

function price(x){return Number.isFinite(x.quote?.price)&&x.quote.price>0?x.quote.price*(x.market==='HK'?research.hkdCny:1):null;}
function quoteDate(q){
 if(!q?.time)return '';
 const s=q.time.replace(/\D/g,'');return s.length>=8?s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6,8):'';
}
function signal(x){
 const v=value(x),p=price(x),today=chinaToday();
 if(!v)return ['暂不估值','pending','模型证据不足；行情仍正常显示'];
 if(modelIsDue(x,today))return ['暂不估值','pending',executionText(x)];
 if(p===null)return ['暂不估值','pending','缺有效行情，暂不比较'];
 const dated=quoteDate(x.quote);
 if(!dated||!Number.isFinite(Date.parse(dated))||dated>today)return ['暂不估值','pending','行情日期无效，暂不比较'];
 if(x.gate==='failed')return ['暂不估值','bad','论点失效，须重建模型'];
 const wait=x.nextDisclosure;
 const reference=(wait?'财报锚 '+wait.anchor+'；'+wait.reason+'；':'')+executionText(x)+'；'+(dated!==today?'按 '+dated+' 报价作历史比较，非实时判断；':'');
 if(p<=v.hi)return ['有折价','watch',reference+(p<v.lo?'低于关注区下沿，先检查是否遗漏风险':'价格不高于条件关注区上沿')];
 if(p>v.pv)return ['有溢价','reduce',reference+'高于模型基准现值／对照值，不自动构成卖点'];
 return ['接近估值','hold',reference+'高于关注区上沿，不高于模型基准现值／对照值'];
}

function progress(x){return x.audit?.stage||(x.model?'已有草案，待完善依据':'资料待补，模型未完成');}
function fulfillment(x){if(x.gate==='failed')return '论点失效';if(x.executionHold)return executionText(x);return x.gate==='verified'&&x.conditionStatus==='verified'?'成立条件已核验':'催化待观察';}
function formula(x,i){
 const m=x.model;if(!m)return '未建立可追溯的当前模型';
 if(m.type==='lookthrough'){
  if(i===0)return 'ETF核心区下沿 '+fmt(m.buyZone[0],3)+' × 85% 压力折价';
  if(i===1)return '核心区上沿 '+fmt(m.buyZone[1],3)+' ÷ 90%（同一假设反推的参照，非独立公允价值）';
  return '固定复核净值 '+fmt(m.anchorNav,4)+' × 修复系数 '+fmt(m.cases[2]/m.anchorNav,2);
 }
 if(m.type==='index')return '锚定净值 '+fmt(m.anchorNav,4)+' × 合理'+m.metric+' '+fmt(m.fair[i],2)+' ÷ 当前'+m.metric+' '+fmt(m.currentMetric,2)+' × 基本面系数 '+fmt(m.fundamental[i],2);
 if(m.type==='fcf')return fmt(m.inputs[i],1)+'元FCFE ÷ '+fmt(m.yields[i]*100,1)+'% + '+m.extra[i]+'元投资折价值';
 const label=m.type==='pb'?'BPS':m.type==='opat'?'营运EPS':'EPS';
 return label+' '+fmt(m.inputs[i],2)+'元 × '+fmt(m.multiples[i],2)+(m.extra[i]?' + '+m.extra[i]+'元期权':'');
}
function buyState(x){
 const s=signal(x);if(s[0]==='暂不估值')return [s[2],'pending'];
 if(x.executionHold)return [executionText(x),'pending'];
 const v=value(x),p=price(x);
 if(p<v.lo)return ['低于核心区，先排查风险','warn'];
 if(p<=v.hi)return x.gate==='verified'&&x.conditionStatus==='verified'&&x.valuationStatus==='conditional'?['价格与条件均达标','good']:['价格达区，条件待核验','watch'];
 if(p<=v.pv)return ['合理但安全边际不足','hold'];
 return ['等待价格','review'];
}

function renderPortfolio(){
 const p=research.portfolio;if(!p||!$('idealGrid'))return;
 const included=state.filter(x=>x.portfolio?.included).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
 $('portfolioMeta').textContent=p.mode+' · 股票 '+p.equity+'% · 现金 '+p.cash+'% · '+included.length+'只核心标的';
 $('idealGrid').innerHTML=included.map(x=>{
  const v=value(x),bs=buyState(x),raw=x.quote?.price;
  const fx=x.market==='HK'?research.hkdCny:1,unit=x.market==='HK'?'HKD':'CNY';
  const nativeLo=v?v.lo/fx:null,nativeHi=v?v.hi/fx:null;
  const d=digits(x),stress=v?fmt(v.cases[0]/fx,d)+' '+unit:'—';
  return '<article tabindex="0" data-code="'+x.code+'" class="portfolio-card"><div class="portfolio-top"><div><span class="rank">#'+x.portfolio.rank+'</span><strong>'+escapeHTML(x.name)+'</strong><span class="code">'+x.market+x.code+' · '+escapeHTML(x.origin||'原研究池')+'</span></div><b class="weight">'+x.portfolio.weight+'%</b></div><div class="role">'+escapeHTML(x.validation?x.validation.category+' · 10/23历史：'+x.validation.priceGrade:x.portfolio.role)+'</div><div class="price-grid"><div><small>报价 '+escapeHTML(quoteDate(x.quote)||'缺失')+'</small><b>'+fmt(raw,d)+' '+unit+'</b></div><div><small>条件关注区 / 待核情景*</small><b>'+(v?fmt(nativeLo,d)+'–'+fmt(nativeHi,d)+' '+unit:'—')+'</b></div><div><small>压力情景（非底价） '+escapeHTML(timeLabel(x))+'</small><b>'+stress+'</b></div></div><span class="pill '+bs[1]+'">'+escapeHTML(bs[0])+'</span><p>'+escapeHTML(x.validation?.summary||x.portfolio.reason)+'</p><small>成立条件：'+escapeHTML(x.catalyst)+'</small><span class="meta">'+escapeHTML(x.quoteOrigin)+' · *条件区不代表已通过现金回报核验，点击看详情</span></article>';
 }).join('')+'<article class="portfolio-card cash-card"><div class="portfolio-top"><div><span class="rank">现金</span><strong>货币基金 / 现金</strong></div><b class="weight">'+p.cash+'%</b></div><div class="role">组合选择权</div><p>任何核心标的未进入条件买入区时，相应目标仓位继续留在现金，不由其他资产自动填满。</p><small>用于财报后错杀、系统性风险和分档建仓；不是闲置仓位。</small></article>';
 const excluded=state.filter(x=>!x.portfolio?.included).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
 $('excludedMethod').textContent=research.excludedReview.method+' '+research.excludedReview.groups;
 $('excludedScope').textContent=research.excludedReview.scope;
 $('excludedRows').innerHTML=excluded.map(x=>{
  const v=value(x),d=digits(x),fx=x.market==='HK'?research.hkdCny:1,z=x.rankReview;
  const moved=x.portfolio.rank-z.previousRank;
  const change=moved<0?'上调'+(-moved)+'位':moved>0?'下调'+moved+'位':'顺位保留';
  return '<tr tabindex="0" data-code="'+x.code+'"><td class="num"><b>#'+x.portfolio.rank+'</b><span class="meta">候选 '+z.candidateRank+'/46</span><span class="meta">'+change+'</span></td><td><b>'+escapeHTML(x.name)+'</b><span class="code">'+x.market+x.code+'</span></td><td><span class="pill secondary">'+escapeHTML(x.portfolio.grade)+'</span></td><td>'+escapeHTML(z.reason)+'</td><td class="num">'+(v?fmt(v.lo/fx,d)+'–'+fmt(v.hi/fx,d)+(x.market==='HK'?' HKD':' CNY'):'—')+'<span class="meta">'+escapeHTML(executionText(x))+'</span></td><td>'+escapeHTML(z.pricing)+'<span class="meta">事实锚：'+escapeHTML(z.anchor)+' · 证据日期 '+(z.evidenceDate||z.date)+' · 排序复核 '+z.date+'</span></td><td>'+escapeHTML(x.catalyst)+'</td></tr>';
 }).join('');
 $('portfolioMethod').textContent=p.method+' '+p.caveat+' '+p.execution+' '+p.changes;
 const buckets={};included.forEach(x=>{buckets[x.portfolio.bucket]=(buckets[x.portfolio.bucket]||0)+x.portfolio.weight;});
 $('riskFactors').innerHTML=Object.entries(buckets).map(([k,v])=>'<span class="pill secondary">'+escapeHTML(k)+' '+v+'%</span>').join(' ')+'<p class="small">按主要盈利驱动归类，不是实测相关系数。金融13%、电网16%、数字需求17%仍有共同风险；消费与出口、利率与信用也可能一起受压。海油和快递的油价敏感性仅提供部分缓冲。</p>';
 renderCoreValidation();
}
function renderCoreValidation(){
 const a=research.coreValidation;if(!a||!$('validationRows'))return;
 $('validationIntro').textContent=a.headline+' '+a.correction+' '+a.portfolio;
 $('validationMethod').textContent=a.method+' '+a.limits;
 $('validationRows').innerHTML=state.filter(x=>x.validation).map(x=>{
  const z=x.validation,v=value(x),fx=x.market==='HK'?research.hkdCny:1,unit=x.market==='HK'?'HKD':'CNY';
  const band=(b,rate=fx)=>b.map(n=>fmt(n/rate,2)).join('–')+' '+unit;
  const cls=x.executionHold?'pending':'watch';
  return '<tr data-code="'+x.code+'"><td><b>'+escapeHTML(x.name)+'</b><span class="code">'+x.code+' · '+z.category+'</span></td><td class="num">'+band(x.previousReview.zone,x.previousReview.fx)+'</td><td class="num">'+band([v.lo,v.hi])+'</td><td><span class="pill '+cls+'">'+escapeHTML(x.executionHold?'暂不启用':'条件观察')+'</span></td><td>'+escapeHTML(x.quarterReview?.status+'；'+(x.quarterReview?.fields['模型修改']||'')||z.finding)+'</td><td class="num">'+(z.cashZone?band(z.cashZone,x.previousReview.fx):'用PB/持续ROE检验')+'</td></tr>';
 }).join('');
}
function render(){
 const query=$('search').value.trim().toLowerCase(),filter=$('tier').value;
 const list=state.filter(x=>{
 const v=value(x),p=price(x);
 return [x.name,x.code,x.catalyst,x.risk,x.analysis?.verdict].join(' ').toLowerCase().includes(query)&&
 (filter==='all'||filter==='core'&&x.tier==='core'||filter==='draft'&&x.model||filter==='pending'&&(!x.model||x.executionHold||modelIsDue(x))||filter==='zone'&&signal(x)[0]==='有折价');
 });
 $('rows').innerHTML=list.map(x=>{
 const v=value(x),p=price(x),s=signal(x);
 const raw=x.quote?.price,d=digits(x);
 return '<tr tabindex="0" data-code="'+x.code+'"><td><div class="name">'+escapeHTML(x.name)+'</div><span class="code">'+x.market+x.code+' · '+x.kind+'</span></td><td><b>#'+x.portfolio.rank+'</b><span class="meta">'+escapeHTML(x.portfolio.grade)+'</span></td>'+
 '<td class="num">'+fmt(raw,d)+(x.market==='HK'?' HKD':' CNY')+'<span class="meta">'+escapeHTML(x.quote?.time||'缺失')+'</span><span class="meta">'+escapeHTML(x.quoteOrigin)+'</span>'+(x.market==='HK'?'<span class="meta">≈ '+fmt(p,2)+' CNY</span>':'')+'</td>'+
 '<td><span class="pill '+s[1]+'">'+s[0]+'</span><span class="meta">'+escapeHTML(s[2])+'</span></td>'+
 '<td><span class="pill pending">'+escapeHTML(progress(x))+'</span><span class="meta">'+fulfillment(x)+'</span><span class="meta">'+escapeHTML(x.analysis?.verdict||'')+'</span></td>'+
 '<td class="num">'+(v?fmt(v.cases[scenario],d):'暂停')+'<span class="meta">'+escapeHTML(timeLabel(x))+'</span></td><td class="num">'+(v?fmt(v.pv,d):'暂停')+'<span class="meta">估值日 '+escapeHTML(x.model.valuationDate)+' / '+escapeHTML(valuationLabel(x))+'</span></td>'+
 '<td class="num">'+(v?fmt(v.lo,d)+'–'+fmt(v.hi,d):'不沿用旧值')+(x.additionReview?.cashGate?'<span class="meta">恢复情景；现金未支持</span>':'')+'</td>'+
 '<td class="num">'+escapeHTML(scenarioReturnText(x,v,p))+'</td>'+
 '<td class="thesis">'+escapeHTML(x.catalyst)+'</td><td class="report factcell">'+escapeHTML(x.fact)+'<span class="meta">'+escapeHTML(x.verification)+'</span></td></tr>';
 }).join('');
 const drafts=state.filter(x=>x.model).length,counts=reviewCounts();
 $('stats').innerHTML=[['经营框架已记录',state.filter(x=>x.analysis).length+'项'],['可复算条件情景',drafts+'项'],['详细季度复核',counts.detailed+'/'+counts.total+'项'],['仅核披露 / 待估值',counts.disclosure+'项'],['未来成立条件已核验',state.filter(x=>x.gate==='verified').length+'项'],['复核日期',research.asOf],['当前列表',list.length+'项']].map(a=>'<div class="stat"><small>'+a[0]+'</small><strong>'+a[1]+'</strong></div>').join('');
 renderPortfolio();
}
function openDetail(x){
 const v=value(x),p=price(x);
 const d=digits(x);
 $('dCode').textContent=x.market+x.code+' · 6–18月投资期 / 3–6月经营核验 · 全部估值为人民币';
 $('dName').textContent=x.name;
 let body='<div class="audit">价格判断：'+signal(x)[0]+'（'+escapeHTML(signal(x)[2])+'）；报价时间：'+escapeHTML(x.quote?.time||'缺失')+'；研究进度：'+escapeHTML(progress(x))+'；经营兑现：'+fulfillment(x)+'。研究完成与未来催化兑现是两回事。折价不自动等于买入，溢价不自动等于卖出。</div>';
 if(x.quarterReview){const q=x.quarterReview;body+='<section class="section audit"><h3>季度复核 · '+escapeHTML(q.date)+' · '+escapeHTML(q.status)+'</h3>'+Object.entries(q.fields).map(([k,v])=>'<p><b>'+escapeHTML(k)+'：</b>'+escapeHTML(v)+'</p>').join('')+(q.sources||[]).map(([label,url])=>'<p><a href="'+escapeHTML(url)+'" target="_blank" rel="noopener">'+escapeHTML(label)+'</a></p>').join('')+'<a href="https://github.com/colourschen-bit/A-share-monitor/blob/main/QUARTERLY-REVIEW-2026-10-30.md" target="_blank" rel="noopener">完整季度报告 ↗</a></section>';}
 body+='<section class="section audit"><h3>执行限制与复核时点</h3><p>'+escapeHTML(executionText(x))+'</p><p>经营状态：'+escapeHTML(x.conditionStatus==='verified'?'已核验':'待核验')+'；模型复核日期 '+escapeHTML(x.modelReviewedAt)+'；下次最迟复核 '+escapeHTML(x.modelReviewDueAt)+'。投资持有期与模型复核期限分别管理。</p>'+(x.bankReconciliation?'<p>'+escapeHTML(bankBridgeText(x))+'</p>':'')+'</section>';
 if(x.rankReview){const z=x.rankReview;
  body+='<section class="section"><h3>候选排序核验 · 候选'+z.candidateRank+'/46 · 全池#'+x.portfolio.rank+'</h3><p>'+escapeHTML(x.portfolio.grade)+'；原全池#'+z.previousRank+'。'+escapeHTML(z.reason)+'</p><p>价格依据与缺口：'+escapeHTML(z.pricing)+'</p><p class="small">事实锚：'+escapeHTML(z.anchor)+'；证据日期：'+(z.evidenceDate||z.date)+'；排序复核：'+z.date+'。候选顺位不改变15只核心席位，也不代表当前可执行买入。</p></section>';
 }
 if(x.additionReview){const a=x.additionReview;
  body+='<section class="section"><h3>10月23日历史研究与价格依据（本季更新见上方）</h3><p>长期质地：'+escapeHTML(a.quality)+'。当前安排：'+escapeHTML(a.decision)+'。</p><p>优先级与组合：'+escapeHTML(a.reason)+'</p><p>价格证据：'+escapeHTML(a.priceEvidence)+'。</p>';
  if(a.cashGate)body+='<div class="audit">该区间只表示盈利恢复情景，当前现金不支持执行。价格达区也保持观察，须先满足现金恢复和渠道条件。</div>';
  if(a.bank&&!x.bankReconciliation)body+='<p>普通股BPS '+fmt(a.bank.reportedBps,2)+'元 − 期后股息预留 '+fmt(a.bank.dividendReserve,3)+'元 = 模型BPS '+fmt(a.bank.modelBps,3)+'元。PB=(持续ROE−长期增长)/(股权要求回报−长期增长)。三情景ROE：'+a.bank.roe.map(v=>fmt(v*100,1)+'%').join(' / ')+'；资本要求：'+a.bank.cost.map(v=>fmt(v*100,1)+'%').join(' / ')+'；长期增长：'+a.bank.growth.map(v=>fmt(v*100,1)+'%').join(' / ')+'。压力/修复BPS为基数90%/105%的假设，非新披露净资产。</p>';
  if(a.cashCheck){const c=a.cashCheck,kind=c.currentOnly?'本期':'TTM';
   body+='<p>'+kind+'现金对照（亿元）：OCF '+fmt(c.ocfTtm,2)+' − 购建长期资产 '+fmt(c.capexTtm,2)+' = '+fmt(c.surplus,2)+'；除以 '+fmt(c.shares,5)+'亿股约 '+fmt(c.perShare,2)+'元/股。'+(c.currentOnly?'本期不是全年预测。':'TTM=2025全年−2025同期＋2026同期。')+(c.minorityPaid!==null?'再扣实际支付少数股东股息 '+fmt(c.minorityPaid,2)+'亿元后约 '+fmt(c.afterMinority,2)+'元/股；少数股东留存权益仍需另分配。':'未在该简表分配少数股东归属。')+' 该差额尚未扣融资利息、租赁本金及其他股东现金限制，不标为FCFE，不用它直接生成买价。</p>';
  }
  body+='</section>';
 }
 if(x.validation){const z=x.validation,fx=x.market==='HK'?x.previousReview.fx:1;
  body+='<section class="section"><h3>10月23日历史现金核验：'+escapeHTML(z.priceGrade)+'</h3><p>'+escapeHTML(z.finding)+'</p><p>财报锚点：'+escapeHTML(z.anchor)+'</p><p>未来假设：'+escapeHTML(z.hypothesis)+'</p><p>反证：'+escapeHTML(z.falsifier)+'</p>';
  if(z.cross)body+='<p>前5年归母可分配现金/股（CNY）：'+z.cash.map(n=>fmt(n,2)).join(' → ')+'；第6–10年：'+z.cross.flows.slice(5).map(n=>fmt(n,2)).join(' → ')+'。</p><p>资金要求 '+fmt(z.rate*100)+'%、终值增长 '+fmt(z.terminal*100)+'%；现金现值 '+fmt(z.cross.pv/fx,2)+(x.market==='HK'?' HKD':' CNY')+'，其中终值占 '+fmt(z.cross.terminalShare*100)+'%。仅改资金要求±2个百分点，现值约为 '+z.sensitivity.map(n=>fmt(n/fx,2)).join('–')+'。</p><p>现金假设参照区（现值再留10%–20%余量）：'+z.cashZone.map(n=>fmt(n/fx,2)).join('–')+(x.market==='HK'?' HKD':' CNY')+'。这不是一组新的高胜率买单；完整净现金/投资资产与资本支出桥接尚可能改变结果。</p>';
  if(z.cross&&v)body+='<p>按同一资金成本、终值和形状，盈利模型条件区需要整条现金路径达到上述假设的 '+fmt(v.lo/z.cross.pv,2)+'–'+fmt(v.hi/z.cross.pv,2)+' 倍；这是反向条件，不是盈利增长率或胜率。</p>';
  body+='<p class="small">'+escapeHTML(research.coreValidation.limits)+'</p></section>';
 }
 const a=x.audit;
 body+='<section class="section"><h3>研究完成度与下一步</h3><p>已完成：'+escapeHTML(a?.done||(x.model?'财报锚点整理、情景计算链、催化与风险框架。':'标的识别及催化、风险框架。'))+'</p><p>仍缺：'+escapeHTML(a?.missing||(x.model?'从财报到未来盈利的分项推导、估值倍数及情景权重依据；草案尚非完整估值。':'当期成分权重、成分盈利/现金流及同日净值，尚不能给出可靠的绝对价区。'))+'</p><p>下一核验：'+escapeHTML(a?.next||x.catalyst)+'</p>'+(a?'<p class="small">补研日期：'+escapeHTML(a.date)+'；'+escapeHTML(a.conclusion)+'</p>':'')+'</section>';
 body+='<section class="section"><h3>现有事实锚 / 以本季复核状态为准</h3><p>'+escapeHTML(x.fact)+'</p><p class="small"><a href="'+escapeHTML(x.source)+'" target="_blank" rel="noopener">来源 / 待核验入口 ↗</a></p></section>';
 if(x.sources)body+='<p class="small">'+x.sources.map(s=>'<a href="'+escapeHTML(s[1])+'" target="_blank" rel="noopener">'+escapeHTML(s[0])+' ↗</a>').join(' · ')+'</p>';
 const n=x.analysis;
 if(n){
 body+='<section class="section"><h3>当前独立判断</h3><p>'+escapeHTML(n.verdict)+'</p></section>';
 if(n.moat)body+='<section class="section"><h3>护城河与长期现金机制</h3><p>'+escapeHTML(n.moat)+'</p></section>';
 if(n.quality)body+='<section class="section"><h3>利润与现金质量</h3><p>'+escapeHTML(n.quality)+'</p></section>';
 if(n.bridge)body+='<section class="section"><h3>盈利 / 情景推导：事实锚点之后均为假设</h3><ul>'+n.bridge.map(t=>'<li>'+escapeHTML(t)+'</li>').join('')+'</ul></section>';
 body+='<section class="section"><h3>估值方法及参数依据</h3><p>'+escapeHTML(n.basis)+'</p></section>';
 body+='<section class="section"><h3>反身性 / 重叠风险</h3><p>'+escapeHTML(n.reflexivity||n.overlap)+'</p></section>';
 }
 if(x.model?.type==='lookthrough'){
 const m=x.model;
  body+='<section class="section"><h3>前十大持仓穿透 · '+escapeHTML(m.holdingsDate)+'披露</h3><div class="lookthrough-summary"><span class="pill core">权重覆盖 '+fmt(m.coverage,2)+'%</span><span class="pill pending">'+escapeHTML(m.confidence)+'</span><span class="pill secondary">固定复核净值 '+fmt(m.anchorNav,4)+'</span></div><div class="table-wrap lookthrough-table"><table><thead><tr><th>成分股</th><th class="num">权重</th><th>现金质量判断</th><th>弹性判断</th><th class="num">假设折价水平*</th><th>经营依据</th></tr></thead><tbody>'+m.top10.map(h=>'<tr><td><b>'+escapeHTML(h.name)+'</b><span class="code">'+escapeHTML(h.code)+'</span></td><td class="num">'+fmt(h.weight,2)+'%</td><td>'+escapeHTML(h.quality)+'</td><td>'+escapeHTML(h.odds)+'</td><td class="num">'+fmt(h.band[0]*100,0)+'%–'+fmt(h.band[1]*100,0)+'%</td><td>'+escapeHTML(h.basis)+'</td></tr>').join('')+'</tbody></table></div><p class="small">*折价比例为研究假设，尚缺逐成分同日价格及绝对价值桥接，不是统计胜率。'+escapeHTML(m.residualNote)+' 剩余净资产包含非股票资产与负债，统一折价只是近似。加权公式：Σ(持仓权重×折价比例)＋剩余净资产权重×假设比例。中间情景由上沿÷90%反推，不构成独立公允价值验证。</p></section>';
 }
 if(v){
  body+='<p class="audit">'+escapeHTML(timeLabel(x))+'；模型基准现值／对照值 '+fmt(v.pv,d)+'元，关注区 '+fmt(v.lo,d)+'–'+fmt(v.hi,d)+'元。</p>';
  body+='<section class="section"><h3>可复算情景：参数均为研究假设</h3><div class="grid">'+scenarioNames.map((n,i)=>'<div class="card inputs"><small>'+n+' · '+(i===1?'定价参照':'敏感性边界')+'</small><strong>'+fmt(v.cases[i],d)+'元</strong><p class="small">'+escapeHTML(formula(x,i))+'</p><p class="small">情景价格收益 '+(!x.model.targetDate||x.model.targetDate<=chinaToday()?'目标日未确认或已到期，不计远期收益':p===null?'缺行情':pct(v.cases[i]/p-1)+' · 至 '+escapeHTML(x.model.targetDate))+'</p></div>').join('')+'</div><p class="small">除明确标注2027年的思源专题外，其余旧EPS/BPS预测年度须按季度复核条目补齐；保留为对照；ETF使用前十大披露持仓穿透＋剩余篮子折价。6–18个月为投资期，3–6个月是经营核验窗口。三种情景不分配未经验证的概率，不计算虚假统计胜率。</p></section>';
 if(x.model.evidenceUrl)body+='<p class="small"><a href="'+escapeHTML(x.model.evidenceUrl)+'" target="_blank" rel="noopener">估值锚数据来源 ↗</a> · '+escapeHTML(x.model.reference||'')+'</p>';
 body+='<section class="section"><h3>条件关注区与反向核验</h3><p class="small">基准估值 '+fmt(v.ev,d)+'；'+(x.model.type==='lookthrough'?'持仓穿透核心区 '+fmt(v.lo,d)+'–'+fmt(v.hi,d)+'，安全边际已经逐项计入，不再二次折现。':(x.model.reviewBuyZone?'沿用专题今天现值与条件区，不重复折现；':x.model.discountYears===0?'PB模型已经是现值，不再做半年折现；':'旧假设情景值 '+fmt(v.terminalValue,2)+'按12%、'+fmt(x.model.discountYears??.5,2)+'年折现为 '+fmt(v.pv,2)+'；目标日未确认，当前仅作对照。')+'相对模型现值的区间折价 '+safetyText(v)+'；条件区 '+fmt(v.lo,d)+'–'+fmt(v.hi,d)+' CNY。以上折价不能替代现金回报、再投资或资产归属核验。')+'</p>';
 if(p!==null&&x.additionReview?.bank){
 const b=x.additionReview.bank,needed=b.growth[1]+p/b.modelBps*(b.cost[1]-b.growth[1]);
 body+='<p>保持模型BPS、资本要求和增长不变，当前价格需要持续ROE约 '+fmt(needed*100,1)+'%；基准假设 '+fmt(b.roe[1]*100,1)+'%。这是反向条件，不是当期ROE预测。</p>';
 }else if(p!==null&&!x.model.targetDate&&x.model.type!=='fcf'&&x.model.type!=='index'&&x.model.type!=='lookthrough'){
 const label=x.model.type==='pb'?'BPS':x.model.type==='opat'?'营运EPS':'EPS';
 body+='<p>按本轮基准倍数，当前价格需要 '+label+' '+fmt((p-x.model.extra[1])/x.model.multiples[1],2)+' 元；本轮基准假设为 '+fmt(x.model.inputs[1],2)+' 元。这个反推只说明市场价格对应的盈利要求，不证明公司能实现。</p>';
 }
 body+='</section>';
 } else body+='<section class="section"><h3>为何暂停价格结论</h3><p>'+escapeHTML(x.risk)+'</p><p>缺少重估输入时不使用旧终值自动生成买入/卖出标签。暂停定价不等于估值为零或建议清仓。</p></section>';
 body+='<div class="conditions section"><div class="card"><small>未来3–6月需要看到</small>'+escapeHTML(x.catalyst)+'</div><div class="card"><small>论点失效 / 风险</small>'+escapeHTML(x.risk)+'</div></div>';
 body+='<details class="section"><summary>旧版对照（失效归档，禁止直接交易）</summary><p class="small">'+escapeHTML(x.historical.model)+'</p><p>旧情景终值：'+x.historical.value.map(n=>fmt(n,2)).join(' / ')+'；当时没有完整计算链，因此不将差异解释为客观价值变化。</p><p class="small">旧资料（本轮未核验）：'+escapeHTML(x.historical.report)+'</p></details>';
 $('dBody').innerHTML=body;$('detail').showModal();
}
function refresh(){
 const button=$('refreshBtn');button.disabled=true;$('status').textContent='正在请求行情；估值参数不会自动更新…';
 $('quoteScript')?.remove();
 const script=document.createElement('script');script.id='quoteScript';script.charset='gbk';
 const symbols=state.map(x=>x.key);
 symbols.forEach(k=>{try{delete window['v_'+k];}catch{}});
 script.src='https://qt.gtimg.cn/q='+symbols.join(',')+'&_='+Date.now();
 let finished=false;
 const finish=()=>{finished=true;button.disabled=false;render();};
 const timer=setTimeout(()=>{if(finished)return;script.remove();$('status').textContent='行情超时：保留标明日期的历史报价，不宣称实时';finish();},12000);
 script.onload=()=>{
 if(finished)return;clearTimeout(timer);let ok=0;
 state=state.map(x=>{
 const raw=window['v_'+x.key];if(typeof raw!=='string')return {...x,quoteOrigin:'未刷新；历史报价'};
 const a=raw.split('~'),n=Number(a[3]);if(!(n>0)&&Number.isFinite(n))return {...x,quoteOrigin:'报价无效；历史报价'};
 if(!Number.isFinite(n)||!a[30])return {...x,quoteOrigin:'返回不完整；历史报价'};
 ok++;return {...x,quote:{price:n,time:a[30],change:Number(a[32])},quoteOrigin:'本次行情响应（可能延迟）'};
 });
 $('status').textContent='行情返回 '+ok+'/'+state.length+'项 · 各自时间见表 · 模型审核 '+research.asOf;finish();
 };
 script.onerror=()=>{if(finished)return;clearTimeout(timer);$('status').textContent='行情请求失败：保留标明日期的历史报价';finish();};
 document.body.appendChild(script);
}
$('macro').innerHTML=research.macro.map(m=>'<article><h3>'+escapeHTML(m.title)+'</h3><p>'+escapeHTML(m.fact)+'</p><p>'+escapeHTML(m.inference)+'</p><a class="small" href="'+escapeHTML(m.url)+'" target="_blank" rel="noopener">证据来源 ↗</a></article>').join('');
$('rows').onclick=e=>{const tr=e.target.closest('tr');if(tr)openDetail(state.find(x=>x.code===tr.dataset.code));};
$('rows').onkeydown=e=>{if(e.key==='Enter'){const tr=e.target.closest('tr');if(tr)openDetail(state.find(x=>x.code===tr.dataset.code));}};
$('excludedRows').onclick=e=>{const tr=e.target.closest('tr');if(tr)openDetail(state.find(x=>x.code===tr.dataset.code));};
$('excludedRows').onkeydown=e=>{if(e.key==='Enter')$('excludedRows').onclick(e);};
$('validationRows').onclick=e=>{const tr=e.target.closest('tr');if(tr)openDetail(state.find(x=>x.code===tr.dataset.code));};
$('idealGrid').onclick=e=>{const card=e.target.closest('[data-code]');if(card)openDetail(state.find(x=>x.code===card.dataset.code));};
$('idealGrid').onkeydown=e=>{if(e.key==='Enter')$('idealGrid').onclick(e);};
$('reviewScope').textContent=research.auditReview.scope;
$('auditItems').innerHTML=research.auditReview.items.map(([name,note])=>'<li><b>'+escapeHTML(name)+'</b>：'+escapeHTML(note)+'</li>').join('');
$('expansionMethod').textContent=research.expansion.scope+' '+research.expansion.method+' '+research.expansion.boundary;
$('reviewHeading').textContent=state.length+'项逐项审查 · 点击查看公式、证据与催化';
$('tier').options[0].textContent='全部'+state.length+'项';$('tier').options[1].textContent=state.length+'项条件情景';
$('closeBtn').onclick=()=>$('detail').close();
$('search').oninput=render;$('tier').onchange=render;
$('scenarioBtn').onclick=()=>{scenario=(scenario+1)%3;$('scenarioBtn').textContent='对照情景：'+scenarioNames[scenario];render();};
$('refreshBtn').onclick=refresh;
render();refresh();

