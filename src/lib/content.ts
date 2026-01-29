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
  const files = readContentFiles('journal');
  return files
    .map(({ slug, data, content }) => ({
      slug,
      frontmatter: journalSchema.parse(data),
      content,
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

export async function getProject(slug: string) {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
