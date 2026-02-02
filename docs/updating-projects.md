# Updating Projects

Projects are stored as individual Markdown files in `src/content/projects/`. Each file uses YAML frontmatter for metadata and an optional Markdown body for extended description.

## File Location

```
src/content/projects/
├── expense-planner.md
├── binit.md
└── fitness-wiki.md
```

## Adding a New Project

Create a new `.md` file in `src/content/projects/`. The filename becomes the project slug used in URLs and the resume's `projects` array.

### Template

```md
---
name: My Project
shortDescription: 'One-line summary of the project'
description: 'A longer description with more detail about what the project does and why it exists.'
url: 'https://myproject.com'
techStack:
  - Next.js
  - TypeScript
  - PostgreSQL
status: active
featured: false
currentFocus: false
dateStart: 2026-01-15
order: 3
---

Optional extended body content in Markdown.
```

## Frontmatter Fields

| Field              | Type       | Required | Default | Description                                                  |
|--------------------|------------|----------|---------|--------------------------------------------------------------|
| `name`             | `string`   | yes      | —       | Display name of the project                                  |
| `shortDescription` | `string`   | yes      | —       | One-line summary shown on project cards                      |
| `description`      | `string`   | yes      | —       | Longer description for detail views                          |
| `url`              | `string`   | no       | —       | Link to the live project or repo                             |
| `techStack`        | `string[]` | no       | `[]`    | List of technologies (rendered as tag pills)                 |
| `status`           | `enum`     | yes      | —       | One of: `active`, `completed`, `upcoming`                    |
| `featured`         | `boolean`  | no       | `false` | Marks the project as featured                                |
| `currentFocus`     | `boolean`  | no       | `false` | Highlights as "Current Focus" at the top of the projects page|
| `dateStart`        | `date`     | yes      | —       | Project start date (YYYY-MM-DD)                              |
| `dateEnd`          | `date`     | no       | —       | Project end date (YYYY-MM-DD), omit if ongoing               |
| `image`            | `string`   | no       | —       | Path to a project screenshot or logo                         |
| `order`            | `number`   | no       | `0`     | Sort order on the projects page (lower = first)              |

### Status Values

- **`active`** — Currently being worked on
- **`completed`** — Finished project
- **`upcoming`** — Planned but not yet started

### Current Focus

Setting `currentFocus: true` on a project renders it in a prominent "Current Focus" section at the top of the projects page, separate from the regular project grid. Only one project should have this set at a time.

## Common Tasks

### Add a new project

1. Create `src/content/projects/my-project.md` with the frontmatter template above
2. Set the `order` field to position it in the list (lower numbers appear first)
3. If you want it on the resume page, add the slug `'my-project'` to the `projects` array in `src/data/resume.ts`

### Mark a project as completed

Update the frontmatter:

```yaml
status: completed
dateEnd: 2026-02-01
currentFocus: false
```

### Change the current focus project

1. Set `currentFocus: false` on the old focus project
2. Set `currentFocus: true` on the new one

### Reorder projects

Change the `order` values. Projects are sorted ascending by `order` — `0` appears first, `1` second, etc.

## Validation

All frontmatter is validated at build time using a Zod schema (`src/lib/schemas.ts`). If a required field is missing or a value has the wrong type, the build will fail with a descriptive error.

## Examples

**Active project with current focus:**
```yaml
---
name: Expense Planner
shortDescription: 'Next.js full-stack budgeting app'
description: 'A full-stack budgeting application...'
url: 'https://expense-planner.noahcancode.com'
techStack:
  - Next.js
  - TypeScript
  - Prisma
  - PostgreSQL
  - Tailwind
status: active
currentFocus: true
dateStart: 2024-12-01
order: 0
---
```

**Completed project:**
```yaml
---
name: Binit
shortDescription: 'AI-native mobile app for waste tracking'
description: 'An AI-powered mobile application...'
url: 'https://www.getbinit.com/'
techStack:
  - React Native
  - TypeScript
  - Expo
  - AI/ML
  - Node.js
status: completed
featured: true
dateStart: 2024-07-01
dateEnd: 2025-12-01
order: 1
---
```

**Upcoming project:**
```yaml
---
name: Fitness Wiki
shortDescription: '[coming soon]'
description: 'A comprehensive fitness knowledge base...'
techStack:
  - Next.js
  - TypeScript
status: upcoming
dateStart: 2025-12-01
order: 2
---
```
