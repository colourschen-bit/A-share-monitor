window.RESEARCH = {
  "version": "3.0-review",
  "asOf": "2026-10-15",
  "window": [
    "2027-01-15",
    "2027-04-15"
  ],
  "hkdCny": 0.85688,
  "fxDate": "2026-10-14",
  "quoteSource": "腾讯行情；盘中报价可能延迟；每项显示自身时间戳",
  "disclaimer": "19项为短期情景草案；4家公司和10只ETF暂停绝对价格，尚未完成最终重估。主观权重不等于胜率；压力损失不等于最大回撤或VaR。公开研究版无个人持仓数据。",
  "macro": [
    {
      "title": "美元折现率",
      "fact": "美联储9月16日加息25bp至3.75%–4%。",
      "inference": "研究判断：长久期估值不预设流动性顺风；港股另检验资本开支与汇率。",
      "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm"
    },
    {
      "title": "成本与需求分化",
      "fact": "9月PPI同比+5.0%，核心CPI同比+1.0%。",
      "inference": "研究判断：区分资源涨价与制造/消费的成本传导，不等同全面需求复苏。",
      "url": "https://www.stats.gov.cn/sj/zxfbhjd/202610/t20261014_1965475.html"
    },
    {
      "title": "美元与外汇",
      "fact": "SAFE：9月外储34003亿美元，环比-1.11%；公告指出美元走强、全球资产下跌影响折算。",
      "inference": "研究判断：外储下降不能直接当作资本外逃指标。",
      "url": "https://www.safe.gov.cn/safe/2026/1006/27959.html"
    },
    {
      "title": "资金情绪的证据边界",
      "fact": "10月14日南向成交净卖出1.35亿港元；单日不足判断趋势。VIX/CNN最新同日值未可靠取得。",
      "inference": "缺失值不填中性；情绪不直接改写EPS。继续观察多日资金、广度与量价。",
      "url": "https://finance.eastmoney.com/a/202610143895806623.html"
    }
  ],
  "assets": [
    {
      "code": "000792",
      "name": "盐湖股份",
      "market": "SZ",
      "tier": "core",
      "kind": "stock",
      "key": "sz000792",
      "historical": {
        "value": [
          20,
          30,
          38
        ],
        "weights": [
          0.25,
          0.5,
          0.25
        ],
        "mos": [
          0.72,
          0.82
        ],
        "model": "钾肥正常化盈利 + 锂业务情景NAV",
        "report": "2026H1：归母净利润预告60–63亿元；高增长不可直接年化",
        "thesis": "钾肥现金牛提供底部，锂价与4万吨项目决定弹性。超额利润必须视作周期变量。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          1.6,
          2.1,
          2.5
        ],
        "multiples": [
          10,
          12,
          14
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.35,
          0.5,
          0.15
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "不把前三季度高增年化；基准假设钾肥盈利稳定、锂盐放量但单位利润回落。PE 12倍是研究假设，不是市场共识。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026前三季预告：归母88.4–90.5亿元、EPS 1.6706–1.7103元；Q3 EPS 0.5046–0.5443元。含同控并表及追溯调整，未经审计。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12640142&stockid=000792",
      "catalyst": "三季报拆分钾肥/锂盐利润；Q4产销及价格；新增项目回款",
      "risk": "钾肥价格与锂盐价差同时收缩；并表利润不能转为现金",
      "gate": "pending",
      "snapshot": {
        "price": 22.73,
        "change": -1.17,
        "time": "20261015132718",
        "name": "盐湖股份"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "000807",
      "name": "云铝股份",
      "market": "SZ",
      "tier": "core",
      "kind": "stock",
      "key": "sz000807",
      "historical": {
        "value": [
          21,
          30,
          36
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.76,
          0.88
        ],
        "model": "中周期铝价 × 单吨利润 × 周期倍数",
        "report": "2026H1：归母净利预告75–78亿元，同比约+171%–182%",
        "thesis": "水电铝成本是结构优势，但峰值利润不能按成长股方法资本化。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          2.2,
          3.2,
          4.2
        ],
        "multiples": [
          7,
          8,
          9
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.2,
          0.1
        ],
        "why": "电解铝盈利使用价格—氧化铝—电力价差情景；基准EPS低于H1简单翻倍，削弱峰值利润资本化。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：归母76.84亿元、EPS 2.22元、OCF 83.77亿元；这是历史半年数据，不代表未来全年。",
      "source": "https://data.eastmoney.com/notices/detail/000807/AN202608270006755079.html",
      "catalyst": "三季报单位成本与吨铝利润；Q4库存和枯水季电价",
      "risk": "铝价下跌与电力成本上涨叠加；高利润刺激供给",
      "gate": "pending",
      "snapshot": {
        "price": 24.97,
        "change": -4.95,
        "time": "20261015132718",
        "name": "云铝股份"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "002028",
      "name": "思源电气",
      "market": "SZ",
      "tier": "core",
      "kind": "stock",
      "key": "sz002028",
      "historical": {
        "value": [
          105,
          150,
          185
        ],
        "weights": [
          0.2,
          0.55,
          0.25
        ],
        "mos": [
          0.8,
          0.9
        ],
        "model": "2027E正常化EPS × 质量调整PE",
        "report": "2026H1：营收+27.1%，归母+13.2%，经营现金流转正至2.27亿元",
        "thesis": "收入强、利润较慢，结构与成本需验证；现金流改善比收入增速更关键。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          3.9,
          4.5,
          5.1
        ],
        "multiples": [
          22,
          27,
          31
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.15,
          0.05
        ],
        "why": "未来12个月EPS与海外订单转收入、毛利率分别假设；不能将数年电网投资一次性计入6个月行情。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1正式报告：EPS 1.87元，OCF 2.33亿元；此前1.90元为业绩快报口径，不应混用。",
      "source": "https://static.cninfo.com.cn/finalpage/2026-08-15/1225473691.PDF",
      "catalyst": "三季报利润率、经营回款；海外订单交付和产品结构",
      "risk": "收入增长但利润/OCF不跟随；铜铝上涨不能向客户传导",
      "gate": "pending",
      "snapshot": {
        "price": 114.51,
        "change": -1.71,
        "time": "20261015132718",
        "name": "思源电气"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "002335",
      "name": "科华数据",
      "market": "SZ",
      "tier": "core",
      "kind": "stock",
      "key": "sz002335",
      "historical": {
        "value": [
          18,
          31,
          45
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.7,
          0.84
        ],
        "model": "IDC/UPS持续经营利润 + 储能折价",
        "report": "2026H1：改善含出售子公司80%股权收益，需剔除非经常性",
        "thesis": "不能用表观利润反转定价。先验证IDC现金流、海外UPS和储能回款。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          0.7,
          1.1,
          1.5
        ],
        "multiples": [
          20,
          25,
          30
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.4,
          0.45,
          0.15
        ],
        "margin": [
          0.25,
          0.15
        ],
        "why": "只对正常化经营利润给倍数；EPS假设剔除处置等非经常性，不把AI/储能收入当股东利润。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1扣非归母2.42亿元，同比增长8.37%；表观增长不能替代扣非经营改善。",
      "source": "https://static.cninfo.com.cn/finalpage/2026-08-28/1225522569.PDF",
      "catalyst": "三季报扣非利润、IDC回款与储能应收；计划披露日期需以预约变更为准",
      "risk": "处置收益掩盖主业疲弱；现金流继续恶化",
      "gate": "pending",
      "snapshot": {
        "price": 25.53,
        "change": -8.13,
        "time": "20261015132718",
        "name": "科华数据"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "002463",
      "name": "沪电股份",
      "market": "SZ",
      "tier": "core",
      "kind": "stock",
      "key": "sz002463",
      "historical": {
        "value": [
          80,
          125,
          165
        ],
        "weights": [
          0.2,
          0.55,
          0.25
        ],
        "mos": [
          0.8,
          0.9
        ],
        "model": "AI高阶PCB可持续EPS × 周期调整PE",
        "report": "2026H1：看AI板占比、毛利率、扩产回报和客户集中度",
        "thesis": "产业趋势强，但价格已交易较多增长；需盈利超预期而非股价上涨确认。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          3.6,
          4.6,
          5.4
        ],
        "multiples": [
          22,
          27,
          32
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "预告支持盈利上修，但下一年EPS、PE分别建模；基准PE 27倍不包含无限期AI高增长。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "10月15日前三季预告：归母54.5–57亿元，EPS 2.83–2.96元；泰国子公司前三季扭亏。未审计。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12641300&stockid=002463",
      "catalyst": "三季报现金流与高阶板毛利；Q4订单和泰国盈利持续性",
      "risk": "估值先于现金流；客户CapEx/贸易限制；扩产回报下降",
      "gate": "pending",
      "snapshot": {
        "price": 115.37,
        "change": 0.32,
        "time": "20261015132718",
        "name": "沪电股份"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "300124",
      "name": "汇川技术",
      "market": "SZ",
      "tier": "core",
      "kind": "stock",
      "key": "sz300124",
      "historical": {
        "value": [
          38,
          58,
          75
        ],
        "weights": [
          0.2,
          0.55,
          0.25
        ],
        "mos": [
          0.77,
          0.87
        ],
        "model": "工业自动化正常化EPS × 质量PE + 车业务折价",
        "report": "2026H1：看通用自动化复苏、应收与车业务盈利拐点",
        "thesis": "制造业复苏给胜率，车业务从规模到利润的转换给赔率。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          2,
          2.4,
          2.8
        ],
        "multiples": [
          22,
          26,
          30
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "以通用自动化与车业务盈利兑现为基础；本轮不额外加大额机器人期权，避免重复支付成长溢价。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS 1.04元，扣非归母27.56亿元、同比+3.15%；机器人远期市场不等于当期收益。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12566577&stockid=300124",
      "catalyst": "通用自动化订单、车业务利润率、三季报现金转化",
      "risk": "车企价格压力传导；应收和存货吞噬利润",
      "gate": "pending",
      "snapshot": {
        "price": 48.94,
        "change": -0.79,
        "time": "20261015132715",
        "name": "汇川技术"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "00700",
      "name": "腾讯控股",
      "market": "HK",
      "tier": "core",
      "kind": "stock",
      "key": "hk00700",
      "historical": {
        "value": [
          300,
          410,
          520
        ],
        "weights": [
          0.2,
          0.55,
          0.25
        ],
        "mos": [
          0.8,
          0.88
        ],
        "model": "核心业务FCF收益率 + AI期权（人民币）",
        "report": "2026Q2：收入2048亿元+11%；非IFRS归母684亿元+9%；CapEx+176%",
        "thesis": "既有业务现金流仍强，但AI投入开始吞噬FCF；CapEx不能自动视作价值。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "fcf",
        "inputs": [
          12,
          18,
          24
        ],
        "multiples": null,
        "yields": [
          0.065,
          0.055,
          0.05
        ],
        "extra": [
          35,
          45,
          55
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.2,
          0.1
        ],
        "why": "假设每股FCFE已扣维持/增长CapEx与股权激励稀释；可变现投资折价单列。基准18÷5.5%＋45，禁止将算力预付款全部无条件加回。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026Q2已披露；10月14日公司公告新增票据融资。本轮FCF为未来正常化假设，并非本季实现金额。",
      "source": "https://www.tencent.com/Investors/",
      "catalyst": "Q3游戏/广告盈利、算力付款与FCF、回购净抵销稀释",
      "risk": "AI资本开支持续超过经营增量；融资及投资变现折价",
      "gate": "pending",
      "snapshot": {
        "price": 420.4,
        "change": -0.71,
        "time": "2026/10/15 13:12:19",
        "name": "腾讯控股"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "09988",
      "name": "阿里巴巴-W",
      "market": "HK",
      "tier": "core",
      "kind": "stock",
      "key": "hk09988",
      "historical": {
        "value": [
          70,
          115,
          160
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.72,
          0.85
        ],
        "model": "电商现金流 + 云SOTP − AI投入风险",
        "report": "2026年6月季：收入2689.5亿元+9%；利润-75%；AI云收入约+45%",
        "thesis": "云与AI需求真实，但利润和FCF承压；关键是投入何时转为可定价收入。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://www.alibabagroup.com/zh-HK/document-2026456290057781248",
      "catalyst": "云增长、即时零售亏损、CapEx/融资稀释及FCF回正；需将电商、云和其他资产重新拆分",
      "risk": "FCF仍为负且稀释未纳入；旧SOTP每股价值不再有效",
      "gate": "pending",
      "snapshot": {
        "price": 106.3,
        "change": -3.8,
        "time": "2026/10/15 13:12:19",
        "name": "阿里巴巴-W"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "600036",
      "name": "招商银行",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh600036",
      "historical": {
        "value": [
          32,
          47,
          58
        ],
        "weights": [
          0.2,
          0.6,
          0.2
        ],
        "mos": [
          0.78,
          0.88
        ],
        "model": "可持续ROE × PB-ROE + 分红",
        "report": "2026H1：看净息差、零售不良、手续费与资本充足率",
        "thesis": "只有资产质量和ROE可持续，低PB才会成为估值修复。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "pb",
        "inputs": [
          54,
          57,
          60
        ],
        "multiples": [
          0.6,
          0.78,
          0.95
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.15,
          0.05
        ],
        "why": "BPS×PB敏感性；PB由可持续ROE、信用成本和资本回报决定，非利润增速线性外推。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：归母764.45亿元、同比+2.02%，年化ROAE 13.42%，不良率0.94%；未来BPS为假设。",
      "source": "https://paper.cnstock.com/html/2026-08/29/content_2262443.htm",
      "catalyst": "Q3净息差、零售不良和拨备；资本与分红约束",
      "risk": "零售信用成本抬升；ROE下降快于估值折价",
      "gate": "pending",
      "snapshot": {
        "price": 42.27,
        "change": -0.94,
        "time": "20261015132718",
        "name": "招商银行"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "600406",
      "name": "国电南瑞",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh600406",
      "historical": {
        "value": [
          18,
          25,
          31
        ],
        "weights": [
          0.2,
          0.6,
          0.2
        ],
        "mos": [
          0.8,
          0.9
        ],
        "model": "电网自动化EPS × 防御成长PE",
        "report": "2026H1：看电网投资、合同负债、现金流与毛利率",
        "thesis": "确定性来自数字化与调度壁垒；赔率取决于订单转收入而非政策口号。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          0.85,
          1,
          1.12
        ],
        "multiples": [
          20,
          24,
          28
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.15,
          0.05
        ],
        "why": "交付季节性不简单H1翻倍；基准EPS1元需Q4交付、毛利率与回款兑现。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS 0.38元；归母30.73亿元+4.08%、收入+14.54%，利润转化慢于收入。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12543058&stockid=600406",
      "catalyst": "国网招标落地、Q4交付确认与年末回款",
      "risk": "合同资产和应收增加；招标延后；利润率承压",
      "gate": "pending",
      "snapshot": {
        "price": 22.23,
        "change": 0.23,
        "time": "20261015132719",
        "name": "国电南瑞"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "600583",
      "name": "海油工程",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh600583",
      "historical": {
        "value": [
          4.5,
          6.8,
          9
        ],
        "weights": [
          0.2,
          0.55,
          0.25
        ],
        "mos": [
          0.75,
          0.86
        ],
        "model": "在手订单利润释放 + 中周期油服EV/EBIT",
        "report": "2026H1：看海外订单、毛利率、回款和项目拨备",
        "thesis": "订单规模不是利润，海外项目执行质量才是核心。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          0.42,
          0.5,
          0.6
        ],
        "multiples": [
          10,
          12,
          14
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "施工订单不能直接乘利润率；以可持续EPS定价，不将中国海油高油价利润直接映射工程承包利润。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS 0.25元、扣非EPS 0.20元；期末在手订单约733亿元。",
      "source": "https://static.cninfo.com.cn/finalpage/2026-08-18/1225476521.PDF",
      "catalyst": "Q4项目交付、海外毛利率与收款",
      "risk": "工程执行损失；油气CapEx转弱；低利润大订单",
      "gate": "pending",
      "snapshot": {
        "price": 6.28,
        "change": -6.55,
        "time": "20261015132718",
        "name": "海油工程"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "600875",
      "name": "东方电气",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh600875",
      "historical": {
        "value": [
          18,
          28,
          38
        ],
        "weights": [
          0.22,
          0.53,
          0.25
        ],
        "mos": [
          0.76,
          0.88
        ],
        "model": "能源装备分部利润 × 混合估值",
        "report": "2026H1报告8月26日披露：拆分火电、核电、燃机与风电利润",
        "thesis": "订单受益能源安全，但不同业务质量差异大；总订单不能直接映射利润。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          1,
          1.35,
          1.6
        ],
        "multiples": [
          15,
          18,
          22
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "核电/燃机订单有较长兑现周期；基准EPS1.35只反映未来12个月可见利润，不为2030空间一次性付费。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：扣非EPS 0.68元；归母增速包含投资及公允价值收益，须拆分主业。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12537132&stockid=600875",
      "catalyst": "核电/火电装备交付、风电减亏、应收回款",
      "risk": "风电价格战；合同资产占用；大订单未增厚利润",
      "gate": "pending",
      "snapshot": {
        "price": 21.45,
        "change": -4.41,
        "time": "20261015132719",
        "name": "东方电气"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "601012",
      "name": "隆基绿能",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh601012",
      "historical": {
        "value": [
          7,
          14,
          24
        ],
        "weights": [
          0.35,
          0.45,
          0.2
        ],
        "mos": [
          0.65,
          0.85
        ],
        "model": "产能重置价值 + BC/储能成功概率",
        "report": "2026H1：仍处行业出清期；看现金消耗、减值、BC盈利和储能贡献",
        "thesis": "这是反转期权而非低PE；只有供给退出和技术溢价兑现，产能才有价值。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://static.cninfo.com.cn/finalpage/2026-08-31/1225535067.PDF",
      "catalyst": "Q3现金消耗与减值、BC单位毛利、组件价差及供给退出",
      "risk": "3–6个月反转没有足够证据；不把产能重置成本等同清算回收价值",
      "gate": "pending",
      "snapshot": {
        "price": 10.54,
        "change": -3.12,
        "time": "20261015132719",
        "name": "隆基绿能"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "601318",
      "name": "中国平安",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh601318",
      "historical": {
        "value": [
          43,
          63,
          78
        ],
        "weights": [
          0.2,
          0.6,
          0.2
        ],
        "mos": [
          0.78,
          0.88
        ],
        "model": "营运利润 + EV增长 + 股东回报",
        "report": "2026H1：营运利润842亿元+8.3%；归母净利926亿元+36.1%",
        "thesis": "归母高增含波动因素，营运利润和NBV质量更值得资本化。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "opat",
        "inputs": [
          8,
          9.2,
          10.2
        ],
        "multiples": [
          5,
          6,
          7
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.15,
          0.05
        ],
        "why": "每股营运利润×倍数；投资波动利润不全部资本化。基准全年/未来12月营运EPS9.2低于H1机械翻倍。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：每股营运收益4.82元、归母营运利润841.96亿元+8.3%；净利润高增不等于营运增速。",
      "source": "https://www.pingan.cn/zh/common/cn_news/1787276812004.shtml",
      "catalyst": "Q3新业务价值与营运利润结构；投资收益持续性",
      "risk": "利率/权益市场波动；资产减值；派息受资本约束",
      "gate": "pending",
      "snapshot": {
        "price": 51.01,
        "change": -0.43,
        "time": "20261015132717",
        "name": "中国平安"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "603345",
      "name": "安井食品",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh603345",
      "historical": {
        "value": [
          58,
          86,
          110
        ],
        "weights": [
          0.2,
          0.6,
          0.2
        ],
        "mos": [
          0.77,
          0.88
        ],
        "model": "正常化EPS × 消费质量PE + 分红",
        "report": "2026H1：收入92.66亿元+21.85%；归母8.22亿元+21.62%",
        "thesis": "需拆分并购/补库与内生需求，避免把阶段高增线性化。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          4.1,
          4.9,
          5.6
        ],
        "multiples": [
          13,
          16,
          19
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "基准EPS4.9与PE16分别假设；H股上市后的股本摊薄、渠道库存及内生需求需核验。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS 2.48元、扣非EPS2.27元；半年EPS不可直接视为未来12个月的一半。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12529199&stockid=603345",
      "catalyst": "Q3动销、冬季旺季订单、吨利与库存",
      "risk": "补库透支终端；促销换量；并购/新增股本稀释",
      "gate": "pending",
      "snapshot": {
        "price": 81.26,
        "change": -0.89,
        "time": "20261015132717",
        "name": "安井食品"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "603993",
      "name": "洛阳钼业",
      "market": "SH",
      "tier": "core",
      "kind": "stock",
      "key": "sh603993",
      "historical": {
        "value": [
          14,
          23,
          31
        ],
        "weights": [
          0.28,
          0.52,
          0.2
        ],
        "mos": [
          0.75,
          0.88
        ],
        "model": "铜钴分部NAV + 中周期商品价格",
        "report": "2026H1：看铜钴产量、实现价、单位成本、刚果税费与FCF",
        "thesis": "成本与放量是优势，但必须用中周期价格而非现货峰值。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          1,
          1.35,
          1.65
        ],
        "multiples": [
          10,
          13,
          15
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.2,
          0.1
        ],
        "why": "未来铜钴价差与产量单独假设；基准EPS低于半年翻倍，避免高商品价与高PE双重加码。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS0.76元，归母161.52亿元、同比+86.27%；OCF163.34亿元。",
      "source": "https://static.cninfo.com.cn/finalpage/2026-08-20/1225482739.PDF",
      "catalyst": "季度产销、铜钴实现价和税费、矿山FCF",
      "risk": "商品回落；刚果税费/政策；扩产和并购消耗现金",
      "gate": "pending",
      "snapshot": {
        "price": 15.61,
        "change": -6.19,
        "time": "20261015132718",
        "name": "洛阳钼业"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "159530",
      "name": "机器人ETF易方达",
      "market": "SZ",
      "tier": "core",
      "kind": "ETF",
      "key": "sz159530",
      "historical": {
        "value": [
          0.9,
          1.3,
          1.65
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.73,
          0.86
        ],
        "model": "成分股远期盈利兑现率 + 拥挤度折价",
        "report": "指数：看产业订单、盈利覆盖率、换手与估值集中度",
        "thesis": "空间大不等于回报；订单扩散到零部件盈利才是确认。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_159530.html",
      "catalyst": "权重股订单→盈利修正、成交拥挤、申赎与折溢价",
      "risk": "与汇川/双环存在主题因子重叠；需要最新成分权重、盈利覆盖率及净值",
      "gate": "pending",
      "snapshot": {
        "price": 1.104,
        "change": -4,
        "time": "20261015132718",
        "name": "机器人ETF易方达"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "159928",
      "name": "消费ETF汇添富",
      "market": "SZ",
      "tier": "core",
      "kind": "ETF",
      "key": "sz159928",
      "historical": {
        "value": [
          0.55,
          0.78,
          0.98
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "mos": [
          0.78,
          0.88
        ],
        "model": "成分股ROE稳定性 + FCF收益率 + 估值分位",
        "report": "指数：看必选消费量价、库存、渠道现金流与龙头ROE",
        "thesis": "低估只有在ROE不继续下台阶时才有意义。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_159928.html",
      "catalyst": "消费龙头动销、库存与盈利修正，跟踪份额/净值",
      "risk": "不是安井/东鹏的等价替代；指数行业权重和ROE需要穿透",
      "gate": "pending",
      "snapshot": {
        "price": 0.651,
        "change": -1.66,
        "time": "20261015132715",
        "name": "消费ETF汇添富"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "513260",
      "name": "恒生科技ETF汇添富",
      "market": "SH",
      "tier": "core",
      "kind": "ETF",
      "key": "sh513260",
      "historical": {
        "value": [
          0.78,
          1.18,
          1.52
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "mos": [
          0.74,
          0.86
        ],
        "model": "指数盈利修正 + FCF收益率 + 港股四因子",
        "report": "指数：美元流动性/风险偏好/南向资金/平台基本面",
        "thesis": "盈利与回购改善被AI CapEx部分抵消；南向资金会增强双向波动。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_513260.html",
      "catalyst": "平台盈利、AI CapEx、美元利率、南向资金与ETF份额",
      "risk": "与腾讯/阿里重叠；先做成分净值估值，不用历史ETF价格设买点",
      "gate": "pending",
      "snapshot": {
        "price": 0.977,
        "change": -3.36,
        "time": "20261015132717",
        "name": "恒生科技ETF汇添富"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "513120",
      "name": "港股创新药ETF广发",
      "market": "SH",
      "tier": "core",
      "kind": "ETF",
      "key": "sh513120",
      "historical": {
        "value": [
          0.88,
          1.32,
          1.7
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.72,
          0.85
        ],
        "model": "管线风险调整NPV + BD现金兑现 + 融资折价",
        "report": "指数：看BD首付款、临床里程碑、现金跑道与融资",
        "thesis": "BD热度不等同利润；首付款、里程碑与商业化概率必须分开。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_513120.html",
      "catalyst": "BD到账、关键临床、商业化、权重股融资和现金跑道",
      "risk": "BD总额不等于利润；需风险调整管线价值和最新权重",
      "gate": "pending",
      "snapshot": {
        "price": 1.222,
        "change": -1.13,
        "time": "20261015132719",
        "name": "港股创新药ETF广发"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "513090",
      "name": "香港证券ETF易方达",
      "market": "SH",
      "tier": "secondary",
      "kind": "ETF",
      "key": "sh513090",
      "historical": {
        "value": [
          1.35,
          1.9,
          2.45
        ],
        "weights": [
          0.28,
          0.52,
          0.2
        ],
        "mos": [
          0.78,
          0.9
        ],
        "model": "成份券商正常化ROE × PB + 港交所IPO期权",
        "report": "2026Q2：前十大权重合计87.64%；中信证券、港交所、国泰海通和中金公司高度集中",
        "thesis": "它不是低估值金融替代品，而是成交额、IPO与风险偏好的高弹性组合；基金份额下降会放大行情退潮。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://www.efunds.com.cn/Mobile/fund/513090.shtml",
      "catalyst": "港股成交额、IPO收入与成分券商ROE；申赎折溢价",
      "risk": "资金情绪敏感；估值要区分券商PB与港交所PE",
      "gate": "pending",
      "snapshot": {
        "price": 1.704,
        "change": -1.5,
        "time": "20261015132717",
        "name": "香港证券ETF易方达"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "516120",
      "name": "化工ETF富国",
      "market": "SH",
      "tier": "secondary",
      "kind": "ETF",
      "key": "sh516120",
      "historical": {
        "value": [
          0.68,
          0.95,
          1.18
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.75,
          0.88
        ],
        "model": "细分产品中周期价差 × 产能出清率 × 盈利覆盖",
        "report": "2026Q2：基金规模50.67亿元；前十大权重约43.96%，前五大为万华、盐湖、藏格、天赐、巨化",
        "thesis": "化工并非单一周期：钾锂、氟化工与聚氨酯驱动不同。只有落后产能真实退出，涨价才可能转为可持续利润。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_516120.html",
      "catalyst": "各产品价差、库存、CapEx退出及成分权重",
      "risk": "涨原料不等于化工利润增长；与盐湖存在周期暴露重叠",
      "gate": "pending",
      "snapshot": {
        "price": 0.747,
        "change": -3.49,
        "time": "20261015132717",
        "name": "化工ETF富国"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "520550",
      "name": "港股红利低波ETF招商",
      "market": "SH",
      "tier": "secondary",
      "kind": "ETF",
      "key": "sh520550",
      "historical": {
        "value": [
          0.98,
          1.17,
          1.32
        ],
        "weights": [
          0.2,
          0.6,
          0.2
        ],
        "mos": [
          0.84,
          0.94
        ],
        "model": "可持续每份分红 ÷ 要求收益率 + 汇率调整",
        "report": "2026Q2回报-13.61%；标的指数由50只港股通高息低波股票构成，2026年9月指示股息率约5.14%",
        "thesis": "高股息只有被自由现金流覆盖才是回报；月度分红会机械降低价格，应以含息总回报而非裸价判断。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://www.cmfchina.com/web/fundDetail/520550/index.html",
      "catalyst": "税后可分配股息、FCF覆盖、利差、份额与含息净值",
      "risk": "分红除息会机械降价；原绝对价区间未做分红校正",
      "gate": "pending",
      "snapshot": {
        "price": 1.078,
        "change": -1.82,
        "time": "20261015132718",
        "name": "港股红利低波ETF招商"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "562550",
      "name": "绿电ETF华夏",
      "market": "SH",
      "tier": "secondary",
      "kind": "ETF",
      "key": "sh562550",
      "historical": {
        "value": [
          0.88,
          1.18,
          1.42
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "mos": [
          0.8,
          0.9
        ],
        "model": "成份股FCF收益率 + 电价/利用小时情景 + 负债折价",
        "report": "2026-09-11单位净值1.1480，近一年+1.69%；研究重点转向电价、消纳、利用小时与资本开支纪律",
        "thesis": "AI用电叙事提高估值，但发电量增长不必然增加股东现金；高负债和持续CapEx会截留经营改善。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_562550.html",
      "catalyst": "上网电价、利用小时、消纳和成分股FCF/负债",
      "risk": "不能把AI用电增长直接映射发电企业ROE；需要电价机制穿透",
      "gate": "pending",
      "snapshot": {
        "price": 1.131,
        "change": -2.16,
        "time": "20261015132717",
        "name": "绿电ETF华夏"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "588000",
      "name": "科创50ETF华夏",
      "market": "SH",
      "tier": "secondary",
      "kind": "ETF",
      "key": "sh588000",
      "historical": {
        "value": [
          1.2,
          1.65,
          2.1
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.72,
          0.84
        ],
        "model": "权重股远期盈利兑现率 × 集中度/流动性折价",
        "report": "2026-09-11单位净值1.6406、近一年+17.63%；半导体与高估值龙头集中度较高",
        "thesis": "指数上涨会吸引ETF申购并反向推高权重股；若盈利上修没有扩散，高集中度会把正反馈快速变成回撤。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_588000.html",
      "catalyst": "权重股盈利修正广度、解禁融资、估值集中度",
      "risk": "不是低风险宽基；盈利兑现差异大，先做成分估值",
      "gate": "pending",
      "snapshot": {
        "price": 1.404,
        "change": -3.7,
        "time": "20261015132717",
        "name": "科创50ETF华夏"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "589720",
      "name": "科创创新药ETF国泰",
      "market": "SH",
      "tier": "secondary",
      "kind": "ETF",
      "key": "sh589720",
      "historical": {
        "value": [
          0.6,
          0.9,
          1.25
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.7,
          0.84
        ],
        "model": "管线风险调整NPV + 商业化现金流 − 融资稀释",
        "report": "2026Q2前十大权重63.73%，集中于艾力斯、百济神州、荣昌生物等；截至9月10日规模较2025年末显著扩张",
        "thesis": "与港股创新药并非完全重复：本项更偏A股科创板、早期管线与估值弹性，但资金快速涌入会强化拥挤风险。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://fundf10.eastmoney.com/ccmx_589720.html",
      "catalyst": "临床/BD到账与融资；与港股药企共同管线暴露",
      "risk": "上市市场不同不等于风险分散；需按经济权益去重",
      "gate": "pending",
      "snapshot": {
        "price": 0.781,
        "change": -1.51,
        "time": "20261015132718",
        "name": "科创创新药ETF国泰"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "601058",
      "name": "赛轮轮胎",
      "market": "SH",
      "tier": "secondary",
      "kind": "stock",
      "key": "sh601058",
      "historical": {
        "value": [
          10,
          17,
          23
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "mos": [
          0.78,
          0.88
        ],
        "model": "正常化EPS × 全球轮胎PE − 关税/扩产风险折价",
        "report": "2026H1：收入200.27亿元+13.88%，归母21.60亿元+17.97%，毛利率26.99%；非公路胎销量约+45%",
        "thesis": "海外制造与高端化正在兑现，但墨西哥等新厂爬坡及关税会先影响现金流；不能把当前高毛利永久化。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          1.05,
          1.3,
          1.5
        ],
        "multiples": [
          9,
          11,
          13
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "正常化吨利、海外爬坡和关税情景；不将当前毛利率永久化，现金回报弱于利润需额外核验。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS0.66元，扣非归母20.58亿元；OCF10.33亿元，低于归母21.60亿元。",
      "source": "https://data.eastmoney.com/notices/detail/601058/AN202608301828733570.html",
      "catalyst": "海外新厂利用率、原料/海运成本与价格传导",
      "risk": "关税升级；原料上涨吞噬吨利；扩产占用现金",
      "gate": "pending",
      "snapshot": {
        "price": 12.23,
        "change": -1.37,
        "time": "20261015132718",
        "name": "赛轮轮胎"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "300207",
      "name": "欣旺达",
      "market": "SZ",
      "tier": "secondary",
      "kind": "stock",
      "key": "sz300207",
      "historical": {
        "value": [
          10,
          18,
          28
        ],
        "weights": [
          0.35,
          0.45,
          0.2
        ],
        "mos": [
          0.65,
          0.8
        ],
        "model": "消费电池现金利润 + 动力/储能SOTP − 净负债与CapEx",
        "report": "2026H1：收入381.79亿元+41.48%，归母6.03亿元-29.59%，扣非0.97亿元-83.32%，OCF为-19.51亿元",
        "thesis": "动力电池收入与出货高增尚未转为股东回报；收入越快、应收与融资越大，反身性可能先恶化后改善。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://data.eastmoney.com/notices/detail/300207/AN202608260006751643.html",
      "catalyst": "扣非利润、消费电池毛利、动力电池回款和资本开支",
      "risk": "扣非利润低且现金净流出；重算净负债、少数股东权益前暂停旧SOTP",
      "gate": "pending",
      "snapshot": {
        "price": 18.05,
        "change": -4.19,
        "time": "20261015132715",
        "name": "欣旺达"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "600938",
      "name": "中国海油",
      "market": "SH",
      "tier": "secondary",
      "kind": "stock",
      "key": "sh600938",
      "historical": {
        "value": [
          25,
          36,
          45
        ],
        "weights": [
          0.25,
          0.5,
          0.25
        ],
        "mos": [
          0.78,
          0.9
        ],
        "model": "中周期油价FCF + 储量/产量增长 + 股东回报",
        "report": "2026H1：净产量398.7百万桶油当量，归母858亿元+23.4%，经营现金流1416亿元、FCF 883亿元；中期股息0.94港元",
        "thesis": "上半年高油价与产量共同推升利润，但现货油价越高，需求破坏、成本与政策压力也越强；只资本化中周期现金流。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          2.3,
          3.1,
          3.8
        ],
        "multiples": [
          8,
          9,
          10
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "正常化EPS反映不同油价/成本组合；低PE不自动便宜，油价回落时EPS与PE可能同时压缩。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS1.81元，归母858.18亿元；中期股息0.94港元。情景不假设油价永远停在高位。",
      "source": "https://www.cnoocltd.com/tzzgx/yjhtjcl/yj/material/2026Mid-yearReviewCN.pdf",
      "catalyst": "Q3产量、桶油成本、实现价；分红与CapEx",
      "risk": "油价需求破坏；成本上升；产量/储量增长不达预期",
      "gate": "pending",
      "snapshot": {
        "price": 34.58,
        "change": -3.27,
        "time": "20261015132717",
        "name": "中国海油"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "002318",
      "name": "久立特材",
      "market": "SZ",
      "tier": "secondary",
      "kind": "stock",
      "key": "sz002318",
      "historical": {
        "value": [
          12,
          19,
          26
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.72,
          0.84
        ],
        "model": "高端特材正常化利润 × 质量PE + 投资收益折价",
        "report": "2026H1：收入38.84亿元-36.38%，归母3.93亿元-52.55%，扣非1.57亿元-80.02%，OCF 0.65亿元；Q2主业转亏",
        "thesis": "高基数与项目交付延后解释部分下滑，但扣非利润和现金流同步恶化说明不能简单等下一批订单；先验证高端品盈利质量。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": null,
      "fact": "本轮未完成短期绝对价格模型；历史财报与旧估值仅作归档，不构成当前结论。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12529143&stockid=002318",
      "catalyst": "高端订单交付、Q3主业利润、参股投资价值与现金回款",
      "risk": "主业与投资收益分离尚未完成；旧19元基准无法追溯",
      "gate": "pending",
      "snapshot": {
        "price": 16.97,
        "change": -2.75,
        "time": "20261015132718",
        "name": "久立特材"
      },
      "verification": "补齐穿透数据后再报价"
    },
    {
      "code": "688313",
      "name": "仕佳光子",
      "market": "SH",
      "tier": "secondary",
      "kind": "stock",
      "key": "sh688313",
      "historical": {
        "value": [
          65,
          105,
          155
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "mos": [
          0.68,
          0.8
        ],
        "model": "光芯片正常化EPS × 兑现PE − 现金流/拥挤折价",
        "report": "2026H1：收入14.95亿元+50.66%，归母3.15亿元+45.30%，光芯片及器件收入+77.64%；OCF为-3.80亿元",
        "thesis": "AI数通需求已进入利润，但股价会反向推动扩产和竞争；利润增长若不能转为回款，高估值正反馈可能快速逆转。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          1,
          1.5,
          2
        ],
        "multiples": [
          35,
          45,
          55
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.4,
          0.45,
          0.15
        ],
        "margin": [
          0.25,
          0.15
        ],
        "why": "EPS须按完全摊薄口径；短期PE压缩与光芯片增长共同模拟；本轮不额外加CPO远期市值。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1归母3.15亿元+45.30%，OCF -3.80亿元；公司公告涉及定向发行，需复核稀释。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12472952&stockid=688313",
      "catalyst": "三季报光芯片毛利/现金流、客户验证、融资条款",
      "risk": "现金未兑现；稀释；出口限制；高估值下仅符合预期",
      "gate": "pending",
      "snapshot": {
        "price": 115.6,
        "change": -5.63,
        "time": "20261015132719",
        "name": "仕佳光子"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "605499",
      "name": "东鹏饮料",
      "market": "SH",
      "tier": "secondary",
      "kind": "stock",
      "key": "sh605499",
      "historical": {
        "value": [
          88,
          125,
          155
        ],
        "weights": [
          0.2,
          0.6,
          0.2
        ],
        "mos": [
          0.8,
          0.9
        ],
        "model": "正常化FCF × 消费品牌倍数 + 第二曲线概率",
        "report": "2026H1：收入124.43亿元+15.89%，归母28.67亿元+20.72%，OCF 24.93亿元；公司提出2026–2028现金回报计划",
        "thesis": "主品牌仍强且现金兑现好，但第二曲线竞争加剧；渠道扩张只有在库存、动销和回款一致时才创造价值。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          6.6,
          8,
          9
        ],
        "multiples": [
          15,
          18,
          21
        ],
        "yields": null,
        "extra": [
          0,
          0,
          0
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "margin": [
          0.18,
          0.08
        ],
        "why": "EPS按当前资本结构估计，基准8元；PE18不假设第二曲线持续高增长，渠道动销优先于发货。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：调整后EPS3.9949元；每10股转增3股导致历史EPS重述，不能混用转增前价格。",
      "source": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12470595&stockid=605499",
      "catalyst": "Q3/Q4终端动销、新品毛利与回购/现金回报",
      "risk": "促销与竞争加剧；渠道压货；增长降档触发倍数收缩",
      "gate": "pending",
      "snapshot": {
        "price": 113.42,
        "change": 1.31,
        "time": "20261015132717",
        "name": "东鹏饮料"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    },
    {
      "code": "002472",
      "name": "双环传动",
      "market": "SZ",
      "tier": "secondary",
      "kind": "stock",
      "key": "sz002472",
      "historical": {
        "value": [
          24,
          36,
          52
        ],
        "weights": [
          0.25,
          0.55,
          0.2
        ],
        "mos": [
          0.72,
          0.85
        ],
        "model": "汽车齿轮正常化利润 + 机器人减速器风险调整期权",
        "report": "2026H1：收入45.59亿元+7.80%，归母5.87亿元+1.65%，OCF 11.12亿元；出口+34.85%，减速器及其他收入+26.18%",
        "thesis": "汽车齿轮提供盈利底盘，机器人提供估值期权；不能把样机、订单意向直接折算成大规模利润。",
        "asOf": "2026-09（旧版未核验）"
      },
      "model": {
        "type": "eps",
        "inputs": [
          1.25,
          1.5,
          1.7
        ],
        "multiples": [
          16,
          20,
          23
        ],
        "yields": null,
        "extra": [
          0,
          2,
          5
        ],
        "weights": [
          0.3,
          0.5,
          0.2
        ],
        "margin": [
          0.2,
          0.1
        ],
        "why": "主业EPS×PE，再加每股机器人期权0/2/5元（主观折价）；不将减速器远期市场规模当订单。",
        "currency": "CNY",
        "status": "draft"
      },
      "fact": "2026H1：EPS0.69元，归母5.87亿元+1.65%、扣非5.34亿元-3.76%；OCF11.12亿元。",
      "source": "https://data.eastmoney.com/notices/detail/002472/AN202608251828422157.html",
      "catalyst": "海外齿轮盈利、减速器量产收入和回款",
      "risk": "车企降价；减速器只有意向；海外产能低利用率",
      "gate": "pending",
      "snapshot": {
        "price": 32.88,
        "change": -4.5,
        "time": "20261015132718",
        "name": "双环传动"
      },
      "verification": "财报锚点已核对；未来参数为主观假设，非盈利预测共识"
    }
  ]
};

