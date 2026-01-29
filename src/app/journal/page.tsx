import type { Metadata } from 'next';
import { getAllJournalPosts, getAllCategories } from '@/lib/content';
import { readingTime } from '@/lib/utils';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Thoughts on building software, product engineering, and the creative process.',
};

export default async function JournalPage() {
  const posts = await getAllJournalPosts();
  const categories = await getAllCategories();

  const serializedPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    pubDate: post.frontmatter.pubDate.toISOString(),
    readingTime: readingTime(post.content),
    tags: post.frontmatter.tags,
    heroImage: post.frontmatter.heroImage,
    category: post.category,
  }));

  return (
    <main className="fade fade-2">
      <div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '12px' }}>Journal</h1>
        <p className="sub">
          Thoughts on building software, product engineering, and the creative
          process.
        </p>
      </div>

      <CategoryFilter posts={serializedPosts} categories={categories} />
    </main>
  );
}
