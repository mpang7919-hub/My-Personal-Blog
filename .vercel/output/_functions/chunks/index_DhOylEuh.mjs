import { c as createComponent } from './astro-component_BbPdZ0Bf.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_CMMalCOc.mjs';
import { $ as $$BaseLayout, s as siteConfig } from './BaseLayout_0lKvEGQ6.mjs';
import { l as listAdminPostRowsByStatus } from './posts_Blnq3YV4.mjs';
import { r as requireUser } from './auth_CGONaJsX.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const user = await requireUser(Astro2);
  if (user instanceof Response) {
    return user;
  }
  const status = Astro2.url.searchParams.get("status");
  const statusFilter = status === "draft" || status === "published" ? status : "all";
  const posts = await listAdminPostRowsByStatus(statusFilter);
  const message = Astro2.url.searchParams.get("message");
  const messageText = message === "created" ? "文章已创建。" : message === "updated" ? "文章已更新。" : message === "deleted" ? "文章已删除。" : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `文章管理 | ${siteConfig.title}`, "description": "后台文章管理。", "data-astro-cid-jktp4foz": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container admin-posts-page" data-astro-cid-jktp4foz> <div class="page-head" data-astro-cid-jktp4foz> <div data-astro-cid-jktp4foz> <p class="eyebrow" data-astro-cid-jktp4foz>Posts</p> <h1 data-astro-cid-jktp4foz>文章管理</h1> <p class="lede" data-astro-cid-jktp4foz>当前登录用户：${user.displayName}。这里可以新建、编辑和管理文章状态。</p> </div> <div class="head-actions" data-astro-cid-jktp4foz> <a class="ghost" href="/admin" data-astro-cid-jktp4foz>返回后台</a> <a class="primary" href="/admin/posts/new" data-astro-cid-jktp4foz>新建文章</a> </div> </div> ${messageText && renderTemplate`<p class="notice" data-astro-cid-jktp4foz>${messageText}</p>`} <section class="panel" data-astro-cid-jktp4foz> <div class="filters" data-astro-cid-jktp4foz> <a${addAttribute(["filter-link", statusFilter === "all" && "active"], "class:list")} href="/admin/posts" data-astro-cid-jktp4foz>
全部
</a> <a${addAttribute(["filter-link", statusFilter === "published" && "active"], "class:list")} href="/admin/posts?status=published" data-astro-cid-jktp4foz>
已发布
</a> <a${addAttribute(["filter-link", statusFilter === "draft" && "active"], "class:list")} href="/admin/posts?status=draft" data-astro-cid-jktp4foz>
草稿
</a> </div> <div class="table-wrap" data-astro-cid-jktp4foz> <table data-astro-cid-jktp4foz> <thead data-astro-cid-jktp4foz> <tr data-astro-cid-jktp4foz> <th data-astro-cid-jktp4foz>标题</th> <th data-astro-cid-jktp4foz>Slug</th> <th data-astro-cid-jktp4foz>状态</th> <th data-astro-cid-jktp4foz>精选</th> <th data-astro-cid-jktp4foz>更新时间</th> <th data-astro-cid-jktp4foz>操作</th> </tr> </thead> <tbody data-astro-cid-jktp4foz> ${posts.map((post) => renderTemplate`<tr data-astro-cid-jktp4foz> <td data-astro-cid-jktp4foz> <a${addAttribute(`/admin/posts/${post.id}`, "href")} data-astro-cid-jktp4foz>${post.title}</a> </td> <td data-astro-cid-jktp4foz>${post.slug}</td> <td data-astro-cid-jktp4foz>${post.status}</td> <td data-astro-cid-jktp4foz>${post.featured ? "是" : "否"}</td> <td data-astro-cid-jktp4foz>${post.updatedAt.toLocaleDateString("zh-CN")}</td> <td data-astro-cid-jktp4foz> <div class="row-actions" data-astro-cid-jktp4foz> <a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" rel="noreferrer" data-astro-cid-jktp4foz>预览</a> <form${addAttribute(`/api/admin/posts/${post.id}/delete`, "action")} method="POST" data-astro-cid-jktp4foz> <button type="submit" class="delete-btn" data-astro-cid-jktp4foz>删除</button> </form> </div> </td> </tr>`)} </tbody> </table> </div> </section> </section> ` })}`;
}, "C:/Users/20241282/Desktop/test/src/pages/admin/posts/index.astro", void 0);

const $$file = "C:/Users/20241282/Desktop/test/src/pages/admin/posts/index.astro";
const $$url = "/admin/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
