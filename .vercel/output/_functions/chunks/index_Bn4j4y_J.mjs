import { c as createComponent } from './astro-component_DBexCIw6.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_tEg_fpUW.mjs';
import { $ as $$BaseLayout, s as siteConfig } from './BaseLayout_B5mwrZfI.mjs';
import { a as listAdminPostRows } from './posts_QZOXX6I9.mjs';
import { r as requireUser } from './auth_B_88mTGx.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const user = await requireUser(Astro2);
  if (user instanceof Response) {
    return user;
  }
  const posts = await listAdminPostRows();
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const message = Astro2.url.searchParams.get("message");
  const messageText = message === "created" ? "文章已创建。" : message === "updated" ? "文章已更新。" : message === "deleted" ? "文章已删除。" : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `后台 | ${siteConfig.title}`, "description": "博客后台管理。", "data-astro-cid-u2h3djql": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container admin-page" data-astro-cid-u2h3djql> <div class="admin-head" data-astro-cid-u2h3djql> <div data-astro-cid-u2h3djql> <p class="eyebrow" data-astro-cid-u2h3djql>Dashboard</p> <h1 data-astro-cid-u2h3djql>后台概览</h1> <p class="lede" data-astro-cid-u2h3djql>
当前登录用户：${user.displayName}。这一步先打通账号、会话和数据库，下一步再接网页编辑器。
</p> <div class="quick-links" data-astro-cid-u2h3djql> <a href="/admin/posts" data-astro-cid-u2h3djql>文章管理</a> <a href="/admin/settings" data-astro-cid-u2h3djql>站点设置</a> </div> </div> <form action="/api/logout" method="POST" data-astro-cid-u2h3djql> <button type="submit" data-astro-cid-u2h3djql>退出登录</button> </form> </div> ${messageText && renderTemplate`<p class="notice" data-astro-cid-u2h3djql>${messageText}</p>`} <div class="stats" data-astro-cid-u2h3djql> <article data-astro-cid-u2h3djql> <span data-astro-cid-u2h3djql>内容源</span> <strong data-astro-cid-u2h3djql>${process.env.CONTENT_SOURCE ?? "file"}</strong> </article> <article data-astro-cid-u2h3djql> <span data-astro-cid-u2h3djql>已发布文章</span> <strong data-astro-cid-u2h3djql>${publishedCount}</strong> </article> <article data-astro-cid-u2h3djql> <span data-astro-cid-u2h3djql>草稿文章</span> <strong data-astro-cid-u2h3djql>${draftCount}</strong> </article> </div> <section class="posts-panel" data-astro-cid-u2h3djql> <div class="panel-head" data-astro-cid-u2h3djql> <div data-astro-cid-u2h3djql> <h2 data-astro-cid-u2h3djql>数据库中的文章</h2> <p data-astro-cid-u2h3djql>现在已经可以进入文章管理，下一步会继续补更完整的编辑体验。</p> </div> <a class="create-link" href="/admin/posts" data-astro-cid-u2h3djql>进入文章管理</a> </div> <div class="table-wrap" data-astro-cid-u2h3djql> <table data-astro-cid-u2h3djql> <thead data-astro-cid-u2h3djql> <tr data-astro-cid-u2h3djql> <th data-astro-cid-u2h3djql>标题</th> <th data-astro-cid-u2h3djql>Slug</th> <th data-astro-cid-u2h3djql>状态</th> <th data-astro-cid-u2h3djql>发布时间</th> </tr> </thead> <tbody data-astro-cid-u2h3djql> ${posts.map((post) => renderTemplate`<tr data-astro-cid-u2h3djql> <td data-astro-cid-u2h3djql> <a${addAttribute(`/admin/posts/${post.id}`, "href")} data-astro-cid-u2h3djql>${post.title}</a> </td> <td data-astro-cid-u2h3djql>${post.slug}</td> <td data-astro-cid-u2h3djql>${post.status}</td> <td data-astro-cid-u2h3djql> ${post.publishedAt ? post.publishedAt.toLocaleDateString("zh-CN") : "未发布"} </td> </tr>`)} </tbody> </table> </div> </section> </section> ` })}`;
}, "C:/Users/20241282/Desktop/test/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/20241282/Desktop/test/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
