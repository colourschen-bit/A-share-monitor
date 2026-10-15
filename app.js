'use strict';
const research=window.RESEARCH;
let scenario=1;
const scenarioNames=['压力','基准','修复'];
let state=research.assets.map(x=>({...x,quote:x.snapshot,quoteOrigin:'2026-10-15盘中快照'}));
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=0)=>Number.isFinite(n)?n.toLocaleString('zh-CN',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
const pct=n=>Number.isFinite(n)?(n>=0?'+':'')+(n*100).toFixed(0)+'%':'—';
function cases(x){
 const m=x.model;if(!m)return null;
 return m.inputs.map((v,i)=>m.type==='fcf'?v/m.yields[i]+m.extra[i]:v*m.multiples[i]+m.extra[i]);
}
function value(x){
 const v=cases(x);if(!v)return null;
 const ev=v.reduce((s,n,i)=>s+n*x.model.weights[i],0);
 const pv=ev/Math.pow(1.12,.5);
 return {cases:v,ev,pv,lo:pv*(1-x.model.margin[0]),hi:pv*(1-x.model.margin[1])};
}
function price(x){return Number.isFinite(x.quote?.price)&&x.quote.price>0?x.quote.price*(x.market==='HK'?research.hkdCny:1):null;}
function quoteDate(q){
 if(!q?.time)return '';
 const s=q.time.replace(/\D/g,'');return s.length>=8?s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6,8):'';
}
function signal(x){
 const v=value(x),p=price(x);
 if(!v)return ['暂不估值','pending','模型证据不足；行情仍正常显示'];
 if(new Date().toISOString().slice(0,10)>research.window[1])return ['暂不估值','pending','模型已过期，须重估'];
 if(p===null)return ['暂不估值','pending','缺有效行情，暂不比较'];
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const part=k=>parts.find(p=>p.type===k).value;const today=part('year')+'-'+part('month')+'-'+part('day');
 if(quoteDate(x.quote)!==today)return ['暂不估值','pending','行情非今日，保留历史报价供参考'];
 if(x.gate==='failed')return ['暂不估值','bad','论点失效，须重建模型'];
 if(p<=v.hi)return ['有折价','watch',p<v.lo?'低于关注区下沿，先检查是否遗漏风险':'价格不高于条件关注区上沿'];
 if(p>v.ev)return ['有溢价','reduce','高于主观加权情景价'];
 return ['接近估值','hold','高于关注区上沿，不高于主观加权情景价'];
}
function progress(x){return x.audit?.stage||(x.model?'已有草案，待完善依据':'资料待补，模型未完成');}
function fulfillment(x){return x.gate==='verified'?'成立条件已核验':x.gate==='failed'?'论点失效':'催化待观察';}
function formula(x,i){
 const m=x.model;if(!m)return '未建立可追溯的当前模型';
 if(m.type==='fcf')return fmt(m.inputs[i],1)+'元FCFE ÷ '+fmt(m.yields[i]*100,1)+'% + '+m.extra[i]+'元投资折价值';
 const label=m.type==='pb'?'BPS':m.type==='opat'?'营运EPS':'EPS';
 return label+' '+fmt(m.inputs[i],2)+'元 × '+fmt(m.multiples[i],2)+(m.extra[i]?' + '+m.extra[i]+'元期权':'');
}
function render(){
 const query=$('search').value.trim().toLowerCase(),filter=$('tier').value;
 const list=state.filter(x=>{
 const v=value(x),p=price(x);
 return [x.name,x.code,x.catalyst,x.risk].join(' ').toLowerCase().includes(query)&&
 (filter==='all'||filter==='core'&&x.tier==='core'||filter==='draft'&&x.model||filter==='pending'&&!x.model||filter==='zone'&&signal(x)[0]==='有折价');
 });
 $('rows').innerHTML=list.map(x=>{
 const v=value(x),p=price(x),s=signal(x);
 const raw=x.quote?.price;
 return '<tr tabindex="0" data-code="'+x.code+'"><td><div class="name">'+escapeHTML(x.name)+'</div><span class="code">'+x.market+x.code+' · '+x.kind+'</span></td>'+
 '<td class="num">'+fmt(raw,x.kind==='ETF'?3:2)+(x.market==='HK'?' HKD':' CNY')+'<span class="meta">'+escapeHTML(x.quote?.time||'缺失')+'</span><span class="meta">'+escapeHTML(x.quoteOrigin)+'</span>'+(x.market==='HK'?'<span class="meta">≈ '+fmt(p,2)+' CNY</span>':'')+'</td>'+
 '<td><span class="pill '+s[1]+'">'+s[0]+'</span><span class="meta">'+escapeHTML(s[2])+'</span></td>'+
 '<td><span class="pill pending">'+escapeHTML(progress(x))+'</span><span class="meta">'+fulfillment(x)+'</span></td>'+
 '<td class="num">'+(v?fmt(v.cases[scenario]):'暂停')+'</td><td class="num">'+(v?fmt(v.ev):'暂停')+'</td>'+
 '<td class="num">'+(v?fmt(v.lo)+'–'+fmt(v.hi):'不沿用旧值')+'</td>'+
 '<td class="num">'+(v&&p!==null?pct(v.cases[0]/p-1)+' / '+pct(v.cases[2]/p-1):'—')+'</td>'+
 '<td class="thesis">'+escapeHTML(x.catalyst)+'</td><td class="report factcell">'+escapeHTML(x.fact)+'<span class="meta">'+escapeHTML(x.verification)+'</span></td></tr>';
 }).join('');
 const drafts=state.filter(x=>x.model).length;
 $('stats').innerHTML=[['研究范围',state.length+'项'],['可追溯情景草案',drafts+'项'],['模型尚未完成',state.length-drafts+'项'],['成立条件已核验',state.filter(x=>x.gate==='verified').length+'项'],['复核日期',research.asOf],['当前列表',list.length+'项']].map(a=>'<div class="stat"><small>'+a[0]+'</small><strong>'+a[1]+'</strong></div>').join('');
}
function openDetail(x){
 const v=value(x),p=price(x);
 $('dCode').textContent=x.market+x.code+' · 3–6月评价窗口 · 全部估值为人民币';
 $('dName').textContent=x.name;
 let body='<div class="audit">价格判断：'+signal(x)[0]+'；研究进度：'+escapeHTML(progress(x))+'；经营兑现：'+fulfillment(x)+'。研究完成与未来催化兑现是两回事。折价不自动等于买入，溢价不自动等于卖出。</div>';
 const a=x.audit;
 body+='<section class="section"><h3>研究完成度与下一步</h3><p>已完成：'+escapeHTML(a?.done||(x.model?'财报锚点整理、情景计算链、催化与风险框架。':'标的识别及催化、风险框架。'))+'</p><p>仍缺：'+escapeHTML(a?.missing||(x.model?'从财报到未来盈利的分项推导、估值倍数及情景权重依据；草案尚非完整估值。':'当期成分权重、成分盈利/现金流及同日净值，尚不能给出可靠的绝对价区。'))+'</p><p>下一核验：'+escapeHTML(a?.next||x.catalyst)+'</p>'+(a?'<p class="small">补研日期：'+escapeHTML(a.date)+'；'+escapeHTML(a.conclusion)+'</p>':'')+'</section>';
 body+='<section class="section"><h3>已核对事实 / 数据边界</h3><p>'+escapeHTML(x.fact)+'</p><p class="small"><a href="'+escapeHTML(x.source)+'" target="_blank" rel="noopener">来源 / 待核验入口 ↗</a></p></section>';
 if(v){
 body+='<section class="section"><h3>可复算情景：参数均为研究假设</h3><div class="grid">'+scenarioNames.map((n,i)=>'<div class="card inputs"><small>'+n+' · 主观权重 '+fmt(x.model.weights[i]*100)+'%</small><strong>'+fmt(v.cases[i])+'元</strong><p class="small">'+escapeHTML(formula(x,i))+'</p><p class="small">情景价格收益 '+(p===null?'缺行情':pct(v.cases[i]/p-1))+'</p></div>').join('')+'</div><p class="small">EPS/BPS/FCFE为未来12个月或正常化参数；不是3–6个月累计利润。参数不是公司指引或一致预期。修复情景需要催化发生，不能仅因跌深而提升权重。</p></section>';
 body+='<section class="section"><h3>模型解释</h3><p>'+escapeHTML(x.model.why)+'</p><p class="small">主观加权情景价 '+fmt(v.ev,2)+'；按12%年化、半年折现后的值 '+fmt(v.pv,2)+'；额外安全边际 '+fmt(x.model.margin[1]*100)+'%–'+fmt(x.model.margin[0]*100)+'%。关注区只用于条件化研究，不是保证可成交买点。</p></section>';
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
$('closeBtn').onclick=()=>$('detail').close();
$('search').oninput=render;$('tier').onchange=render;
$('scenarioBtn').onclick=()=>{scenario=(scenario+1)%3;$('scenarioBtn').textContent='对照情景：'+scenarioNames[scenario];render();};
$('refreshBtn').onclick=refresh;
render();refresh();

