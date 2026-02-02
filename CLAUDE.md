# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and journal site (createdbynoah.com) built with Next.js 15 App Router, statically exported and deployed on Cloudflare Pages.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Static export to out/
npm run start    # Serve production build
```

No test runner or linter is configured.

## Architecture

**Static site** — `output: 'export'` in next.config.js means no server runtime. All pages are pre-rendered at build time. The build outputs static HTML/CSS/JS to `out/`.

**Content pipeline**: Markdown/MDX files in `src/content/` are parsed with gray-matter and validated against Zod schemas (`src/lib/schemas.ts`) at build time. Journal posts use MDX via next-mdx-remote with syntax highlighting from rehype-pretty-code + Shiki.

**Path alias**: `@/*` maps to `./src/*`.

### Key Directories

- `src/content/journal/{category}/` — MDX journal posts organized by category subdirectory. The subdirectory name is the category, the filename is the slug.
- `src/content/projects/` — Markdown project files. The filename is the slug.
- `src/data/resume.ts` — All resume data as a typed TypeScript object. Projects reference slugs from `src/content/projects/`.
- `src/lib/content.ts` — Content loading functions (reads filesystem, parses frontmatter).
- `src/lib/schemas.ts` — Zod validation schemas for all content frontmatter.
- `src/lib/constants.ts` — Site metadata, nav items, social links.
- `src/lib/quiz-*.ts` — Quiz generation pipeline (AI generation via Cloudflare Workers AI with deterministic fallback, caching with SHA256 fingerprints).
- `src/components/embeds/` — MDX embed components (YouTubeEmbed, TweetEmbed, CodeSandbox, IframeEmbed) globally registered in MDXComponents.tsx.

### Styling

CSS-first approach using CSS custom properties — no Tailwind, no CSS-in-JS. Global styles in `src/styles/global.css` define the color system (`--bg`, `--text`, `--accent`, `--muted`, `--faint`, `--line`). Responsive sizing uses `clamp()` for fluid typography.

### Client vs Server Components

Server components are the default (async page components that load content at build time). Client components are marked with `'use client'` and handle interactivity: QuizOverlay, CategoryFilter, ScrollReveal, MouseGradient, Typewriter, HomeClient.

## Content Authoring

Detailed guides are in `docs/`:
- `docs/writing-journal-posts.md` — Journal post creation, frontmatter fields, MDX embed components
- `docs/updating-projects.md` — Project file format, frontmatter fields, status values
- `docs/updating-resume.md` — Resume data structure and TypeScript interfaces

## Environment Variables

Optional, for AI quiz generation only:
```
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_AI_API_TOKEN=your-cloudflare-ai-token
```
