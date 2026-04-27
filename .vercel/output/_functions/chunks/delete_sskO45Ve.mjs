import { d as deleteAdminPost } from './posts_Blnq3YV4.mjs';
import { r as requireUser } from './auth_CGONaJsX.mjs';

const prerender = false;
const POST = async (context) => {
  const user = await requireUser(context);
  if (user instanceof Response) {
    return user;
  }
  const postId = Number(context.params.id);
  if (!Number.isFinite(postId)) {
    return context.redirect("/admin/posts");
  }
  await deleteAdminPost(postId);
  return context.redirect("/admin/posts?message=deleted");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
