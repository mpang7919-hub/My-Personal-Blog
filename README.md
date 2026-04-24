# 鸣的技术手记

使用 Astro + MDX 构建的个人博客，内容方向包括：

- Python 爬虫
- JS 逆向
- AI 大模型

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 新增文章

在 `src/content/blog` 下新增 `.mdx` 文件，并填写 frontmatter：

```md
---
title: "文章标题"
description: "文章摘要"
pubDate: "2026-04-24"
tags: ["标签1", "标签2"]
draft: false
---
```

## 部署到 Vercel

这个项目是 Astro 静态站点，默认不需要额外适配器配置。

1. 把项目推到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 中导入仓库。
3. 保持 Astro 自动识别出来的默认构建设置。
4. 部署完成后即可获得一个 `*.vercel.app` 地址。

## 站点 URL 配置

为了让 `sitemap.xml`、RSS 和 canonical URL 正常工作，建议配置站点 URL：

- 本地开发：复制 `.env.example` 为 `.env.local`，填入 `SITE_URL`
- Vercel：二选一
  - 手动添加环境变量 `SITE_URL`
  - 或启用 Vercel 的 `Automatically expose System Environment Variables`，项目会自动读取 `VERCEL_PROJECT_PRODUCTION_URL`

## 参考

- Astro Vercel 部署文档：https://docs.astro.build/en/guides/deploy/vercel/
- Vercel 系统环境变量文档：https://vercel.com/docs/environment-variables/system-environment-variables
