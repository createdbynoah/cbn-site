import IframeEmbed from './IframeEmbed';

interface CodeSandboxProps {
  sandboxId: string;
  title?: string;
  view?: 'editor' | 'preview' | 'split';
}

export default function CodeSandbox({
  sandboxId,
  title = 'CodeSandbox',
  view = 'split',
}: CodeSandboxProps) {
  const url = `https://codesandbox.io/embed/${sandboxId}?view=${view}&theme=dark`;

  return (
    <IframeEmbed
      src={url}
      title={title}
      aspectRatio="16/9"
      allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
    />
  );
}
