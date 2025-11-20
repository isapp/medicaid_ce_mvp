import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Theme, ThemeTokens, adminTheme, memberTheme } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  tokens: ThemeTokens;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>('admin');

  useEffect(() => {
    if (location.pathname.startsWith('/m')) {
      setTheme('member');
    } else if (location.pathname.startsWith('/admin')) {
      setTheme('admin');
    }
  }, [location.pathname]);

  const tokens = theme === 'admin' ? adminTheme : memberTheme;

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--font-size-base', tokens.fontSize.base);
    root.style.setProperty('--font-size-h1', tokens.fontSize.h1);
    root.style.setProperty('--font-size-h2', tokens.fontSize.h2);
    root.style.setProperty('--font-size-h3', tokens.fontSize.h3);
    root.style.setProperty('--font-size-h4', tokens.fontSize.h4);
    root.style.setProperty('--font-size-h5', tokens.fontSize.h5);
    root.style.setProperty('--font-size-h6', tokens.fontSize.h6);
    root.style.setProperty('--font-size-body', tokens.fontSize.body);
    root.style.setProperty('--font-size-caption', tokens.fontSize.caption);
    
    root.style.setProperty('--color-primary', tokens.colors.primary);
    root.style.setProperty('--color-primary-hover', tokens.colors.primaryHover);
    root.style.setProperty('--color-success', tokens.colors.success);
    root.style.setProperty('--color-warning', tokens.colors.warning);
    root.style.setProperty('--color-destructive', tokens.colors.destructive);
    root.style.setProperty('--color-background', tokens.colors.background);
    root.style.setProperty('--color-surface', tokens.colors.surface);
    root.style.setProperty('--color-foreground', tokens.colors.foreground);
    root.style.setProperty('--color-muted', tokens.colors.muted);
    root.style.setProperty('--color-muted-foreground', tokens.colors.mutedForeground);
    root.style.setProperty('--color-border', tokens.colors.border);
    
    root.style.setProperty('--spacing-xs', tokens.spacing.xs);
    root.style.setProperty('--spacing-sm', tokens.spacing.sm);
    root.style.setProperty('--spacing-md', tokens.spacing.md);
    root.style.setProperty('--spacing-lg', tokens.spacing.lg);
    root.style.setProperty('--spacing-xl', tokens.spacing.xl);
    root.style.setProperty('--spacing-2xl', tokens.spacing['2xl']);
    root.style.setProperty('--spacing-3xl', tokens.spacing['3xl']);
    root.style.setProperty('--spacing-4xl', tokens.spacing['4xl']);
    
    root.style.setProperty('--radius-sm', tokens.radius.sm);
    root.style.setProperty('--radius-md', tokens.radius.md);
    root.style.setProperty('--radius-lg', tokens.radius.lg);
    root.style.setProperty('--radius-full', tokens.radius.full);
    
    root.style.setProperty('--layout-max-width', tokens.layout.maxWidth);
    root.style.setProperty('--layout-min-touch-target', tokens.layout.minTouchTarget);
    
    root.setAttribute('data-theme', theme);
  }, [tokens, theme]);

  const value: ThemeContextValue = {
    theme,
    tokens,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
