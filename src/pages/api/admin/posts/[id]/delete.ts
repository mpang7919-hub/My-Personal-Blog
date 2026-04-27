import type { APIRoute } from "astro";
import { deleteAdminPost } from "../../../../../db/repositories/posts";
import { requireUser } from "../../../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async (context) => {
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
