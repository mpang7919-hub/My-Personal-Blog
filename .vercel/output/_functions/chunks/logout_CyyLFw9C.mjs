import { l as logoutCurrentUser } from './auth_CGONaJsX.mjs';

const prerender = false;
const POST = async (context) => {
  await logoutCurrentUser(context.cookies);
  return context.redirect("/login");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
