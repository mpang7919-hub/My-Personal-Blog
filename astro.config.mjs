import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://blog.example.com");

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
});
