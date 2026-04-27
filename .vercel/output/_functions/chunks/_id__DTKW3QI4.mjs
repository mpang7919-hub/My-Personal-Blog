import { c as createComponent } from './astro-component_BbPdZ0Bf.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_CMMalCOc.mjs';
import { $ as $$AdminPostForm } from './AdminPostForm_BkeGpWU4.mjs';
import { $ as $$BaseLayout, s as siteConfig } from './BaseLayout_0lKvEGQ6.mjs';
import { g as getAdminPostById } from './posts_Blnq3YV4.mjs';
import { r as requireUser } from './auth_CGONaJsX.mjs';

const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const user = await requireUser(Astro2);
  if (user instanceof Response) {
    return user;
  }
  const id = Number(Astro2.params.id);
  const post = Number.isFinite(id) ? await getAdminPostById(id) : null;
  const message = Astro2.url.searchParams.get("message");
  const messageText = message === "updated" ? "文章已保存。" : "";
  if (!post) {
    return Astro2.redirect("/admin/posts");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `编辑文章 | ${siteConfig.title}`, "description": "后台编辑文章。", "data-astro-cid-u4qw32gb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container editor-page" data-astro-cid-u4qw32gb> ${messageText && renderTemplate`<p class="notice" data-astro-cid-u4qw32gb>${messageText}</p>`} ${renderComponent($$result2, "AdminPostForm", $$AdminPostForm, { "action": `/api/admin/posts/${post.id}`, "title": `编辑：${post.title}`, "submitLabel": "保存更改", "values": post, "data-astro-cid-u4qw32gb": true })} </section> ` })}`;
}, "C:/Users/20241282/Desktop/test/src/pages/admin/posts/[id].astro", void 0);

const $$file = "C:/Users/20241282/Desktop/test/src/pages/admin/posts/[id].astro";
const $$url = "/admin/posts/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
