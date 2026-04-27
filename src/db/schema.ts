import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 120 }).notNull(),
    role: mysqlEnum("role", ["admin", "editor"]).notNull().default("admin"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("users_role_idx").on(table.role)],
);

export const postsTable = mysqlTable(
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
    status: mysqlEnum("status", ["draft", "published"])
      .notNull()
      .default("draft"),
    featured: boolean("featured").notNull().default(false),
    authorId: int("author_id").notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("posts_status_idx").on(table.status),
    index("posts_author_idx").on(table.authorId),
    index("posts_featured_idx").on(table.featured),
  ],
);

export const tagsTable = mysqlTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postTagsTable = mysqlTable(
  "post_tags",
  {
    postId: int("post_id").notNull(),
    tagId: int("tag_id").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("post_tags_post_idx").on(table.postId),
    index("post_tags_tag_idx").on(table.tagId),
  ],
);

export const sessionsTable = mysqlTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    userId: int("user_id").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

export const siteSettingsTable = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
