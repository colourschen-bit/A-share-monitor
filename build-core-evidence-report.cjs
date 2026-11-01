'use strict';
const fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{}};vm.createContext(ctx);
for(const f of Array.from(fs.readFileSync('index.html','utf8').matchAll(/<script src="([^?]+)\?/g),m=>m[1]).filter(f=>f!=='app.js'))vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
const r=ctx.window.RESEARCH,math=ctx.window.CORE_EVIDENCE_MATH;
const core=r.assets.filter(x=>x.portfolio.included).sort((a,b)=>a.portfolio.rank-b.portfolio.rank);
const f=(n,d=2)=>n.toFixed(d);
const zone=x=>{const m=x.model,p=m.reviewBuyZone?m.reviewValueToday:(m.inputs[1]*m.multiples[1]+m.extra[1])/Math.pow(1.12,m.discountYears??.5);return m.reviewBuyZone||[p*(1-m.margin[0]),p*(1-m.margin[1])];};
const band=(a,fx)=>a.map(n=>f(n/fx)).join('–');
let out=`# 15只核心：影响买价的证据补核 · 2026-11-01

截至北京时间2026-11-01。最新行情参照仍为2026-10-30，不是周末实时价格。15席位、股票目标85%及现金底线15%保留；候选排名不在本轮范围内。

## 本轮结论与边界

本轮逐项补核15只核心的公开定价证据，补出南瑞、美的、东鹏、长江的滚动现金，重算东鹏和长江的2026盈利试算区，完成招行普通股权益及含权股息估值口径。**不等于15项买价证据全部通过。** 缺少分项披露的现金/套保/合并资本仍明确保留限制，腾讯与中通等待11月18日新季报。

- 招行：当前含权普通股BPS可使用；不再因未来尚未实施股息而笼统冻结PB。未来信用、资本和分红实施仍要维护。
- 东鹏：旧EPS7.3元需要Q4扣非同比约134%，比“略高于Q3”严苛得多；新基准用上年同季利润持平、当前股本，分清2026盈利和长期倍数依据。
- 长江：旧EPS1.5元需要Q4归母同比约64%；新基准用上年同季，压力和修复另设，不能以Q3旺季外推。
- 南瑞：现金下降桥已核清，主要付款压力有实数；采购付款增加不能全部加回。滚动现金转正没有证明24倍合理。
- 美的：归母/扣非算术闭合，不代表汇兑及对冲的经济净桥接已经闭合；金融资产收益不全是套保收益。
- 吉比特：原始PDF购建付款负数获得确认，但性质未获解释；定价排除这笔负支出增益，不用异常数据抬买价。

所有压力/基准/修复乘数、资金要求、PB/PE及长期增长均为研究假设，不是公司指引或统计校准概率。未来经营条件仍为待核，没有因为增加研究文字而产生可自动执行买单。

## 15项总表

“此前区”冻结本轮前模型，港股前后均用SAFE 2026-10-30汇率0.85594；与网页另列的10月23日固定旧汇率历史对照不同。原模型区未改数值，不表示已确认合理。页面同时修正了A股历史对照列误用港币汇率的显示问题；人民币历史区按人民币原值显示，当前计算区间不受此显示修正影响。反推当前价格所需EPS也与现值模型使用同一折现因子，避免以现价直接除期末倍数混用口径。

|顺位|标的|本轮前模型区|当前区间/试算|买价依据状态|本轮补核|
|---|---|---:|---:|---|---|
`;
for(const x of core){const e=x.coreEvidence,fx=x.market==='HK'?r.hkdCny:1,u=x.market==='HK'?'HKD':'CNY';out+=`|${x.portfolio.rank}|${x.code} ${x.name}|${band(e.previousZone,fx)} ${u}|${band(zone(x),fx)} ${u}|${e.priceStatus}|${e.status}|\n`;}
out+=`
## 四项滚动现金复算

单位亿元。TTM=2025全年−2025前三季＋2026前三季。各期均取合并报表相同科目；本金/利息/少数股东/租赁及受限资金尚未完整拆分，因此不标成FCFE。既不将前三季度乘4/3，也不把上一年Q4现金保证为本年Q4现金。

|标的|全年OCF−上年同期＋本年同期|TTM OCF|全年购建−上年同期＋本年同期|TTM购建|简化差额|
|---|---|---:|---|---:|---:|
`;
for(const x of core.filter(x=>x.coreEvidence.ttmData)){const {ttmData:t,ttm}=x.coreEvidence;out+=`|${x.name}|${f(t.ocf[0],4)}−${f(t.ocf[1],4)}＋(${f(t.ocf[2],4)})|${f(ttm.ocf,4)}|${f(t.capex[0],4)}−${f(t.capex[1],4)}＋${f(t.capex[2],4)}|${f(ttm.capex,4)}|${f(ttm.ocf-ttm.capex,4)}|\n`;}
out+=`
## 定价方法与剩余门槛

两项2026盈利重算保持原倍数和安全边际，隔离本次盈利修正的影响，不表示原倍数已获得现金充分支持。当前没有足够分项证据把它们升级为“高胜率买入价”。旧12%半年折现因子保留为估值压力余量，不能据此声称半年退出或12%年化；情景没有明确退出日时页面不展示远期收益。

招行PB是当前净资产现值，不重复折现。思源保留独立2027专题及取整现值110元，不根据周末日期机械滚动。其他核心为正常化年度盈利参照，未虚构具体预测年度或退出日。

为检验倍数是否有现金含义，非金融核心另列稳态反向现金条件：P×(r−g)。它只回答“若全部价值来自可持续股东现金，需要什么水平”，不是10年DCF、FCFE预测或新的买价；没有额外加入投资/净金融资产，不能据此否定全部公司价值，也不能将九个月合并现金直接与全年每股条件相比。现金路径/投资资产若未来补齐，须统一归属并避免双计。
`;
for(const x of core){const e=x.coreEvidence,m=x.model;out+=`\n## ${x.portfolio.rank}. ${x.code} ${x.name}\n\n**${e.priceStatus}；${e.status}。**\n\n本轮已完成：${e.resolved.join(' ')}\n\n财报事实：${e.fact}\n\n现金/资本桥：${e.cash}\n\n定价推导：${e.pricing}\n\n独立假设与反身性：${e.assumptions}\n`;
 if(e.earningsBridge){const b=e.earningsBridge;out+=`\n可复算盈利桥（亿元/亿股）：${f(b.ytdProfit,8)}＋${f(b.priorQ4Profit,8)}×[${b.q4Factors.join(', ')}]，除以${f(b.shares,8)}，得到EPS[${b.eps.map(n=>f(n,6)).join(', ')}]元；再乘[${m.multiples.join(', ')}]倍。旧基准Q4要求${f(b.oldRequiredQ4,6)}亿元、同比+${f(b.oldRequiredGrowth*100,2)}%。基准Q4同比持平是情景选择，不是经验证明的预测。\n`;}
 if(e.cashBridge){const b=e.cashBridge;out+=`\n南瑞现金桥复算：${f(b.start,8)}＋${f(b.inflows,8)}＋(${f(b.purchases,8)})＋(${f(b.employees,8)})＋${f(b.taxes,8)}＋(${f(b.other,8)})=${f(b.end,8)}亿元。负号表示减少现金。\n`;}
 if(e.cashData)out+=`\n本期现金中间值：${f(math.cashIntermediate(e.cashData),6)}亿元；期间${e.cashData.period}；${e.cashData.scope}。\n`;
 if(e.requiredReturn){const z=zone(x),s=e.requiredReturn-e.longGrowth;out+=`\n稳态反向条件：资金要求${f(e.requiredReturn*100,1)}%、长期增长${f(e.longGrowth*100,1)}%；当前试算区需下一年可持续股东现金约${f(z[0]*s,3)}–${f(z[1]*s,3)}元/股（人民币）。这不是已实现现金或本轮现金预测。\n`;}
 out+=`\n尚缺：\n\n${e.missing.map(s=>'- '+s).join('\n')}\n\n下一核验/反证：${e.next}\n\n一手资料（包括公司原始公告PDF的存档地址）：\n\n${e.sources.map(([label,url])=>'- ['+label+']('+url+')').join('\n')}\n`;
}
out+=`
## 下一轮补证据顺序

1. 南瑞：供应商付款条款、库存与归母现金路径，决定24倍是否值得保留。
2. 美的：套保与汇兑分项的税后净额、工业现金及金融子公司现金，决定5.8元正常化EPS是否有代表性。
3. 东鹏：新品利润/终端动销、Q4扣非及投入回报，决定新6.123元基准能否兑现及18倍是否合理。
4. 财险：合并归母权益与投资波动资本桥接；11月6日派息不是新一期合并资本证据。
5. 长江：Q4发电、电价、利息和维持投入，验证新年度盈利与现金。
6. 腾讯/中通：11月18日新报，按新累计数重算；其余核心见各自明确的归属/投入缺口。

这是证据补研顺序，不改变15只组合的投资优先级或权重。未披露的未来数字不会由假设填成事实。

## 实现与核验

- 数据覆盖：core-evidence.js加载于季度复核之后、页面之前；保存本轮前区间与来源。
- 计算：两项EPS从利润/股本直接生成，现金与归属状态单独管理；不在页面写死新价区。
- 报告：由node build-core-evidence-report.cjs从同一证据数据生成，避免网页与报告分叉。
- 验证：node verify-dashboard.cjs检查61项、全部详情、15项证据覆盖、现金桥、年度盈利、股息口径、异常现金不抬价和执行限制。
`;
fs.writeFileSync('CORE-EVIDENCE-2026-11-01.md',out);
console.log('Generated CORE-EVIDENCE-2026-11-01.md: '+core.length+' core records.');
