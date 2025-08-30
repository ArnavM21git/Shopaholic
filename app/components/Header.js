'use client';

import { ThemeToggle } from '../../context/ThemeProvider';

export default function Header() {
  return (
    <header className="topbar">
      <div className="logo">
        <a href="/">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ width: 20, height: 20 }}>
            <path d="M3 3h18v4H3z" fill="currentColor" opacity="0.12" />
            <path d="M6 7l2 10h8l2-10" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </svg>
          <span>Shopaholic</span>
        </a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <nav>
          <a 
            href="/" 
            className="nav-link"
          >
            New List
          </a>
          <a 
            href="/lists" 
            className="nav-link"
          >
            Saved Lists
          </a>
        </nav>
        <ThemeToggle className="theme-toggle compact" />
      </div>
    </header>
  );
}
