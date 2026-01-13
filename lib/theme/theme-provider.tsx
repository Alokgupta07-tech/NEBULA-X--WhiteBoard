'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeType } from '@/types/board';
import { getTheme, applyTheme } from './themes';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('cosmic-glass');
  const [isDark, setIsDarkState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('nebulaboard-theme') as ThemeType | null;
    const savedDarkMode = localStorage.getItem('nebulaboard-dark') === 'true';

    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('cosmic-glass');
    }

    setIsDarkState(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('nebulaboard-theme', newTheme);
  };

  const setIsDark = (newIsDark: boolean) => {
    setIsDarkState(newIsDark);
    localStorage.setItem('nebulaboard-dark', newIsDark.toString());

    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
