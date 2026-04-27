import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { APIContext, AstroCookies } from "astro";
import {
  createSession,
  deleteExpiredSessions,
  deleteSession,
  getSessionWithUser,
} from "../db/repositories/sessions";

export const SESSION_COOKIE_NAME = "ming_blog_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function setSessionCookie(cookies: AstroCookies, token: string, secure: boolean) {
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: "/",
  });
}

export async function createUserSession(
  userId: number,
  cookies: AstroCookies,
  secure: boolean,
) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await createSession({
    token,
    userId,
    expiresAt,
  });

  setSessionCookie(cookies, token, secure);
}

export async function getCurrentUser(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  await deleteExpiredSessions();
  const session = await getSessionWithUser(token);

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return {
    id: session.userId,
    email: session.email,
    displayName: session.displayName,
    role: session.role,
    sessionToken: session.token,
  };
}

export async function logoutCurrentUser(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSession(token);
  }

  clearSessionCookie(cookies);
}

export async function requireUser(context: APIContext) {
  const user = await getCurrentUser(context.cookies);

  if (!user) {
    return context.redirect("/login");
  }

  return user;
}
