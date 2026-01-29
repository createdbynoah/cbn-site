'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (menuOpen) {
      document.addEventListener('keydown', onEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [menuOpen, closeMenu]);

  // Close drawer on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
      <header className="fade fade-1">
        <div className="brand">
          <Link href="/">
            <strong>Noah Rodgers</strong>
          </Link>
          <span>product engineer</span>
        </div>

        {/* Desktop nav */}
        <nav className="nav-desktop">
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

      {/* Mobile hamburger — outside header so it has its own stacking context */}
      <button
        className={`hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer overlay */}
      <div
        className={`drawer-overlay${menuOpen ? ' visible' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <nav className={`drawer${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'active'
                : ''
            }
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
