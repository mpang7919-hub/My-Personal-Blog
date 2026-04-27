import "dotenv/config";
import matter from "gray-matter";
import { desc, eq } from "drizzle-orm";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "./client";
import {
  postTagsTable,
  postsTable,
  siteSettingsTable,
  tagsTable,
  usersTable,
} from "./schema";
import { hashPassword } from "../lib/auth";
import { siteConfig } from "../lib/site";
import { slugify } from "../lib/slug";

type FileBlogFrontmatter = {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  pubDate: string;
  updatedDate?: string;
  authorName?: string;
  status?: "draft" | "published";
  featured?: boolean;
  tags?: string[];
  cover?: string;
  draft?: boolean;
};

async function loadBlogFiles() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const blogDir = path.resolve(currentDir, "../content/blog");
  const fileNames = await readdir(blogDir);
  const mdxFiles = fileNames.filter((fileName) => /\.(md|mdx)$/i.test(fileName));

  return Promise.all(
    mdxFiles.map(async (fileName) => {
      const source = await readFile(path.join(blogDir, fileName), "utf8");
      const parsed = matter(source);
      return {
        fileName,
        frontmatter: parsed.data as FileBlogFrontmatter,
        content: parsed.content.trim(),
      };
    }),
  );
}

async function ensureAdminUser() {
  const db = getDb();
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPasswordHash = process.env.ADMIN_PASSWORD
    ? await hashPassword(process.env.ADMIN_PASSWORD)
    : process.env.ADMIN_PASSWORD_HASH ?? "CHANGE_ME_BEFORE_PRODUCTION";
  const adminDisplayName = process.env.ADMIN_DISPLAY_NAME ?? siteConfig.author.name;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, adminEmail))
    .limit(1);

  if (existing[0]) {
    return existing[0].id;
  }

  await db.insert(usersTable).values({
    email: adminEmail,
    passwordHash: adminPasswordHash,
    displayName: adminDisplayName,
    role: "admin",
  });

  const created = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, adminEmail))
    .limit(1);

  if (!created[0]) {
    throw new Error("Failed to create default admin user.");
  }

  return created[0].id;
}

async function syncSiteSettings() {
  const db = getDb();
  const items = [
    { settingKey: "siteTitle", settingValue: siteConfig.title },
    { settingKey: "siteDescription", settingValue: siteConfig.description },
    { settingKey: "authorName", settingValue: siteConfig.author.name },
    { settingKey: "authorBio", settingValue: siteConfig.author.shortBio },
  ];

  for (const item of items) {
    const existing = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.settingKey, item.settingKey))
      .limit(1);

    if (existing[0]) {
      await db
        .update(siteSettingsTable)
        .set({
          settingValue: item.settingValue,
          updatedAt: new Date(),
        })
        .where(eq(siteSettingsTable.settingKey, item.settingKey));
    } else {
      await db.insert(siteSettingsTable).values(item);
    }
  }
}

async function syncTags(postId: number, tagNames: string[]) {
  const db = getDb();

  for (const tagName of tagNames) {
    const tagSlug = slugify(tagName);
    let existingTag = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.slug, tagSlug))
      .limit(1);

    if (!existingTag[0]) {
      await db.insert(tagsTable).values({
        name: tagName,
        slug: tagSlug,
      });

      existingTag = await db
        .select()
        .from(tagsTable)
        .where(eq(tagsTable.slug, tagSlug))
        .limit(1);
    }

    const tag = existingTag[0];

    if (!tag) {
      throw new Error(`Failed to create tag: ${tagName}`);
    }

    const existingLinks = await db
      .select()
      .from(postTagsTable)
      .where(eq(postTagsTable.postId, postId));

    const alreadyLinked = existingLinks.some((item) => item.tagId === tag.id);

    if (!alreadyLinked) {
      await db.insert(postTagsTable).values({
        postId,
        tagId: tag.id,
      });
    }
  }
}

async function syncPosts(authorId: number) {
  const db = getDb();
  const files = await loadBlogFiles();

  for (const file of files) {
    const fm = file.frontmatter;
    const existing = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.slug, fm.slug))
      .limit(1);

    const postValues = {
      slug: fm.slug,
      title: fm.title,
      description: fm.description,
      seoTitle: fm.seoTitle,
      seoDescription: fm.seoDescription,
      content: file.content,
      cover: fm.cover,
      status: fm.draft ? "draft" : fm.status ?? "published",
      featured: fm.featured ?? false,
      authorId,
      publishedAt: fm.pubDate ? new Date(fm.pubDate) : null,
      updatedAt: fm.updatedDate ? new Date(fm.updatedDate) : new Date(),
    } as const;

    let postId: number;

    if (existing[0]) {
      postId = existing[0].id;
      await db.update(postsTable).set(postValues).where(eq(postsTable.id, postId));
      await db.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
    } else {
      await db.insert(postsTable).values(postValues);
      const created = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.slug, fm.slug))
        .orderBy(desc(postsTable.id))
        .limit(1);

      if (!created[0]) {
        throw new Error(`Failed to create post for ${file.fileName}`);
      }

      postId = created[0].id;
    }

    await syncTags(postId, fm.tags ?? []);
  }
}

async function main() {
  const db = getDb();

  await db.execute("SELECT 1");

  const authorId = await ensureAdminUser();
  await syncPosts(authorId);
  await syncSiteSettings();

  console.log("Seed complete: MDX content synced into MySQL.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
