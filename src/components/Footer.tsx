'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/quiz') return null;

  return (
    <footer className="fade">
      <div>© {new Date().getFullYear()} Created by Noah | Noah Rodgers</div>
      <div className="footer-right">
        {pathname === '/' && (
          <span className="footer-hint">
            Press <strong>/</strong> to jump to links
          </span>
        )}
        <Link href="/quiz" className="quiz-footer-link">
          Take the quiz
        </Link>
      </div>
    </footer>
  );
}
