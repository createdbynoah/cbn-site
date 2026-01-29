interface LinkPreviewProps {
  url: string;
  title: string;
  description?: string;
}

export default function LinkPreview({ url, title, description }: LinkPreviewProps) {
  const domain = new URL(url).hostname.replace('www.', '');

  return (
    <a
      href={url}
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
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--muted)',
            marginTop: '4px',
            fontFamily: 'var(--mono)',
          }}
        >
          {description}
        </div>
      )}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--faint)',
          marginTop: '8px',
          fontFamily: 'var(--mono)',
        }}
      >
        {domain}
      </div>
    </a>
  );
}
