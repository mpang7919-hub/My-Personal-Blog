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
slug: "article-slug"
title: "文章标题"
description: "文章摘要"
seoTitle: "SEO 标题"
seoDescription: "SEO 摘要"
pubDate: "2026-04-24"
authorName: "鸣"
status: "published"
featured: false
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

## 内容源配置

项目目前默认使用本地 MDX 文件作为内容源：

```bash
CONTENT_SOURCE=file
```

为了给后续“登录 + 数据库 + 在线编辑”做准备，项目里已经预留了内容源切换入口：

- `file`：当前使用的本地 MDX
- `database`：未来数据库内容源的占位入口

当你准备接数据库时，可以先在环境变量里切换：

```bash
CONTENT_SOURCE=database
DATABASE_URL=your-database-url
```

然后把数据库适配器补到 `src/lib/blog-source.ts`。

## MySQL 初始化

项目已经内置了 MySQL + Drizzle ORM 骨架。

1. 在 `.env.local` 里配置：

```bash
DATABASE_URL=mysql://user:password@127.0.0.1:3306/personal_blog
ADMIN_EMAIL=admin@example.com
ADMIN_DISPLAY_NAME=鸣
ADMIN_PASSWORD=your-admin-password
ADMIN_PASSWORD_HASH=CHANGE_ME_BEFORE_PRODUCTION
```

2. 推送表结构到 MySQL：

```bash
npm run db:push
```

3. 把当前 MDX 文章同步到 MySQL：

```bash
npm run db:seed:file
```

当前阶段数据库主要用于为后续“登录 + 在线编辑”做准备，站点默认仍走文件内容源。

## 最小登录后台

项目已经具备最小登录能力：

- 登录页：`/login`
- 后台页：`/admin`
- 登录接口：`/api/login`
- 退出接口：`/api/logout`

推荐初始化流程：

```bash
npm run db:push
npm run db:seed:file
```

如果你希望重设管理员密码，可以在 `.env.local` 里配置：

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-new-password
```

然后执行：

```bash
npm run db:set-admin-password
```

## 参考

- Astro Vercel 部署文档：https://docs.astro.build/en/guides/deploy/vercel/
- Vercel 系统环境变量文档：https://vercel.com/docs/environment-variables/system-environment-variables
