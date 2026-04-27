import "dotenv/config";
import matter from "gray-matter";
import { desc, eq } from "drizzle-orm";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "../db/client";
import { postTagsTable, postsTable, tagsTable } from "../db/schema";

export type BlogSourceType = "file" | "database";

export type RawBlogRecord = {
  id: string;
  body: string;
  filePath?: string;
  data: {
    slug: string;
    title: string;
    description: string;
    seoTitle?: string;
    seoDescription?: string;
    pubDate: string | Date;
    updatedDate?: string | Date;
    authorName?: string;
    status?: "draft" | "published";
    featured?: boolean;
    tags?: string[];
    cover?: string;
    draft?: boolean;
  };
};

type FileBlogFrontmatter = RawBlogRecord["data"];

async function loadFileBlogRecords(): Promise<RawBlogRecord[]> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const blogDir = path.resolve(currentDir, "../content/blog");
  const fileNames = await readdir(blogDir);
  const mdxFiles = fileNames.filter((fileName) => /\.(md|mdx)$/i.test(fileName));

  const records = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const absolutePath = path.join(blogDir, fileName);
      const source = await readFile(absolutePath, "utf8");
      const parsed = matter(source);
      const data = parsed.data as FileBlogFrontmatter;

      return {
        id: data.slug,
        body: parsed.content.trim(),
        filePath: absolutePath,
        data,
      };
    }),
  );

  return records.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );
}

async function loadDatabaseBlogRecords(): Promise<RawBlogRecord[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: postsTable.id,
      slug: postsTable.slug,
      title: postsTable.title,
      description: postsTable.description,
      seoTitle: postsTable.seoTitle,
      seoDescription: postsTable.seoDescription,
      content: postsTable.content,
      cover: postsTable.cover,
      status: postsTable.status,
      featured: postsTable.featured,
      publishedAt: postsTable.publishedAt,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      tagName: tagsTable.name,
    })
    .from(postsTable)
    .leftJoin(postTagsTable, eq(postTagsTable.postId, postsTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
    .where(eq(postsTable.status, "published"))
    .orderBy(desc(postsTable.publishedAt), desc(postsTable.createdAt));

  const grouped = new Map<string, RawBlogRecord>();

  for (const row of rows) {
    const existing = grouped.get(row.slug);

    if (!existing) {
      grouped.set(row.slug, {
        id: row.slug,
        body: row.content,
        data: {
          slug: row.slug,
          title: row.title,
          description: row.description,
          seoTitle: row.seoTitle ?? undefined,
          seoDescription: row.seoDescription ?? undefined,
          pubDate: row.publishedAt ?? row.createdAt,
          updatedDate: row.updatedAt ?? undefined,
          authorName: "鸣",
          status: row.status,
          featured: row.featured,
          tags: row.tagName ? [row.tagName] : [],
          cover: row.cover ?? undefined,
          draft: row.status !== "published",
        },
      });
      continue;
    }

    if (row.tagName && !existing.data.tags?.includes(row.tagName)) {
      existing.data.tags = [...(existing.data.tags ?? []), row.tagName];
    }
  }

  return [...grouped.values()];
}

export async function getConfiguredBlogRecords(): Promise<RawBlogRecord[]> {
  const contentSource = (process.env.CONTENT_SOURCE ?? "file") as BlogSourceType;

  if (contentSource === "database") {
    return loadDatabaseBlogRecords();
  }

  return loadFileBlogRecords();
}
