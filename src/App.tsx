import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Building2,
  CircuitBoard,
  Github,
  Globe2,
  Landmark,
  Leaf,
  Link2,
  Mail,
  Megaphone,
  Music2,
  Network,
  Sparkles,
  Store,
  Trophy
} from "lucide-react";
import {
  assetClasses,
  cases,
  collaboration,
  researchItems,
  roleGroups,
  skillGroups,
  stats,
  timeline,
  type Copy,
  type Lang,
  ventures
} from "./data";

gsap.registerPlugin(ScrollTrigger);

const mobileMotionQuery = "(max-width: 980px), (pointer: coarse)";
const isMobileMotionDevice = () =>
  typeof window !== "undefined" && window.matchMedia(mobileMotionQuery).matches;

type StyleVars = CSSProperties & Record<`--${string}`, string | number>;

const inkDropPaths = {
  rest: "M -39 0 C -39 -25 -18 -42 8 -42 C 35 -42 53 -23 53 2 C 53 28 31 43 3 42 C -25 41 -39 25 -39 0 Z",
  breathTall: "M -35 -2 C -36 -28 -17 -45 7 -46 C 33 -46 50 -25 49 1 C 48 29 29 45 3 45 C -23 45 -36 24 -35 -2 Z",
  breathWide: "M -44 1 C -44 -21 -20 -37 9 -37 C 38 -37 58 -20 58 1 C 58 24 34 38 4 38 C -27 38 -44 23 -44 1 Z",
  straightLead: "M -48 -1 C -45 -22 -21 -34 6 -33 C 41 -32 68 -16 67 0 C 66 18 37 29 3 29 C -30 29 -51 18 -48 -1 Z",
  straightLong: "M -66 0 C -62 -19 -34 -28 -3 -28 C 43 -28 87 -13 86 1 C 85 18 43 25 -4 25 C -40 25 -68 17 -66 0 Z",
  straightRecover: "M -51 1 C -50 -21 -24 -34 4 -34 C 38 -34 66 -18 65 0 C 64 20 36 32 3 32 C -29 32 -52 20 -51 1 Z",
  compress: "M -31 0 C -31 -24 -14 -40 8 -40 C 34 -40 47 -22 46 2 C 45 28 27 40 2 40 C -22 40 -31 25 -31 0 Z",
  bendClockwise: "M -43 -4 C -34 -27 -8 -38 19 -30 C 49 -21 61 -1 50 14 C 37 32 7 38 -18 30 C -39 23 -50 12 -43 -4 Z",
  bendClockwiseLong: "M -52 -8 C -40 -29 -4 -34 26 -25 C 62 -14 75 7 56 20 C 34 35 -5 34 -31 22 C -51 12 -58 2 -52 -8 Z",
  bendClockwiseHook: "M -33 -18 C -16 -42 21 -38 34 -14 C 45 7 33 36 12 41 C -10 46 -33 32 -40 12 C -46 -4 -43 -11 -33 -18 Z",
  bendCounter: "M -43 4 C -49 -18 -30 -35 -2 -37 C 30 -39 58 -25 59 -6 C 60 13 37 31 7 33 C -21 35 -38 24 -43 4 Z",
  bendCounterLong: "M -54 5 C -56 -17 -29 -34 7 -33 C 48 -32 76 -15 72 2 C 67 20 32 30 -5 28 C -36 27 -52 17 -54 5 Z",
  bendCounterHook: "M -34 16 C -50 -4 -37 -31 -12 -39 C 13 -47 43 -34 50 -10 C 56 12 37 33 14 37 C -8 41 -24 31 -34 16 Z"
};

const navItems: Array<{ id: string; label: Copy }> = [
  { id: "signals", label: { cn: "价值", en: "Value", ja: "価値" } },
  { id: "assets", label: { cn: "资产", en: "Assets", ja: "資産" } },
  { id: "cases", label: { cn: "案例", en: "Cases", ja: "事例" } },
  { id: "capital", label: { cn: "项目", en: "Projects", ja: "プロジェクト" } },
  { id: "trust", label: { cn: "履历", en: "Career", ja: "経歴" } },
  { id: "starepoch", label: { cn: "观星纪", en: "StarEpoch", ja: "StarEpoch" } }
];

const languageHtml: Record<Lang, string> = {
  cn: "zh-CN",
  en: "en",
  ja: "ja"
};

const languageOptions: Array<{ code: Lang; label: string }> = [
  { code: "cn", label: "中文" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" }
];

const caseIcons = [Trophy, Building2, Store, Sparkles, Network, Leaf, Megaphone, Landmark, CircuitBoard, Boxes, Music2];

type CountSpec = {
  prefix: string;
  suffix: string;
  from: number;
  to: number;
  decimals: number;
};

function parseCountSpec(value: string): CountSpec | null {
  const match = value.match(/^([^0-9-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const rawNumber = match[2]?.replace(/,/g, "") ?? "";
  const to = Number(rawNumber);
  if (!Number.isFinite(to)) return null;

  return {
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
    from: 0,
    to,
    decimals: rawNumber.includes(".") ? rawNumber.split(".")[1]?.length ?? 0 : 0
  };
}

function AnimatedNumber({ value }: { value: string }) {
  const spec = parseCountSpec(value);
  const numberRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!spec || !numberRef.current) {
      if (numberRef.current) numberRef.current.textContent = value;
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const format = (next: number) => {
      const fixed = spec.decimals ? next.toFixed(spec.decimals) : Math.round(next).toLocaleString("en-US");
      return `${spec.prefix}${fixed}${spec.suffix}`;
    };

    if (prefersReducedMotion) {
      numberRef.current.textContent = format(spec.to);
      return;
    }

    const element = numberRef.current;
    const counter = { value: spec.from };
    element.textContent = format(spec.from);

    const tween = gsap.to(counter, {
      value: spec.to,
      duration: 1.25,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        element.textContent = format(counter.value);
      },
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        once: true,
        onEnter: () => tween.play(0)
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [spec?.decimals, spec?.prefix, spec?.suffix, spec?.to, value]);

  return <span ref={numberRef}>{spec ? `${spec.prefix}${spec.from}${spec.suffix}` : value}</span>;
}

const pageCopy = {
  cn: {
    heroLabel: "董昀赫 / Andy D / 观星纪.StarEpoch",
    heroTitle: "价值，不只是经历，\n而是可量化的资产。",
    heroText: "我把20年品牌、市场、产业、渠道、公益、内容、AI与项目投资经验，编码成一条可展示、可验证、可增长、可合作转化的个人价值链。",
    manifesto: "每个数据、项目、IP和Agent都是一个资产切片：不是静态简历，而是持续生长的数字生命体。",
    primaryCta: "查看价值链",
    secondaryCta: "进入数字专辑",
    signalsTitle: "先看信号：\n这些数字构成我的核心价值密度。",
    signalsText: "所有核心成绩都以Asset Block编码。它们不是零散经历，而是品牌资产、产业资产、渠道资产、数据资产、资本资产和AI资产的共同证明。",
    assetsTitle: "个人价值链，\n由八类资产组成。",
    casesTitle: "真实项目组合：\n职能背后，是可复用成果。",
    casesText: "这里不把单个回收点、单个活动孤立出来，而是按品牌、城市循环、公益传播、数字产品、渠道资本和个人IP归类。每一项都对应可沉淀资产。",
    capitalTitle: "项目投资，\n也是渠道和商业判断。",
    trustTitle: "履历、社会身份与研究工作，\n构成信任底座。",
    researchTitle: "政策、论文与公共议题，\n让产业经验进入公共价值。",
    skillsTitle: "工具栈不是点缀，\n而是系统执行力。",
    starText: "这里汇集数字分身网站、个人公众号、AI音乐、Agent经验、知识库、自动化工作流和社媒渠道。它让个人价值不是被动陈列，而是持续发布、连接和增长。",
    closeTitle: "合作的不是一个职位，\n而是一套价值系统。",
    closeText: "我适合参与品牌增长、个人IP打造、城市循环体系、再生资源平台、ESG数据表达、新媒体矩阵和AI Agent落地。",
    scrollCue: "滚动启动个人价值链",
    caseSummaryAria: "项目数据摘要",
    caseSummary: "项目证据块覆盖品牌、城市循环、公益IP、数字产品、渠道资本与个人IP。",
    roleLabel: "角色",
    signalLabel: "数据",
    assetLabel: "沉淀资产",
    sourceLabel: "公开报道",
    moreCases: "以上为代表性案例，更多品牌、城市循环、数字产品、渠道与个人IP项目正在持续沉淀。",
    morePortfolio: "以上为部分项目投资与项目经历，更多项目可在合作沟通中按行业和目标进一步展开。",
    starName: "观星纪，",
    starAria: "观星纪数字IP视觉资产",
    starLineA: "是个人IP与",
    starLineB: "数字资产入口。",
    starPills: [
      "观星纪.StarEpoch",
      "数字分身",
      "5张专辑",
      "93首歌曲",
      "全社交媒体覆盖",
      "公众号",
      "视频号",
      "小红书",
      "抖音",
      "微博",
      "Facebook",
      "X",
      "Gemini",
      "Codex",
      "OpenClaw",
      "Hermes"
    ],
    wechatAlt: "Andy D 微信二维码",
    wechatTitle: "个人微信",
    wechatText: "扫码连接 Andy D",
    starepochAlt: "观星纪公众号二维码",
    starepochTitle: "观星纪.StarEpoch",
    starepochText: "公众号与内容资产入口",
    albumCta: "数字专辑 / StarEpoch",
    notionCta: "RRRS / Notion"
    ,
    identityTitle: "品牌、循环经济、AI Agent 与数字资产",
    identityHash: "哈希: 0xADB-GENESIS-STAREPOCH-1984-2026"
  },
  en: {
    heroLabel: "Dong Yunhe / Andy D / StarEpoch",
    heroTitle: "Value is not a resume.\nIt is a measurable asset system.",
    heroText: "I encode 20 years of brand, market, industry, channel, public welfare, content, AI and venture experience into a personal value chain that can be displayed, verified, scaled and converted into collaboration.",
    manifesto: "Every metric, project, IP and agent is an asset slice: not a static resume, but a living digital organism.",
    primaryCta: "View Value Chain",
    secondaryCta: "Enter StarEpoch",
    signalsTitle: "First, the signals:\nnumbers that form my value density.",
    signalsText: "Core achievements are encoded as Asset Blocks. They are not scattered experiences, but proof of brand, industry, channel, data, capital and AI assets.",
    assetsTitle: "The personal value chain,\nstructured into eight asset classes.",
    casesTitle: "Project portfolio:\nreusable outcomes behind functions.",
    casesText: "Instead of isolating one station or event, the work is grouped by brand, urban circular systems, public communication, digital products, channel capital and personal IP. Each item maps to an asset.",
    capitalTitle: "Project investments,\nas channel and judgment assets.",
    trustTitle: "Career, social roles and research\nform the trust layer.",
    researchTitle: "Policy, publications and public issues\nturn practice into public value.",
    skillsTitle: "The tool stack is not decoration.\nIt is execution capability.",
    starText: "It brings together the avatar site, official account, AI music, agent practice, knowledge base, automation workflows and social channels. Personal value is not passively displayed; it is published, connected and grown.",
    closeTitle: "Collaboration is not with a title,\nbut with a value system.",
    closeText: "I am suited for brand growth, personal IP building, urban circular systems, recycling platforms, ESG data storytelling, social media matrices and AI agent implementation.",
    scrollCue: "Scroll to activate the value chain",
    caseSummaryAria: "Case signal summary",
    caseSummary: "Proof blocks across brand, circular systems, public IP, digital products, channel capital and personal IP.",
    roleLabel: "Role",
    signalLabel: "Signal",
    assetLabel: "Asset",
    sourceLabel: "Public record",
    moreCases: "The above are representative cases. More brand, circular economy, digital product, channel and personal IP projects are continuously archived.",
    morePortfolio: "These are selected project investment and operating experiences. More can be expanded by industry and collaboration objective.",
    starName: "StarEpoch,",
    starAria: "StarEpoch digital IP visual asset",
    starLineA: "the front door to",
    starLineB: "personal digital assets.",
    starPills: [
      "StarEpoch",
      "Digital Avatar",
      "5 Albums",
      "93 Songs",
      "Full Social Coverage",
      "WeChat OA",
      "Channels",
      "Xiaohongshu",
      "Douyin",
      "Weibo",
      "Facebook",
      "X",
      "Gemini",
      "Codex",
      "OpenClaw",
      "Hermes"
    ],
    wechatAlt: "Andy D WeChat QR code",
    wechatTitle: "Personal WeChat",
    wechatText: "Scan to connect with Andy D",
    starepochAlt: "StarEpoch official account QR code",
    starepochTitle: "StarEpoch Official Account",
    starepochText: "Official account and content asset portal",
    albumCta: "Albums / StarEpoch",
    notionCta: "RRRS / Notion"
    ,
    identityTitle: "Brand, Circular Economy, AI Agents and Digital Assets",
    identityHash: "Hash: 0xADB-GENESIS-STAREPOCH-1984-2026"
  },
  ja: {
    heroLabel: "董昀赫 / Andy D / StarEpoch",
    heroTitle: "価値は履歴ではない。\n測定可能な資産システムである。",
    heroText: "20年にわたるブランド、マーケティング、産業、チャネル、公益、コンテンツ、AI、プロジェクト投資の経験を、表示・検証・成長・協業転換できる個人価値チェーンとして编码しています。",
    manifesto: "すべてのデータ、プロジェクト、IP、Agentは資産の断片です。静的な履歴書ではなく、成長し続けるデジタル生命体です。",
    primaryCta: "価値チェーンを見る",
    secondaryCta: "デジタルアルバムへ",
    signalsTitle: "まずシグナルを見る：\n価値密度を構成する数字。",
    signalsText: "主要な成果はすべてAsset Blockとして编码されています。散在する経験ではなく、ブランド、産業、チャネル、データ、資本、AI資産の証拠です。",
    assetsTitle: "個人価値チェーンは、\n八つの資産クラスで構成される。",
    casesTitle: "実プロジェクト群：\n職能の背後に、再利用可能な成果がある。",
    casesText: "単一の回収点やイベントだけを切り出さず、ブランド、都市循環、公益传播、デジタルプロダクト、チャネル資本、個人IPで分類しています。すべてが蓄積可能な資産に対応します。",
    capitalTitle: "プロジェクト投資は、\nチャネルと商業判断の資産でもある。",
    trustTitle: "経歴、社会的役割、研究活動が\n信頼の基盤を構成する。",
    researchTitle: "政策、論文、公共課題が\n産業経験を公共価値へ変える。",
    skillsTitle: "ツールスタックは飾りではない。\n実行システムである。",
    starText: "ここにはデジタル分身サイト、公式アカウント、AI音楽、Agent経験、ナレッジベース、自動化ワークフロー、SNSチャネルが統合されています。個人価値は受け身の展示ではなく、継続的に発信・接続・成長します。",
    closeTitle: "協業対象は肩書きではなく、\n一つの価値システムである。",
    closeText: "ブランド成長、個人IP構築、都市循環体系、再生資源平台、ESGデータ表現、新媒体マトリクス、AI Agent実装に適しています。",
    scrollCue: "スクロールで価値チェーンを起動",
    caseSummaryAria: "プロジェクトデータ概要",
    caseSummary: "証拠ブロックはブランド、都市循環、公益IP、デジタルプロダクト、チャネル資本、個人IPをカバーします。",
    roleLabel: "役割",
    signalLabel: "データ",
    assetLabel: "蓄積資産",
    sourceLabel: "公開報道",
    moreCases: "以上は代表的なケースです。さらに多くのブランド、都市循環、デジタルプロダクト、チャネル、個人IPプロジェクトが継続的に蓄積されています。",
    morePortfolio: "以上は一部のプロジェクト投資・運営経験です。より多くの案件は業界と協業目的に応じて展開できます。",
    starName: "StarEpoch、",
    starAria: "StarEpochデジタルIP視覚資産",
    starLineA: "個人IPと",
    starLineB: "デジタル資産の入口。",
    starPills: [
      "StarEpoch",
      "Digital Avatar",
      "5 Albums",
      "93 Songs",
      "Full SNS Coverage",
      "WeChat OA",
      "動画号",
      "小紅書",
      "Douyin",
      "Weibo",
      "Facebook",
      "X",
      "Gemini",
      "Codex",
      "OpenClaw",
      "Hermes"
    ],
    wechatAlt: "Andy D WeChat QRコード",
    wechatTitle: "個人WeChat",
    wechatText: "スキャンしてAndy Dとつながる",
    starepochAlt: "StarEpoch公式アカウントQRコード",
    starepochTitle: "StarEpoch公式アカウント",
    starepochText: "公式アカウントとコンテンツ資産入口",
    albumCta: "デジタルアルバム / StarEpoch",
    notionCta: "RRRS / Notion"
    ,
    identityTitle: "ブランド、循環経済、AI Agent、デジタル資産",
    identityHash: "Hash: 0xADB-GENESIS-STAREPOCH-1984-2026"
  }
} satisfies Record<Lang, Record<string, string | string[]>>;

function useMotionSystem(setProgress: (progress: number) => void) {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".app-shell");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stableMobileMotion = isMobileMotionDevice();
    const lightMotion = reduceMotion || stableMobileMotion;
    const canSmoothScroll = !lightMotion && window.matchMedia("(pointer: fine) and (min-width: 900px)").matches;
    let progressFrame = 0;
    let latestProgress = 0;
    let lastSyncedProgress = 0;
    let lastPercent = -1;
    let lenis: Lenis | null = null;

    const syncProgress = (value: number) => {
      latestProgress = value;
      if (progressFrame) return;

      progressFrame = window.requestAnimationFrame(() => {
        progressFrame = 0;
        const stageCount = 10;
        const stage = Math.min(stageCount - 1, Math.floor(latestProgress * stageCount));
        const stageProgress = latestProgress * stageCount - stage;
        const percent = Math.round(latestProgress * 100);
        lastSyncedProgress = latestProgress;

        if (shell) {
          shell.style.setProperty("--p", latestProgress.toFixed(4));
          shell.style.setProperty("--sp", stageProgress.toFixed(4));
          shell.style.setProperty("--turn", `${latestProgress * 720}deg`);
          shell.style.setProperty("--turn-rev", `${latestProgress * -720}deg`);
          shell.style.setProperty("--drift", `${stageProgress * 150}px`);
          shell.style.setProperty("--read-scale", Math.max(0.06, latestProgress).toFixed(4));
          shell.style.setProperty("--read-top", `${latestProgress * 108}px`);
        }

        if (percent !== lastPercent) {
          lastPercent = percent;
          setProgress(percent / 100);
        }
      });
    };

    const syncFromNativeScroll = () => {
      const root = document.scrollingElement ?? document.documentElement;
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      const nativeProgress = Math.min(1, Math.max(0, root.scrollTop / maxScroll));
      syncProgress(nativeProgress);
    };

    if (canSmoothScroll) {
      lenis = new Lenis({
        lerp: 0.15,
        wheelMultiplier: 0.98,
        touchMultiplier: 1.12,
        smoothWheel: true,
        syncTouch: false
      });
      lenis.on("scroll", ScrollTrigger.update);
    }

    const rafLenis = (time: number) => {
      lenis?.raf(time * 1000);
    };

    if (lenis) {
      gsap.ticker.add(rafLenis);
      gsap.ticker.lagSmoothing(0);
    }

    window.addEventListener("scroll", syncFromNativeScroll, { passive: true });
    window.addEventListener("resize", syncFromNativeScroll);

    const ctx = gsap.context(() => {
      const cardSelector = ".stat-card, .asset-specimen, .proof-card, .venture-card, .timeline-item, .role-card, .skill-card, .case-index, .qr-specimen";
      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".story",
          start: "top top",
          end: "bottom bottom",
          scrub: lightMotion ? false : 0.86,
          onUpdate: (self) => syncProgress(self.progress)
        }
      });

      const starPath = document.querySelector<SVGPathElement>(".starfall-path");
      const starTrail = document.querySelector<SVGPathElement>(".star-trail");
      if (starPath && starTrail && document.documentElement.dataset.legacyStarfall === "true") {
        const pathLength = starTrail.getTotalLength();
        gsap.set(starTrail, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.set(".falling-star", {
          scale: 0.58,
          transformOrigin: "50% 50%",
          motionPath: {
            path: starPath,
            align: starPath,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 0
          }
        } as gsap.TweenVars);

        master
          .to(
            ".falling-star",
            {
              motionPath: {
                path: starPath,
                align: starPath,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
                start: 0,
                end: 1
              },
              scale: 0.92,
              duration: 1,
              ease: "none",
              force3D: true,
              immediateRender: false
            } as gsap.TweenVars,
            0
          )
          .to(starTrail, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0)
          .to(starTrail, { strokeWidth: 2.15, opacity: 0.62, duration: 0.16, ease: "sine.inOut" }, 0.06)
          .to(starTrail, { strokeWidth: 1.1, opacity: 0.36, duration: 0.18, ease: "sine.inOut" }, 0.22)
          .to(starTrail, { strokeWidth: 2.55, opacity: 0.58, duration: 0.18, ease: "sine.inOut" }, 0.42)
          .to(starTrail, { strokeWidth: 1.15, opacity: 0.34, duration: 0.18, ease: "sine.inOut" }, 0.62)
          .to(starTrail, { strokeWidth: 2.2, opacity: 0.5, duration: 0.16, ease: "sine.inOut" }, 0.79)
          .to(starTrail, { strokeWidth: 1.05, opacity: 0.3, duration: 0.2, ease: "sine.inOut" }, 0.92);
      }

      if (false) {
        master
        .set(".star-elastic, .fluid-metaballs, .fluid-main, .fluid-unit, .fluid-rim, .star-comet-tail", { transformOrigin: "50% 50%", force3D: true }, 0)
        .addLabel("flowStart", 0.02)
        .addLabel("turnA", 0.2)
        .addLabel("turnB", 0.38)
        .addLabel("turnC", 0.58)
        .addLabel("turnD", 0.78)
        .addLabel("settle", 0.92)
        .to(".star-elastic", { scaleX: 0.98, scaleY: 1.04, rotation: -1, duration: 0.1, ease: "sine.inOut" }, 0.02)
        .to(".star-elastic", { scaleX: 1.13, scaleY: 0.88, rotation: -2.2, duration: 0.12, ease: "sine.inOut" }, 0.13)
        .to(".star-elastic", { scaleX: 1.18, scaleY: 0.84, rotation: -1.5, duration: 0.11, ease: "sine.inOut" }, 0.25)
        .to(".star-elastic", { scaleX: 0.96, scaleY: 1.07, rotation: 6.5, duration: 0.12, ease: "sine.inOut" }, 0.38)
        .to(".star-elastic", { scaleX: 1.03, scaleY: 0.98, rotation: 12, duration: 0.1, ease: "sine.inOut" }, 0.51)
        .to(".star-elastic", { scaleX: 1.08, scaleY: 0.93, rotation: -8, duration: 0.12, ease: "sine.inOut" }, 0.62)
        .to(".star-elastic", { scaleX: 0.97, scaleY: 1.06, rotation: -13, duration: 0.11, ease: "sine.inOut" }, 0.76)
        .to(".star-elastic", { scaleX: 1.01, scaleY: 1, rotation: 0, duration: 0.11, ease: "sine.inOut" }, 0.89)
        .to(".fluid-main", { scaleX: 1.02, scaleY: 0.99, duration: 0.1, ease: "sine.inOut" }, 0.02)
        .to(".fluid-main", { scaleX: 1.1, scaleY: 0.9, duration: 0.12, ease: "sine.inOut" }, 0.13)
        .to(".fluid-main", { scaleX: 1.16, scaleY: 0.86, duration: 0.11, ease: "sine.inOut" }, 0.25)
        .to(".fluid-main", { scaleX: 0.95, scaleY: 1.08, duration: 0.12, ease: "sine.inOut" }, 0.38)
        .to(".fluid-main", { scaleX: 1.02, scaleY: 0.98, duration: 0.1, ease: "sine.inOut" }, 0.51)
        .to(".fluid-main", { scaleX: 1.07, scaleY: 0.93, duration: 0.12, ease: "sine.inOut" }, 0.62)
        .to(".fluid-main", { scaleX: 0.96, scaleY: 1.05, duration: 0.11, ease: "sine.inOut" }, 0.76)
        .to(".fluid-main", { scaleX: 1, scaleY: 1, duration: 0.11, ease: "sine.inOut" }, 0.89)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.breathTall }, duration: 0.08, ease: "sine.inOut" } as gsap.TweenVars, 0.02)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.straightLead }, duration: 0.08, ease: "power1.inOut" } as gsap.TweenVars, 0.12)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.straightLong }, duration: 0.1, ease: "power1.inOut" } as gsap.TweenVars, 0.21)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.straightRecover }, duration: 0.08, ease: "sine.inOut" } as gsap.TweenVars, 0.32)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.compress }, duration: 0.07, ease: "sine.inOut" } as gsap.TweenVars, 0.41)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.bendClockwise }, duration: 0.08, ease: "power1.inOut" } as gsap.TweenVars, 0.49)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.bendClockwiseLong }, duration: 0.08, ease: "power1.inOut" } as gsap.TweenVars, 0.58)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.bendClockwiseHook }, duration: 0.08, ease: "sine.inOut" } as gsap.TweenVars, 0.67)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.compress }, duration: 0.07, ease: "sine.inOut" } as gsap.TweenVars, 0.76)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.bendCounter }, duration: 0.08, ease: "power1.inOut" } as gsap.TweenVars, 0.82)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.bendCounterLong }, duration: 0.06, ease: "power1.inOut" } as gsap.TweenVars, 0.91)
        .to(".fluid-main-shape", { attr: { d: inkDropPaths.rest }, duration: 0.03, ease: "sine.inOut" } as gsap.TweenVars, 0.97)
        .to(".ink-highlight-main", { x: -3, y: 0, scaleX: 0.92, scaleY: 1.04, rotation: 8, duration: 0.12, ease: "sine.inOut" }, 0.02)
        .to(".ink-highlight-main", { x: 13, y: -2, scaleX: 1.34, scaleY: 0.72, rotation: -10, duration: 0.18, ease: "sine.inOut" }, 0.13)
        .to(".ink-highlight-main", { x: 22, y: -1, scaleX: 1.42, scaleY: 0.64, rotation: -7, duration: 0.14, ease: "sine.inOut" }, 0.28)
        .to(".ink-highlight-main", { x: 2, y: -8, scaleX: 0.84, scaleY: 1.2, rotation: 26, duration: 0.18, ease: "sine.inOut" }, 0.44)
        .to(".ink-highlight-main", { x: -8, y: -7, scaleX: 0.88, scaleY: 1.14, rotation: -22, duration: 0.16, ease: "sine.inOut" }, 0.72)
        .to(".ink-highlight-main", { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: -4, duration: 0.08, ease: "sine.inOut" }, 0.92)
        .to(".fluid-metaballs", { x: -3, y: 10, scaleX: 1.08, scaleY: 0.94, rotation: -4, duration: 0.22, ease: "power1.inOut" }, 0.05)
        .to(".fluid-metaballs", { x: 5, y: -5, scaleX: 0.98, scaleY: 1.03, rotation: 6, duration: 0.24, ease: "power1.inOut" }, 0.31)
        .to(".fluid-metaballs", { x: -6, y: 13, scaleX: 1.12, scaleY: 0.9, rotation: -7, duration: 0.24, ease: "power1.inOut" }, 0.57)
        .to(".fluid-metaballs", { x: 0, y: 5, scaleX: 1.02, scaleY: 0.98, rotation: -2, duration: 0.24, ease: "power1.inOut" }, 0.84)
        .to(".fluid-lobe-a", { x: -20, y: 11, scale: 1.1, opacity: 0.72, duration: 0.22, ease: "power1.inOut" }, 0.08)
        .to(".fluid-lobe-a", { x: -8, y: -8, scale: 0.92, opacity: 0.62, duration: 0.24, ease: "power1.inOut" }, 0.36)
        .to(".fluid-lobe-a", { x: -17, y: 13, scale: 1.08, opacity: 0.7, duration: 0.24, ease: "power1.inOut" }, 0.64)
        .to(".fluid-lobe-b", { x: 16, y: -11, scale: 1.06, opacity: 0.7, duration: 0.22, ease: "power1.inOut" }, 0.1)
        .to(".fluid-lobe-b", { x: 6, y: 9, scale: 0.92, opacity: 0.6, duration: 0.24, ease: "power1.inOut" }, 0.39)
        .to(".fluid-lobe-b", { x: 18, y: -8, scale: 1.04, opacity: 0.68, duration: 0.24, ease: "power1.inOut" }, 0.68)
        .to(".fluid-lobe-c", { x: -4, y: -18, scale: 0.9, opacity: 0.55, duration: 0.22, ease: "power1.inOut" }, 0.14)
        .to(".fluid-lobe-c", { x: 7, y: 9, scale: 1.08, opacity: 0.65, duration: 0.24, ease: "power1.inOut" }, 0.43)
        .to(".fluid-lobe-c", { x: -6, y: -16, scale: 0.92, opacity: 0.58, duration: 0.24, ease: "power1.inOut" }, 0.72)
        .to(".fluid-lobe-d", { x: 8, y: 18, scale: 1.08, opacity: 0.64, duration: 0.22, ease: "power1.inOut" }, 0.16)
        .to(".fluid-lobe-d", { x: -8, y: -8, scale: 0.9, opacity: 0.55, duration: 0.24, ease: "power1.inOut" }, 0.45)
        .to(".fluid-lobe-d", { x: 9, y: 16, scale: 1.04, opacity: 0.62, duration: 0.24, ease: "power1.inOut" }, 0.74)
        .to(".fluid-lobe-e", { x: -42, y: 8, scale: 1.18, opacity: 0.38, duration: 0.24, ease: "power1.inOut" }, 0.2)
        .to(".fluid-lobe-e", { x: -16, y: 4, scale: 0.82, opacity: 0.24, duration: 0.24, ease: "power1.inOut" }, 0.52)
        .to(".fluid-lobe-e", { x: -34, y: 7, scale: 1, opacity: 0.3, duration: 0.16, ease: "power1.inOut" }, 0.82)
        .to(".fluid-lobe-f", { x: 38, y: -7, scale: 1.08, opacity: 0.34, duration: 0.24, ease: "power1.inOut" }, 0.26)
        .to(".fluid-lobe-f", { x: 14, y: -4, scale: 0.8, opacity: 0.22, duration: 0.24, ease: "power1.inOut" }, 0.58)
        .to(".fluid-lobe-f", { x: 29, y: -6, scale: 0.96, opacity: 0.28, duration: 0.14, ease: "power1.inOut" }, 0.86)
        .to(".fluid-strand-a", { x: -78, y: 16, scaleX: 1.82, scaleY: 0.52, rotation: -4, opacity: 0.34, transformOrigin: "100% 50%", duration: 0.22, ease: "power1.inOut" }, 0.08)
        .to(".fluid-strand-a", { x: -22, y: -6, scaleX: 0.82, scaleY: 0.92, rotation: 4, opacity: 0.16, duration: 0.24, ease: "power1.inOut" }, 0.42)
        .to(".fluid-strand-a", { x: -68, y: 18, scaleX: 1.64, scaleY: 0.56, rotation: -8, opacity: 0.28, duration: 0.26, ease: "power1.inOut" }, 0.66)
        .to(".fluid-strand-b", { x: 58, y: -14, scaleX: 1.46, scaleY: 0.58, rotation: 6, opacity: 0.26, transformOrigin: "0% 50%", duration: 0.22, ease: "power1.inOut" }, 0.18)
        .to(".fluid-strand-b", { x: 16, y: 5, scaleX: 0.82, scaleY: 0.96, rotation: -5, opacity: 0.14, duration: 0.24, ease: "power1.inOut" }, 0.52)
        .to(".fluid-strand-b", { x: 50, y: -12, scaleX: 1.34, scaleY: 0.64, rotation: 8, opacity: 0.22, duration: 0.2, ease: "power1.inOut" }, 0.78)
        .to(".fluid-rim", { x: -3, y: 8, rotation: -8, scaleX: 1.12, scaleY: 0.88, opacity: 0.14, duration: 0.24, ease: "sine.inOut" }, 0.14)
        .to(".fluid-rim", { x: 4, y: -5, rotation: 8, scaleX: 0.94, scaleY: 1.02, opacity: 0.08, duration: 0.26, ease: "sine.inOut" }, 0.48)
        .to(".fluid-rim", { x: -2, y: 5, rotation: -4, scaleX: 1.04, scaleY: 0.94, opacity: 0.12, duration: 0.2, ease: "sine.inOut" }, 0.78)
        .to(".star-comet-tail", { scaleX: 2.18, scaleY: 0.5, skewX: -5, opacity: 0.22, transformOrigin: "100% 50%", duration: 0.2, ease: "power1.inOut" }, 0.06)
        .to(".star-comet-tail", { scaleX: 0.86, scaleY: 0.9, skewX: 5, opacity: 0.08, duration: 0.24, ease: "power1.inOut" }, 0.39)
        .to(".star-comet-tail", { scaleX: 1.92, scaleY: 0.54, skewX: -4, opacity: 0.18, duration: 0.24, ease: "power1.inOut" }, 0.64)
        .to(".star-comet-tail", { scaleX: 1.08, scaleY: 0.76, skewX: -1, opacity: 0.1, duration: 0.1, ease: "power1.inOut" }, 0.9);
      }

      master.to(".portrait-card", { yPercent: 5, scale: 0.985, force3D: true }, 0);

      if (lightMotion) {
        gsap.set(".reveal", { autoAlpha: 1, y: 0, clearProps: "transform" });
        gsap.set(cardSelector, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 1,
          clearProps: "transform"
        });
      } else {
        gsap.set(".reveal", { autoAlpha: 0, y: 34, force3D: true });
        gsap.set(".hero-scene .reveal", { autoAlpha: 1, y: 0, force3D: true });
        gsap.set(cardSelector, {
          autoAlpha: 0,
          x: (index) => [-180, 190, -120, 140, 0, -90, 110][index % 7],
          y: (index) => [-90, 76, 132, -120, 160, -64, 96][index % 7],
          z: (index) => [-240, -160, -320, -110, -260][index % 5],
          rotationX: (index) => [26, -18, 32, -24, 14][index % 5],
          rotationY: (index) => [-34, 28, -18, 36, -26, 16][index % 6],
          rotationZ: (index) => [-8, 6, -4, 9, -6, 4][index % 6],
          scale: 0.72,
          transformOrigin: "50% 55%",
          force3D: true
        });
      }
      gsap.set(".timeline-progress", { scaleY: 0, transformOrigin: "top center" });

      if (!lightMotion) {
        ScrollTrigger.batch(".reveal", {
          start: "top 84%",
          end: "bottom 12%",
          interval: 0.08,
          batchMax: 6,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1.05,
              ease: "power3.out",
              stagger: { each: 0.045, from: "start" },
              overwrite: "auto"
            });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease: "power2.out",
              stagger: 0.025,
              overwrite: "auto"
            });
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, {
              autoAlpha: 0,
              y: 30,
              duration: 0.42,
              ease: "power2.out",
              stagger: 0.018,
              overwrite: "auto"
            });
          }
        });

        ScrollTrigger.batch(cardSelector, {
          start: "top 88%",
          interval: 0.08,
          batchMax: 8,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              duration: 1.18,
              ease: "expo.out",
              stagger: { each: 0.055, from: "random" },
              overwrite: "auto"
            });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              stagger: { each: 0.03, from: "edges" },
              overwrite: "auto"
            });
          }
        });
      }

      gsap.fromTo(
        ".portrait-card",
        { autoAlpha: 0, y: 54, scale: 0.985, rotation: -0.8 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: lightMotion ? 0.01 : 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-scene",
            start: "top 62%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.to(".timeline-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 72%",
          end: "bottom 42%",
          scrub: lightMotion ? false : 0.55
        }
      });

      if (!lightMotion) {
        gsap.to(".ip-inline-badge img", {
          y: -5,
          rotation: 2.4,
          duration: 3.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

      }

      gsap.utils.toArray<HTMLElement>(".scene").forEach((scene) => {
        gsap.fromTo(
          scene,
          { "--section-light": 0 } as gsap.TweenVars,
          {
            "--section-light": 1,
            duration: lightMotion ? 0.01 : 1,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top 72%",
              end: "bottom 28%",
              scrub: lightMotion ? false : 0.8
            }
          } as gsap.TweenVars
        );
      });

      syncProgress(master.scrollTrigger?.progress ?? 0);
    });

    const refresh = window.setTimeout(() => {
      ScrollTrigger.refresh();
      syncFromNativeScroll();
    }, 200);
    const initialSync = window.setTimeout(syncFromNativeScroll, 420);
    window.requestAnimationFrame(syncFromNativeScroll);

    return () => {
      window.clearTimeout(refresh);
      window.clearTimeout(initialSync);
      if (progressFrame) window.cancelAnimationFrame(progressFrame);
      window.removeEventListener("scroll", syncFromNativeScroll);
      window.removeEventListener("resize", syncFromNativeScroll);
      if (lenis) {
        gsap.ticker.remove(rafLenis);
        lenis.destroy();
      }
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setProgress]);
}

function LivingSystem() {
  const years = Array.from({ length: 2026 - 1984 + 1 }, (_, index) => 1984 + index);
  const keyYears = new Set([1984, 2003, 2009, 2014, 2022, 2025, 2026]);
  const keyYearLayout: Partial<Record<number, { x: number; y: number; rot: number }>> = {
    1984: { x: 4, y: 64, rot: -8 },
    2003: { x: 34, y: 47, rot: -3 },
    2009: { x: 48, y: 34, rot: 3 },
    2014: { x: 61, y: 50, rot: 6 },
    2022: { x: 76, y: 38, rot: -5 },
    2025: { x: 88, y: 58, rot: 3 },
    2026: { x: 96, y: 42, rot: -2 }
  };

  return (
    <div className="living-system" aria-hidden="true">
      <svg className="cinema-orbit" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice">
        <path
          className="orbit-path orbit-path-main"
          d="M 58 512 C 196 250 374 616 532 344 C 706 46 846 188 1138 110"
        />
        <path
          className="orbit-path orbit-path-secondary"
          d="M 124 158 C 286 246 410 96 580 214 C 792 360 932 420 1110 302"
        />
        <circle className="orbit-runner" cx="58" cy="512" r="6" />
      </svg>
      <div className="year-orbit">
        {years.map((year, index) => {
          const t = index / (years.length - 1);
          const keyPosition = keyYearLayout[year];
          const tier = (index % 5) - 2;
          const x = keyPosition?.x ?? 4 + t * 92;
          const y = keyPosition?.y ?? 58 - Math.sin(t * Math.PI * 1.08) * 24 + tier * 3.8;
          const rot = keyPosition?.rot ?? -7 + Math.sin(t * Math.PI * 3.2) * 8;
          const scale = keyYears.has(year) ? 1 : 0.46 + (index % 4) * 0.1;
          const opacity = keyYears.has(year) ? 1 : 0.18 + (index % 5) * 0.045;
          return (
            <span
              className={keyYears.has(year) ? "year-specimen key-year" : "year-specimen"}
              key={year}
              style={
                {
                  "--x": `${x}%`,
                  "--y": `${y}%`,
                  "--rot": `${rot}deg`,
                  "--scale": scale,
                  "--year-opacity": opacity
                } as StyleVars
              }
            >
              <i />
              <b>{year}</b>
            </span>
          );
        })}
      </div>
      <div className="organism">
        <span className="membrane membrane-a" />
        <span className="membrane membrane-b" />
        <span className="membrane membrane-c" />
        {Array.from({ length: 12 }).map((_, index) => (
          <span className={`asset-slice slice-${index + 1}`} key={index} />
        ))}
        <span className="nucleus" />
      </div>
      <div className="ledger-ribbon ribbon-a" />
      <div className="ledger-ribbon ribbon-b" />
      <div className="living-label label-a">LIVING VALUE ORGANISM / 1984-2026</div>
      <div className="living-label label-b">ENCODED ASSET SPECIMENS / STAR EPOCH</div>
    </div>
  );
}

function useActiveStage() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const sectionIds = ["top", "signals", "assets", "cases", "capital", "trust", "research", "skills", "starepoch", "contact"];
    const triggers = sectionIds
      .map((id, index) => {
        const element = document.getElementById(id);
        if (!element) return null;
        return ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveStage(index),
          onEnterBack: () => setActiveStage(index)
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return activeStage;
}

function VisualStage({ activeStage }: { activeStage: number }) {
  const stages = ["GENESIS", "SIGNAL", "ASSETS", "PROOF", "CAPITAL", "TRUST", "RESEARCH", "TOOLS", "STAREPOCH", "CONTACT"];
  const displayStage = Math.min(stages.length - 1, activeStage);
  const nodes = [
    [12, 70],
    [21, 34],
    [33, 57],
    [44, 24],
    [55, 66],
    [66, 38],
    [78, 18],
    [88, 56],
    [72, 78],
    [38, 82],
    [18, 52],
    [58, 14]
  ];

  return (
    <div
      className={`visual-stage stage-${displayStage}`}
      aria-hidden="true"
    >
      <span className="stage-label">{stages[displayStage]}</span>
      <div className="stage-map" />
      <div className="stage-orb orb-a" />
      <div className="stage-orb orb-b" />
      <div className="stage-ledger">
        {Array.from({ length: 8 }).map((_, index) => (
          <i key={index} style={{ "--i": index, "--h": `${38 + index * 6}%` } as StyleVars} />
        ))}
      </div>
      <div className="stage-network">
        {nodes.map(([x, y], index) => (
          <i key={`${x}-${y}`} style={{ "--x": `${x}%`, "--y": `${y}%`, "--i": index } as StyleVars} />
        ))}
      </div>
      <div className="stage-specimens">
        {Array.from({ length: 9 }).map((_, index) => (
          <i key={index} style={{ "--i": index } as StyleVars} />
        ))}
      </div>
      <div className="stage-circuit" />
    </div>
  );
}

function CinematicStarfall({ activeStage }: { activeStage: number }) {
  const milestones = [
    { year: 1984, label: "GENESIS", x: 9, y: 9 },
    { year: 2003, label: "ART", x: 38, y: 18 },
    { year: 2009, label: "JAPAN", x: 76, y: 28 },
    { year: 2014, label: "BRAND", x: 24, y: 46 },
    { year: 2018, label: "MARKET", x: 65, y: 56 },
    { year: 2021, label: "CITYMINE", x: 15, y: 70 },
    { year: 2022, label: "CIRCULAR", x: 82, y: 72 },
    { year: 2024, label: "AGENT", x: 42, y: 86 },
    { year: 2025, label: "STAREPOCH", x: 60, y: 90 },
    { year: 2026, label: "NOW", x: 94, y: 72 }
  ];
  const displayStage = Math.min(milestones.length - 1, activeStage);
  const milestoneMap = new Map(milestones.map((milestone) => [milestone.year, milestone]));
  const yearTrail = Array.from({ length: 2026 - 1984 + 1 }, (_, index) => {
    const year = 1984 + index;
    const progress = index / (2026 - 1984);
    const milestone = milestoneMap.get(year);
    const driftX = 4 + progress * 92 + Math.sin(progress * Math.PI * 5.1) * 11;
    const driftY = 7 + progress * 88 + Math.cos(progress * Math.PI * 3.7) * 8;
    const x = milestone ? milestone.x : driftX;
    const y = milestone ? milestone.y : driftY;
    const scale = milestone ? 1.18 : 0.34 + ((index * 7) % 11) / 30;
    const alpha = milestone ? 0.3 : 0.028 + ((index * 5) % 9) / 230;

    return {
      year,
      label: milestone?.label,
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(5, Math.min(96, y)),
      scale,
      alpha
    };
  });

  return (
    <div className={`starfall-system starfall-stage-${displayStage}`} aria-hidden="true">
      <div className="starfall-prologue">
        <div className="prologue-stars">
          {Array.from({ length: 56 }).map((_, index) => {
            const x = (index * 37) % 100;
            const y = (index * 19) % 72;
            const size = 1 + (index % 3);
            const alpha = 0.28 + (index % 7) * 0.08;
            return (
              <i
                key={index}
                style={{ "--x": `${x}%`, "--y": `${y}%`, "--s": `${size}px`, "--a": alpha } as StyleVars}
              />
            );
          })}
        </div>
      </div>

      <svg className="starfall-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <radialGradient id="cinematicStarCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2b2c29" stopOpacity="0.96" />
            <stop offset="26%" stopColor="#373833" stopOpacity="0.72" />
            <stop offset="58%" stopColor="#5f5b53" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2b2c29" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cinematicStarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2e302d" stopOpacity="0.2" />
            <stop offset="42%" stopColor="#5f5b53" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2e302d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cinematicStarBeam" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#2b2c29" stopOpacity="0" />
            <stop offset="34%" stopColor="#3b3d38" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#252622" stopOpacity="0.46" />
            <stop offset="66%" stopColor="#3b3d38" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2b2c29" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="inkDropSkin" cx="35%" cy="24%" r="76%">
            <stop offset="0%" stopColor="#4b4d47" stopOpacity="0.96" />
            <stop offset="18%" stopColor="#20221f" stopOpacity="0.96" />
            <stop offset="62%" stopColor="#090a09" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#010101" stopOpacity="0.88" />
          </radialGradient>
          <radialGradient id="inkDropHighlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="cinematicStarBloom" x="-260%" y="-260%" width="620%" height="620%">
            <feGaussianBlur stdDeviation="8" result="softGlow" />
            <feGaussianBlur stdDeviation="22" result="wideGlow" />
            <feMerge>
              <feMergeNode in="wideGlow" />
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fluidGoo" x="-180%" y="-180%" width="460%" height="460%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <filter id="fluidGlow" x="-220%" y="-220%" width="540%" height="540%">
            <feGaussianBlur stdDeviation="10" result="soft" />
            <feGaussianBlur stdDeviation="22" result="wide" />
            <feMerge>
              <feMergeNode in="wide" />
              <feMergeNode in="soft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="starfall-path"
          d="M 520 -130 C 520 70 420 156 462 230 C 528 350 690 304 640 430 C 600 560 360 542 418 665 C 476 800 724 758 650 890 C 610 952 548 972 520 1010"
        />
        <path
          className="star-trail"
          d="M 520 -130 C 520 70 420 156 462 230 C 528 350 690 304 640 430 C 600 560 360 542 418 665 C 476 800 724 758 650 890 C 610 952 548 972 520 1010"
        />
        <g className="falling-star">
          <path className="star-comet-tail" d="M -8 0 C -82 -34 -166 -20 -250 -2 C -166 18 -82 35 -8 0 Z" />
          <g className="star-elastic">
            <g className="fluid-velocity">
              <foreignObject className="ink-video-object" x="-150" y="-150" width="300" height="300">
                <video
                  className="ink-drop-motion"
                  src="./ink-drop-motion.webm?v=1"
                  poster="./ink-drop-poster.png?v=1"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              </foreignObject>
              <g className="star-dust">
                <circle cx="-72" cy="20" r="3.2" />
                <circle cx="-46" cy="-30" r="2.2" />
                <circle cx="52" cy="26" r="3" />
                <circle cx="76" cy="-16" r="2" />
              </g>
            </g>
          </g>
        </g>
      </svg>

      <div className="star-year-rail">
        {yearTrail.map((milestone, index) => {
          const isKey = Boolean(milestone.label);

          return (
          <span
            className={[
              "star-year-node",
              isKey ? "is-key" : "is-faint"
            ]
              .filter(Boolean)
              .join(" ")}
            key={milestone.year}
            style={
              {
                "--x": `${milestone.x}%`,
                "--y": `${milestone.y}%`,
                "--i": index,
                "--ys": milestone.scale,
                "--yo": milestone.alpha,
                "--delay": `${index * -0.16}s`,
                "--ripple-delay": `${index * -0.22}s`
              } as StyleVars
            }
          >
            <i />
            <b>{milestone.year}</b>
            {milestone.label ? <em>{milestone.label}</em> : null}
          </span>
          );
        })}
      </div>
    </div>
  );
}

function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  return (
    <div className="language-toggle" role="group" aria-label="Language">
      <Globe2 size={16} />
      {languageOptions.map((option) => (
        <button
          aria-pressed={lang === option.code}
          className={lang === option.code ? "active" : ""}
          data-short={option.code === "cn" ? "中" : option.code === "ja" ? "日" : "EN"}
          key={option.code}
          onClick={() => setLang(option.code)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function EncodedCard({
  code,
  title,
  proof,
  children,
  className = ""
}: {
  code: string;
  title: string;
  proof?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`asset-specimen ${className}`}>
      <div className="shape-safe">
        <div className="block-meta">
          <span>{code}</span>
          <span>{proof ?? "VERIFIED"}</span>
        </div>
        <h3>{title}</h3>
        <div className="card-body">{children}</div>
      </div>
    </article>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [progress, setProgress] = useState(0);
  const [mobileMotion] = useState(() => isMobileMotionDevice());
  const [starepochIntroStarted, setStarepochIntroStarted] = useState(() => mobileMotion);
  const [starepochIntroComplete, setStarepochIntroComplete] = useState(() => mobileMotion);
  const starepochVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeStage = useActiveStage();
  useMotionSystem(setProgress);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || mobileMotion) {
      setStarepochIntroStarted(true);
      setStarepochIntroComplete(true);
      return;
    }

    const section = document.getElementById("starepoch");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.36) {
          setStarepochIntroStarted(true);
          observer.disconnect();
        }
      },
      { threshold: [0.24, 0.36, 0.52] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [mobileMotion]);

  useEffect(() => {
    if (!starepochIntroStarted || starepochIntroComplete) return;

    const video = starepochVideoRef.current;
    const fallback = window.setTimeout(() => setStarepochIntroComplete(true), 6200);

    if (video) {
      video.currentTime = 0;
      const playResult = video.play();
      playResult?.catch(() => {
        window.setTimeout(() => setStarepochIntroComplete(true), 1800);
      });
    }

    return () => window.clearTimeout(fallback);
  }, [starepochIntroStarted, starepochIntroComplete]);

  useEffect(() => {
    const wraps = Array.from(document.querySelectorAll<HTMLElement>(".starepoch-pills"));
    if (!wraps.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lightMotion = reduceMotion || mobileMotion;
    const cleanupHandlers: Array<() => void> = [];

    wraps.forEach((wrap) => {
      const pills = Array.from(wrap.querySelectorAll<HTMLElement>(".signal-pill"));
      if (!pills.length) return;

      gsap.killTweensOf(pills);
      if (lightMotion) {
        gsap.set(pills, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          clearProps: "transform"
        });
        return;
      }

      gsap.set(pills, {
        autoAlpha: 0,
        x: (index) => [-210, 180, -145, 160, -115, 135, -90, 110][index % 8],
        y: (index) => [-76, -58, 74, 62, -44, 50, 36, -32][index % 8],
        scale: 0.86,
        rotation: (index) => [-8, 6, -5, 8, -4, 5, -3, 4][index % 8],
        transformOrigin: "50% 50%",
        force3D: true
      });

      if (starepochIntroComplete) {
        gsap.to(pills, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          delay: 0.16,
          duration: 1.05,
          ease: "expo.out",
          stagger: { amount: 0.58, from: "center" },
          overwrite: "auto"
        });
      }

      if (!starepochIntroComplete) return;

      const xTo = pills.map((pill) => gsap.quickTo(pill, "x", { duration: 0.42, ease: "power3.out" }));
      const yTo = pills.map((pill) => gsap.quickTo(pill, "y", { duration: 0.42, ease: "power3.out" }));
      const scaleTo = pills.map((pill) => gsap.quickTo(pill, "scale", { duration: 0.42, ease: "power3.out" }));
      const rotationTo = pills.map((pill) => gsap.quickTo(pill, "rotation", { duration: 0.42, ease: "power3.out" }));

      const resetPills = () => {
        pills.forEach((_, index) => {
          xTo[index](0);
          yTo[index](0);
          scaleTo[index](1);
          rotationTo[index](0);
        });
      };

      const avoidPointer = (event: PointerEvent) => {
        pills.forEach((pill, index) => {
          const rect = pill.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = centerX - event.clientX;
          const dy = centerY - event.clientY;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const radius = 168;

          if (distance > radius) {
            xTo[index](0);
            yTo[index](0);
            scaleTo[index](1);
            rotationTo[index](0);
            return;
          }

          const force = Math.pow(1 - distance / radius, 1.65);
          const angle = Math.atan2(dy, dx);
          xTo[index](Math.cos(angle) * force * 58);
          yTo[index](Math.sin(angle) * force * 34);
          scaleTo[index](1 + force * 0.05);
          rotationTo[index](Math.sin(angle) * force * 9);
        });
      };

      wrap.addEventListener("pointermove", avoidPointer, { passive: true });
      wrap.addEventListener("pointerleave", resetPills);
      cleanupHandlers.push(() => {
        wrap.removeEventListener("pointermove", avoidPointer);
        wrap.removeEventListener("pointerleave", resetPills);
        gsap.killTweensOf(pills);
      });
    });

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup());
    };
  }, [lang, mobileMotion, starepochIntroComplete]);

  const copy = pageCopy[lang];
  const text = (value: Copy) => value[lang];

  const progressLabel = `${Math.round(progress * 100).toString().padStart(2, "0")}%`;

  return (
    <main className="app-shell" lang={languageHtml[lang]}>
      <CinematicStarfall activeStage={activeStage} />
      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Andy D Digital Asset Lab">
          <span className="brand-logo">
            <img src="./andy-d-symbol.png?v=1" alt="" />
          </span>
          <span className="brand-code">ADB</span>
          <small>VALUE CHAIN</small>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              {text(item.label)}
            </a>
          ))}
        </nav>
        <LanguageToggle lang={lang} setLang={setLang} />
      </header>

      <div className="scroll-index" aria-hidden="true">
        <span>PRE-READ</span>
        <div className="scroll-track">
          <i />
          <b>
            <img src="./starepoch-creature-transparent.png?v=4" alt="" />
          </b>
        </div>
        <strong>{progressLabel}</strong>
      </div>

      <div className="story" id="top">
        <section className="scene hero-scene">
          <div className="content hero-grid">
            <div className="hero-copy">
              <p className="eyebrow reveal">ADB-ID-001 / GENESIS BLOCK</p>
              <h1
                aria-label={lang === "cn" ? copy.heroTitle.replace(/\n/g, " ") : undefined}
                className={lang === "cn" ? "hero-title-cn reveal" : "reveal"}
              >
                {lang === "cn" ? (
                  <span className="hero-title-cn-layout" aria-hidden="true">
                    <span className="hero-calligraphy">价值</span>
                    <span className="hero-title-rest">
                      不只是经历，
                      <br />
                      而是可量化的资产。
                    </span>
                  </span>
                ) : (
                  copy.heroTitle
                )}
              </h1>
              <p className="hero-label reveal">{copy.heroLabel}</p>
              <p className="hero-text reveal">{copy.heroText}</p>
              <p className="manifesto-line reveal">{copy.manifesto}</p>
              <div className="hero-actions reveal">
                <a className="button primary" href="#signals">
                  {copy.primaryCta}
                  <ArrowUpRight size={18} />
                </a>
                <a className="button" href="http://www.stargazer.click/" target="_blank" rel="noreferrer">
                  {copy.secondaryCta}
                  <Link2 size={18} />
                </a>
              </div>
            </div>

            <div className="portrait-system reveal">
              <div className="protagonist-core" aria-hidden="true">
                <span className="core-ring ring-1" />
                <span className="core-ring ring-2" />
                <span className="core-ring ring-3" />
                <span className="bio-slice bio-1">ADB-ID-001</span>
                <span className="bio-slice bio-2">300B+</span>
                <span className="bio-slice bio-3">StarEpoch</span>
                <span className="bio-slice bio-4">30,000T+</span>
              </div>
              <div className="portrait-card portrait-sketch">
                <img src="./andy-d-minimal-sketch.png?v=1" alt="Andy D minimal portrait sketch" />
              </div>
              <div className="identity-ledger">
                <span>董昀赫 / Andy D</span>
                <strong>{copy.identityTitle}</strong>
                <small>{copy.identityHash}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="scene signal-scene" id="signals">
          <div className="content">
            <SectionHeading eyebrow="SIGNALS / ASSET BLOCKS" title={copy.signalsTitle}>
              <p>{copy.signalsText}</p>
            </SectionHeading>
            <div className="stats-grid">
              {stats.map((stat) => (
                <article className={stat.accent ? "stat-card accent-stat" : "stat-card"} key={stat.code}>
                  <div className="shape-safe">
                    <span>{stat.code}</span>
                    <strong className={stat.value.length >= 8 ? "extra-long-value" : stat.value.length >= 6 ? "long-value" : undefined}>
                      <AnimatedNumber value={stat.value} />
                    </strong>
                    <p>{text(stat.label)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scene asset-scene" id="assets">
          <div className="content">
            <SectionHeading eyebrow="LEDGER / DIGITAL ASSET CLASSES" title={copy.assetsTitle} />
            <div className="asset-grid">
              {assetClasses.map((asset) => (
                <EncodedCard code={asset.code} proof={asset.proof} title={text(asset.title)} key={asset.code}>
                  <p>{text(asset.signal)}</p>
                </EncodedCard>
              ))}
            </div>
          </div>
        </section>

        <section className="scene cases-scene" id="cases">
          <div className="content">
            <div className="section-heading cases-heading reveal">
              <div>
                <p className="eyebrow">CASES / PROOF BLOCKS</p>
                <h2>{copy.casesTitle}</h2>
                <p>{copy.casesText}</p>
              </div>
              <aside className="case-index" aria-label={copy.caseSummaryAria}>
                <span>CASE INDEX</span>
                <strong>
                  <AnimatedNumber value="11" />
                </strong>
                <p>{copy.caseSummary}</p>
                <div>
                  <b>300B+</b>
                  <b>30,000T+</b>
                  <b>10M+</b>
                </div>
              </aside>
            </div>
            <div className="proof-grid">
              {cases.map((item, index) => (
                <article className={index < 2 ? "proof-card wide-proof" : "proof-card"} key={item.code}>
                  <div className="shape-safe">
                    <div className="block-meta">
                      <span>{item.code}</span>
                      <span className="category-mark">
                        {(() => {
                          const Icon = caseIcons[index % caseIcons.length];
                          return <Icon size={14} />;
                        })()}
                        {text(item.category)}
                      </span>
                    </div>
                    <h3>{text(item.title)}</h3>
                    <dl>
                      <dt>{copy.roleLabel}</dt>
                      <dd>{text(item.role)}</dd>
                      <dt>{copy.signalLabel}</dt>
                      <dd className="signal-line">{item.signal}</dd>
                      <dt>{copy.assetLabel}</dt>
                      <dd>{text(item.asset)}</dd>
                    </dl>
                    {item.sourceUrl ? (
                      <a className="source-link" href={item.sourceUrl} target="_blank" rel="noreferrer">
                        {copy.sourceLabel}
                        <ArrowUpRight size={14} />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <div className="more-note reveal">
              <span>MORE / CASE ARCHIVE</span>
              <p>{copy.moreCases}</p>
            </div>
          </div>
        </section>

        <section className="scene capital-scene" id="capital">
          <div className="content">
            <SectionHeading eyebrow="PROJECT INVESTMENT / CHANNEL PORTFOLIO" title={copy.capitalTitle} />
            <div className="venture-grid">
              {ventures.map((venture) => (
                <article className="venture-card" key={venture.code}>
                  <span>{venture.code}</span>
                  <h3>{text(venture.title)}</h3>
                  <strong>{text(venture.role)}</strong>
                  <p>{text(venture.signal)}</p>
                </article>
              ))}
            </div>
            <div className="more-note reveal">
              <span>MORE / PROJECT PORTFOLIO</span>
              <p>{copy.morePortfolio}</p>
            </div>
          </div>
        </section>

        <section className="scene trust-scene" id="trust">
          <div className="content trust-layout">
            <SectionHeading eyebrow="TRUST / CAREER AND SOCIAL IDENTITY" title={copy.trustTitle} />
            <div className="timeline">
              <span className="timeline-progress" aria-hidden="true" />
              {timeline.map((item) => (
                <article className="timeline-item" key={`${item.period}-${item.title.en}`}>
                  <span>{item.period}</span>
                  <div>
                    <h3>{text(item.title)}</h3>
                    <strong>{text(item.role)}</strong>
                    <p>{text(item.signal)}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="role-grid">
              {roleGroups.map((group) => (
                <article className="role-card reveal" key={group.code}>
                  <div className="block-meta">
                    <span>{group.code}</span>
                    <span>VERIFIED</span>
                  </div>
                  <h3>{text(group.title)}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.cn}>
                        <BadgeCheck size={15} />
                        <span>{text(item)}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scene research-scene" id="research">
          <div className="content">
            <SectionHeading eyebrow="PUBLIC VALUE / RESEARCH AND POLICY" title={copy.researchTitle} />
            <div className="research-grid">
              {researchItems.map((item) => (
                <EncodedCard className="research-card" code={item.code} title={text(item.title)} key={item.code}>
                  <p>{text(item.signal)}</p>
                </EncodedCard>
              ))}
            </div>
          </div>
        </section>

        <section className="scene skills-scene" id="skills">
          <div className="content">
            <SectionHeading eyebrow="TOOLS / EXECUTION SYSTEM" title={copy.skillsTitle} />
            <div className="skill-grid">
              {skillGroups.map((group) => (
                <article className="skill-card reveal" key={group.code}>
                  <span>{group.code}</span>
                  <h3>{text(group.title)}</h3>
                  <div>
                    {group.items.map((item) => (
                      <b key={item}>{item}</b>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`scene starepoch-scene ${starepochIntroStarted ? "is-intro-started" : ""} ${
            starepochIntroComplete ? "is-intro-complete" : ""
          }`}
          id="starepoch"
        >
          {!starepochIntroComplete ? (
            <div className="starepoch-intro" aria-hidden={starepochIntroComplete}>
              <video
                ref={starepochVideoRef}
                className="starepoch-intro-video"
                src="./top-banner-motion.mp4"
                poster="./top-banner-frame.jpg"
                muted
                playsInline
                preload="metadata"
                onEnded={() => setStarepochIntroComplete(true)}
              />
            </div>
          ) : null}
          <div className="content starepoch-layout">
            <div className="starepoch-copy">
              <div className="section-heading reveal">
                <p className="eyebrow">STAREPOCH / IDENTITY LAYER</p>
                <h2 className="starepoch-title">
                  <span className="starepoch-title-main">
                    <span>{copy.starName}</span>
                    <span className="ip-inline-badge" aria-label={copy.starAria}>
                      <img src="./starepoch-creature-transparent.png?v=4" alt="" />
                      <i>ADB-IP</i>
                    </span>
                  </span>
                  <span>{copy.starLineA}</span>
                  <span>{copy.starLineB}</span>
                </h2>
                <p>{copy.starText}</p>
              </div>
              <div className="starepoch-pills">
                {copy.starPills.map((item) => (
                  <span className="signal-pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="scene closing-scene" id="contact">
          <div className="content closing-panel reveal">
            <p className="eyebrow">COLLABORATION / COMMERCIAL VALUE</p>
            <h2>{copy.closeTitle}</h2>
            <p>{copy.closeText}</p>
            <div className="collab-grid">
              {collaboration.map((item) => (
                <span key={item.cn}>{text(item)}</span>
              ))}
            </div>
            <div className="contact-matrix">
              <div className="contact-ledger">
                <article className="qr-specimen">
                  <img src="./wechat-qr.jpg" alt={copy.wechatAlt} />
                  <div>
                    <span>ADB-CONTACT-001</span>
                    <strong>{copy.wechatTitle}</strong>
                    <p>{copy.wechatText}</p>
                  </div>
                </article>
                <article className="qr-specimen">
                  <img src="./starepoch-qr.jpg" alt={copy.starepochAlt} />
                  <div>
                    <span>ADB-STAREPOCH-QR</span>
                    <strong>{copy.starepochTitle}</strong>
                    <p>{copy.starepochText}</p>
                  </div>
                </article>
              </div>
              <div className="closing-actions">
                <a className="closing-link" href="http://www.stargazer.click/" target="_blank" rel="noreferrer">
                  {copy.albumCta}
                  <ArrowUpRight size={18} />
                </a>
                <a
                  className="closing-link"
                  href="https://www.notion.so/dzc/RRRS-33d1a77903ec44e681d4a8e415e6fa0c?source=copy_link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.notionCta}
                  <Link2 size={18} />
                </a>
                <a
                  className="closing-link"
                  href="https://github.com/dongyongxue-collab/vault-capture"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub / vault-capture
                  <Github size={18} />
                </a>
                <a className="closing-link" href="mailto:58007275@qq.com">
                  58007275@qq.com
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
