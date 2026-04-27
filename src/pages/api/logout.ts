import type { APIRoute } from "astro";
import { logoutCurrentUser } from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  await logoutCurrentUser(context.cookies);
  return context.redirect("/login");
};
