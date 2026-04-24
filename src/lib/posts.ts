import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getLatestPosts(limit = 3) {
  return (await getPublishedPosts()).slice(0, limit);
}

export async function getAllTags() {
  const posts = await getPublishedPosts();
  const tags = new Set(posts.flatMap((post) => post.data.tags));

  return [...tags].sort((a, b) => a.localeCompare(b));
}

export async function getTagCounts() {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return counts;
}

export async function getPostsByTag(tag: string) {
  return (await getPublishedPosts()).filter((post) => post.data.tags.includes(tag));
}

export async function getGroupedPostsByYear() {
  return (await getPublishedPosts()).reduce((acc, post) => {
    const year = post.data.pubDate.getFullYear();
    acc.set(year, [...(acc.get(year) ?? []), post]);
    return acc;
  }, new Map<number, BlogPost[]>());
}

export function getAdjacentPosts(posts: BlogPost[], currentPostId: string) {
  const index = posts.findIndex((post) => post.id === currentPostId);

  return {
    nextPost: index > 0 ? posts[index - 1] : null,
    prevPost: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function getRelatedPosts(posts: BlogPost[], currentPostId: string, limit = 2) {
  const currentPost = posts.find((post) => post.id === currentPostId);

  if (!currentPost) {
    return [];
  }

  return posts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      const overlap = post.data.tags.filter((tag) =>
        currentPost.data.tags.includes(tag),
      ).length;

      return { post, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) {
        return b.overlap - a.overlap;
      }

      return b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime();
    })
    .slice(0, limit)
    .map((item) => item.post);
}

export function estimateReadingMinutes(content) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_\-\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const chineseChars = (plainText.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWords = plainText
    .replace(/[\u4e00-\u9fff]/g, " ")
    .match(/[A-Za-z0-9_]+/g)?.length ?? 0;

  return Math.max(1, Math.ceil((chineseChars + latinWords) / 280));
}
