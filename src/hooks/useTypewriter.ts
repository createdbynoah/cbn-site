'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
  const messageIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const tick = useCallback(() => {
    const currentMessage = messages[messageIndexRef.current];

    if (!isDeletingRef.current && charIndexRef.current < currentMessage.length) {
      charIndexRef.current++;
      setText(currentMessage.substring(0, charIndexRef.current));
      timerRef.current = setTimeout(tick, typingSpeed);
    } else if (!isDeletingRef.current && charIndexRef.current === currentMessage.length) {
      isDeletingRef.current = true;
      timerRef.current = setTimeout(tick, pauseAfterComplete);
    } else if (isDeletingRef.current && charIndexRef.current > 0) {
      charIndexRef.current--;
      setText(currentMessage.substring(0, charIndexRef.current));
      timerRef.current = setTimeout(tick, deletingSpeed);
    } else if (isDeletingRef.current && charIndexRef.current === 0) {
      isDeletingRef.current = false;
      messageIndexRef.current = (messageIndexRef.current + 1) % messages.length;
      timerRef.current = setTimeout(tick, pauseAfterDelete);
    }
  }, [messages, typingSpeed, deletingSpeed, pauseAfterComplete, pauseAfterDelete]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(messages[0]);
      return;
    }

    timerRef.current = setTimeout(tick, startDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [messages, startDelay, tick]);

  return text;
}
