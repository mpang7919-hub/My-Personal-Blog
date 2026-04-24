export const siteConfig = {
  title: "鸣的技术手记",
  description: "记录 Python 爬虫、JS 逆向和 AI 大模型实践的个人博客。",
  author: {
    name: "鸣",
    shortBio:
      "长期记录 Python 爬虫、JS 逆向和 AI 大模型实践的技术作者。",
    aboutIntro:
      "鸣是一个喜欢钻细节的人，平时常在脚本、请求链路、混淆代码和模型实验里来回穿梭。遇到问题时，习惯先把现象拆开，再一点点把原因钉实。",
    aboutParagraphs: [
      "这个博客主要写三类内容：Python 爬虫的工程实践、JS 逆向时的分析思路，以及 AI 大模型在真实场景里的折腾记录。",
      "我希望这里不是“只给结论”的地方，而是能把推理过程、踩坑细节和修正路径都留下来。技术本身已经够硬了，表达可以稍微温和一点。",
      "如果你也在做类似方向，希望这些文章能帮你更快定位问题，也更有耐心把一个系统真正看懂。",
    ],
  },
  hero: {
    eyebrow: "Ming's Notes",
    title: "把复杂问题拆开，把技术经验写暖。",
    description:
      "我是鸣，这里主要记录 Python 爬虫、JS 逆向和 AI 大模型相关的实战笔记。比起追热点，我更想把每一次排查、拆解和验证写得足够清楚，让后来的人少走一点弯路。",
    primaryCta: { href: "/blog", label: "开始阅读" },
    secondaryCta: { href: "/about", label: "关于鸣" },
  },
  focusAreas: ["Python 爬虫", "JS 逆向", "AI 大模型"],
  signalCards: [
    { label: "研究方向", value: "爬虫 · 逆向 · 大模型" },
    { label: "写作习惯", value: "先拆链路，再写结论" },
    { label: "站点气质", value: "技术感里留一点温度" },
  ],
  navigation: [
    { href: "/", label: "首页" },
    { href: "/blog", label: "文章" },
    { href: "/archive", label: "归档" },
    { href: "/tags", label: "标签" },
    { href: "/about", label: "关于" },
  ],
  footerText:
    "鸣的技术手记。写爬虫、逆向和大模型，也写那些慢慢想明白的过程。",
  socialLinks: [
    { href: "https://github.com/mpang7919-hub", label: "GitHub" },
    { href: "/rss.xml", label: "RSS" },
  ],
} as const;
