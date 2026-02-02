# Updating the Resume

All resume data lives in a single file: `src/data/resume.ts`. There is no markdown or frontmatter involved — it's a typed TypeScript object.

## File Location

```
src/data/resume.ts
```

## Data Structure

The file exports a `resume` object with four sections:

### Experience

```ts
experience: [
  {
    company: 'Binit',
    role: 'Lead Product Engineer',
    location: 'Remote',
    dateStart: 'Jul 2024',
    dateEnd: 'Dec 2025',       // omit for current role
    highlights: [
      'Architected and shipped an AI-native mobile app...',
      'Led cross-functional development...',
    ],
    url: 'https://www.getbinit.com/',  // optional
  },
]
```

| Field       | Type       | Required | Notes                                       |
|-------------|------------|----------|---------------------------------------------|
| `company`   | `string`   | yes      | Company or organization name                |
| `role`      | `string`   | yes      | Job title                                   |
| `location`  | `string`   | yes      | e.g. "Remote", "San Francisco, CA"          |
| `dateStart` | `string`   | yes      | Free-form date string, e.g. "Jul 2024"      |
| `dateEnd`   | `string`   | no       | Omit for current/ongoing roles              |
| `highlights`| `string[]` | yes      | Bullet points describing the role           |
| `url`       | `string`   | no       | Link to the company website                 |

### Education

```ts
education: [
  {
    institution: 'Self-directed',
    degree: 'Full-Stack Engineering',
    field: 'Software Development',
    dateStart: '2023',
    highlights: [
      'Full-stack TypeScript (React, Next.js, Node.js)',
      'AI/ML integration and prompt engineering',
    ],
  },
]
```

| Field         | Type       | Required | Notes                                  |
|---------------|------------|----------|----------------------------------------|
| `institution` | `string`   | yes      | School or learning context             |
| `degree`      | `string`   | yes      | Degree name or equivalent              |
| `field`       | `string`   | yes      | Field of study                         |
| `dateStart`   | `string`   | yes      | Free-form date string                  |
| `dateEnd`     | `string`   | no       | Omit if ongoing                        |
| `highlights`  | `string[]` | no       | Optional bullet points                 |

### Skills

```ts
skills: [
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML', 'CSS'],
  },
  {
    category: 'Frameworks',
    items: ['Next.js', 'React', 'React Native', 'Expo', 'Node.js', 'Express'],
  },
]
```

| Field      | Type       | Required | Notes                         |
|------------|------------|----------|-------------------------------|
| `category` | `string`   | yes      | Skill group label             |
| `items`    | `string[]` | yes      | Individual skills in group    |

### Projects

The `projects` array is a list of project slugs that appear in the resume's project section. These reference files in `src/content/projects/`.

```ts
projects: ['expense-planner', 'binit', 'fitness-wiki']
```

The slug must match a filename in `src/content/projects/` (without the `.md` extension).

## Common Tasks

### Add a new job

Add a new object to the beginning of the `experience` array (most recent first):

```ts
experience: [
  {
    company: 'Acme Corp',
    role: 'Senior Engineer',
    location: 'New York, NY',
    dateStart: 'Jan 2026',
    highlights: [
      'Built and launched the new billing system',
      'Reduced API latency by 40%',
    ],
    url: 'https://acme.com',
  },
  // ... existing entries
]
```

### End a current role

Add a `dateEnd` field to the entry:

```ts
dateEnd: 'Feb 2026',
```

### Add a new skill

Add the skill string to the appropriate category's `items` array, or create a new skill group:

```ts
{
  category: 'Databases',
  items: ['PostgreSQL', 'Redis', 'MongoDB'],
},
```

### Add a project to the resume

1. Make sure the project has a `.md` file in `src/content/projects/` (see [Updating Projects](updating-projects.md))
2. Add the slug to the `projects` array:

```ts
projects: ['expense-planner', 'binit', 'fitness-wiki', 'new-project']
```

## TypeScript Interfaces

The file defines these interfaces — your data must conform to them:

```ts
interface ResumeExperience {
  company: string;
  role: string;
  location: string;
  dateStart: string;
  dateEnd?: string;
  highlights: string[];
  url?: string;
}

interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  dateStart: string;
  dateEnd?: string;
  highlights?: string[];
}

interface ResumeSkillGroup {
  category: string;
  items: string[];
}
```

TypeScript will catch any missing required fields or type mismatches at build time.
