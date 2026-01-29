interface IframeEmbedProps {
  src: string;
  title: string;
  aspectRatio?: string;
  maxWidth?: string;
  allow?: string;
}

export default function IframeEmbed({
  src,
  title,
  aspectRatio = '16/9',
  maxWidth,
  allow,
}: IframeEmbedProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: maxWidth || undefined,
        marginBlock: '16px',
      }}
    >
      <iframe
        src={src}
        title={title}
        allow={allow}
        loading="lazy"
        style={{
          width: '100%',
          aspectRatio,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'block',
        }}
      />
    </div>
  );
}
