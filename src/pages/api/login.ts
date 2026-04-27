import type { APIRoute } from "astro";
import { getUserByEmail } from "../../db/repositories/users";
import { createUserSession, verifyPassword } from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return context.redirect("/login?error=missing");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return context.redirect("/login?error=invalid");
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return context.redirect("/login?error=invalid");
  }

  const secure = context.url.protocol === "https:";
  await createUserSession(user.id, context.cookies, secure);

  return context.redirect("/admin");
};
