import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { mysqlTable, int, primaryKey, index, timestamp, boolean, mysqlEnum, varchar, text, serial } from 'drizzle-orm/mysql-core';

const usersTable = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 120 }).notNull(),
    role: mysqlEnum("role", ["admin", "editor"]).notNull().default("admin"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [index("users_role_idx").on(table.role)]
);
const postsTable = mysqlTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: varchar("seo_description", { length: 255 }),
    content: text("content").notNull(),
    cover: varchar("cover", { length: 255 }),
    status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    authorId: int("author_id").notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [
    index("posts_status_idx").on(table.status),
    index("posts_author_idx").on(table.authorId),
    index("posts_featured_idx").on(table.featured)
  ]
);
const tagsTable = mysqlTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const postTagsTable = mysqlTable(
  "post_tags",
  {
    postId: int("post_id").notNull(),
    tagId: int("tag_id").notNull()
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("post_tags_post_idx").on(table.postId),
    index("post_tags_tag_idx").on(table.tagId)
  ]
);
const sessionsTable = mysqlTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    userId: int("user_id").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => [index("sessions_user_idx").on(table.userId)]
);
const siteSettingsTable = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

const schema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  postTagsTable,
  postsTable,
  sessionsTable,
  siteSettingsTable,
  tagsTable,
  usersTable
}, Symbol.toStringTag, { value: 'Module' }));

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to use the MySQL database.");
  }
  return databaseUrl;
}
function getDb() {
  return drizzle({
    connection: {
      uri: getDatabaseUrl()
    },
    schema,
    mode: "default"
  });
}

async function createSession(values) {
  const db = getDb();
  return db.insert(sessionsTable).values(values);
}
async function getSessionWithUser(token) {
  const db = getDb();
  const rows = await db.select({
    sessionId: sessionsTable.id,
    token: sessionsTable.token,
    userId: sessionsTable.userId,
    expiresAt: sessionsTable.expiresAt,
    email: usersTable.email,
    displayName: usersTable.displayName,
    role: usersTable.role
  }).from(sessionsTable).innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId)).where(eq(sessionsTable.token, token)).limit(1);
  return rows[0] ?? null;
}
async function deleteSession(token) {
  const db = getDb();
  return db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}
async function deleteExpiredSessions(now = /* @__PURE__ */ new Date()) {
  const db = getDb();
  const allSessions = await db.select().from(sessionsTable);
  const expired = allSessions.filter((session) => session.expiresAt < now);
  for (const session of expired) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
  }
}

const SESSION_COOKIE_NAME = "ming_blog_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
function createSessionToken() {
  return randomBytes(32).toString("hex");
}
function setSessionCookie(cookies, token, secure) {
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}
function clearSessionCookie(cookies) {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: "/"
  });
}
async function createUserSession(userId, cookies, secure) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1e3);
  await createSession({
    token,
    userId,
    expiresAt
  });
  setSessionCookie(cookies, token, secure);
}
async function getCurrentUser(cookies) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  await deleteExpiredSessions();
  const session = await getSessionWithUser(token);
  if (!session || session.expiresAt < /* @__PURE__ */ new Date()) {
    return null;
  }
  return {
    id: session.userId,
    email: session.email,
    displayName: session.displayName,
    role: session.role,
    sessionToken: session.token
  };
}
async function logoutCurrentUser(cookies) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
  }
  clearSessionCookie(cookies);
}
async function requireUser(context) {
  const user = await getCurrentUser(context.cookies);
  if (!user) {
    return context.redirect("/login");
  }
  return user;
}

export { postsTable as a, getCurrentUser as b, createUserSession as c, getDb as g, logoutCurrentUser as l, postTagsTable as p, requireUser as r, siteSettingsTable as s, tagsTable as t, usersTable as u, verifyPassword as v };
