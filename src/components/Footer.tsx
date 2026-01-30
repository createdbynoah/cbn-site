'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fade">
      <div>© {new Date().getFullYear()} Created by Noah | Noah Rodgers</div>
      {pathname === '/' && (
        <div>
          Press <strong>/</strong> to jump to links
        </div>
      )}
    </footer>
  );
}
