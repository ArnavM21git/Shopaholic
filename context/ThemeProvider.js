"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize theme from multiple sources with priority order
    let initialTheme = null;
    
    try {
      if (typeof document !== 'undefined') {
        // 1. Check for existing cookie first (highest priority)
        const match = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
        if (match && (match[1] === 'light' || match[1] === 'dark')) {
          initialTheme = match[1];
        }

        // 2. If no cookie, check localStorage
        if (!initialTheme) {
          const storedTheme = localStorage.getItem('theme');
          if (storedTheme === 'light' || storedTheme === 'dark') {
            initialTheme = storedTheme;
          }
        }

        // 3. If no stored preference, check server-rendered attribute
        if (!initialTheme) {
          const serverTheme = document.documentElement.getAttribute('data-theme');
          if (serverTheme === 'light' || serverTheme === 'dark') {
            initialTheme = serverTheme;
          }
        }

        // 4. Final fallback to light theme
        if (!initialTheme) {
          initialTheme = 'light';
        }

        // Set the theme and ensure DOM is immediately updated
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        // Ensure persistence across all storage methods
        if (initialTheme) {
          document.cookie = `theme=${initialTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
          localStorage.setItem('theme', initialTheme);
        }
        
        return;
      }
    } catch (e) {
      // Ignore errors silently
    }
    
    // Browser fallback
    setTheme('light');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted || !theme || (theme !== 'light' && theme !== 'dark')) return;
    
    try {
      // Update DOM
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update cookie for server-side persistence
      document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      
      // Also store in localStorage as backup
      localStorage.setItem('theme', theme);
      
    } catch (e) {
      // Ignore errors silently
    }
  }, [theme, mounted]);

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
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
