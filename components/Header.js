'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="logo">
        <Link href="/">
          <span>Shopaholic</span>
        </Link>
      </div>
      <nav>
        <Link 
          href="/" 
          className={`nav-link ${pathname === '/' ? 'active' : ''}`}
        >
          New List
        </Link>
        <Link 
          href="/lists" 
          className={`nav-link ${pathname === '/lists' ? 'active' : ''}`}
        >
          Saved Lists
        </Link>
      </nav>
    </header>
  );
}
