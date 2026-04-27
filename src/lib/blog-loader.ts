import type { Loader } from "astro/loaders";
import { getConfiguredBlogRecords } from "./blog-source";

export function blogLoader(): Loader {
  return {
    name: "blog-loader",
    async load({ generateDigest, parseData, renderMarkdown, store }) {
      const entries = await getConfiguredBlogRecords();

      store.clear();

      for (const entry of entries) {
        const data = await parseData({
          id: entry.id,
          data: entry.data,
        });

        store.set({
          id: entry.id,
          data,
          body: entry.body,
          filePath: entry.filePath,
          digest: generateDigest({ data: entry.data, body: entry.body }),
          rendered: await renderMarkdown(entry.body),
        });
      }
    },
  };
}
