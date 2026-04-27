import type { APIRoute } from "astro";
import { updateSiteSettings } from "../../../db/repositories/site-settings";
import { requireUser } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async (context) => {
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
    authorBio,
  });

  return context.redirect("/admin/settings?message=saved");
};
