'use strict';
{
const research = window.RESEARCH;
const date = '2026-11-19';
const report = 'https://github.com/colourschen-bit/A-share-monitor/blob/main/PLATFORM-VALUATION-2026-11-19.md';
const common = {
  type: 'sotp',
  valuationDate: date,
  targetDate: '2028-05-19',
  years: 1.5,
  fx: 0.85,
  weightSets: [
    {name: '基准兑现', weights: [0, 1, 0]},
    {name: '偏谨慎', weights: [0.4, 0.5, 0.1]},
    {name: '更谨慎', weights: [0.5, 0.45, 0.05]},
  ],
  requiredReturns: [0.10, 0.125, 0.15],
};
const tencent = research.assets.find(asset => asset.code === '00700');
const alibaba = research.assets.find(asset => asset.code === '09988');
const tencentSource = 'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/1118/2026111800448.pdf';
const alibabaSource = 'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/1119/2026111900874_c.pdf';

// Financial inputs are in RMB hundred millions, share counts in hundred millions.
const reviews = [
  {
    asset: tencent,
    published: '2026-11-18',
    source: tencentSource,
    quoteSource: 'https://hk.marketscreener.com/quote/stock/TENCENT-HOLDINGS-LIMITED-3045861/quotes/',
    snapshot: {price: 348.40, time: '20261119160807', name: '腾讯控股'},
    shares: 91.25,
    dividend: 5.30,
    coreLabel: '游戏、广告、支付及存量企业服务',
    fact: '2026Q3营收2,073.36亿元（同比+8%），非IFRS经营利润680.73亿元（−6%）；剔除新AI产品后约833亿元（+8%）；云服务收入同比+35%。',
    cash: 'Q3实际FCF −691亿元，剔除约860亿元算力预付款后为169亿元；TTM实际约78亿元，9月底净债务137亿元。',
    bridge: '核心利润基准参考剔除新AI产品后二/三季度约861/833亿元；云只计存量以外增量。上市投资5,054亿元计入50%/60%/70%；少数权益按约860亿元扣减。退出日前的资金占用进净债务，退出日后的新AI投入单独扣除。',
    gate: '实际自由现金流连续两季为正、TTM至少950亿元；核验预付款结转后现金回流，以及续约和扣算力成本后的增量毛利。等量新预付或资产处置主导的现金改善不足以通过。',
    hold: '现金回流、算力预付结转和AI增量毛利待验证',
    next: '财报核验实际自由现金流、预付款结转和新增采购占用，2027-02-18复核。',
    due: '2027-02-18',
    risk: '若算力预付反复占用现金、主业毛利转弱或估值倍数压缩，重算价格上限。',
    cashReference: '五年股东现金流模型基准现值297.93港元，条件区223.45–253.24港元，沿11月18日模型汇率。详情保留原参数。',
    scenarios: [
      {coreProfit:2950, coreMultiple:9, cloudProfit:0, cloudMultiple:12, investments:2527, netCash:-1500, aiDrag:2400, minority:860},
      {coreProfit:3350, coreMultiple:11, cloudProfit:80, cloudMultiple:16, investments:3032.4, netCash:-900, aiDrag:1600, minority:860},
      {coreProfit:3750, coreMultiple:13, cloudProfit:170, cloudMultiple:19, investments:3537.8, netCash:-400, aiDrag:800, minority:860},
    ],
    stress: {coreProfit:2500, coreMultiple:7, cloudProfit:0, cloudMultiple:10, investments:2021.6, netCash:-1800, aiDrag:3000, minority:860},
  },
  {
    asset: alibaba,
    published: date,
    source: alibabaSource,
    quoteSource: 'https://longbridge.com/zh-HK/quote/9988.HK',
    snapshot: {price: 80.55, time: '20261119160807', name: '阿里巴巴-W'},
    shares: 200,
    dividend: 1,
    coreLabel: '阿里巴巴电商集团',
    fact: '截至2026-09季度营收2,715.19亿元（同比+10%），经调整EBITA 326.36亿元（+260%）；云与算力收入609.73亿元（+53%），外部经常性收入+67%，云经调整EBITA利润率14.5%；同口径CMR仅+1%。',
    cash: '本季实际FCF −344.72亿元，H1为−791.42亿元，TTM约−851亿元；本季资本开支504.77亿元，9月底账面净现金约2,207亿元。',
    bridge: '电商基准EBITA 1,500亿元对应本财年H1约786亿元的规模；云基准收入3,000亿元、利润率14%。平头哥已经包含在云分部。蚂蚁股权按历史交易锚折价；AI应用及其他业务拖累单列，少数权益等合并影响吸收在该项及可分配现金假设中。',
    gate: '观察云利润率能否守住14%左右，闪购能否继续减亏，以及自由现金流缺口能否由经营现金流改善持续缩小；同时复核境外算力供给和成本。',
    hold: '云现金转化、闪购减亏和算力成本待验证',
    next: '后续财报核验云利润率、闪购减亏、经营现金流和算力成本，最迟2027-02-19复核。',
    due: '2027-02-19',
    risk: '若推理及算力成本抬升、云利润率下行、闪购重新扩大亏损或现金缺口扩大，重新定价。',
    cashReference: '同口径五年现金流基准现值约66港元；18个月年化10%–15%的现金模型试算约62–67港元。早先78港元仅作分部模型价格示例，对应更谨慎权重约11.3%年化。',
    scenarios: [
      {coreProfit:1200, coreMultiple:7, cloudRevenue:2450, cloudMargin:0.10, cloudMultiple:12, investments:800, netCash:350, aiDrag:1900, minority:0},
      {coreProfit:1500, coreMultiple:8, cloudRevenue:3000, cloudMargin:0.14, cloudMultiple:16, investments:1100, netCash:900, aiDrag:1500, minority:0},
      {coreProfit:1750, coreMultiple:9, cloudRevenue:3500, cloudMargin:0.17, cloudMultiple:19, investments:1300, netCash:1450, aiDrag:800, minority:0},
    ],
    stress: {coreProfit:1100, coreMultiple:7, cloudRevenue:2200, cloudMargin:0.08, cloudMultiple:10, investments:700, netCash:0, aiDrag:2100, minority:0},
  },
];

for (const review of reviews) {
  const {asset, published, source, quoteSource, snapshot, shares, dividend, coreLabel, fact, cash, bridge, gate, hold, next, due, risk, cashReference, scenarios, stress} = review;
  const priceDecision = '统一按2028-05-19分部退出情景与要求回报倒推；看板关注区采用更谨慎权重的12.5%–15%年化门槛，现金兑现待核验。';
  if (asset.tencentReview) {
    const oldPv = asset.tencentReview.scenarios[1].pv;
    asset.previousReview = {...asset.previousReview, zone: [oldPv * 0.75, oldPv * 0.85], fx: research.hkdCny};
  }
  asset.model = {...common, shares, dividend, coreLabel, scenarios, stress, cashReference, report, evidenceUrl: source};
  asset.snapshot = {...snapshot, source: quoteSource};
  asset.source = source;
  asset.sources = [['公司正式三季报', source], ['11月19日收盘报价', quoteSource], ...(asset.tencentReview ? asset.sources.slice(1) : [])];
  asset.reportPeriod = '2026-09-30';
  asset.fact = fact + ' ' + cash;
  asset.verification = published + '正式财报；经营事实与退出假设分列';
  asset.modelReviewedAt = date;
  asset.modelReviewDueAt = due;
  asset.executionHold = true;
  asset.executionHoldReason = hold;
  asset.gate = 'pending';
  asset.conditionStatus = 'pending';
  asset.valuationStatus = 'sensitivity';
  asset.catalyst = next;
  asset.risk = risk;
  delete asset.nextDisclosure;

  asset.fullReview = {date, reportPeriod: asset.reportPeriod, kind: '统一分部估值 · 现金条件待核', facts: fact, cash, judgment: bridge, priceDecision, limitation: gate, source, report};
  asset.quarterReview = {date, depth: 'detailed', period: asset.reportPeriod, status: '正式Q3与分部估值已复核', fields: {'财报事实':fact, '现金回报':cash, '模型修改':priceDecision, '执行条件':gate}, sources: asset.sources, report};
  asset.analysis = {...asset.analysis, source, fact, quality: cash, bridge: [bridge], basis: priceDecision, verdict: '价格参照已更新；' + hold, confirm: gate, fail: risk, reflexivity: risk};
  asset.audit = {...asset.audit, date, stage: '18个月分部估值 · 现金待核', done: '正式财报、分部估值、含息情景回报和压力测试', missing: gate, next, conclusion: priceDecision};
  if (asset.coreEvidence) asset.coreEvidence = {...asset.coreEvidence, date, status:'18个月统一分部估值', priceStatus:'回报门槛试算，暂不启用', pricing:priceDecision};
  if (asset.rankReview) asset.rankReview = {...asset.rankReview, evidenceDate:date, anchor:'2026-09-30正式业绩及现金流', pricing:priceDecision};
}
research.asOf = date;
research.coreValidation.correction = research.coreValidation.correction.replace(/腾讯正式Q3.*?阿里待11月19日/, '腾讯与阿里Q3已核验，18个月分部估值已统一；中通仍为11月11日复核时的披露安排');
}
