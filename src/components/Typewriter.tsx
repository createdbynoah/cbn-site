'use client';

import { useTypewriter } from '@/hooks/useTypewriter';
import { KICKER_MESSAGES } from '@/lib/constants';

export default function Typewriter() {
  const text = useTypewriter({ messages: KICKER_MESSAGES });

  return (
    <div className="kicker">
      <span className="kicker-text">{text}</span>
      <span className="cursor">|</span>
    </div>
  );
}
