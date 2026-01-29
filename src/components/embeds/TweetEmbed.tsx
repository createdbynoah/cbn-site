interface TweetEmbedProps {
  tweetId: string;
  author?: string;
  handle?: string;
  content?: string;
  date?: string;
}

export default function TweetEmbed({
  tweetId,
  author,
  handle,
  content,
  date,
}: TweetEmbedProps) {
  return (
    <a
      href={`https://x.com/${handle?.replace('@', '') || 'x'}/status/${tweetId}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'block',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.2s ease, background 0.2s ease',
        marginBlock: '16px',
      }}
    >
      {(author || handle) && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
          {author && (
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
              {author}
            </span>
          )}
          {handle && (
            <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--faint)' }}>
              {handle}
            </span>
          )}
        </div>
      )}
      {content && (
        <div style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--muted)' }}>
          {content}
        </div>
      )}
      {date && (
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--mono)',
            color: 'var(--faint)',
            marginTop: '8px',
          }}
        >
          {date}
        </div>
      )}
    </a>
  );
}
