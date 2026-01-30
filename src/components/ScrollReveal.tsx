'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({ children, className, style }: ScrollRevealProps) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
