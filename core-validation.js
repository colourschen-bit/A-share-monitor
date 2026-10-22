'use strict';
// 2026-10-23 adversarial review. Cash paths are explicit sensitivity assumptions,
// never reported guidance, statistical win rates or an independent full SOTP.
{
 const r=window.RESEARCH, by=c=>r.assets.find(x=>x.code===c);
 const previousZone=x=>{const m=x.model,b=m.type==='lookthrough'?m.cases[1]:m.inputs[1]*m.multiples[1]+m.extra[1],pv=b/Math.sqrt(1.12);return[pv*(1-m.margin[0]),pv*(1-m.margin[1])];};
 const old=new Map(r.assets.filter(x=>x.portfolio.included).map(x=>[x.code,{zone:previousZone(x),type:x.model.type,inputs:[...x.model.inputs],multiples:[...x.model.multiples]}]));
 // Financial-company PB is already a present equity value. Do not discount it twice.
 const cmb=by('600036');cmb.model.inputs=[42,45.4,48];cmb.model.discountYears=0;
 cmb.model.why='以实际普通股BPS45.40元为基准，PB=(持续ROE−g)/(股权成本−g)。基准(12%−3%)/(13%−3%)=.90；这是现值，不再按半年折现。';
 cmb.analysis.bridge=['压力BPS42元：对当前45.40元另作约7.5%信用/其他权益损失假设。','基准BPS45.40元直接用中报实际值，不把48元预测当事实。','修复BPS48元为留存利润和信用稳定假设，尚未兑现。'];
 cmb.analysis.basis=cmb.model.why;
 const picc=by('02328'),bps=303688000000/22242765303-.34;
 picc.model={type:'pb',inputs:[12.16,bps,14.16],multiples:[2/3,10/9,1.5],extra:[0,0,0],weights:[0,1,0],margin:[.20,.10],discountYears:0,currency:'CNY',status:'conditional',why:'归母净资产3036.88亿元÷222.42765303亿股=BPS13.6533元，再审慎预留已宣布中期股息0.34元，研究BPS13.3133元，不同时计入待收股息。基准持续ROE13%、g3%、股权成本12%，PB=1.111；压力/修复为ROE10%/15%、资本成本14%/11%等假设。已是现值，不另折半年。',evidenceUrl:picc.source,reference:'官方2026中报第39页归母权益；预留0.34元中期股息，未滚动Q3其他综合收益；ROE/g/资本成本为研究假设'};
 picc.fact+=' 本轮已读取官方中报：归母权益3036.88亿元、股份222.42765303亿股；据此BPS约13.6533元，不能用含少数股东的总权益3063.61亿元替代。综合/核心偿付能力237.2%/213.8%。';
 picc.analysis.bridge=['中报归母权益除实际总股本得到BPS13.6533元，先扣已宣布0.34元中期股息作审慎基数13.3133元；未把股息重复加回。','基准PB=(13%−3%)/(12%−3%)=1.111，对应正常化股本回报假设；不年化半年投资浮盈。','压力/修复BPS12.16/14.16、PB0.667/1.5，均非概率或监管保证；实际除息资格及Q3其他综合收益仍须滚动核验。'];
 picc.analysis.basis=picc.model.why;picc.analysis.limit='官方全文已取得；尚未逐险种重建赔付发展三角，权益与长债价格变化仍可侵蚀净资产。';
 picc.verification='已补官方全文、归母权益/股本、偿付能力与PB交叉核验；准备金和资本分配仍需跟踪。';
 picc.audit={date:'2026-10-23',stage:'归母净资产＋承保条件估值',done:'官方全文、归母权益、实际股本、偿付能力及PB公式。',missing:'逐险种赔付发展三角和资本分配敏感性。',next:picc.catalyst,conclusion:'经营与定价具有初步支持，仍不代表未来条件自动兑现。'};
 const dp=by('605499');dp.model.inputs=[6.2,7.3,8.5];
 dp.fact='2026H1归母28.6680亿元、扣非25.9760亿元、OCF24.9260亿元；报告EPS3.9949元、扣非EPS3.6197元。期末总股本7.34199310亿股；扣非利润÷期末股本约3.5380元，不能把加权EPS当完全稀释全年基数。资本性购建支出11.3516亿元。';
 dp.model.why='按期末7.34199310亿股与扣非利润重新约束EPS。基准全年7.30元对应扣非约53.60亿元，要求后半程约27.62亿元；未使用报告EPS3.9949直接翻倍。15/18/21倍仍为估值假设。';
 dp.analysis.bridge=['压力EPS6.20元：促销和产能投入压利润。','基准EPS7.30元×期末7.34199310亿股≈53.60亿元；扣除H1扣非25.976亿元，后半程需约27.62亿元。','修复EPS8.50元需要新品、全国化和利润现金共同改善；H股发行与转增分开核对。'];
 dp.analysis.basis=dp.model.why;
 dp.analysis.quality='H1 OCF24.926亿元减资本性购建11.352亿元约13.574亿元，低于扣非25.976亿元；这是简化合并现金剩余，未扣并购、租赁和少数股东，也不是完整FCFE。发股融资现金不能充当经营现金。';
 dp.verification='已改用扣非、期末股本约束全年EPS，并补资本开支；报告EPS与加权股本口径已区分。';
 // Facts below are filing anchors. Each future cash path is a hypothesis that
 // must fund maintenance, growth investment and working capital before payout.
 const specs={
  '00700':{category:'经营底仓',priceGrade:'需要额外条件',cash:[17,20,23,26,29],rate:.12,terminal:.03,
   anchor:'Q2实际FCF-138亿元；剔除算力预付款376亿元，均保留。非GAAP并非现金，回购不得再从DCF扣/加一次。',
   hypothesis:'第1年每股归母可分配现金17元、第5年29元；需要预付款节奏稳定和AI商业化，未视作已经实现。',
   finding:'护城河强，但原区间需要现金修复；现金敏感性未单独加上市/非上市投资及超额现金，不足以单凭该模型否定全部资产价值。',
   falsifier:'实际累计FCF连续为负且AI利润未改善；不能只看剔预付后的口径。'},
  '600941':{category:'经营底仓',priceGrade:'需要额外条件',cash:[5,5.3,5.6,5.9,6.1],rate:.10,terminal:.02,
   anchor:'中报公司口径FCF539亿元，非归母EPS；Q3扣非-0.2%，主营收入-5.1%，两者须并看。',
   hypothesis:'每股可分配现金从5元到6.1元，要求全年资本开支付款受控；10%资金要求是防守资产假设。',
   finding:'有防守价值；原70–78元更接近现金情景价值，不是天然高赔率。股息预期不能保证组合12%年化，也应比较同公司H股税后成本。',
   falsifier:'FCF持续不覆盖股息，传统收入恶化快于算力利润。'},
  '600036':{category:'经营底仓',priceGrade:'价格依据初步支持',financial:true,
   anchor:'普通股BPS45.40元、年化ROAE13.42%；必须扣优先股/永续债影响，不能以工业OCF判断银行。',
   hypothesis:'持续ROE12%、g3%、股权成本13%；信用损失和留存收益都会改变BPS。',
   finding:'原区间数值基本可保留，但原“未来48元BPS再折半年”的巧合已改为实际BPS与现值PB。',
   falsifier:'持续ROE下破股权成本、信用损失侵蚀账面价值；低PB本身不是保护。'},
  '002270':{category:'经营底仓',priceGrade:'需要额外条件',cash:[.78,.88,1,1.12,1.24],rate:.11,terminal:.03,
   anchor:'H1 OCF4.5888亿元、资本性购建0.4320亿元，简化现金剩余约4.1568亿元；另有融资租赁偿还，不能忽略。',
   hypothesis:'每股可分配现金0.78→1.24元；海外复购和服务网络必须转利润，不能只靠海外低基数增速。',
   finding:'细分壁垒与现金较好；15–17元仍要求较强海外成长和现金分配，尤其上沿缺少宽安全边际。',
   falsifier:'海外收入增而利润/回款恶化，或续扩产却没有复购。'},
  '000333':{category:'经营底仓',priceGrade:'价格依据初步支持',cash:[5.6,5.9,6.2,6.5,6.8],rate:.11,terminal:.02,
   anchor:'H1合并OCF375.52亿元、资本性购建26.34亿元，单位为千元；金融业务/存款及应付占用不能全算可分配现金。',
   hypothesis:'每股可分配现金5.6→6.8元，低于把半年现金剩余简单翻倍；不给机器人业务独立加值。',
   finding:'原区间在该现金假设下有初步支撑，仍须检查账期、套保与汇兑成对效果。',
   falsifier:'海外利润与现金同时下降，融资/供应链占用掩盖现金回报。'},
  '02328':{category:'经营底仓',priceGrade:'价格依据初步支持',financial:true,
   anchor:'官方中报归母权益3036.88亿元÷222.42765303亿股=BPS13.6533元；总权益含少数股东，不能混用。',
   hypothesis:'中报BPS审慎预留中期股息0.34元；持续ROE13%、g3%、股权成本12%，对应PB1.111；中期投资浮盈不年化。',
   finding:'从单一PE改为PB/资本回报检验。承保定价改善真实，但大灾、准备金和资产端仍有共同金融风险。',
   falsifier:'成本率长期上行、准备金不足，或资本增长无法变成每股回报。'},
  '600938':{category:'周期卫星',priceGrade:'需要额外条件',cash:[2.7,2.6,2.5,2.5,2.5],rate:.12,terminal:0,fade:[0,0,0,0,0],
   anchor:'H1布伦特均价87.6美元；OCF1416.31亿元，购建付款533.75亿元，而项目资本支出619.93亿元，现金/权责发生口径不同。',
   hypothesis:'可分配现金2.7→2.5元反映油价正常化和持续替代储量投资；不把资源高景气现金永久化。',
   finding:'低成本与资源有价值，但6%仓位是商品卫星，不是保证对冲；原区间需油价及资本回报支持。',
   falsifier:'油价回落且资本开支刚性，维持产量所需再投资抬升；衰退时可与股票一起跌。'},
  '600900':{category:'经营底仓',priceGrade:'原买价依据偏弱',cash:[1.45,1.55,1.65,1.75,1.85],rate:.10,terminal:.02,
   anchor:'H1 OCF241.28亿元、购建付款44.35亿元；两者差额196.94亿元仍未扣全部付息、少数股东及新增投资。',
   hypothesis:'每股可分配现金1.45→1.85元，需要来水、电价和债务成本支持；不将“电力增长”直接乘进水电。',
   finding:'资产稀缺成立，原22.89–24.78元却没有充分证明高回报要求；19倍PE和资产稳定不是同一件事。',
   falsifier:'枯水/电价下降、维持开支升高或高价并购使现金偿债循环减弱。'},
  '300760':{category:'经营底仓',priceGrade:'原买价依据偏弱',cash:[6.4,7,7.7,8.4,9.1],rate:.11,terminal:.03,
   anchor:'H1合并OCF48.77亿元、购建付款10.64亿元，简化现金剩余38.13亿元；母公司购建5.78亿元不能替代合并数。',
   hypothesis:'每股可分配现金6.4→9.1元，要求采购恢复、海外利润兑现和周转稳定；第1年并非把半年利润乘PE。',
   finding:'装机/耗材/服务壁垒有价值；原139–156元上沿更多依赖增长持续性与高倍数，现金模型未给出充分安全边际。',
   falsifier:'高端装机不转耗材/服务现金，医院应收与渠道库存持续增加。'},
  '002028':{category:'条件成长',priceGrade:'原买价依据偏弱',cash:[2.8,3.5,4.4,5.2,6.1],rate:.12,terminal:.03,
   anchor:'H1合并OCF2.2721亿元、购建付款4.5806亿元，简化现金剩余-2.3084亿元；并非母公司现金。',
   hypothesis:'每股可分配现金2.8→6.1元本已假设回款恢复和海外规模；不把未来27倍PE当确定退出价。',
   finding:'海外电网能力值得研究，但原97–109元需要比该现金路径更强的回款/成长或更低资本成本；不能称已证明高胜率。',
   falsifier:'应收/合同资产持续快于收入增长，扩产靠融资且利润率下滑。'},
  '605499':{category:'条件成长',priceGrade:'原买价依据偏弱',cash:[4,4.7,5.5,6.3,7.1],rate:.11,terminal:.03,
   anchor:'H1扣非25.976亿元、期末7.34199310亿股；OCF减购建约13.574亿元，扩张投入真实消耗现金。',
   hypothesis:'每股可分配现金4.0→7.1元，需要新增产能和渠道投入产生现金；中报发股融资不作为经营回报。',
   finding:'先下修EPS8→7.3，纠正把报告加权EPS当全年底盘。下修后的PE区间仍需现金增长来支持，铺货不等于终端需求。',
   falsifier:'库存与促销一起上升，现金弱于扣非且新增股本继续稀释。'},
  '02057':{category:'条件成长',priceGrade:'价格依据初步支持',cash:[10,10.6,11.2,11.8,12.4],rate:.12,terminal:.02,
   anchor:'Q2 OCF约45.64亿元、资本开支9.52亿元；半年稀释EPS6.44元，1 ADS对应1股，人民币盈利与港币交易分开。',
   hypothesis:'每股可分配现金10→12.4元，不直接把高现金Q2乘四；需要竞争纪律和加盟商盈利延续。',
   finding:'原区间在温和现金增长假设下有初步支撑；反身性是单票利润—网络稳定—效率，而非追求件量。',
   falsifier:'价格战恢复、加盟商利润被总部转移或服务质量下降；不是无条件防守股。'},
  '001872':{category:'周期卫星',priceGrade:'原买价依据偏弱',cash:[1.25,1.35,1.45,1.55,1.65],rate:.11,terminal:.02,
   anchor:'H1权益法联营合营利润36.984亿元、投资收益现金12.152亿元；后者并非全为联营股息，不能直接当完整收现率。',
   hypothesis:'归母可分配现金1.25→1.65元，需要穿透持股和股息上划；不把合并OCF与归母利润直接相除。',
   finding:'港口壁垒存在，原18–20元欠逐港口及联营股息桥接；与制造出口也有共同风险。',
   falsifier:'吞吐增长却费率/归母现金下降，关联资产高价扩张，联营利润无法分配。'},
  '600406':{category:'条件成长',priceGrade:'原买价依据偏弱',cash:[.75,.86,.98,1.10,1.22],rate:.11,terminal:.03,
   anchor:'H1合并OCF5.911亿元、购建付款7.543亿元，简化现金剩余-1.632亿元，不能提前保证年末回款。',
   hypothesis:'每股可分配现金0.75→1.22元已假设交付和回款逐步改善，仍需与同季比较，避免季节性误判。',
   finding:'系统、客户和技术壁垒支持经营质量；原19–22元尚缺足够现金回报证据，且与思源/华明共享电网预算风险。',
   falsifier:'利润增长持续落后收入，现金转化弱且合同资产上升。'},
  '603444':{category:'周期卫星',priceGrade:'需要额外条件',cash:[22,23,23,22,21],rate:.12,terminal:0,fade:[-.03,-.03,-.02,-.01,0],
   anchor:'沿用已核对Q3：累计EPS22元、OCF19.152亿元；单季收入/利润回落，现金充裕不等于新品长期成功。',
   hypothesis:'归母可分配现金22→21元，后续允许产品衰减；未另加超额净现金和投资资产，完整SOTP尚缺。',
   finding:'有现金与资本纪律，但不宜作稳定消费底仓。原260–293元需要现金资产拆分或产品接棒额外支持，不能只看累计增长。',
   falsifier:'多个产品连续衰减、储备断档或分红靠处置资产。'}
 };
 const cashPV=(a,rate,terminal,tailGrowth)=>{
  const flows=[...a];let c=flows[4];
  const fade=tailGrowth||[terminal+.04,terminal+.025,terminal+.015,terminal+.005,terminal];
  for(const g of fade){c*=1+g;flows.push(c);}
  const operating=flows.reduce((s,v,i)=>s+v/(1+rate)**(i+1),0),tail=c*(1+terminal)/(rate-terminal)/(1+rate)**10;
  return {pv:operating+tail,terminalShare:tail/(operating+tail),flows,rate,terminal};
 };
 const extraSources={
  '600941':'https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12492474&stockid=600941',
  '002270':'https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12570844&stockid=002270',
  '000333':'https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12572219&stockid=000333',
  '600938':'https://stockmc.xueqiu.com/202608/600938_20260827_EUY6.pdf',
  '600900':'https://static.cninfo.com.cn/finalpage/2026-08-31/1225534923.PDF',
  '300760':'https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12570586&stockid=300760'
 };
 for(const [code,s]of Object.entries(specs)){
  const x=by(code),before=old.get(code);if(!x)continue;
  const cross=s.financial?null:cashPV(s.cash,s.rate,s.terminal,s.fade);
  x.validation={...s,date:'2026-10-23',old:before,cross,summary:s.finding,
   cashZone:cross?[cross.pv*.8,cross.pv*.9]:null,
   sensitivity:cross?[cashPV(s.cash,s.rate+.02,s.terminal,s.fade).pv,cashPV(s.cash,s.rate-.02,s.terminal,s.fade).pv]:null};
  x.analysis.verdict=s.finding;x.analysis.quality=(x.analysis.quality||'')+' 本轮补核：'+s.anchor;
  x.analysis.limit+=' 现金敏感性所用未来路径及资本成本均为假设，并非公司指引或完整逐分部DCF。';
  if(extraSources[code])x.sources=[...(x.sources||[['既有披露',x.source]]),['本轮完整现金/权益披露',extraSources[code]]];
  x.portfolio.grade=s.category+' · '+s.priceGrade;
 }
 r.coreValidation={date:'2026-10-23',supported:4,conditional:5,weak:6,
  headline:'15只均有继续研究价值，但不应等价视为15只高胜率核心：8只经营底仓、4只条件成长、3只周期卫星。当前仅4只的价格依据获得初步交叉支持，5只需要额外条件，6只原买价依据偏弱。',
  method:'财报事实、正常化盈利、价格计算和未来兑现分别核验。现金参照为10年归母可分配现金敏感性：前5年逐年假设、后5年增速向终值衰减，资金要求10%–12%，再留10%–20%余量；不另做半年折现。银行/财险用归母净资产与持续ROE检验。',
  limits:'现金参照共享若干经营假设，不是已完成的独立完整DCF；租赁、少数股东、资本开支和投资资产仍可能改变结果。未另加净金融资产，尤其腾讯/吉比特可能被低估，因此现金参照偏低不等于证明旧价错误。所有胜率均未经统计验证。',
  correction:'原统一“估值÷√1.12再打折”只折现一个假设终值，不能保证长期12%年化。已撤掉该回报暗示；修正东鹏扣非/期末股本、招行BPS现值、财险归母权益与PB，以及港口联营利润的现金归属。',
  portfolio:'目标权重保留作条件配置上限；价格依据不足的席位留现金，15%是底线，不要求凑齐85%股票。电网16%、金融13%及出口链仍有共同风险；海油/中通的油价敏感性不保证股价负相关。'};
 r.portfolio.method=r.coreValidation.headline+' '+r.coreValidation.portfolio;
 r.auditReview.scope='本轮逐项核验15只的关键财报、现金归属、每股和价格条件；52项做结构与计算检查，其余37项未在本轮重读全部财报。仅4项价格依据初步支持，不等于未来经营条件已核验。';
 r.auditReview.items.unshift(['12%回报暗示','半年折现并不保证买入后的长期年化回报，已撤掉该暗示。'],['本轮口径修正','东鹏用扣非与期末股本约束EPS；招行改实际BPS现值；财险补官方全文并用归母权益/PB，预留已宣布股息；港口补联营利润与股息现金桥接限制。']);
 r.asOf='2026-10-23';r.window=['2027-01-23','2027-04-23'];r.version='4.2-core-validation';
}
