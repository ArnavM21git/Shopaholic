"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  // Start with a "no value" so server and client don't disagree.
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);

  // On mount, read the server-provided html attribute, cookie, or OS preference.
  useEffect(() => {
    setMounted(true);
    try {
      if (typeof document !== 'undefined') {
        // cookie takes precedence
        const match = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
        if (match) {
          setTheme(match[1]);
          return;
        }

        // server-rendered attribute set in RootLayout
        const server = document.documentElement.getAttribute('data-theme');
        if (server === 'light' || server === 'dark') {
          setTheme(server);
          return;
        }

  // Do not auto-apply OS-level dark preference here to avoid overriding
  // the server-provided theme or cookie. Default will be 'light' below.
      }
    } catch (e) {
      // ignore
    }
    setTheme('light');
  }, []);

  // sync theme change to the DOM and set a cookie for SSR — only after mount and when theme is set
  useEffect(() => {
    if (!mounted || (theme !== 'light' && theme !== 'dark')) return;
    try {
      document.documentElement.setAttribute('data-theme', theme);
      // set cookie for 1 year
      document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch (e) {
      // ignore
    }
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
      {/* Accessible status for screen readers announcing theme changes -- only render after mount to avoid hydration mismatch */}
      {mounted && (theme === 'dark' || theme === 'light') && (
        <div aria-live="polite" role="status" className="sr-only">
          {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme();
  const isCompact = !!(className && className.includes('compact'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isCompact) {
    return (
      <button onClick={toggle} aria-label="Toggle theme" className={className} title="Toggle theme">
        {/* Render a neutral placeholder on the server and before mount to avoid hydration mismatch */}
        {!mounted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.15" />
          </svg>
        ) : theme === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.22 4.22l1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.36 18.36l1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
          </svg>
        )}
      </button>
    );
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className={className}>
      <span className="knob" aria-hidden="true" />
      <span style={{ display: 'none' }}>{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
