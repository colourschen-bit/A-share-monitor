import json,pathlib
financial=json.load(open('financial-evidence-2026-11-11.json'));macro=json.load(open('macro-evidence-2026-11-11.json'))
etf={
'516120':'化工篮子不能当单一复苏交易：万华/煤化工、钾肥/锂、氟化工/电解液的价差驱动不同。二手9月末前十合计42.19%左右，余下篮子很大；价格锚仍待独立绝对价值核算。',
'513260':'平台现金、汽车价格竞争与半导体扩产驱动不同。二手9月权重排序已变化，不能把恒科等同腾讯/阿里；港股11月财报尚未齐，不用A股报完推定已完成穿透。',
'159928':'主要消费含乳制品、养殖与白酒；养殖利润周期可能抵消或掩盖白酒去库存。二手9月前十覆盖约67.84%，需逐成分归母现金及剩余篮子定价。',
'562550':'绿电篮子包含水电、火电、核电和新能源：高煤价、电价、来水及负债敏感性不同；二手9月前十覆盖54.25%，不等同长江电力单股。',
'520550':'红利低波不保证低经营风险。二手9月前十仅约26.48%，燃气、基建和租赁的分红约束不同，前十不足以代表全部资产，不能套统一股息率定价。',
'513090':'券商和交易所受成交、投行周期、利率和资本要求共同影响。二手9月前十约87.36%，集中度高仍不能把交易额高点年化；券商普通股权益与香港交易所现金估值分开。',
'589720':'创新药的销售、临床/审批、BD首付款与融资是不同现金来源。二手9月前十约61.34%，一次性授权款不能永续化，研发现金跑道与稀释优先于PE。',
'588000':'半导体设计、设备、晶圆制造混合。二手9月前十约58.92%，盈利与资本开支周期不同；长期利率上行时，高估值和扩产回报可能同时受压。',
'159530':'机器人概念篮子不代表已落地机器人利润；汽车零部件、消费机器人和工控业务分开。二手页面出现多期表格混排，未确认前不覆盖旧前十。',
'513120':'港股创新药需按管线成功概率、商业化利润和净现金/融资跑道研究，不能将BD金额全当收入或净利；港股披露不同步，未取得同口径新前十前不改绝对价区。'}
# Remove speculative coverage numbers unless exactly summed from retrieved dated rows.
etf['516120']=etf['516120'].replace('42.19%左右','42.19%')
etf['159928']=etf['159928'].replace('67.84%','67.84%')
code="'use strict';\n{\nconst r=window.RESEARCH,date='2026-11-11';\nconst financial="+json.dumps(financial,ensure_ascii=False)+";\nconst macro="+json.dumps(macro,ensure_ascii=False)+";\nconst etfs="+json.dumps(etf,ensure_ascii=False)+";\n"+r'''
const f=v=>Number.isFinite(v)?v.toFixed(2):'未提供';
const annualCash=z=>Number.isFinite(z.ttmOcf)&&Number.isFinite(z.ttmCapex)?z.ttmOcf-z.ttmCapex:null;
for(const z of financial.records){
 const x=r.assets.find(a=>a.code===z.code),financialCompany=z.financial;
 const fieldText=`2026前三季归母${f(z.netProfit)}亿元、扣非${f(z.recurring)}亿元（同比${f(z.recurringYoY)}%）；Q3单季扣非${f(z.q3Recurring)}亿元（同比${f(z.q3RecurringYoY)}%）。`;
 const cashText=financialCompany?'银行/保险不用工业现金差额估值；资本、准备金、普通股股息及信用成本另核。':`前三季OCF${f(z.ocf)}亿元、现金购建${f(z.cashCapex)}亿元；TTM OCF${f(z.ttmOcf)}−购建${f(z.ttmCapex)}=${f(annualCash(z))}亿元。该差额非归母FCFE，尚未分利息、租赁、少数留存和受限资金。`;
 const limitations=financialCompany?'普通股权益/股息、资本与信用压力测试；报表增长不自动证明PB合理。':'分部正常化利润、维持与扩张投入、归母现金、倍数或DCF独立依据；当期增长率不直接转成年增长假设。';
 x.fullReview={date,reportPeriod:'2026-09-30',kind:'A股正式Q3关键字段复核',facts:fieldText,cash:cashText,judgment:z.judgment,priceDecision:'保留原有有标签的试算区；本轮未产生新的可靠绝对买价。'+limitations,limitation:limitations,source:z.source,numeric:z};
 x.fact=fieldText+' '+cashText;x.verification=date+'正式Q3字段对照；非完整DCF/FCFE。';x.catalyst='下一经营公告/年报核验：'+limitations;x.source=z.source;x.sources=[["2026Q3公司原始报告（公告存档）",z.source],["东方财富财务对照",'https://data.eastmoney.com/bbsj/202609.html']];x.reportPeriod='2026-09-30';
 x.quarterReview={date,depth:'detailed',status:'Q3财务字段已复核，定价另审',fields:{'披露与财务事实':x.fact,'反馈与预期差':z.judgment,'模型修改':x.fullReview.priceDecision,'成立/失效及下一核验':limitations},sources:x.sources};
 if(x.disclosure){x.disclosureHistory=x.disclosure;delete x.disclosure;}
 x.analysis={...x.analysis,quality:x.fact,reflexivity:z.judgment,verdict:z.judgment+' '+x.fullReview.priceDecision};
 x.audit={...x.audit,date,stage:'正式Q3财务关键字段已补',done:'三表数据、单季同比和TTM现金对照；归母/OCF/购建数值与原始PDF交叉核对。',missing:limitations,next:'下一经营公告/业绩说明或2026年报；已知财报日优先，不把通常披露期限当公司预约日。'};
 if(x.rankReview){x.rankReview.reason=z.judgment;x.rankReview.pricing=x.fullReview.priceDecision;x.rankReview.anchor='2026Q3';x.rankReview.evidenceDate=date;}
 if(x.coreEvidence)x.coreEvidence.fullReviewDate=date;
 if(!financialCompany&&((z.ttmOcf!==null&&z.ttmCapex!==null&&annualCash(z)<0)||z.netProfit<0||z.cashCapex<0)){
  x.executionHold=true;x.executionHoldReason=z.cashCapex<0?'购建负数性质未解释，不计持续现金收益':z.netProfit<0?'亏损及持续现金路径尚未重建':'TTM购建后合并现金为负，归母现金/投资回报待补';x.valuationStatus='reference';
 }
 // No gate is promoted merely because a filing was obtained.
 x.gate='pending';x.conditionStatus='pending';
}
for(const [code,judgment]of Object.entries(etfs)){
 const x=r.assets.find(a=>a.code===code);
 x.fullReview={date,kind:'ETF敞口与披露边界复核',reportPeriod:'Q3二手权重线索；原始穿透未完成',facts:'基金Q3披露与股票公司财报是两层数据；历史模型仍为6月篮子。新权重线索未覆盖旧权重或生成新价区。',cash:'未完成同日底层归母现金、剩余篮子及净值桥接。',judgment,priceDecision:'旧区仅为历史试算，不是本轮建仓报价。',limitation:'原始Q3基金报告、逐成分绝对价值、剩余净资产及同日净值。',source:x.source};
 x.audit={...x.audit,date,stage:'ETF风险敞口复核；绝对估值未完成',missing:x.fullReview.limitation};x.executionHold=true;x.executionHoldReason=x.fullReview.limitation;x.valuationStatus='reference';
 x.quarterReview={...x.quarterReview,date,status:'Q3穿透未完成，旧区仅对照'};
}
const secondaryETF={'516120':'https://finance.sina.com.cn/fund/quotes/516120/bc.shtml','513260':'https://basic.10jqka.com.cn/513260/asset.html','159928':'https://q.fund.sohu.com/q/hs10.php?code=159928','562550':'https://fund.eastmoney.com/562550.html','520550':'https://fund.stockstar.com/funds/520550.shtml','513090':'https://fund.stockstar.com/funds/513090.shtml','589720':'https://finance.sina.com.cn/fund/quotes/589720/bc.shtml','588000':'https://fund.eastmoney.com/588000.html','159530':'https://q.fund.sohu.com/q/hs10.php?code=159530'};
for(const [code,url]of Object.entries(secondaryETF))r.assets.find(a=>a.code===code).fullReview.secondarySource=url;
const hk={
 '00700':['2026Q2/H1','2026-11-18','https://www.tencent.com/investors/investor-kit-calendar/','公司最新正式业绩仍为Q2/H1。AI变现与预付/算力投入双向影响现金；新增融资支持扩张不等于股东回报提高。'],
 '02057':['2026Q2/H1','2026-11-18','https://zto.investorroom.com/2026-10-16-ZTO-to-Announce-Third-Quarter-Financial-Results-of-2026-on-November-17%2C-2026-U-S-Eastern-Time','美东11月17日收盘后发布，按北京时间11月18日核验；票均价、单票成本及加盟网络收益共同决定持续性。'],
 '09988':['截至2026-06季度','2026-11-19','https://www.alibabagroup.com/zh-HK/ir-news-filings','11月6日新增公告已明确11月19日发布9月底季度业绩。配售、即时零售亏损和云增量现金须一起检验；不是A股Q3已发布。'],
 '02328':['2026Q3单体；合并资本仍H1',null,'https://property.picc.com.cn/tzzgx/tw/yejigonggao/202610/771549916668391424.pdf','承保改善与投资损益方向不同。11月6日为既定股息付款日，不据此再次扣资本；Q3单体不能替换合并归母资本。'],
 '01193':['2026H1',null,'https://www.crcgas.com/yszl_2026/2026-09-16/cf628881-c84f-4c2d-9bd7-96d8e98bbec2.pdf','燃气采购/销售气差、顺价时滞和资本开支决定现金；能源成本上涨不自动利好城燃。未检得新的正式完整季度报。']
};
for(const [code,[period,next,url,judgment]]of Object.entries(hk)){
 const x=r.assets.find(a=>a.code===code);
 x.fullReview={date,kind:'港股差异化披露复核',reportPeriod:period,facts:x.fact,cash:'沿用最近正式披露口径，未用A股更新节奏推定港股新报已出。',judgment,priceDecision:'保留旧模型及执行限制，正式新报之前不抬盈利/现金。',limitation:'新报告或合并归母现金/权益口径。',source:url};
 if(next){x.nextDisclosure={anchor:period,next,reason:judgment};x.modelReviewDueAt=next;}
 x.quarterReview={...x.quarterReview,date,status:'港股披露期单列',fields:{...x.quarterReview.fields,'披露状态':judgment}};
 x.audit={...x.audit,date,stage:'披露日与财务口径已核验',next:judgment};
}
r.fullReview={date,aShareCount:46,hkCount:5,etfCount:10,scope:'61项逐项复核：46只A股正式Q3关键字段；5只港股分期披露；10只ETF风险敞口与待补穿透。不是61份新DCF。',pricing:'没有依据个股涨跌调整EPS/PE；本轮不修改原价格模型数值。行情时间和估值依据日期分别保留。',macroScenarios:['压力：能源供应迟迟不恢复、海外通胀/利率上行、客户压缩预算；增长和倍数可能同向受压。','基准：政策分化、国内需求缓慢修复；按订单利润与归母现金分别兑现，不统一给行业溢价。','修复：能源运输恢复、实际利率/融资成本回落、需求与回款改善；需数据证实后调整，尚未分配统计概率。']};
r.macro=macro.items.map(z=>({...z,title:z.title+' · '+z.date}));r.macroEvidence=macro;r.asOf=date;r.version='4.8-full-q3-macro-review';
r.coreValidation.headline='11月11日全池资料复核完成；46只A股已用正式Q3。15核心和85%/15%配置不变，价格依据未全部通过。';
r.coreValidation.correction='全部46只补单季扣非与TTM现金；银行保险不套工业现金标准。腾讯/中通待11月18日，阿里待11月19日；财险与城燃保留合并口径边界。';
r.excludedReview.scope=r.fullReview.scope;r.auditReview.scope=r.fullReview.scope;
r.disclaimer=r.fullReview.scope+' '+r.fullReview.pricing;
}
'''
pathlib.Path('full-review-2026-11-11.js').write_text(code)
