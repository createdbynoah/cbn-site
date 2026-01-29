'use client';

import { useEffect, useRef } from 'react';

export function useMousePosition() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = 50;
    let mouseY = 50;

    function update() {
      document.documentElement.style.setProperty('--mouse-x', mouseX + '%');
      document.documentElement.style.setProperty('--mouse-y', mouseY + '%');
      rafRef.current = null;
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth) * 100;
      mouseY = (e.clientY / window.innerHeight) * 100;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update);
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
}
