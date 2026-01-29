'use client';

import { useState } from 'react';
import JournalPostCard from './JournalPostCard';

interface SerializedPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  readingTime: string;
  tags: string[];
  heroImage?: string;
  category: string;
}

interface CategoryFilterProps {
  posts: SerializedPost[];
  categories: string[];
}

export default function CategoryFilter({ posts, categories }: CategoryFilterProps) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <button
          onClick={() => setActive(null)}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            letterSpacing: '0.04em',
            color: 'var(--accent)',
            background: active === null ? 'rgba(255, 180, 84, 0.2)' : 'rgba(255, 180, 84, 0.1)',
            border: `1px solid ${active === null ? 'rgba(255, 180, 84, 0.4)' : 'rgba(255, 180, 84, 0.2)'}`,
            borderRadius: '999px',
            padding: '3px 10px',
            cursor: 'pointer',
            transition: 'background 0.15s ease, border-color 0.15s ease',
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(active === cat ? null : cat)}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: 'var(--accent)',
              background: active === cat ? 'rgba(255, 180, 84, 0.2)' : 'rgba(255, 180, 84, 0.1)',
              border: `1px solid ${active === cat ? 'rgba(255, 180, 84, 0.4)' : 'rgba(255, 180, 84, 0.2)'}`,
              borderRadius: '999px',
              padding: '3px 10px',
              cursor: 'pointer',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
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
          {filtered.map((post) => (
            <JournalPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              pubDate={post.pubDate}
              readingTime={post.readingTime}
              tags={post.tags}
              heroImage={post.heroImage}
            />
          ))}
        </div>
      )}
    </>
  );
}
