import { eq, desc } from 'drizzle-orm';
import { g as getDb, p as postTagsTable, a as postsTable, t as tagsTable } from './auth_CGONaJsX.mjs';

function slugify(value) {
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w\u4e00-\u9fff-]+/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function listAdminPostRows() {
  const db = getDb();
  return db.select().from(postsTable).orderBy(desc(postsTable.updatedAt), desc(postsTable.createdAt));
}
async function listAdminPostRowsByStatus(status = "all") {
  if (status === "all") {
    return listAdminPostRows();
  }
  const db = getDb();
  return db.select().from(postsTable).where(eq(postsTable.status, status)).orderBy(desc(postsTable.updatedAt), desc(postsTable.createdAt));
}
async function getAdminPostById(postId) {
  const db = getDb();
  const rows = await db.select({
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
    tagName: tagsTable.name
  }).from(postsTable).leftJoin(postTagsTable, eq(postTagsTable.postId, postsTable.id)).leftJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId)).where(eq(postsTable.id, postId));
  if (rows.length === 0) {
    return null;
  }
  const [firstRow] = rows;
  return {
    ...firstRow,
    tagNames: rows.map((row) => row.tagName).filter((tagName) => Boolean(tagName))
  };
}
async function ensureTags(tx, tagNames) {
  const tagIds = [];
  for (const tagName of tagNames) {
    const trimmed = tagName.trim();
    if (!trimmed) {
      continue;
    }
    const tagSlug = slugify(trimmed);
    let existing = await tx.select().from(tagsTable).where(eq(tagsTable.slug, tagSlug)).limit(1);
    if (!existing[0]) {
      await tx.insert(tagsTable).values({
        name: trimmed,
        slug: tagSlug
      });
      existing = await tx.select().from(tagsTable).where(eq(tagsTable.slug, tagSlug)).limit(1);
    }
    if (existing[0]) {
      tagIds.push(existing[0].id);
    }
  }
  return tagIds;
}
async function createAdminPost(input) {
  const db = getDb();
  const normalizedSlug = slugify(input.slug || input.title);
  const publishedAt = input.status === "published" ? /* @__PURE__ */ new Date() : null;
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
      updatedAt: /* @__PURE__ */ new Date()
    });
    const created = await tx.select().from(postsTable).where(eq(postsTable.slug, normalizedSlug)).limit(1);
    const post = created[0];
    if (!post) {
      throw new Error("Failed to create post.");
    }
    const tagIds = await ensureTags(tx, input.tagNames);
    for (const tagId of tagIds) {
      await tx.insert(postTagsTable).values({
        postId: post.id,
        tagId
      });
    }
    return post;
  });
}
async function updateAdminPost(postId, input) {
  const db = getDb();
  const normalizedSlug = slugify(input.slug || input.title);
  return db.transaction(async (tx) => {
    const existing = await tx.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1);
    if (!existing[0]) {
      throw new Error("Post not found.");
    }
    const currentPublishedAt = existing[0].publishedAt;
    const nextPublishedAt = input.status === "published" ? currentPublishedAt ?? /* @__PURE__ */ new Date() : null;
    await tx.update(postsTable).set({
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
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(postsTable.id, postId));
    await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
    const tagIds = await ensureTags(tx, input.tagNames);
    for (const tagId of tagIds) {
      await tx.insert(postTagsTable).values({
        postId,
        tagId
      });
    }
  });
}
async function deleteAdminPost(postId) {
  const db = getDb();
  return db.transaction(async (tx) => {
    await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
    await tx.delete(postsTable).where(eq(postsTable.id, postId));
  });
}

export { listAdminPostRows as a, createAdminPost as c, deleteAdminPost as d, getAdminPostById as g, listAdminPostRowsByStatus as l, updateAdminPost as u };
