interface ConnectLinkProps {
  name: string;
  handle: string;
  url: string;
  external?: boolean;
}

export default function ConnectLink({ name, handle, url, external = true }: ConnectLinkProps) {
  return (
    <a
      className="connect-link scroll-reveal-item"
      href={url}
      {...(external && !url.startsWith('mailto:')
        ? { target: '_blank', rel: 'noreferrer' }
        : {})}
    >
      <div className="name">{name}</div>
      <div className="handle">{handle}</div>
      <div className="arrow">→</div>
    </a>
  );
}
