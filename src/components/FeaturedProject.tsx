interface FeaturedProjectProps {
  name: string;
  shortDescription: string;
  url?: string;
  dateRange: string;
}

export default function FeaturedProject({
  name,
  shortDescription,
  url,
  dateRange,
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
          <div className="dates">{dateRange}</div>
        </div>
        <div className="go">view →</div>
      </a>
    </div>
  );
}
