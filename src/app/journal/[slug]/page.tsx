import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllJournalPosts, getJournalPost } from '@/lib/content';
import { readingTime, formatDate } from '@/lib/utils';
import TagPill from '@/components/TagPill';
import MDXComponents from '@/components/MDXComponents';
import styles from '@/styles/prose.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllJournalPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return {};

  const ogImage = post.frontmatter.ogImage || post.frontmatter.heroImage || '/assets/og-image.png';

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.pubDate.toISOString(),
      ...(post.frontmatter.updatedDate && {
        modifiedTime: post.frontmatter.updatedDate.toISOString(),
      }),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) notFound();

  const dateStr = formatDate(post.frontmatter.pubDate);
  const time = readingTime(post.content);

  return (
    <main className="fade fade-2">
      <article>
        <header
          style={{
            marginBottom: '32px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <Link
            href="/journal"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--faint)',
              display: 'inline-block',
              marginBottom: '24px',
            }}
          >
            ← Back to journal
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '12px' }}>
            {post.frontmatter.title}
          </h1>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              color: 'var(--faint)',
            }}
          >
            <span>{dateStr}</span>
            <span>·</span>
            <span>{time}</span>
          </div>
          {post.frontmatter.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {post.frontmatter.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>
          )}
        </header>

        {post.frontmatter.heroImage && (
          <img
            src={post.frontmatter.heroImage}
            alt=""
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              marginBottom: '32px',
            }}
          />
        )}

        <div className={styles.prose}>
          <MDXRemote source={post.content} components={MDXComponents} />
        </div>
      </article>
    </main>
  );
}
