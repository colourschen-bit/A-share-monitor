'use strict';
const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);
const layers=[...fs.readFileSync('index.html','utf8').matchAll(/<script src="([^?]+)\?/g)].map(x=>x[1]).filter(x=>x!=='app.js'&&!x.startsWith('full-review-'));
for(const f of [...layers,'full-review-2026-11-11.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const r=c.window.RESEARCH,assets=r.assets.slice().sort((a,b)=>a.portfolio.rank-b.portfolio.rank),f=v=>Number.isFinite(v)?v.toFixed(2):'未提供';
const band=x=>{const m=x.model,b=m.type==='lookthrough'?m.cases[1]:m.inputs[1]*m.multiples[1]+m.extra[1],pv=m.reviewBuyZone?m.reviewValueToday:m.type==='lookthrough'?b:b/Math.pow(1.12,m.discountYears??.5),z=m.reviewBuyZone||(m.type==='lookthrough'?m.buyZone:[pv*(1-m.margin[0]),pv*(1-m.margin[1])]),fx=x.market==='HK'?r.hkdCny:1;return z.map(v=>f(v/fx)).join('–')+(x.market==='HK'?' HKD':' CNY');};
let out=`# David看板全池财报与全球宏观复核 · 2026-11-11

已检索。资料截止北京时间2026-11-11；A股财报期2026-09-30，宏观各项日期分列。研究期6–18个月；下次最迟整体复核2027-01-30，已知港股11月18/19日披露优先。

## 本轮覆盖与边界

${r.fullReview.scope} 已取得46份公司原始Q3 PDF（公司/巨潮或公告存档）。东方财富三表标准化字段与各份PDF的归母、OCF及购建数值交叉核对；这不是逐附注审计，数值一致也不证明可持续现金。单季=九个月−半年，单季同比用上年同季，前期单季亏损时不输出误导百分比。TTM=2025全年−2025前三季＋2026前三季；非2027盈利预测。

${r.fullReview.pricing} **本轮没有完成61份独立绝对估值，也没有新增一组高胜率买单。** 不因数据更新就改变15核心席位或候选相邻顺位；排序日期保持，证据日期更新。ETF原始Q3穿透/剩余篮子价值尚未全部完成，二手权重线索不替代原模型。

## 总体判断

1. 全球政策分化，能源冲击使海外抗通胀约束延续；不能假设全球利率会同步下降，从而统一提高股票倍数。
2. 国内PPI与CPI/订单分化，上游价格改善不是终端需求全面复苏。铝、金铜、油运等利润/现金改善要剥离周期价格，检验新增产量、成本和中周期回报。
3. 思源、华明、南瑞的客户/技术壁垒仍需现金、归属和订单结构兑现；电网需求与美国设备安全要求分别核对，不能只数AI/电力关键词。
4. 沪电、仕佳的利润增长与现金/扩产背离：资本投入可能创造未来优势，也可能在需求降温时形成负反馈；未完成良率、客户账期和成熟产线资本回报前不抬估值。
5. 美的/海尔/福耀/公牛等要分会计损益、区域需求和渠道库存；一次利润下降既不等于护城河消失，也不能被品牌故事自动抵消。
6. 现金15%是底线；核心席位中证据不足或价格不合适的部分继续留现金。当前15席位是研究框架，不是已验证的最优交易组合。

## 全球宏观政策与传导

`;
for(const m of r.macroEvidence.items)out+=`### ${m.title}（${m.date}）\n\n事实：${m.fact}\n\n研究推断：${m.inference}\n\n来源：[原始发布/明确标注的转载](${m.url})\n\n`;
out+=`### 情景，不分配未经校准的概率\n\n${r.fullReview.macroScenarios.map(s=>'- '+s).join('\n')}\n\n### 如何修改估值，而不是跟随价格\n\n- 收入改变只在数量、单价、客户/订单确认和产能进度能够连接时进入情景，不将利润同比当未来增长率。\n- 利润率区分原料、产品结构、汇兑、套保、股份支付、非经常项目及税/少数归属，正负一次性因素对称处理。\n- 再投资、营运资金、利息、租赁、少数权益分配后才讨论股东现金。银行与保险用普通股资本和可持续ROE；保费流入不是自由现金。\n- 本轮确认海外利率约束，但没有完整币种/风险溢价桥，故未统一上调每家公司折现率或下调PE。高利率只进入独立压力情景。\n- 例如招行，持续ROE12%、g3%时，股权成本12%/13%/14%分别对应PB1.000/0.900/0.818；ROE也下降时再单独处理，避免隐含重复惩罚。此表是敏感性，不是新目标价。\n- 大宗商品与运输使用中周期、替代储量/船舶投资及供给恢复反证，不以当前商品/股票价格确定永续利润。\n\n## 15只核心：本轮安排\n\n|优先级|标的|保留模型试算区|经营与价格证据判断|\n|---|---|---:|---|\n`;
for(const x of assets.filter(x=>x.portfolio.included))out+=`|${x.portfolio.rank}|${x.name}|${band(x)}|${x.fullReview.judgment}|\n`;
out+=`\n区间数值沿用11月1日版本，不能把11月11日资料复核日期理解为所有价格已重新验证。模型估值日期、行情日期、显示汇率日期保持分离。\n\n## 46只A股财务全表\n\n金额为亿元人民币；同比为百分数。银行保险现金列不按工业口径展示。购建是现金流表科目，非公司经营口径资本开支；出现负数保留原数并提示，不计作持续现金增益。\n\n|代码|公司|九个月归母|扣非同比%|Q3单季扣非同比%|九个月OCF|九个月购建|TTM简化差额|\n|---|---|---:|---:|---:|---:|---:|---:|\n`;
for(const x of assets.filter(x=>x.fullReview.numeric)){const z=x.fullReview.numeric;out+=`|${x.code}|${x.name}|${f(z.netProfit)}|${f(z.recurringYoY)}|${f(z.q3RecurringYoY)}|${z.financial?'不适用':f(z.ocf)}|${z.financial?'不适用':f(z.cashCapex)}|${z.financial?'不适用':f(z.ttmOcf-z.ttmCapex)}|\n`;}
out+=`\n## 61项逐项判断与来源\n\n`;
for(const x of assets){const z=x.fullReview;out+=`### #${x.portfolio.rank} ${x.code} ${x.name}\n\n披露口径：${z.reportPeriod}；${z.kind}。\n\n财务事实：${z.facts}\n\n现金：${z.cash}\n\n独立判断/反馈：${z.judgment}\n\n定价处理：${z.priceDecision}\n\n仍需证明：${z.limitation}\n\n来源：[本项财报或披露入口](${z.source})${z.secondarySource?'；[二手权重线索（未入定价）]('+z.secondarySource+')':''}\n\n`;}
out+=`## 可追溯数据与验证\n\nfinancial-evidence-2026-11-11.json保存单位、报表期、来源及46项标准化关键数字和TTM比较数；macro-evidence-2026-11-11.json保存各政策日期和来源。full-review-2026-11-11.js只更新证据和必要限制，不读取行情生成财务假设。旧报告保留历史标签。验证脚本检查全池覆盖、原始字段、单季与TTM公式、金融口径、模型数值不随报价变化及未来条件保护。\n`;
fs.writeFileSync('FULL-REVIEW-2026-11-11.md',out);console.log('Built 61-asset review');
