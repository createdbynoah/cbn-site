'use client';

import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  messages: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterComplete?: number;
  pauseAfterDelete?: number;
  startDelay?: number;
}

export function useTypewriter({
  messages,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseAfterComplete = 3000,
  pauseAfterDelete = 500,
  startDelay = 800,
}: UseTypewriterOptions) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText('');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(messages[0]);
      return;
    }

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const currentMessage = messages[messageIndex];

      if (!isDeleting && charIndex < currentMessage.length) {
        charIndex++;
        setText(currentMessage.substring(0, charIndex));
        timer = setTimeout(tick, typingSpeed);
      } else if (!isDeleting && charIndex === currentMessage.length) {
        isDeleting = true;
        timer = setTimeout(tick, pauseAfterComplete);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setText(currentMessage.substring(0, charIndex));
        timer = setTimeout(tick, deletingSpeed);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        timer = setTimeout(tick, pauseAfterDelete);
      }
    }

    timer = setTimeout(tick, startDelay);

    return () => clearTimeout(timer);
  }, [messages, typingSpeed, deletingSpeed, pauseAfterComplete, pauseAfterDelete, startDelay]);

  return text;
}
