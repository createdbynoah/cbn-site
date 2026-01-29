import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { projectSchema, journalSchema } from './schemas';
import type { ProjectFrontmatter, JournalFrontmatter } from './schemas';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

function readContentFiles(subdir: string) {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.(md|mdx)$/, '');
      return { slug, data, content };
    });
}

function readContentFilesRecursive(subdir: string) {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  const results: { slug: string; data: Record<string, unknown>; content: string; category: string }[] = [];
  const seenSlugs = new Set<string>();

  function walk(currentDir: string, category: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(currentDir, entry.name), entry.name);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        const raw = fs.readFileSync(path.join(currentDir, entry.name), 'utf-8');
        const { data, content } = matter(raw);
        const slug = (data.slug as string) || entry.name.replace(/\.(md|mdx)$/, '');
        if (seenSlugs.has(slug)) {
          throw new Error(`Duplicate journal slug "${slug}"`);
        }
        seenSlugs.add(slug);
        results.push({ slug, data, content, category });
      }
    }
  }

  // Only walk subdirectories, not root files
  const topEntries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of topEntries) {
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), entry.name);
    }
  }

  return results;
}

export async function getAllProjects() {
  const files = readContentFiles('projects');
  return files
    .map(({ slug, data, content }) => ({
      slug,
      frontmatter: projectSchema.parse(data),
      content,
    }))
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export async function getAllJournalPosts(includeDrafts = false) {
  const files = readContentFilesRecursive('journal');
  return files
    .map(({ slug, data, content, category }) => ({
      slug,
      frontmatter: journalSchema.parse(data),
      content,
      category,
    }))
    .filter((post) => includeDrafts || !post.frontmatter.draft)
    .sort(
      (a, b) =>
        b.frontmatter.pubDate.getTime() - a.frontmatter.pubDate.getTime(),
    );
}

export async function getJournalPost(slug: string) {
  const posts = await getAllJournalPosts(true);
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllCategories() {
  const posts = await getAllJournalPosts();
  const categories = new Set(posts.map((p) => p.category));
  return [...categories].sort();
}

export async function getProject(slug: string) {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
