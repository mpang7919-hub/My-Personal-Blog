import { desc, eq } from "drizzle-orm";
import { getDb } from "../client";
import { postTagsTable, postsTable, tagsTable } from "../schema";
import { slugify } from "../../lib/slug";

export type AdminPostInput = {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  cover?: string;
  status: "draft" | "published";
  featured: boolean;
  tagNames: string[];
  authorId: number;
};

export async function listPublishedPostRows() {
  const db = getDb();

  return db
    .select()
    .from(postsTable)
    .where(eq(postsTable.status, "published"))
    .orderBy(desc(postsTable.publishedAt), desc(postsTable.createdAt));
}

export async function listAdminPostRows() {
  const db = getDb();

  return db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.updatedAt), desc(postsTable.createdAt));
}

export async function listAdminPostRowsByStatus(
  status: "draft" | "published" | "all" = "all",
) {
  if (status === "all") {
    return listAdminPostRows();
  }

  const db = getDb();

  return db
    .select()
    .from(postsTable)
    .where(eq(postsTable.status, status))
    .orderBy(desc(postsTable.updatedAt), desc(postsTable.createdAt));
}

export async function getPostRowBySlug(slug: string) {
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
      authorId: postsTable.authorId,
      publishedAt: postsTable.publishedAt,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      tagName: tagsTable.name,
      tagSlug: tagsTable.slug,
    })
    .from(postsTable)
    .leftJoin(postTagsTable, eq(postTagsTable.postId, postsTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
    .where(eq(postsTable.slug, slug));

  if (rows.length === 0) {
    return null;
  }

  const [firstRow] = rows;

  return {
    ...firstRow,
    tags: rows
      .filter((row) => row.tagName && row.tagSlug)
      .map((row) => ({
        name: row.tagName as string,
        slug: row.tagSlug as string,
      })),
  };
}

export async function getAdminPostById(postId: number) {
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
      authorId: postsTable.authorId,
      publishedAt: postsTable.publishedAt,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      tagName: tagsTable.name,
    })
    .from(postsTable)
    .leftJoin(postTagsTable, eq(postTagsTable.postId, postsTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
    .where(eq(postsTable.id, postId));

  if (rows.length === 0) {
    return null;
  }

  const [firstRow] = rows;

  return {
    ...firstRow,
    tagNames: rows
      .map((row) => row.tagName)
      .filter((tagName): tagName is string => Boolean(tagName)),
  };
}

async function ensureTags(tx: ReturnType<typeof getDb>, tagNames: string[]) {
  const tagIds: number[] = [];

  for (const tagName of tagNames) {
    const trimmed = tagName.trim();

    if (!trimmed) {
      continue;
    }

    const tagSlug = slugify(trimmed);
    let existing = await tx
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.slug, tagSlug))
      .limit(1);

    if (!existing[0]) {
      await tx.insert(tagsTable).values({
        name: trimmed,
        slug: tagSlug,
      });

      existing = await tx
        .select()
        .from(tagsTable)
        .where(eq(tagsTable.slug, tagSlug))
        .limit(1);
    }

    if (existing[0]) {
      tagIds.push(existing[0].id);
    }
  }

  return tagIds;
}

export async function createAdminPost(input: AdminPostInput) {
  const db = getDb();
  const normalizedSlug = slugify(input.slug || input.title);
  const publishedAt =
    input.status === "published" ? new Date() : null;

  return db.transaction(async (tx) => {
    await tx.insert(postsTable).values({
      slug: normalizedSlug,
      title: input.title,
      description: input.description,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      content: input.content,
      cover: input.cover,
      status: input.status,
      featured: input.featured,
      authorId: input.authorId,
      publishedAt,
      updatedAt: new Date(),
    });

    const created = await tx
      .select()
      .from(postsTable)
      .where(eq(postsTable.slug, normalizedSlug))
      .limit(1);

    const post = created[0];

    if (!post) {
      throw new Error("Failed to create post.");
    }

    const tagIds = await ensureTags(tx as unknown as ReturnType<typeof getDb>, input.tagNames);

    for (const tagId of tagIds) {
      await tx.insert(postTagsTable).values({
        postId: post.id,
        tagId,
      });
    }

    return post;
  });
}

export async function updateAdminPost(postId: number, input: AdminPostInput) {
  const db = getDb();
  const normalizedSlug = slugify(input.slug || input.title);

  return db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId))
      .limit(1);

    if (!existing[0]) {
      throw new Error("Post not found.");
    }

    const currentPublishedAt = existing[0].publishedAt;
    const nextPublishedAt =
      input.status === "published"
        ? currentPublishedAt ?? new Date()
        : null;

    await tx
      .update(postsTable)
      .set({
        slug: normalizedSlug,
        title: input.title,
        description: input.description,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        content: input.content,
        cover: input.cover,
        status: input.status,
        featured: input.featured,
        publishedAt: nextPublishedAt,
        updatedAt: new Date(),
      })
      .where(eq(postsTable.id, postId));

    await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
    const tagIds = await ensureTags(tx as unknown as ReturnType<typeof getDb>, input.tagNames);

    for (const tagId of tagIds) {
      await tx.insert(postTagsTable).values({
        postId,
        tagId,
      });
    }
  });
}

export async function deleteAdminPost(postId: number) {
  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
    await tx.delete(postsTable).where(eq(postsTable.id, postId));
  });
}

export async function createPostRow(
  values: typeof postsTable.$inferInsert,
) {
  const db = getDb();
  return db.insert(postsTable).values(values);
}

export async function updatePostRow(
  postId: number,
  values: Partial<typeof postsTable.$inferInsert>,
) {
  const db = getDb();
  return db.update(postsTable).set(values).where(eq(postsTable.id, postId));
}
