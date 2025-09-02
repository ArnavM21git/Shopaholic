"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, read the server-provided html attribute, cookie, or localStorage.
    let initialTheme = 'light'; // Default theme
    try {
      // Priority: 1. Cookie, 2. localStorage, 3. Server-rendered attribute
      const cookieMatch = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
      if (cookieMatch) {
        initialTheme = cookieMatch[1];
      } else {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          initialTheme = storedTheme;
        } else {
          const serverTheme = document.documentElement.getAttribute('data-theme');
          if (serverTheme && (serverTheme === 'light' || serverTheme === 'dark')) {
            initialTheme = serverTheme;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to initialize theme from storage', e);
    }
    setTheme(initialTheme);
  }, []);

  const updateTheme = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    setTheme(newTheme);
    try {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.warn('Failed to persist theme', e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    updateTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, updateTheme]);

  const value = {
    theme,
    setTheme: updateTheme,
    toggle: toggleTheme,
    mounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className }) {
  const { theme, toggle, mounted } = useTheme();
  const isCompact = !!(className && className.includes('compact'));

  // To prevent hydration mismatch, render a placeholder until the component is mounted on the client.
  if (!mounted) {
    return (
      <button className={className} aria-label="Toggle theme" title="Toggle theme" disabled>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.15" />
        </svg>
      </button>
    );
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className={className} title="Toggle theme">
      {theme === 'light' ? (
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
