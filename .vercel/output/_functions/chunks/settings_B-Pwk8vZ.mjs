import { u as updateSiteSettings } from './site-settings_laPO-WiQ.mjs';
import { r as requireUser } from './auth_B_88mTGx.mjs';

const prerender = false;
const POST = async (context) => {
  const user = await requireUser(context);
  if (user instanceof Response) {
    return user;
  }
  const formData = await context.request.formData();
  const siteTitle = String(formData.get("siteTitle") ?? "").trim();
  const siteDescription = String(formData.get("siteDescription") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const authorBio = String(formData.get("authorBio") ?? "").trim();
  if (!siteTitle || !siteDescription || !authorName || !authorBio) {
    return context.redirect("/admin/settings");
  }
  await updateSiteSettings({
    siteTitle,
    siteDescription,
    authorName,
    authorBio
  });
  return context.redirect("/admin/settings?message=saved");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
