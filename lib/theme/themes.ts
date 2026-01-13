import { ThemeType } from '@/types/board';

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    background: string;
    backgroundPattern: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    panelBg: string;
    panelBorder: string;
    gridColor: string;
  };
  effects: {
    glassmorphism: boolean;
    blur: string;
    glow: boolean;
    gridOpacity: number;
  };
}

export const themes: Record<ThemeType, ThemeConfig> = {
  'cosmic-glass': {
    name: 'cosmic-glass',
    displayName: 'Cosmic Glass',
    colors: {
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0f0a1e 100%)',
      backgroundPattern: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
      foreground: '#e0e0ff',
      primary: '#8b5cf6',
      secondary: '#6366f1',
      accent: '#ec4899',
      border: 'rgba(139, 92, 246, 0.3)',
      panelBg: 'rgba(15, 10, 30, 0.7)',
      panelBorder: 'rgba(139, 92, 246, 0.3)',
      gridColor: 'rgba(139, 92, 246, 0.15)',
    },
    effects: {
      glassmorphism: true,
      blur: '12px',
      glow: true,
      gridOpacity: 0.15,
    },
  },

  'minimal-pro': {
    name: 'minimal-pro',
    displayName: 'Minimal Pro',
    colors: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      backgroundPattern: 'none',
      foreground: '#1a1a1a',
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      border: '#e2e8f0',
      panelBg: 'rgba(255, 255, 255, 0.95)',
      panelBorder: '#e2e8f0',
      gridColor: 'rgba(0, 0, 0, 0.05)',
    },
    effects: {
      glassmorphism: false,
      blur: '0px',
      glow: false,
      gridOpacity: 0.05,
    },
  },

  'cyber-motion': {
    name: 'cyber-motion',
    displayName: 'Cyber Motion',
    colors: {
      background: 'linear-gradient(135deg, #000000 0%, #0d1117 50%, #161b22 100%)',
      backgroundPattern: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
      foreground: '#00ff88',
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      border: 'rgba(0, 255, 255, 0.4)',
      panelBg: 'rgba(13, 17, 23, 0.8)',
      panelBorder: 'rgba(0, 255, 255, 0.4)',
      gridColor: 'rgba(0, 255, 255, 0.1)',
    },
    effects: {
      glassmorphism: true,
      blur: '8px',
      glow: true,
      gridOpacity: 0.1,
    },
  },
};

export function getTheme(themeType: ThemeType): ThemeConfig {
  return themes[themeType] || themes['cosmic-glass'];
}

export function applyTheme(themeType: ThemeType) {
  // Only apply theme in browser environment
  if (typeof document === 'undefined') {
    return;
  }

  const theme = getTheme(themeType);
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  root.style.setProperty('--theme-blur', theme.effects.blur);
  root.style.setProperty(
    '--theme-grid-opacity',
    theme.effects.gridOpacity.toString()
  );

  root.setAttribute('data-theme', themeType);
  root.setAttribute('data-glow', theme.effects.glow.toString());
  root.setAttribute(
    'data-glass',
    theme.effects.glassmorphism.toString()
  );
}
