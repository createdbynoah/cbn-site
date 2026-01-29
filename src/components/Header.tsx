'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fade fade-1">
      <div className="brand">
        <Link href="/">
          <strong>Noah Rodgers</strong>
        </Link>
        <span>product engineer</span>
      </div>
      <nav>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? {
                    color: 'rgba(255,255,255,0.88)',
                    borderColor: 'var(--line)',
                  }
                : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
