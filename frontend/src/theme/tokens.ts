
export interface ThemeTokens {
  fontSize: {
    base: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    body: string;
    caption: string;
  };
  
  colors: {
    primary: string;
    primaryHover: string;
    success: string;
    warning: string;
    destructive: string;
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  
  layout: {
    maxWidth: string;
    minTouchTarget: string;
  };
}

export const adminTheme: ThemeTokens = {
  fontSize: {
    base: '14px',
    h1: '24px',
    h2: '20px',
    h3: '18px',
    h4: '16px',
    h5: '14px',
    h6: '12px',
    body: '14px',
    caption: '12px',
  },
  colors: {
    primary: 'oklch(0.55 0.15 250)',
    primaryHover: 'oklch(0.50 0.15 250)',
    success: 'oklch(0.65 0.15 145)',
    warning: 'oklch(0.75 0.15 85)',
    destructive: 'oklch(0.55 0.20 25)',
    background: 'oklch(0.98 0.01 250)',
    surface: 'oklch(1.00 0 0)',
    foreground: 'oklch(0.15 0.01 250)',
    muted: 'oklch(0.96 0.01 250)',
    mutedForeground: 'oklch(0.45 0.01 250)',
    border: 'oklch(0.90 0.01 250)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  layout: {
    maxWidth: '1280px',
    minTouchTarget: '32px',
  },
};

export const memberTheme: ThemeTokens = {
  fontSize: {
    base: '16px',
    h1: '32px',
    h2: '28px',
    h3: '24px',
    h4: '20px',
    h5: '18px',
    h6: '14px',
    body: '16px',
    caption: '14px',
  },
  colors: {
    primary: '#007aff',
    primaryHover: '#0051d5',
    success: '#30d158',
    warning: '#ff9f0a',
    destructive: '#ff3b30',
    background: '#f2f2f7',
    surface: '#ffffff',
    foreground: '#000000',
    muted: '#f2f2f7',
    mutedForeground: '#8e8e93',
    border: '#c6c6c8',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  layout: {
    maxWidth: '428px',
    minTouchTarget: '44px',
  },
};

export type Theme = 'admin' | 'member';
