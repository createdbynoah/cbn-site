import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import LinkPreview from './LinkPreview';
import { IframeEmbed, YouTubeEmbed, TweetEmbed, CodeSandbox } from './embeds';

const MDXComponents: MDXComponentsType = {
  a: (props) => (
    <a
      {...props}
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noreferrer' : undefined}
      style={{ color: 'var(--accent)', textDecoration: 'underline' }}
    />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt || ''}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        border: '1px solid var(--line)',
      }}
    />
  ),
  LinkPreview,
  IframeEmbed,
  YouTubeEmbed,
  TweetEmbed,
  CodeSandbox,
};

export default MDXComponents;
