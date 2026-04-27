import { c as createComponent } from './astro-component_BbPdZ0Bf.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, u as unescapeHTML, n as renderHead, l as renderComponent, o as renderSlot } from './entrypoint_CMMalCOc.mjs';
import 'clsx';

const siteConfig = {
  title: "鸣的技术手记",
  navigation: [
    { href: "/", label: "首页" },
    { href: "/blog", label: "文章" },
    { href: "/archive", label: "归档" },
    { href: "/tags", label: "标签" },
    { href: "/about", label: "关于" }
  ],
  footerText: "鸣的技术手记。写爬虫、逆向和大模型，也写那些慢慢想明白的过程。",
  socialLinks: [
    { href: "https://github.com/mpang7919-hub", label: "GitHub" },
    { href: "/rss.xml", label: "RSS" }
  ]
};

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="site-footer" data-astro-cid-sz7xmlte> <div class="container footer-inner" data-astro-cid-sz7xmlte> <p data-astro-cid-sz7xmlte>${siteConfig.footerText}</p> <div class="footer-links" data-astro-cid-sz7xmlte> ${siteConfig.socialLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} data-astro-cid-sz7xmlte>${link.label}</a>`)} </div> </div> </footer>`;
}, "C:/Users/20241282/Desktop/test/src/components/Footer.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="site-header" data-astro-cid-3ef6ksr2> <nav class="container nav" aria-label="主导航" data-astro-cid-3ef6ksr2> <a class="brand" href="/" data-astro-cid-3ef6ksr2>${siteConfig.title}</a> <div class="links" data-astro-cid-3ef6ksr2> ${siteConfig.navigation.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} data-astro-cid-3ef6ksr2>${link.label}</a>`)} </div> </nav> </header>`;
}, "C:/Users/20241282/Desktop/test/src/components/Header.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "鸣的技术手记",
    description = "记录 Python 爬虫、JS 逆向和 AI 大模型实践的个人博客。",
    ogType = "website",
    socialImage = "/og-image.svg",
    publishedTime,
    modifiedTime,
    keywords = [],
    structuredData = []
  } = Astro2.props;
  const canonicalUrl = Astro2.site ? new URL(Astro2.url.pathname, Astro2.site).toString() : Astro2.url.toString();
  const socialImageUrl = Astro2.site ? new URL(socialImage, Astro2.site).toString() : new URL(socialImage, Astro2.url.origin).toString();
  const keywordsContent = Array.isArray(keywords) ? keywords.join(", ") : keywords;
  const structuredDataItems = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];
  return renderTemplate`<html lang="zh-CN"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="theme-color" content="#d36a2e">${keywordsContent && renderTemplate`<meta name="keywords"${addAttribute(keywordsContent, "content")}>`}<meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name" content="鸣的技术手记"><meta property="og:locale" content="zh_CN"><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:image"${addAttribute(socialImageUrl, "content")}><meta property="og:image:alt" content="鸣的技术手记分享图">${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(socialImageUrl, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}><link rel="alternate" type="application/rss+xml" title="鸣的技术手记 RSS" href="/rss.xml"><link rel="icon" type="image/svg+xml" href="/favicon.svg">${structuredDataItems.map((item) => renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(item))))}<title>${title}</title>${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} <main> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "C:/Users/20241282/Desktop/test/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, siteConfig as s };
