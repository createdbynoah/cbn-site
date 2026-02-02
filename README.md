# createdbynoah.com

Personal portfolio and journal built with Next.js 15, statically exported and deployed on Cloudflare Pages.

## Tech Stack

- **Framework** — Next.js 15 (App Router, static export)
- **Language** — TypeScript 5
- **Content** — MDX via next-mdx-remote, gray-matter for frontmatter
- **Syntax Highlighting** — rehype-pretty-code + Shiki
- **Validation** — Zod schemas for all content frontmatter
- **Feed** — RSS generation
- **Hosting** — Cloudflare Pages
- **AI** — Cloudflare Workers AI (quiz generation)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── journal/            # Journal listing + [slug] detail
│   ├── projects/           # Projects listing
│   ├── resume/             # Resume page
│   ├── quiz/               # AI-powered quiz API
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── sitemap.ts          # Sitemap generation
├── components/             # React components
│   ├── embeds/             # YouTubeEmbed, TweetEmbed, CodeSandbox, IframeEmbed
│   ├── LinkPreview.tsx     # Link card component
│   ├── MDXComponents.tsx   # MDX component registry
│   ├── ProjectCard.tsx     # Project card
│   ├── FeaturedProject.tsx # Current focus project highlight
│   ├── JournalPostCard.tsx # Journal post card
│   ├── CategoryFilter.tsx  # Journal category filter
│   ├── ScrollReveal.tsx    # Scroll-triggered animations
│   ├── MouseGradient.tsx   # Mouse-follow gradient effect
│   ├── Typewriter.tsx      # Rotating tagline animation
│   ├── QuizOverlay.tsx     # Interactive quiz modal
│   └── ...
├── content/                # Markdown/MDX content
│   ├── journal/            # Journal posts (organized by category subdirectory)
│   │   ├── coding/
│   │   ├── design/
│   │   └── meta/
│   └── projects/           # Project .md files
├── data/                   # Static data
│   └── resume.ts           # Resume experience, education, skills
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities
│   ├── content.ts          # Content loading (projects + journal)
│   ├── schemas.ts          # Zod schemas for frontmatter validation
│   ├── constants.ts        # Site metadata, nav items, social links
│   ├── quiz-generator.ts   # Deterministic quiz fallback
│   ├── quiz-ai-generator.ts # AI quiz generation
│   └── quiz-cache.ts       # Quiz caching with SHA256 fingerprints
└── styles/                 # CSS
    ├── global.css           # Global styles + CSS variables
    ├── prose.module.css     # Article typography
    └── quiz.css             # Quiz overlay styles
```

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Building

```bash
npm run build
```

Outputs a static export to `out/` for deployment to Cloudflare Pages.

## Environment Variables

For AI quiz generation (optional):

```
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_AI_API_TOKEN=your-cloudflare-ai-token
```

## Content Guides

- [Updating the Resume](docs/updating-resume.md)
- [Updating Projects](docs/updating-projects.md)
- [Writing a Journal Post](docs/writing-journal-posts.md)
