import { c as createComponent } from './astro-component_DBexCIw6.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_tEg_fpUW.mjs';
import { $ as $$BaseLayout, s as siteConfig } from './BaseLayout_B5mwrZfI.mjs';
import { g as getSiteSettingsMap } from './site-settings_laPO-WiQ.mjs';
import { r as requireUser } from './auth_B_88mTGx.mjs';

const prerender = false;
const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Settings;
  const user = await requireUser(Astro2);
  if (user instanceof Response) {
    return user;
  }
  const settings = await getSiteSettingsMap();
  const message = Astro2.url.searchParams.get("message");
  const messageText = message === "saved" ? "站点设置已保存。" : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `站点设置 | ${siteConfig.title}`, "description": "后台站点设置。", "data-astro-cid-nc6xuisf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container settings-page" data-astro-cid-nc6xuisf> <div class="page-head" data-astro-cid-nc6xuisf> <div data-astro-cid-nc6xuisf> <p class="eyebrow" data-astro-cid-nc6xuisf>Settings</p> <h1 data-astro-cid-nc6xuisf>站点设置</h1> <p class="lede" data-astro-cid-nc6xuisf>可以先从标题、描述和作者信息开始，后面再逐步扩展成更完整的站点配置面板。</p> </div> <a class="ghost" href="/admin" data-astro-cid-nc6xuisf>返回后台</a> </div> ${messageText && renderTemplate`<p class="notice" data-astro-cid-nc6xuisf>${messageText}</p>`} <section class="panel" data-astro-cid-nc6xuisf> <form action="/api/admin/settings" method="POST" class="settings-form" data-astro-cid-nc6xuisf> <label data-astro-cid-nc6xuisf> <span data-astro-cid-nc6xuisf>站点标题</span> <input type="text" name="siteTitle"${addAttribute(settings.siteTitle ?? siteConfig.title, "value")} required data-astro-cid-nc6xuisf> </label> <label data-astro-cid-nc6xuisf> <span data-astro-cid-nc6xuisf>站点描述</span> <textarea name="siteDescription" rows="3" required data-astro-cid-nc6xuisf>${settings.siteDescription ?? siteConfig.description}</textarea> </label> <label data-astro-cid-nc6xuisf> <span data-astro-cid-nc6xuisf>作者名</span> <input type="text" name="authorName"${addAttribute(settings.authorName ?? siteConfig.author.name, "value")} required data-astro-cid-nc6xuisf> </label> <label data-astro-cid-nc6xuisf> <span data-astro-cid-nc6xuisf>作者简介</span> <textarea name="authorBio" rows="4" required data-astro-cid-nc6xuisf>${settings.authorBio ?? siteConfig.author.shortBio}</textarea> </label> <button type="submit" data-astro-cid-nc6xuisf>保存设置</button> </form> </section> </section> ` })}`;
}, "C:/Users/20241282/Desktop/test/src/pages/admin/settings.astro", void 0);

const $$file = "C:/Users/20241282/Desktop/test/src/pages/admin/settings.astro";
const $$url = "/admin/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
