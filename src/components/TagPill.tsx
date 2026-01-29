interface TagPillProps {
  label: string;
}

export default function TagPill({ label }: TagPillProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--mono)',
        fontSize: '10px',
        letterSpacing: '0.04em',
        color: 'var(--accent)',
        background: 'rgba(255, 180, 84, 0.1)',
        border: '1px solid rgba(255, 180, 84, 0.2)',
        borderRadius: '999px',
        padding: '3px 10px',
      }}
    >
      {label}
    </span>
  );
}
