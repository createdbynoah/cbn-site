import TagPill from './TagPill';

interface SkillGroupProps {
  category: string;
  items: string[];
}

export default function SkillGroup({ category, items }: SkillGroupProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--faint)',
          marginBottom: '8px',
        }}
      >
        {category}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {items.map((item) => (
          <TagPill key={item} label={item} />
        ))}
      </div>
    </div>
  );
}
