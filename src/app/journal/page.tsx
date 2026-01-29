import type { Metadata } from 'next';
import { getAllJournalPosts } from '@/lib/content';
import { readingTime } from '@/lib/utils';
import JournalPostCard from '@/components/JournalPostCard';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Thoughts on building software, product engineering, and the creative process.',
};

export default async function JournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <main className="fade fade-2">
      <div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '12px' }}>Journal</h1>
        <p className="sub">
          Thoughts on building software, product engineering, and the creative
          process.
        </p>
      </div>

      {posts.length === 0 ? (
        <div
          style={{
            padding: '48px 0',
            textAlign: 'center',
            color: 'var(--faint)',
            fontFamily: 'var(--mono)',
            fontSize: '13px',
          }}
        >
          No posts yet — check back soon.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map((post) => (
            <JournalPostCard
              key={post.slug}
              slug={post.slug}
              title={post.frontmatter.title}
              description={post.frontmatter.description}
              pubDate={post.frontmatter.pubDate}
              readingTime={readingTime(post.content)}
              tags={post.frontmatter.tags}
              heroImage={post.frontmatter.heroImage}
            />
          ))}
        </div>
      )}
    </main>
  );
}
