"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Default to light
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize theme from multiple sources with priority order
    let initialTheme = 'light'; // Safe default
    
    try {
      // Only run in browser environment
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // 1. Check for existing cookie first (highest priority)
        const cookieMatch = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
        if (cookieMatch && (cookieMatch[1] === 'light' || cookieMatch[1] === 'dark')) {
          initialTheme = cookieMatch[1];
        } else {
          // 2. If no cookie, check localStorage
          try {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
              initialTheme = storedTheme;
            }
          } catch (e) {
            // localStorage might not be available
          }

          // 3. If no stored preference, check server-rendered attribute
          if (!cookieMatch) {
            const serverTheme = document.documentElement.getAttribute('data-theme');
            if (serverTheme === 'light' || serverTheme === 'dark') {
              initialTheme = serverTheme;
            }
          }
        }

        // Set the theme and ensure DOM is immediately updated
        setTheme(initialTheme);
        updateThemeInDOM(initialTheme);
      }
    } catch (e) {
      console.warn('Theme initialization error:', e);
      // Fallback to light theme
      setTheme('light');
      if (typeof document !== 'undefined') {
        updateThemeInDOM('light');
      }
    }
  }, []);

  const updateThemeInDOM = (newTheme) => {
    try {
      if (typeof document !== 'undefined') {
        // Update DOM
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update cookie for server-side persistence
        document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        
        // Also store in localStorage as backup
        try {
          localStorage.setItem('theme', newTheme);
        } catch (e) {
          // localStorage might not be available
        }
      }
    } catch (e) {
      console.warn('Theme DOM update error:', e);
    }
  };

  useEffect(() => {
    if (!mounted || !theme || (theme !== 'light' && theme !== 'dark')) return;
    updateThemeInDOM(theme);
  }, [theme, mounted]);

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setThemeWithValidation = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: setThemeWithValidation, 
      toggle,
      mounted 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className }) {
  const { theme, toggle, mounted } = useTheme();
  const isCompact = !!(className && className.includes('compact'));

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button 
        className={className} 
        aria-label="Toggle theme" 
        title="Toggle theme"
        disabled
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.15" />
        </svg>
      </button>
    );
  }

  if (isCompact) {
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

  return (
    <button onClick={toggle} aria-label="Toggle theme" className={className}>
      <span className="knob" aria-hidden="true" />
      <span style={{ display: 'none' }}>{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
