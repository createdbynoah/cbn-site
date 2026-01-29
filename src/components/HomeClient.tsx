'use client';

import { useEffect, useRef } from 'react';

export default function HomeClient() {
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        const currentFocus = document.querySelector('.current-focus');
        const currentFocusCard = currentFocus?.querySelector('.card');
        if (currentFocus && currentFocusCard) {
          currentFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (currentFocusCard as HTMLElement).focus();
          currentFocus.classList.add('pulse');
          if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
          pulseTimeoutRef.current = setTimeout(
            () => currentFocus.classList.remove('pulse'),
            6000,
          );
        }
      }

      if (e.key === 'Tab') {
        const currentFocus = document.querySelector('.current-focus');
        if (currentFocus?.classList.contains('pulse')) {
          currentFocus.classList.remove('pulse');
          if (pulseTimeoutRef.current) {
            clearTimeout(pulseTimeoutRef.current);
            pulseTimeoutRef.current = null;
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  return null;
}
