import TagPill from './TagPill';

interface ProjectCardProps {
  name: string;
  shortDescription: string;
  description?: string;
  url?: string;
  techStack?: string[];
  status?: 'active' | 'completed' | 'upcoming';
  dateRange: string;
  showTechStack?: boolean;
  showDescription?: boolean;
}

export default function ProjectCard({
  name,
  shortDescription,
  description,
  url,
  techStack,
  status,
  dateRange,
  showTechStack = false,
  showDescription = false,
}: ProjectCardProps) {
  const isUpcoming = status === 'upcoming';
  const href = isUpcoming ? '#' : url || '#';

  return (
    <a
      className="card scroll-reveal-item"
      href={href}
      {...(isUpcoming ? { 'aria-disabled': 'true' } : {})}
      {...(!isUpcoming && url ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <div className="info">
        <div className="name">{name}</div>
        <div className="hint">
          {isUpcoming ? '[coming soon]' : shortDescription}
        </div>
        {showDescription && description && !isUpcoming && (
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
      <div className="go">{isUpcoming ? 'not yet →' : 'view →'}</div>
    </a>
  );
}
