import { getCollection } from "astro:content";

export async function getPublishedPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getAllTags() {
  const posts = await getPublishedPosts();
  const tags = new Set(posts.flatMap((post) => post.data.tags));

  return [...tags].sort((a, b) => a.localeCompare(b));
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
