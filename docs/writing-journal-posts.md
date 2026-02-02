# Writing a Journal Post

Journal posts are MDX files organized into category subdirectories under `src/content/journal/`. MDX extends Markdown with JSX support, allowing you to use custom React components directly in your content.

## File Location

```
src/content/journal/
├── coding/                 # Posts about code and engineering
│   ├── switching-to-nextjs.mdx
│   └── mdx-embed-components.mdx
├── design/                 # Posts about design and UI/UX
│   └── ui-patterns.mdx
└── meta/                   # Posts about the site itself
    └── hello-world.mdx
```

The **subdirectory name** becomes the post's category (shown in the category filter on the journal page). The **filename** (without `.mdx`) becomes the URL slug.

Example: `src/content/journal/coding/my-post.mdx` → category `coding`, URL `/journal/my-post`

## Creating a New Post

1. Choose or create a category subdirectory under `src/content/journal/`
2. Create a new `.mdx` file with a descriptive filename
3. Add the required frontmatter
4. Write your content using Markdown and the available MDX components

### Minimal Template

```mdx
---
title: 'My Post Title'
description: 'A short summary of this post for cards and SEO.'
pubDate: 2026-02-02
tags:
  - example
  - tutorial
---

# My Post Title

Your content goes here.
```

### Full Template (All Fields)

```mdx
---
title: 'My Post Title'
description: 'A short summary of this post for cards and SEO.'
pubDate: 2026-02-02
updatedDate: 2026-02-10
heroImage: '/assets/journal/my-post-hero.png'
ogImage: '/assets/journal/my-post-og.png'
ogTitle: 'Custom Open Graph Title'
ogDescription: 'Custom description for social sharing'
tags:
  - example
  - tutorial
draft: false
---

# My Post Title

Your content goes here.
```

## Frontmatter Fields

| Field           | Type       | Required | Default | Description                                      |
|-----------------|------------|----------|---------|--------------------------------------------------|
| `title`         | `string`   | yes      | —       | Post title (displayed as heading and in cards)    |
| `description`   | `string`   | yes      | —       | Summary for post cards, RSS, and SEO meta         |
| `pubDate`       | `date`     | yes      | —       | Publication date (YYYY-MM-DD), used for sorting   |
| `updatedDate`   | `date`     | no       | —       | Last updated date, shown if set                   |
| `heroImage`     | `string`   | no       | —       | Path to hero image displayed above the post       |
| `ogImage`       | `string`   | no       | —       | Custom Open Graph image for social sharing        |
| `ogTitle`       | `string`   | no       | —       | Custom title for Open Graph (defaults to `title`) |
| `ogDescription` | `string`   | no       | —       | Custom description for Open Graph                 |
| `tags`          | `string[]` | no       | `[]`    | Tag labels displayed as pills on the post         |
| `draft`         | `boolean`  | no       | `false` | Set to `true` to hide from the published listing  |

### Slug Behavior

The slug is derived from the filename by default. You can override it with a `slug` field in the frontmatter, but slugs must be unique across all categories — the build will fail on duplicates.

### Drafts

Posts with `draft: true` are excluded from the journal listing and RSS feed. They are still built and accessible by direct URL during development.

### Images

Store images in `public/assets/journal/` and reference them with absolute paths:

```yaml
heroImage: '/assets/journal/my-post-hero.png'
```

---

## Markdown Formatting

All standard Markdown syntax is supported and styled automatically.

### Headings

```md
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

### Text Formatting

```md
**Bold text** renders in white with font-weight 650.

_Italic text_ renders in italic style.

`Inline code` renders with a monospace font and accent color background.
```

### Links

```md
[External link](https://example.com) — opens in a new tab automatically
[Internal link](/projects) — navigates within the site
```

External links (starting with `http`) automatically get `target="_blank"` and `rel="noreferrer"`.

### Blockquotes

```md
> Blockquotes are styled with an amber left border and italic text.
>
> They can span multiple paragraphs.
```

### Lists

```md
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
```

### Horizontal Rules

```md
---
```

Renders as a subtle divider line.

### Code Blocks

Fenced code blocks get syntax highlighting via Shiki. Specify the language after the opening backticks:

````md
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
````

Supported languages include `typescript`, `javascript`, `jsx`, `tsx`, `css`, `html`, `json`, `bash`, `python`, `sql`, `mdx`, and many more (anything Shiki supports).

### Images

```md
![Alt text](/assets/journal/my-image.png)
```

Images are automatically styled with rounded corners, a subtle border, and responsive sizing.

---

## MDX Embed Components

These React components can be used directly in your `.mdx` files. No imports needed — they are globally registered.

### YouTubeEmbed

Embeds a YouTube video using privacy-enhanced mode (no tracking cookies until playback).

```mdx
<YouTubeEmbed videoId="jNQXAC9IVRw" title="Me at the zoo" />
```

With a start time (in seconds):

```mdx
<YouTubeEmbed videoId="jNQXAC9IVRw" title="Starting at 5s" startAt="5" />
```

| Prop      | Type     | Required | Default          | Description                    |
|-----------|----------|----------|------------------|--------------------------------|
| `videoId` | `string` | yes      | —                | YouTube video ID from the URL  |
| `title`   | `string` | no       | `"YouTube video"`| Accessible title for the embed |
| `startAt` | `number` | no       | —                | Start playback at N seconds    |

The video ID is the part after `v=` in a YouTube URL: `youtube.com/watch?v=jNQXAC9IVRw` → `jNQXAC9IVRw`

---

### TweetEmbed

Renders a static tweet card. No Twitter/X JavaScript is loaded — the content is provided via props and rendered as plain HTML.

```mdx
<TweetEmbed
  tweetId="20"
  author="Jack Dorsey"
  handle="@jack"
  content="just setting up my twttr"
  date="Mar 21, 2006"
/>
```

| Prop      | Type     | Required | Default | Description                              |
|-----------|----------|----------|---------|------------------------------------------|
| `tweetId` | `string` | yes      | —       | The tweet's numeric ID                   |
| `author`  | `string` | no       | —       | Display name of the tweet author         |
| `handle`  | `string` | no       | —       | Twitter handle with @ prefix             |
| `content` | `string` | no       | —       | The tweet text                           |
| `date`    | `string` | no       | —       | Human-readable date string               |

The card links to the tweet on X. All fields except `tweetId` are optional, but including them makes the card useful without requiring API calls.

---

### CodeSandbox

Embeds an interactive CodeSandbox editor.

```mdx
<CodeSandbox sandboxId="new" view="split" title="Try it live" />
```

| Prop        | Type     | Required | Default        | Description                              |
|-------------|----------|----------|----------------|------------------------------------------|
| `sandboxId` | `string` | yes      | —              | CodeSandbox ID (use `"new"` for a blank) |
| `title`     | `string` | no       | `"CodeSandbox"`| Accessible title for the embed           |
| `view`      | `string` | no       | `"split"`      | `"editor"`, `"preview"`, or `"split"`    |

View modes:
- `editor` — code editor only
- `preview` — output preview only
- `split` — side-by-side editor and preview

The embed uses a dark theme to match the site.

---

### IframeEmbed

A generic iframe wrapper for embedding any URL. This is the foundation component that YouTubeEmbed and CodeSandbox are built on.

```mdx
<IframeEmbed
  src="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio"
  title="MDN: aspect-ratio"
  aspectRatio="4/3"
/>
```

| Prop          | Type     | Required | Default  | Description                              |
|---------------|----------|----------|----------|------------------------------------------|
| `src`         | `string` | yes      | —        | URL to embed                             |
| `title`       | `string` | yes      | —        | Accessible title (required for a11y)     |
| `aspectRatio` | `string` | no       | `"16/9"` | CSS aspect-ratio value                   |
| `maxWidth`    | `string` | no       | —        | CSS max-width, e.g. `"600px"`           |
| `allow`       | `string` | no       | —        | iframe permission policy                 |

---

### LinkPreview

Renders a styled link card with title, description, and auto-extracted domain.

```mdx
<LinkPreview
  url="https://nextjs.org"
  title="Next.js"
  description="The React framework for the web"
/>
```

| Prop          | Type     | Required | Default | Description                              |
|---------------|----------|----------|---------|------------------------------------------|
| `url`         | `string` | yes      | —       | Link URL (also used to extract domain)   |
| `title`       | `string` | yes      | —       | Display title                            |
| `description` | `string` | no       | —       | Short description shown below the title  |

The domain is automatically extracted from the URL and displayed at the bottom of the card (e.g. `nextjs.org`).

---

## Full Example Post

```mdx
---
title: 'Building a Design System'
description: 'How I built a lightweight design system for this portfolio site.'
pubDate: 2026-02-15
tags:
  - design
  - css
  - tutorial
heroImage: '/assets/journal/design-system-hero.png'
---

# Building a Design System

This post walks through how I approached creating a minimal, consistent design
system for my portfolio.

## Why bother?

Consistency matters. Even for a personal site, having a defined set of colors,
spacing, and typography makes every page feel intentional.

> Design is not just what it looks like. Design is how it works.

## The color palette

The site uses CSS custom properties for theming:

```css
:root {
  --accent: #ffb454;
  --muted: rgba(255, 255, 255, 0.72);
  --faint: rgba(255, 255, 255, 0.4);
  --line: rgba(255, 255, 255, 0.08);
}
```

## A video walkthrough

<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Design system walkthrough" />

## Inspiration

<TweetEmbed
  tweetId="1234567890"
  author="Steve Jobs"
  handle="@stevejobs"
  content="Design is not just what it looks like and feels like. Design is how it works."
  date="Jan 1, 2007"
/>

## Try it yourself

<CodeSandbox sandboxId="new" view="split" title="Playground" />

## Further reading

<LinkPreview
  url="https://every-layout.dev"
  title="Every Layout"
  description="Relearn CSS layout through algorithmic design"
/>

---

That's the system. Simple, consistent, and easy to extend.
```

## Category Organization

Categories are derived from the subdirectory name. To create a new category, create a new subdirectory under `src/content/journal/`:

```
src/content/journal/new-category/my-post.mdx
```

The category name `new-category` will automatically appear in the filter on the journal page.

Existing categories:
- `coding` — Code, engineering, and technical posts
- `design` — Design, UI/UX, and visual topics
- `meta` — Posts about the site itself

## Validation

All frontmatter is validated at build time using a Zod schema (`src/lib/schemas.ts`). Missing required fields or wrong types will cause a build error with a descriptive message.
