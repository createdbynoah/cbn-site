import Link from 'next/link';
import TagPill from './TagPill';

interface JournalPostCardProps {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  readingTime: string;
  tags: string[];
  heroImage?: string;
}

export default function JournalPostCard({
  slug,
  title,
  description,
  pubDate,
  readingTime,
  tags,
  heroImage,
}: JournalPostCardProps) {
  const dateStr = new Date(pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/journal/${slug}`} className="card" style={{ textDecoration: 'none' }}>
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          style={{
            width: '100%',
            height: '160px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
        />
      )}
      <div className="info">
        <div className="name">{title}</div>
        <div className="hint" style={{ whiteSpace: 'normal' }}>
          {description}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
        <div className="dates">
          {dateStr} · {readingTime}
        </div>
      </div>
      <div className="go">read →</div>
    </Link>
  );
}
