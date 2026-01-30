interface ResumeEntryProps {
  title: string;
  subtitle: string;
  location?: string;
  dateRange: string;
  highlights: string[];
  url?: string;
}

export default function ResumeEntry({
  title,
  subtitle,
  location,
  dateRange,
  highlights,
  url,
}: ResumeEntryProps) {
  const Wrapper = url ? 'a' : 'div';
  const wrapperProps = url
    ? { href: url, target: '_blank' as const, rel: 'noreferrer' }
    : {};

  return (
    <Wrapper
      className="card scroll-reveal-item"
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: url ? 'pointer' : 'default' }}
      {...wrapperProps}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div className="name">{title}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            {subtitle}
            {location && <span> · {location}</span>}
          </div>
        </div>
        <div className="dates">{dateRange}</div>
      </div>
      {highlights.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: '16px',
            fontSize: '13px',
            color: 'var(--muted)',
            lineHeight: '1.5',
            listStyle: 'disc',
          }}
        >
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
