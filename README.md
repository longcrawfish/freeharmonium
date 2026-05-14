🌍 *[English](README.md) ∙ [简体中文](README_zh.md) ∙ [日本語](README_ja.md)*

# Next.js Starter - Multilingual Next.js 16 Starter

A feature-rich Next.js 16 multilingual starter template to help you quickly build globally-ready websites.

- [👉 Source Code](https://github.com/weijunext/nextjs-starter)
- [👉 Live Demo](https://nextjsstarter.io/)

**🚀 Looking for a full-featured SaaS Starter Template? [Check out the complete version](https://nexty.dev)**

## ✨ Features

- 🌐 Built-in i18n support (English, Chinese, Japanese)
- 🎨 Modern UI design with Tailwind CSS
- 🌙 Dark/Light theme toggle
- 📱 Responsive layout
- 📝 MDX blog system 
- 🔍 SEO optimization
- 📊 Integrated analytics tools
  - Google Analytics
  - Baidu Analytics
  - Google Adsense
  - Vercel Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher, below 25 (`>=20 <25`)
- Corepack, included with modern Node.js releases
- pnpm 10.12.4, resolved from the `packageManager` field

> **Note**: Use pnpm through Corepack so everyone gets the pinned `pnpm@10.12.4` version.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/weijunext/nextjs-starter.git
cd nextjs-starter
```

2. Enable Corepack (recommended):
```bash
corepack enable
corepack prepare pnpm@10.12.4 --activate
```

3. Install dependencies:
```bash
pnpm install
```

4. Copy environment variables:
```bash
cp -f .env.example .env
```

5. Start the development server:
```bash
pnpm dev
```

Visit http://localhost:3000 to view your application.

### Common Commands

```bash
pnpm install   # install dependencies
pnpm dev       # start the local development server
pnpm lint      # run ESLint
pnpm build     # create a production build
pnpm start     # start the production server after pnpm build
```

## ⚙️ Configuration

1. Basic Setup
   - Edit `config/site.ts` for website information
   - Update icons and logo in `public/`
   - Configure `app/sitemap.ts` for sitemap
   - Update `app/robots.ts` for robots.txt

2. i18n Setup
   - Add/modify language files in `i18n/messages/`
   - Configure supported languages in `i18n/routing.ts`
   - Set up i18n routing in `middleware.ts`
   - Create pages under `app/[locale]/`
   - Use the `Link` component from `i18n/routing.ts` instead of Next.js default

## 📝 Content Management

### Blog Posts
Create MDX files in `blog/[locale]` with the following format:

```markdown
---
title: Post Title
description: Post Description
image: /image.png
slug: /url-path
tags: tag1,tag2
date: 2025-02-20
visible: published
pin: true
---

Post content...
```

Reference `types/blog.ts` for supported fields.

### Static Pages
Manage static page content in `content/[page]/[locale].mdx`.

## 🔍 SEO Optimization

Built-in comprehensive SEO features:
   - Server-side rendering and static generation
   - Automatic sitemap.xml generation
   - robots.txt configuration
   - Optimized metadata
   - Open Graph support
   - Multilingual SEO support

## 📊 Analytics

Enable analytics by adding IDs in `.env`:
```
NEXT_PUBLIC_GOOGLE_ANALYTICS=
NEXT_PUBLIC_BAIDU_TONGJI=
NEXT_PUBLIC_GOOGLE_ADSENSE=
```

## 📁 Project Structure

```
nextjs-starter/
├── app/                      # App directory
│   ├── [locale]/            # Internationalized routes
│   │   ├── about/           # About page
│   │   ├── blog/           # Blog pages
│   │   └── ...              # Other pages
│   ├── api/                 # API routes
│   └── globals/             # Global components
├── blog/                   # Blog content (MDX)
│   ├── en/                  # English blog
│   ├── ja/                  # Japanese blog
│   └── zh/                  # Chinese blog
├── components/              # Reusable components
│   ├── ui/                  # Base UI components
│   ├── header/              # Header components
│   ├── footer/              # Footer components
│   └── ...                  # Other components
├── config/                  # Configuration files
├── content/                 # Static content (MDX)
├── i18n/                    # Internationalization
│   ├── messages/            # Translation files
│   ├── routing.ts           # Routing configuration
│   └── request.ts           # Request configuration
├── lib/                     # Utility functions
├── public/                  # Static assets
└── types/                   # Type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Internationalization**: next-intl
- **Content**: MDX
- **State Management**: Zustand
- **Deployment**: Vercel
- **Package Manager**: pnpm (recommended)

## 🚀 Deployment

### Manual Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 💡 Development Best Practices

### Package Manager

- Project configured with `packageManager: "pnpm@10.12.4"`
- Enable Corepack: `corepack enable`
- Activate the pinned pnpm version: `corepack prepare pnpm@10.12.4 --activate`
- Team members should use the same pnpm version and avoid committing lockfile changes from other package managers

### Code Quality

```bash
# Lint code
pnpm lint
```

### Troubleshooting Corepack And pnpm

- If `pnpm` is not found, run `corepack enable` and open a new shell.
- If the pnpm shim still is not available, use `corepack pnpm install` or `corepack pnpm dev`.
- If Corepack selects the wrong pnpm version, run `corepack prepare pnpm@10.12.4 --activate`.
- If install logs `Ignored build scripts`, review the package list before running `pnpm approve-builds`.
- If a production build fails in a restricted sandbox with a Turbopack port-binding error, rerun the same command in an environment that allows local worker processes.

### Internationalization Development

1. Adding new language support:
   - Add new language files in `i18n/messages/`
   - Update `i18n/routing.ts` configuration
   - Create corresponding language directories in `blog/` and `content/`

2. Using translations:
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

## 🔧 Troubleshooting

### Common Issues

**1. Package manager version mismatch**
```bash
# Remove node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml
# Reinstall
pnpm install
```

**2. MDX files not displaying**
- Check file path is correct
- Verify frontmatter format
- Ensure `visible` field is set to `published`

**3. Internationalization routing issues**
- Use `Link` component from `i18n/routing.ts`
- Check `middleware.ts` configuration

**4. Styles not working**
- Verify Tailwind CSS class names are correct
- Try restarting development server

### Environment Variables

Ensure `.env` file contains necessary configuration:
```bash
# Copy example config
cp .env.example .env
# Modify as needed
```

## 📄 License

MIT
