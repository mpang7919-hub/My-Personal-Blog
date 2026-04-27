import { c as createComponent } from './astro-component_DBexCIw6.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_tEg_fpUW.mjs';
import { $ as $$AdminPostForm } from './AdminPostForm_CkiqPg5Z.mjs';
import { $ as $$BaseLayout, s as siteConfig } from './BaseLayout_B5mwrZfI.mjs';
import { r as requireUser } from './auth_B_88mTGx.mjs';

const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$New;
  const user = await requireUser(Astro2);
  if (user instanceof Response) {
    return user;
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `新建文章 | ${siteConfig.title}`, "description": "后台新建文章。", "data-astro-cid-evsmad5u": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container editor-page" data-astro-cid-evsmad5u> ${renderComponent($$result2, "AdminPostForm", $$AdminPostForm, { "action": "/api/admin/posts", "title": "新建文章", "submitLabel": "创建文章", "data-astro-cid-evsmad5u": true })} </section> ` })}`;
}, "C:/Users/20241282/Desktop/test/src/pages/admin/posts/new.astro", void 0);

const $$file = "C:/Users/20241282/Desktop/test/src/pages/admin/posts/new.astro";
const $$url = "/admin/posts/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
