import rss from "@astrojs/rss";
import {
  getPostDescription,
  getPostSlug,
  getPostTitle,
  getPublishedPosts,
} from "../lib/posts";
import { siteConfig } from "../lib/site";

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: getPostTitle(post, true),
      description: getPostDescription(post, true),
      pubDate: post.data.pubDate,
      link: `/blog/${getPostSlug(post)}`,
    })),
  });
}
