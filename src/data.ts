export type Lang = "cn" | "en" | "ja";

export type Copy = Record<Lang, string>;

const copy = (cn: string, en: string, ja: string): Copy => ({ cn, en, ja });

export type Stat = {
  code: string;
  value: string;
  label: Copy;
  accent?: boolean;
};

export type AssetClass = {
  code: string;
  title: Copy;
  signal: Copy;
  proof: string;
};

export type CaseStudy = {
  code: string;
  category: Copy;
  title: Copy;
  role: Copy;
  signal: string;
  asset: Copy;
  sourceUrl?: string;
};

export type VentureAsset = {
  code: string;
  title: Copy;
  role: Copy;
  signal: Copy;
};

export type TimelineItem = {
  period: string;
  title: Copy;
  role: Copy;
  signal: Copy;
};

export type RoleGroup = {
  code: string;
  title: Copy;
  items: Copy[];
};

export type SkillGroup = {
  code: string;
  title: Copy;
  items: string[];
};

export type ResearchItem = {
  code: string;
  title: Copy;
  signal: Copy;
};

export const stats: Stat[] = [
  {
    code: "ADB-SIGNAL-20Y",
    value: "20Y+",
    label: copy("品牌、市场、产业、渠道与AI应用实战", "Brand, market, industry, channel and AI practice", "ブランド、マーケティング、産業、チャネル、AI活用の実戦"),
    accent: true
  },
  {
    code: "ADB-BRAND-300B",
    value: "300B+",
    label: copy("集团品牌估值支撑与全球品牌管理经验", "Group brand value support and global brand management", "グループブランド価値を支えるグローバルブランド管理経験"),
    accent: true
  },
  {
    code: "ADB-BRAND-300M",
    value: "300M+",
    label: copy("单品牌年度销售规模参与经验", "Annual sales scale for a single brand", "単一ブランドの年間売上規模への参画経験"),
    accent: true
  },
  {
    code: "ADB-EVENT-6262",
    value: "6,262",
    label: copy("尼斯大会吉尼斯世界纪录参与者", "Nice Conference Guinness record participants", "ニース大会ギネス世界記録の参加者")
  },
  {
    code: "ADB-GLOBAL-50R",
    value: "50+",
    label: copy("国家和地区参与尼斯大会传播事件", "Countries and regions in the Nice event", "ニース大会の伝播に参加した国と地域")
  },
  {
    code: "ADB-CIRC-30KT",
    value: "30,000T+",
    label: copy("循环体系累计回收量", "Cumulative recycling volume", "循環体系の累計回収量"),
    accent: true
  },
  {
    code: "ADB-CIRC-300S",
    value: "300+ / 18",
    label: copy("天津公益挂牌站点 / 实际经营驿站", "Tianjin listed public stations / operated stations", "天津の公益登録ステーション / 実運営拠点")
  },
  {
    code: "ADB-CIRC-100E",
    value: "100+",
    label: copy("无废市集公益活动场次", "Zero-waste market events", "無廃マーケット公益イベント回数")
  },
  {
    code: "ADB-MEDIA-10M",
    value: "10M+",
    label: copy("公益传播浏览量", "Public welfare media views", "公益传播の閲覧数"),
    accent: true
  },
  {
    code: "ADB-COMM-5000",
    value: "5,000+",
    label: copy("中国设计师品牌社群规模", "China designer brand community members", "中国デザイナーブランドコミュニティ規模")
  },
  {
    code: "ADB-KOL-1000",
    value: "1,000+",
    label: copy("跨行业精英品牌/KOL资源", "Cross-industry elite brand and KOL resources", "業界横断のエリートブランド/KOLリソース")
  },
  {
    code: "ADB-MCN-3000",
    value: "3,000 / 19",
    label: copy("主播资源与全国基地", "Streamer resources and national bases", "配信者リソースと全国拠点"),
    accent: true
  },
  {
    code: "ADB-IP-93",
    value: "5 / 93",
    label: copy("AI数字音乐专辑 / 歌曲", "AI music albums / songs", "AIデジタル音楽アルバム / 楽曲")
  },
  {
    code: "ADB-CITY-3P",
    value: "3+",
    label: copy("西安、广州、哈尔滨等模式复制", "Replication in Xi'an, Guangzhou and Harbin", "西安・広州・ハルビン等へのモデル展開")
  },
  {
    code: "ADB-CAP-90M",
    value: "90M",
    label: copy("相关业务主体注册资本人民币", "Registered capital of related operating entity", "関連事業主体の登録資本金")
  }
];

export const assetClasses: AssetClass[] = [
  {
    code: "ADB-ID-001",
    title: copy("身份资产", "Identity Asset", "アイデンティティ資産"),
    signal: copy("董昀赫 / Andy D / 观星纪.StarEpoch / AI极客", "Dong Yunhe / Andy D / StarEpoch / AI geek", "董昀赫 / Andy D / StarEpoch / AIギーク"),
    proof: "20Y+"
  },
  {
    code: "ADB-BRAND-001",
    title: copy("品牌资产", "Brand Asset", "ブランド資産"),
    signal: copy("集团品牌、产品品牌、多业态品牌、企业官网、个人IP打造", "Group brands, product brands, multi-format brands, websites and personal IP", "グループブランド、製品ブランド、多業態ブランド、企業サイト、個人IP構築"),
    proof: "300B+ / 300M+"
  },
  {
    code: "ADB-IND-001",
    title: copy("产业资产", "Industry Asset", "産業資産"),
    signal: copy("城市循环、再生资源、资环驿站、绿色供应链、涉密载体销毁", "Urban circular systems, recycling, resource stations, green supply chain and secure destruction", "都市循環、再生資源、資源循環ステーション、グリーンサプライチェーン、機密媒体廃棄"),
    proof: "30,000T+ / 18S"
  },
  {
    code: "ADB-CHANNEL-001",
    title: copy("渠道资产", "Channel Asset", "チャネル資産"),
    signal: copy("政府、街道、社区、商场、品牌、媒体、MCN与国际社媒矩阵", "Government, streets, communities, malls, brands, media, MCN and international social platforms", "政府、街道、コミュニティ、商業施設、ブランド、メディア、MCN、国際SNS"),
    proof: "300+ / 19"
  },
  {
    code: "ADB-DATA-001",
    title: copy("数据资产", "Data Asset", "データ資産"),
    signal: copy("站点、品类、重量、定时报送、ESG、传播、用户参与与智慧看板", "Stations, categories, weight, scheduled reporting, ESG, media, participation and dashboards", "拠点、品目、重量、定期報告、ESG、传播、参加データ、スマートダッシュボード"),
    proof: "ESG"
  },
  {
    code: "ADB-AI-001",
    title: copy("AI工具资产", "AI Tool Asset", "AIツール資産"),
    signal: copy("Codex、OpenClaw、Hermes、n8n、扣子、飞书多维表格、Obsidian、Notion", "Codex, OpenClaw, Hermes, n8n, Coze, Feishu Base, Obsidian and Notion", "Codex、OpenClaw、Hermes、n8n、Coze、Feishu Base、Obsidian、Notion"),
    proof: "Agent"
  },
  {
    code: "ADB-CONTENT-001",
    title: copy("内容资产", "Content Asset", "コンテンツ資産"),
    signal: copy("公众号、视频号、微博、小红书、抖音、Facebook、X、AI音乐与数字分身网站", "WeChat OA, Channels, Weibo, Xiaohongshu, Douyin, Facebook, X, AI music and avatar website", "WeChat公式、動画号、Weibo、小紅書、Douyin、Facebook、X、AI音楽、デジタル分身サイト"),
    proof: "5 / 93"
  },
  {
    code: "ADB-CAPITAL-001",
    title: copy("项目投资", "Project Investment", "プロジェクト投資"),
    signal: copy("教育、MCN、跨境直播、AI应用、物料设计、广告与农业等多领域项目投资经历", "Project investment experience across education, MCN, cross-border live commerce, AI, design, advertising and agriculture", "教育、MCN、越境ライブコマース、AI活用、デザイン、広告、農業などへのプロジェクト投資経験"),
    proof: "Portfolio"
  }
];

export const cases: CaseStudy[] = [
  {
    code: "ADB-EVENT-001",
    category: copy("品牌事件", "Brand Event", "ブランドイベント"),
    title: copy("尼斯大会吉尼斯世界纪录", "Nice Conference Guinness Record", "ニース大会ギネス世界記録"),
    role: copy("天狮集团全球品牌传播与大型事件协同参与", "Global brand communication and major event coordination for Tiens Group", "天獅グループのグローバルブランド传播と大型イベント連携に参画"),
    signal: "6,262 / 50+ regions",
    asset: copy("把集团品牌、国际传播、公众事件和媒体声量转化为可被记忆的品牌资产。", "Converted group brand, international communication, public event and media attention into a memorable brand asset.", "グループブランド、国際传播、公共イベント、メディア露出を記憶に残るブランド資産へ転換。"),
    sourceUrl: "https://www.chinanews.com/cj/2015/04-08/7192123.shtml"
  },
  {
    code: "ADB-BRAND-002",
    category: copy("品牌系统", "Brand System", "ブランドシステム"),
    title: copy("全球品牌管理体系", "Global Brand Management System", "グローバルブランド管理体系"),
    role: copy("多家知名企业品牌总监；横向产品品牌与集团下属多业态品牌管理，协同20-30人全球品牌中心", "Brand Director for multiple well-known enterprises; managed product brands and multi-format group brands with a 20-30 person global brand center", "複数の著名企業でブランドディレクターを担当。製品ブランドと多業態ブランドを横断管理し、20-30名規模のグローバルブランドセンターと連携"),
    signal: "300B+ / Xinhua strategic partner",
    asset: copy("沉淀全球品牌管理、新华社战略合作传播、多业态品牌复制与组织协同方法。", "Built global brand management, Xinhua strategic communication, multi-format brand replication and organization methods.", "グローバルブランド管理、新華社との戦略传播、多業態ブランド複製、組織連携の方法論を蓄積。")
  },
  {
    code: "ADB-BRAND-003",
    category: copy("产品品牌", "Product Brand", "製品ブランド"),
    title: copy("新锐奢侈品品牌", "Emerging Luxury Brand", "新鋭ラグジュアリーブランド"),
    role: copy("参与品牌定位、产品体系、SKU建设与渠道推广", "Participated in positioning, product system, SKU building and channel promotion", "ブランドポジショニング、製品体系、SKU構築、チャネル推广に参画"),
    signal: "43 SKUs / 300M+ annual sales",
    asset: copy("从品牌概念到规模化销售的产品品牌资产，验证高客单、高利润产品线打造能力。", "A product brand asset from concept to scaled sales, validating premium product-line building capability.", "ブランド概念から大規模販売までの製品ブランド資産。高単価・高利益率の商品ライン構築力を証明。")
  },
  {
    code: "ADB-BRAND-004",
    category: copy("老字号焕新", "Legacy Brand Renewal", "伝統ブランド刷新"),
    title: copy("传统中药品牌升级", "Traditional Chinese Medicine Brand Upgrade", "伝統中医薬ブランドのアップグレード"),
    role: copy("主持传统中药品牌升级、年轻化表达与全国渠道推广", "Led TCM brand upgrade, younger expression and national channel promotion", "伝統中医薬ブランドの刷新、若年層向け表現、全国チャネル推广を主導"),
    signal: "30M bottles / national pharmacy chains",
    asset: copy("让传统品牌进入全国知名连锁药店渠道，形成可销售、可传播、可复购的品牌资产。", "Brought a traditional brand into national pharmacy chains with sellable, communicable and repeatable brand value.", "伝統ブランドを全国大手ドラッグストアチェーンへ展開し、販売・传播・リピート可能なブランド資産へ転換。")
  },
  {
    code: "ADB-CIRC-001",
    category: copy("城市循环", "Urban Circular System", "都市循環"),
    title: copy("城市循环体系建设", "Urban Circular Economy System", "都市循環体系の構築"),
    role: copy("推动点、站、场、平台、街道、政府与社会从业人员协同运营", "Built coordinated operation across points, stations, hubs, platforms, streets, government and social operators", "回収点、ステーション、集積場、プラットフォーム、街道、政府、社会事業者の協働運営を推進"),
    signal: "30,000T+ / 18 operated stations / Tianjin -> Xi'an, Guangzhou, Harbin",
    asset: copy("线下网络与线上平台同步品类、重量、站点、定时报送与ESG数据；实际经营18个驿站，是城市业态数字化资产。", "Offline network and online platform synchronize categories, weight, stations, scheduled reporting and ESG data; 18 stations were directly operated as city-level digital assets.", "オフライン網とオンライン平台で品目、重量、拠点、定期報告、ESGデータを同期。18拠点を実運営し、都市業態のデジタル資産化を実現。")
  },
  {
    code: "ADB-CIRC-002",
    category: copy("公益IP", "Public Welfare IP", "公益IP"),
    title: copy("WE爱循环：以废代捐", "WE Recycle: Donation Through Recyclables", "WE愛循環：廃棄物を寄付に変える"),
    role: copy("公益模式发起与城市级站点网络运营", "Initiated the model and operated the city-level station network", "公益モデルの発起と都市級ステーションネットワーク運営"),
    signal: "10,000 participants / 300+ stations / 4 flagship stores",
    asset: copy("近万人参与、天津300余个公益站点、几十家知名品牌联席、4个商场公益旗舰店。", "Nearly 10,000 participants, 300+ Tianjin stations, dozens of brand partners and 4 mall flagship stores.", "約1万人が参加、天津300以上の公益ステーション、数十の有名ブランドと連携、商業施設内に4つの公益旗艦店。")
  },
  {
    code: "ADB-CIRC-003",
    category: copy("城市传播", "City Communication", "都市传播"),
    title: copy("无废市集公益活动", "Zero-Waste Market", "ゼロウェイスト・マーケット"),
    role: copy("活动IP发起、传播策划与绿色生活方式运营", "Campaign IP initiation, communication planning and green lifestyle operation", "イベントIPの発起、传播設計、グリーンライフスタイル運営"),
    signal: "100+ events / 10M+ views / Tianjin TV",
    asset: copy("累计100余场，浏览量1000万以上，多次登上天津电视台新闻栏目。", "100+ events, 10M+ views and multiple Tianjin TV news features.", "累計100回以上、閲覧数1000万超、天津テレビのニュース番組に複数回登場。")
  },
  {
    code: "ADB-CIRC-004",
    category: copy("前端网络", "Front-End Network", "フロントエンド回収ネットワーク"),
    title: copy("中国资环驿站", "China Resources Recycling Station", "中国資源循環ステーション"),
    role: copy("主持中国资环驿站、前端街道回收点、平台应用与规范运营方案", "Led China Resources Recycling Station, front-end street station, platform application and standardized operation", "中国資源循環ステーション、街道前端回収点、平台アプリ、標準運営方案を主導"),
    signal: "18 stations / App / ESG",
    asset: copy("实际经营18个驿站，招募社会从业人员规范运营，与回收站点入驻应用、数据采集、商务协同形成一体化模型。", "Operated 18 stations, standardized social operators and integrated station onboarding, data collection and business coordination.", "18拠点を実運営し、社会事業者を募集して標準運営。回収ステーション入居アプリ、データ収集、商務連携を一体化。")
  },
  {
    code: "ADB-DIGITAL-001",
    category: copy("数字产品", "Digital Products", "デジタルプロダクト"),
    title: copy("企业官网、报价看板与知识同步系统", "Corporate Site, Pricing Dashboard and Knowledge Sync", "企業サイト、価格ダッシュボード、知識同期システム"),
    role: copy("设计、制作并上线公司官网；制作再生资源报价智慧看板与网页信息同步工作流", "Designed, built and launched corporate site; built pricing dashboard and web-to-knowledge workflows", "企業サイトを設計・制作・公開。再生資源価格スマートボードとWeb情報同期ワークフローを制作"),
    signal: "Website / Dashboard / Obsidian + Notion",
    asset: copy("把内容、业务、报价、平台入驻与知识库沉淀成可复用的数字化资产。", "Turned content, business, pricing, onboarding and knowledge capture into reusable digital assets.", "コンテンツ、業務、価格、平台入居、ナレッジを再利用可能なデジタル資産へ蓄積。")
  },
  {
    code: "ADB-CHANNEL-001",
    category: copy("渠道与MCN", "Channel and MCN", "チャネルとMCN"),
    title: copy("社群、MCN与直播电商资源", "Communities, MCN and Live Commerce Resources", "コミュニティ、MCN、ライブコマース資源"),
    role: copy("创建中国设计师品牌社群与跨行业精英品牌资源；投资MCN与跨境直播项目", "Built designer brand community and cross-industry elite brand resources; invested in MCN and cross-border live commerce", "中国デザイナーブランドコミュニティと業界横断のブランド資源を構築。MCNと越境ライブコマースに投資"),
    signal: "5,000+ / 1,000+ / 3,000 anchors / 19 bases",
    asset: copy("第一时间科技拥有腾讯生态头部MCN资源；优九文化曾进入抖音跨境直播带货全国前十。", "First Time Technology carries Tencent ecosystem MCN resources; Youjiu Culture ranked national top ten in Douyin cross-border live commerce.", "第一時間科技はテンセント生態圏の有力MCN資源を持ち、優九文化はDouyin越境ライブコマース全国トップ10入り。")
  },
  {
    code: "ADB-IP-001",
    category: copy("个人IP", "Personal IP", "個人IP"),
    title: copy("观星纪.StarEpoch数字资产", "StarEpoch Digital Asset System", "StarEpochデジタル資産システム"),
    role: copy("制作个人数字分身网站、运营个人公众号、创作AI音乐并实践Agent工作流", "Built digital avatar site, operated official account, created AI music and practiced agent workflows", "個人デジタル分身サイト、公式アカウント運営、AI音楽制作、Agentワークフロー実践"),
    signal: "5 albums / 93 songs / Codex + OpenClaw + Hermes",
    asset: copy("个人IP、数字人、公众号、AI音乐、知识库、Agent与自动化工作流统一沉淀。", "Personal IP, digital avatar, official account, AI music, knowledge base, agents and automation workflows as one asset system.", "個人IP、デジタルアバター、公式アカウント、AI音楽、ナレッジベース、Agent、自動化を一体の資産体系として蓄積。")
  }
];

export const ventures: VentureAsset[] = [
  {
    code: "ADB-VENTURE-001",
    title: copy("田禾仙农业发展有限公司", "Tianhexian Agriculture Development", "田禾仙農業発展有限公司"),
    role: copy("海南/南京公司投资", "Investor in Hainan/Nanjing entities", "海南/南京法人への投資"),
    signal: copy("农业与消费场景投资经验", "Agriculture and consumer-scenario investment experience", "農業と消費シーンへの投資経験")
  },
  {
    code: "ADB-VENTURE-002",
    title: copy("优九文化发展有限公司", "Youjiu Culture Development", "優九文化発展有限公司"),
    role: copy("投资", "Investor", "投資"),
    signal: copy("抖音跨境直播带货全国前十相关项目经验", "Related experience in national top-ten Douyin cross-border live commerce", "Douyin越境ライブコマース全国トップ10関連プロジェクト経験")
  },
  {
    code: "ADB-VENTURE-003",
    title: copy("恒九运文化发展有限公司", "Hengjiuyun Culture Development", "恒九運文化発展有限公司"),
    role: copy("投资", "Investor", "投資"),
    signal: copy("文化、广告与内容业务资产", "Culture, advertising and content-business assets", "文化、広告、コンテンツ事業資産")
  },
  {
    code: "ADB-VENTURE-004",
    title: copy("天津第一时间科技有限公司", "Tianjin First Time Technology", "天津第一時間科技有限公司"),
    role: copy("投资", "Investor", "投資"),
    signal: copy("腾讯生态头部MCN资源，3000名主播、19个全国基地、300+知名主播资源", "Tencent ecosystem MCN resources, 3,000 streamers, 19 bases and 300+ well-known streamers", "テンセント生態圏の有力MCN資源、配信者3000名、全国19拠点、著名配信者300名以上")
  },
  {
    code: "ADB-VENTURE-005",
    title: copy("天津常青源教育有限公司等", "Tianjin Changqingyuan Education and others", "天津常青源教育有限公司ほか"),
    role: copy("投资 / 项目投资", "Investor / project investor", "投資 / プロジェクト投資"),
    signal: copy("户外体育教育项目，类似“体育外卖”：体育教练带器材进入社区，为孩子提供小区场景下的体育课程服务。", "Outdoor sports education project, like sports delivery: coaches bring equipment into communities and provide sports classes for children near home.", "屋外体育教育プロジェクト。いわば「スポーツのデリバリー」で、コーチが器材を持って社区に入り、子ども向けに近隣型体育レッスンを提供。")
  }
];

export const timeline: TimelineItem[] = [
  {
    period: "1984",
    title: copy("出生于大同", "Born in Datong", "大同生まれ"),
    role: copy("身份起点", "Identity origin", "アイデンティティの起点"),
    signal: copy("现居天津，两个孩子的父亲。", "Based in Tianjin and father of two.", "現在は天津在住、二児の父。")
  },
  {
    period: "2003-2007",
    title: copy("天津美术学院", "Tianjin Academy of Fine Arts", "天津美術学院"),
    role: copy("公共艺术 / 环境艺术 本科", "B.A. Public Art / Environmental Art", "公共芸術 / 環境芸術 学士"),
    signal: copy("建立审美、空间、设计与视觉表达底层能力。", "Built foundations in aesthetics, space, design and visual expression.", "美意識、空間、デザイン、視覚表現の基礎能力を形成。")
  },
  {
    period: "2007-2009",
    title: copy("天津地标天程传媒有限公司", "Tianjin Landmark Tiancheng Media", "天津地標天程メディア有限公司"),
    role: copy("合伙人", "Partner", "パートナー"),
    signal: copy("进入传媒、品牌、广告与商业项目实践。", "Entered media, brand, advertising and commercial project practice.", "メディア、ブランド、広告、商業プロジェクトの実践に入る。")
  },
  {
    period: "2009-2011",
    title: copy("日本筑波大学", "University of Tsukuba, Japan", "筑波大学"),
    role: copy("生命环境科学 硕士", "M.S. Life and Environmental Sciences", "生命環境科学 修士"),
    signal: copy("形成环境、产业与国际化视野。英语四级，日语二级，书写与口语可用。", "Built environmental, industrial and international perspective. CET-4 English and JLPT N2 Japanese with working writing and speaking ability.", "環境、産業、国際的視野を形成。英語CET-4、日本語能力試験N2、読み書きと会話が可能。")
  },
  {
    period: "2011-2013",
    title: copy("筑土国际", "Archiland Group", "筑土国際"),
    role: copy("品牌总监", "Brand Director", "ブランドディレクター"),
    signal: copy("外企环境下参与空间设计、品牌表达、项目包装与市场沟通。", "Worked in a foreign-enterprise setting across spatial design, brand expression, project packaging and market communication.", "外資系環境で空間設計、ブランド表現、プロジェクト包装、市場コミュニケーションに従事。")
  },
  {
    period: "2013-2018",
    title: copy("天狮集团", "Tiens Group", "天獅グループ"),
    role: copy("品牌总监", "Brand Director", "ブランドディレクター"),
    signal: copy("全球品牌中心、多业态品牌管理、尼斯大会、新华社战略合作、新锐奢侈品品牌等项目。", "Global brand center, multi-format brand management, Nice event, Xinhua partnership and emerging luxury brand projects.", "グローバルブランドセンター、多業態ブランド管理、ニース大会、新華社戦略協力、新鋭ラグジュアリーブランドなどのプロジェクト。")
  },
  {
    period: "2018-2021",
    title: copy("金耀集团", "Kingyork Group", "金耀グループ"),
    role: copy("市场部总监", "Marketing Director", "マーケティング部長"),
    signal: copy("主持传统中药品牌升级与全国渠道推广。", "Led traditional medicine brand upgrades and national channel promotion.", "伝統中医薬ブランドの刷新と全国チャネル推广を主導。")
  },
  {
    period: "2021-2025",
    title: copy("拾起卖集团", "Citymine Group", "拾起売グループ"),
    role: copy("事业部总经理", "Business Unit General Manager", "事業部総経理"),
    signal: copy("推动城市循环体系、公益回收、站点网络与数字平台建设。", "Advanced urban circular systems, public recycling, station networks and digital platforms.", "都市循環体系、公益回収、ステーションネットワーク、デジタル平台の構築を推進。")
  },
  {
    period: "2025-Now",
    title: copy("中国资源循环集团", "China Resources Recycling Group", "中国資源循環グループ"),
    role: copy("回收体系建设负责人兼销毁市场部负责人", "Head of Recycling System Construction and Destruction Market", "回収体系構築責任者 兼 廃棄市場部責任者"),
    signal: copy("负责回收体系建设与销毁市场业务，覆盖涉密涉敏信息载体销毁、公共机构废旧物资回收、假冒伪劣罚没物资处置等方向。", "Leads recycling system construction and destruction-market business, covering secure destruction, public-institution recycling and counterfeit/confiscated goods disposal.", "回収体系構築と廃棄市場業務を担当。機密・敏感情報媒体廃棄、公共機関の廃旧物資回収、偽物・没収物資処分などをカバー。")
  }
];

export const roleGroups: RoleGroup[] = [
  {
    code: "ADB-SOCIAL-001",
    title: copy("公共事务与协会身份", "Public Affairs and Associations", "公共事務・協会での役割"),
    items: [
      copy("天津民建会员兼研究课题组调研员", "Member of Tianjin CDNCA and research group investigator", "天津民建会員 兼 研究課題グループ調査員"),
      copy("天津产业园协会会员", "Member of Tianjin Industrial Park Association", "天津産業園協会会員"),
      copy("中国工艺美术协会会员", "Member of China Arts and Crafts Association", "中国工芸美術協会会員"),
      copy("天津葫芦工艺美术协会办公室主任", "Office Director of Tianjin Gourd Arts and Crafts Association", "天津瓢箪工芸美術協会 事務局主任"),
      copy("海河文化发展基金会理事", "Council Member of Haihe Cultural Development Foundation", "海河文化発展基金会 理事"),
      copy("大同商会会员", "Member of Datong Chamber of Commerce", "大同商会会員")
    ]
  },
  {
    code: "ADB-EDU-001",
    title: copy("教育、文化与公益身份", "Education, Culture and Welfare Roles", "教育・文化・公益での役割"),
    items: [
      copy("天津天狮大学副教授", "Associate Professor at Tiens University", "天津天獅大学 副教授"),
      copy("天津商业大学创业导师", "Entrepreneurship Mentor at Tianjin University of Commerce", "天津商業大学 起業メンター"),
      copy("中俄文化艺术中心特聘专家", "Special Expert at China-Russia Culture and Art Center", "中露文化芸術センター 特聘専門家"),
      copy("爱印途儿童帮扶中心副理事长", "Vice Chairman of Ai Yintu Children Support Center", "愛印途児童支援センター 副理事長"),
      copy("天津梧桐金融俱乐部联合发起人", "Co-founder of Tianjin Wutong Finance Club", "天津梧桐金融クラブ 共同発起人")
    ]
  }
];

export const researchItems: ResearchItem[] = [
  {
    code: "ADB-RESEARCH-001",
    title: copy("国家发改委环境司委托调研", "Research Commissioned by NDRC Environmental Department", "国家発展改革委員会 環境司委託調査"),
    signal: copy("完成天津循环经济前端回收体系调研及方案制定。", "Completed research and solution planning for Tianjin front-end circular economy recycling system.", "天津循環経済の前端回収体系に関する調査と方案策定を完了。")
  },
  {
    code: "ADB-RESEARCH-002",
    title: copy("天津重点项目调研", "Tianjin Key Project Research", "天津重点プロジェクト調査"),
    signal: copy("作为天津民建专家课题组调研员，参与天津重点项目调研工作。", "Participated in Tianjin key project research as an expert-group investigator.", "天津民建専門課題グループの調査員として、天津重点プロジェクト調査に参加。")
  },
  {
    code: "ADB-RESEARCH-003",
    title: copy("循环经济中英文论文发表", "Circular Economy Publications in Chinese and English", "循環経済に関する中英論文・論考発表"),
    signal: copy("循环经济相关论文与观点在中英文知名板块/刊物渠道刊登。", "Circular-economy papers and viewpoints published through notable Chinese and English channels.", "循環経済関連の論文・見解が中国語・英語の主要媒体/刊行チャネルに掲載。")
  }
];

export const skillGroups: SkillGroup[] = [
  {
    code: "ADB-SKILL-AI",
    title: copy("AI Agent与自动化", "AI Agents and Automation", "AI Agentと自動化"),
    items: ["Codex", "OpenClaw", "Hermes", "n8n", "扣子 / Coze", "Feishu Base"]
  },
  {
    code: "ADB-SKILL-KM",
    title: copy("知识库与数字工作流", "Knowledge and Digital Workflows", "ナレッジベースとデジタルワークフロー"),
    items: ["Obsidian", "Notion", "Web sync", "Data dashboard", "Station onboarding app"]
  },
  {
    code: "ADB-SKILL-DESIGN",
    title: copy("设计、影像与建模", "Design, Video and Modeling", "デザイン・映像・モデリング"),
    items: ["Adobe Suite", "剪映", "SketchUp", "3ds Max", "AutoCAD"]
  },
  {
    code: "ADB-SKILL-OFFICE",
    title: copy("办公与语言", "Office and Languages", "オフィススキルと言語"),
    items: ["Microsoft Office", "English CET-4", "Japanese JLPT N2", "中文 / English / 日本語"]
  }
];

export const collaboration: Copy[] = [
  copy("个人IP与数字资产打造", "Personal IP and digital asset building", "個人IPとデジタル資産構築"),
  copy("集团品牌、产品品牌与多业态品牌管理", "Group, product and multi-format brand management", "グループ・製品・多業態ブランド管理"),
  copy("城市循环体系与再生资源平台建设", "Urban circular economy and recycling platform development", "都市循環体系と再生資源平台の構築"),
  copy("ESG、双碳与循环经济数据表达", "ESG, dual-carbon and circular economy data storytelling", "ESG・双炭素・循環経済データ表現"),
  copy("AI Agent、知识库与自动化工作流落地", "AI agents, knowledge bases and automation workflows", "AI Agent、ナレッジベース、自動化ワークフローの実装"),
  copy("新媒体矩阵、MCN、直播电商与国际社媒渠道", "Social media matrix, MCN, live commerce and international channels", "新媒体マトリクス、MCN、ライブコマース、国際SNSチャネル")
];
