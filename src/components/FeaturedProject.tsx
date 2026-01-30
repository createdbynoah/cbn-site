import TagPill from './TagPill';

interface FeaturedProjectProps {
  name: string;
  shortDescription: string;
  description?: string;
  url?: string;
  techStack?: string[];
  dateRange: string;
  showDescription?: boolean;
  showTechStack?: boolean;
}

export default function FeaturedProject({
  name,
  shortDescription,
  description,
  url,
  techStack,
  dateRange,
  showDescription = false,
  showTechStack = false,
}: FeaturedProjectProps) {
  return (
    <div className="current-focus fade fade-3">
      <h2 className="section-heading">Current Focus</h2>
      <a
        className="card"
        href={url || '#'}
        {...(url ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        <div className="info">
          <div className="name">{name}</div>
          <div className="hint">{shortDescription}</div>
          {showDescription && description && (
            <div
              className="hint"
              style={{
                whiteSpace: 'normal',
                marginTop: '4px',
                color: 'var(--muted)',
                fontSize: '12px',
              }}
            >
              {description}
            </div>
          )}
          {showTechStack && techStack && techStack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {techStack.map((tech) => (
                <TagPill key={tech} label={tech} />
              ))}
            </div>
          )}
          <div className="dates">{dateRange}</div>
        </div>
        <div className="go">view →</div>
      </a>
    </div>
  );
}
