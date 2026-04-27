import { c as createComponent } from './astro-component_BbPdZ0Bf.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_CMMalCOc.mjs';
import { $ as $$BaseLayout, s as siteConfig } from './BaseLayout_0lKvEGQ6.mjs';
import { b as getCurrentUser } from './auth_CGONaJsX.mjs';

const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const user = await getCurrentUser(Astro2.cookies);
  if (user) {
    return Astro2.redirect("/admin");
  }
  const error = Astro2.url.searchParams.get("error");
  const errorMessage = error === "invalid" ? "邮箱或密码不正确。" : error === "missing" ? "请填写邮箱和密码。" : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `登录 | ${siteConfig.title}`, "description": "登录博客后台。", "data-astro-cid-sgpqyurt": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container login-page" data-astro-cid-sgpqyurt> <div class="login-card" data-astro-cid-sgpqyurt> <p class="eyebrow" data-astro-cid-sgpqyurt>Admin Access</p> <h1 data-astro-cid-sgpqyurt>登录后台</h1> <p class="lede" data-astro-cid-sgpqyurt>先完成最小登录，后面再继续扩展在线编辑器和发布流程。</p> ${errorMessage && renderTemplate`<p class="error" data-astro-cid-sgpqyurt>${errorMessage}</p>`} <form action="/api/login" method="POST" class="login-form" data-astro-cid-sgpqyurt> <label data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>邮箱</span> <input type="email" name="email" placeholder="admin@example.com" required data-astro-cid-sgpqyurt> </label> <label data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>密码</span> <input type="password" name="password" placeholder="请输入密码" required data-astro-cid-sgpqyurt> </label> <button type="submit" data-astro-cid-sgpqyurt>登录</button> </form> </div> </section> ` })}`;
}, "C:/Users/20241282/Desktop/test/src/pages/login.astro", void 0);

const $$file = "C:/Users/20241282/Desktop/test/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
