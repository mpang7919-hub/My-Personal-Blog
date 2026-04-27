import { eq } from 'drizzle-orm';
import { g as getDb, u as usersTable, v as verifyPassword, c as createUserSession } from './auth_B_88mTGx.mjs';

async function getUserByEmail(email) {
  const db = getDb();
  const rows = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  return rows[0] ?? null;
}

const prerender = false;
const POST = async (context) => {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
