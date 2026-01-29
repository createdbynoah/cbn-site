import IframeEmbed from './IframeEmbed';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  startAt?: number;
}

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
  startAt,
}: YouTubeEmbedProps) {
  const url = `https://www.youtube-nocookie.com/embed/${videoId}${startAt ? `?start=${startAt}` : ''}`;

  return (
    <IframeEmbed
      src={url}
      title={title}
      aspectRatio="16/9"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
