import { c as createAdminPost } from './posts_Blnq3YV4.mjs';
import { r as requireUser } from './auth_CGONaJsX.mjs';

const prerender = false;
function parseTagNames(raw) {
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}
const POST = async (context) => {
  const user = await requireUser(context);
  if (user instanceof Response) {
    return user;
  }
  const formData = await context.request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const cover = String(formData.get("cover") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") === "published" ? "published" : "draft";
  const featured = formData.get("featured") === "true";
  const tagNames = parseTagNames(String(formData.get("tags") ?? ""));
  if (!title || !description || !content) {
    return context.redirect("/admin/posts/new");
  }
  const post = await createAdminPost({
    slug,
    title,
    description,
    seoTitle: seoTitle || void 0,
    seoDescription: seoDescription || void 0,
    content,
    cover: cover || void 0,
    status,
    featured,
    tagNames,
    authorId: user.id
  });
  return context.redirect(`/admin/posts/${post.id}?message=created`);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
