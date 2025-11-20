# Design System Guidelines Analysis

This document explains the design guidelines from both Figma exports (Admin and Member experiences) and how they map to a reusable design system for the Medicaid Community Engagement application.

## Overview

The Figma exports contain two distinct but related design systems:

- **Admin Experience**: Desktop-focused design for case workers and administrators
- **Member Experience**: Mobile-first design for Medicaid beneficiaries

Both systems share common design principles but are optimized for their respective contexts and user needs.

---

## Typography Rules

### Admin Typography (Desktop-Focused)

**Base Font Size**: 14px (optimized for desktop information density)

**Typography Hierarchy**:

| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| H1 | 24px | Semibold (600) | Tight (1.25) | -0.025em | Page titles ("Participants", "Cases") |
| H2 | 20px | Medium (500) | Tight (1.25) | -0.025em | Section titles ("Case Summary") |
| H3 | 18px | Medium (500) | Snug (1.375) | 0 | Card titles, modal headers |
| H4 | 16px | Medium (500) | Snug (1.375) | 0 | Form section labels |
| H5 | 14px | Medium (500) | Snug (1.375) | 0.025em | Input labels (UPPERCASE) |
| H6 | 12px | Medium (500) | Snug (1.375) | 0.05em | Overlines, micro-labels (UPPERCASE) |
| Body | 14px | Normal (400) | Relaxed (1.625) | 0 | Main content, descriptions |
| Caption | 12px | Normal (400) | Snug (1.375) | 0 | Timestamps, metadata |

**Implementation Classes**:
```tsx
// H1 - Page Titles
<h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
  Participants
</h1>

// H2 - Section Titles
<h2 className="text-xl font-medium leading-tight tracking-tight text-foreground">
  Case Summary
</h2>

// H3 - Card Titles
<h3 className="text-lg font-medium leading-snug text-foreground">
  Basic Information
</h3>

// Body Text
<p className="text-sm font-normal leading-relaxed text-foreground">
  Description text
</p>

// Caption Text
<small className="text-xs font-normal leading-snug text-muted-foreground">
  Last updated Aug 15, 2025
</small>
```

### Member Typography (Mobile-Focused)

**Base Font Size**: 16px (prevents iOS zoom on input focus)

**Typography Hierarchy**:

| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| H1 | 32px | Bold (700) | 1.2 | -0.02em | Hero text, main titles |
| H2 | 24px | Bold (700) | 1.3 | -0.01em | Section titles |
| H3 | 20px | Semibold (600) | 1.3 | 0 | Subsection titles |
| H4 | 18px | Semibold (600) | 1.5 | 0 | Card titles |
| H5 | 16px | Medium (500) | 1.5 | 0 | Component labels |
| H6 | 14px | Medium (500) | 1.4 | 0.05em | Tiny labels (UPPERCASE) |
| Body | 16px | Normal (400) | 1.6 | 0 | Main content (optimized for mobile readability) |
| Caption | 12px | Normal (400) | 1.4 | 0 | Secondary information |

**Mobile-Specific Typography Rules**:
- **Reading Level**: 5th-6th grade level for government accessibility
- **Line Height**: 1.6 for body text (more generous for mobile)
- **Minimum Font Size**: 16px for inputs to prevent iOS zoom
- **Baseline Grid**: All typography aligns to 4px baseline grid

**Implementation Classes**:
```tsx
// H1 - Hero Text
<h1 className="text-4xl font-bold" style={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}>
  Verify Your Employment
</h1>

// Body Text - Mobile Optimized
<p className="text-base font-normal" style={{ lineHeight: 1.6 }}>
  Description text with generous line height for mobile readability
</p>

// Input - Prevents iOS Zoom
<input 
  className="w-full h-12 text-base" 
  style={{ fontSize: '16px' }} 
/>
```

---

## Color Usage

### Admin Color System (Desktop)

**Color Format**: OKLCH (perceptually uniform color space) and hex

**Semantic Colors**:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | #ffffff | oklch(0.145 0 0) | Page background |
| `--foreground` | oklch(0.145 0 0) | oklch(0.985 0 0) | Primary text |
| `--primary` | #030213 | oklch(0.985 0 0) | Primary actions, links |
| `--primary-foreground` | oklch(1 0 0) | oklch(0.205 0 0) | Text on primary |
| `--muted` | #ececf0 | oklch(0.269 0 0) | Inactive states |
| `--muted-foreground` | #717182 | oklch(0.708 0 0) | Secondary text |
| `--destructive` | #d4183d | oklch(0.396 0.141 25.723) | Error states, critical alerts |
| `--destructive-foreground` | #ffffff | oklch(0.637 0.237 25.331) | Text on destructive |
| `--success` | #22c55e | oklch(0.55 0.15 142) | Verified states, completed actions |
| `--success-foreground` | #ffffff | oklch(0.985 0 0) | Text on success |
| `--warning` | #f59e0b | oklch(0.65 0.15 75) | Pending states, caution |
| `--warning-foreground` | #ffffff | oklch(0.145 0 0) | Text on warning |
| `--info` | #3b82f6 | oklch(0.55 0.15 240) | Informational states, processing |
| `--info-foreground` | #ffffff | oklch(0.985 0 0) | Text on info |
| `--border` | rgba(0,0,0,0.1) | oklch(0.269 0 0) | Borders, dividers |
| `--input-background` | #f3f3f5 | N/A | Input field backgrounds |

**Chart Colors** (for data visualization):
```css
--chart-1: oklch(0.646 0.222 41.116)  /* Orange */
--chart-2: oklch(0.6 0.118 184.704)    /* Teal */
--chart-3: oklch(0.398 0.07 227.392)   /* Blue */
--chart-4: oklch(0.828 0.189 84.429)   /* Yellow */
--chart-5: oklch(0.769 0.188 70.08)    /* Green */
```

### Member Color System (Mobile)

**Color Format**: Hex with RGB alpha variants

**iOS-Inspired Semantic Colors**:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | #ffffff | #000000 | Page background |
| `--foreground` | #1d1d1f | #ffffff | Primary text |
| `--primary` | #007aff | #0a84ff | iOS blue - primary actions |
| `--primary-foreground` | #ffffff | #ffffff | Text on primary |
| `--primary-alpha-10` | rgba(0,122,255,0.1) | N/A | Subtle primary tints |
| `--primary-alpha-20` | rgba(0,122,255,0.2) | N/A | Light primary backgrounds |
| `--secondary` | #f2f2f7 | #1c1c1e | Secondary surfaces |
| `--muted` | #f2f2f7 | #2c2c2e | Inactive states |
| `--muted-foreground` | #6d6d70 | #98989d | Secondary text |
| `--destructive` | #ff3b30 | #ff453a | iOS red - errors |
| `--warning` | #ff9500 | #ff9f0a | iOS orange - warnings |
| `--success` | #30d158 | #32d74b | iOS green - success |
| `--info` | #007aff | #0a84ff | iOS blue - info |
| `--border` | #e5e5ea | #38383a | Borders, dividers |
| `--input-border` | #d1d1d6 | #38383a | Input borders |
| `--input-focus` | #007aff | #0a84ff | Focused input borders |

**Accessibility Requirements**:
- **WCAG 2.1 AA Compliance**: All color combinations meet 4.5:1 contrast ratio minimum
- **Color Independence**: Never rely solely on color to convey information
- **High Contrast Support**: Enhanced contrast mode available
- **Color Blindness**: Patterns and icons supplement color indicators

**Status Badge Colors**:
```tsx
// Success - Verified
<Badge className="bg-green-50 text-green-700 border-green-200">
  <CheckCircle2 className="w-3 h-3 mr-1" />
  Verified
</Badge>

// Warning - Pending
<Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
  <Clock className="w-3 h-3 mr-1" />
  Pending Review
</Badge>

// Destructive - Action Required
<Badge className="bg-red-50 text-red-700 border-red-200">
  <AlertCircle className="w-3 h-3 mr-1" />
  Action Required
</Badge>
```

---

## Spacing Rules

### Admin Spacing System (8pt Grid)

**Grid System**: All spacing follows strict 8pt grid system for visual consistency

**Base Units**:
```css
--spacing-1: 2px   /* Border offsets, micro adjustments */
--spacing-2: 4px   /* Icon gaps, fine-tuning */
--spacing-3: 6px   /* Small element spacing */
--spacing-4: 8px   /* Base unit, minimum spacing */
```

**Component Spacing**:
```css
--spacing-6: 12px   /* Small gaps between related elements */
--spacing-8: 16px   /* Medium gaps, form field spacing */
--spacing-12: 24px  /* Large gaps between sections */
--spacing-16: 32px  /* Major section dividers */
```

**Layout Spacing**:
```css
--spacing-20: 40px  /* Extra large gaps */
--spacing-24: 48px  /* Page padding, card padding */
--spacing-32: 64px  /* Page sections, major layout divisions */
--spacing-40: 80px  /* Large layout spacing */
--spacing-48: 96px  /* Maximum spacing between major sections */
```

**Page Layout Patterns**:
```tsx
// Standard Page Structure
<div className="max-w-[1280px] mx-auto px-6">
  <div className="py-6 space-y-8">
    {/* Page Header - 8pt spacing */}
    <div className="space-y-2">
      <h1>Page Title</h1>
      <p>Page description</p>
    </div>
    
    {/* Content sections - 32px spacing */}
    <section className="space-y-6">{/* Content */}</section>
  </div>
</div>

// Card Layout
<Card>
  <CardHeader className="pb-6">
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* 24px spacing between content groups */}
  </CardContent>
</Card>

// Form Layout
<form className="space-y-6">
  {/* 24px between form sections */}
  <div className="space-y-4">
    {/* 16px between form fields */}
    <div className="space-y-2">
      {/* 8px between label and input */}
      <Label>Field Label</Label>
      <Input />
    </div>
  </div>
</form>
```

### Member Spacing System (4px Baseline Grid)

**Grid System**: 4px baseline grid for mobile-optimized spacing

**Baseline Units**:
```css
--baseline: 4px      /* Base unit */
--baseline-2: 8px    /* 2× base */
--baseline-3: 12px   /* 3× base */
--baseline-4: 16px   /* 4× base */
--baseline-5: 20px   /* 5× base */
--baseline-6: 24px   /* 6× base */
--baseline-8: 32px   /* 8× base */
--baseline-10: 40px  /* 10× base */
--baseline-12: 48px  /* 12× base */
--baseline-16: 64px  /* 16× base */
```

**Content Spacing** (semantic tokens):
```css
--content-spacing-xs: 8px   /* Tight spacing */
--content-spacing-sm: 12px  /* Small spacing */
--content-spacing-md: 16px  /* Medium spacing */
--content-spacing-lg: 24px  /* Large spacing */
--content-spacing-xl: 32px  /* Extra large spacing */
--content-spacing-2xl: 48px /* Maximum spacing */
```

**Mobile Layout Patterns**:
```tsx
// Mobile Screen Layout
<ScreenLayout
  showHeader={true}
  headerTitle="Screen Title"
  actions={
    <div className="space-y-3 py-4">
      <Button className="w-full h-12">Primary Action</Button>
      <Button variant="ghost" className="w-full h-10">Secondary</Button>
    </div>
  }
>
  <div className="space-y-4 mobile-padding">
    {/* 16px horizontal padding, 16px vertical spacing */}
  </div>
</ScreenLayout>

// Mobile Card
<div className="wallet-card space-y-3">
  {/* 12px spacing between card elements */}
  <h3 className="font-medium">Card Title</h3>
  <p className="text-sm text-gray-600">Card content</p>
  <Button className="w-full h-10">Action</Button>
</div>

// Mobile Form
<form className="space-y-4 mobile-padding">
  {/* 16px between form fields */}
  <div className="space-y-2">
    {/* 8px between label and input */}
    <Label>Field Label</Label>
    <Input className="w-full h-12" style={{ fontSize: '16px' }} />
  </div>
</form>
```

**Touch Target Requirements**:
- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: Minimum 8px between adjacent touch targets
- **Button Height**: 44-48px for primary actions, 40px for secondary

---

## Accessibility Requirements

### Admin Accessibility (Desktop)

**Government Standards**:
- Section 508 compliance for federal accessibility
- WCAG 2.1 AA compliance for color contrast and keyboard navigation
- Enterprise-grade accessibility for case workers

**Implementation Requirements**:
```tsx
// Keyboard Navigation
<button 
  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  aria-label="View participant details"
>
  View Details
</button>

// Screen Reader Support
<div role="region" aria-label="Case summary">
  <h2 id="case-summary-heading">Case Summary</h2>
  <div aria-labelledby="case-summary-heading">
    {/* Content */}
  </div>
</div>

// Focus Management
<Dialog>
  <DialogContent 
    onOpenAutoFocus={(e) => {
      // Focus first interactive element
      e.preventDefault();
      firstInputRef.current?.focus();
    }}
  >
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

### Member Accessibility (Mobile)

**Mobile-Specific Requirements**:
- **Touch Targets**: Minimum 44px × 44px
- **Font Size**: Minimum 16px for inputs (prevents iOS zoom)
- **Safe Areas**: Account for device notches using `env(safe-area-inset-*)`
- **Reading Level**: 5th-6th grade level for government accessibility
- **Color Contrast**: WCAG 2.1 AA (4.5:1 minimum)

**Implementation Requirements**:
```tsx
// Touch Target Compliance
<button 
  className="w-full h-12 min-h-[44px]"
  aria-label="Submit verification"
>
  Submit
</button>

// iOS Zoom Prevention
<input 
  type="text"
  className="w-full h-12"
  style={{ fontSize: '16px' }} // Critical for iOS
  aria-label="Enter phone number"
/>

// Safe Area Support
<div className="pb-[env(safe-area-inset-bottom)]">
  <Button className="w-full h-12">Continue</Button>
</div>

// Screen Reader Support
<div 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  <Badge className="bg-green-50 text-green-700">
    <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
    <span>Verified</span>
  </Badge>
</div>

// Reduced Motion Support
<div className="transition-transform duration-300 motion-reduce:transition-none">
  {/* Animated content */}
</div>
```

**Focus Styles**:
```css
/* Enhanced focus for government accessibility */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
  ring: 2px solid var(--primary);
  ring-offset: 2px;
}
```

---

## Mapping to Reusable Design System

### Unified Token Interface

To support both Admin and Member experiences, we define a unified token interface with two theme implementations:

```typescript
// frontend/src/theme/tokens.ts

export interface DesignTokens {
  // Colors
  color: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    info: string;
    infoForeground: string;
    border: string;
    input: string;
    inputBackground: string;
    ring: string;
    chart: string[];
  };
  
  // Typography
  typography: {
    baseFontSize: string;
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl'?: string;
      '6xl'?: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold?: number;
    };
    lineHeight: {
      none: number;
      tight: number;
      snug: number;
      normal: number;
      relaxed: number;
      loose: number;
      heading?: number;
      body?: number;
      caption?: number;
    };
  };
  
  // Spacing
  spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    6: string;
    8: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
  };
  
  // Border Radius
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  
  // Shadows
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  // Layout
  layout: {
    containerMaxWidth: string;
    containerPadding: string;
    touchTargetMin?: string;
  };
}

// Admin Theme (Desktop)
export const adminTheme: DesignTokens = {
  color: {
    background: '#ffffff',
    foreground: 'oklch(0.145 0 0)',
    primary: '#030213',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.95 0.0058 264.53)',
    secondaryForeground: '#030213',
    muted: '#ececf0',
    mutedForeground: '#717182',
    accent: '#e9ebef',
    accentForeground: '#030213',
    destructive: '#d4183d',
    destructiveForeground: '#ffffff',
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
    info: '#3b82f6',
    infoForeground: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    input: 'transparent',
    inputBackground: '#f3f3f5',
    ring: 'oklch(0.708 0 0)',
    chart: [
      'oklch(0.646 0.222 41.116)',
      'oklch(0.6 0.118 184.704)',
      'oklch(0.398 0.07 227.392)',
      'oklch(0.828 0.189 84.429)',
      'oklch(0.769 0.188 70.08)',
    ],
  },
  typography: {
    baseFontSize: '14px',
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    1: '0.125rem',  // 2px
    2: '0.25rem',   // 4px
    3: '0.375rem',  // 6px
    4: '0.5rem',    // 8px
    6: '0.75rem',   // 12px
    8: '1rem',      // 16px
    12: '1.5rem',   // 24px
    16: '2rem',     // 32px
    20: '2.5rem',   // 40px
    24: '3rem',     // 48px
    32: '4rem',     // 64px
    40: '5rem',     // 80px
    48: '6rem',     // 96px
  },
  radius: {
    sm: 'calc(0.625rem - 4px)',
    md: 'calc(0.625rem - 2px)',
    lg: '0.625rem',
    xl: 'calc(0.625rem + 4px)',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  layout: {
    containerMaxWidth: '1280px',
    containerPadding: '1.5rem', // 24px
  },
};

// Member Theme (Mobile)
export const memberTheme: DesignTokens = {
  color: {
    background: '#ffffff',
    foreground: '#1d1d1f',
    primary: '#007aff',
    primaryForeground: '#ffffff',
    secondary: '#f2f2f7',
    secondaryForeground: '#1d1d1f',
    muted: '#f2f2f7',
    mutedForeground: '#6d6d70',
    accent: '#e5f3ff',
    accentForeground: '#0066cc',
    destructive: '#ff3b30',
    destructiveForeground: '#ffffff',
    success: '#30d158',
    successForeground: '#ffffff',
    warning: '#ff9500',
    warningForeground: '#ffffff',
    info: '#007aff',
    infoForeground: '#ffffff',
    border: '#e5e5ea',
    input: '#ffffff',
    inputBackground: '#ffffff',
    ring: '#007aff',
    chart: ['#007aff', '#30d158', '#af52de', '#ff9500', '#ff3b30'],
  },
  typography: {
    baseFontSize: '16px',
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif',
      mono: 'SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2rem',    // 32px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
      heading: 1.2,
      body: 1.6,
      caption: 1.4,
    },
  },
  spacing: {
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
  },
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  layout: {
    containerMaxWidth: '428px',
    containerPadding: '1rem', // 16px
    touchTargetMin: '44px',
  },
};
```

### Theme Provider Implementation

```tsx
// frontend/src/components/ThemeProvider.tsx

import React, { createContext, useContext, useEffect } from 'react';
import { adminTheme, memberTheme, DesignTokens } from '../theme/tokens';

type ThemeType = 'admin' | 'member';

interface ThemeContextType {
  theme: ThemeType;
  tokens: DesignTokens;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'admin' 
}: { 
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}) {
  const [theme, setTheme] = React.useState<ThemeType>(defaultTheme);
  const tokens = theme === 'admin' ? adminTheme : memberTheme;

  useEffect(() => {
    // Apply theme class to root element
    document.documentElement.classList.remove('theme-admin', 'theme-member');
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Apply CSS variables
    const root = document.documentElement;
    Object.entries(tokens.color).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          root.style.setProperty(`--color-${key}-${i + 1}`, v);
        });
      } else {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  }, [theme, tokens]);

  return (
    <ThemeContext.Provider value={{ theme, tokens, setTheme }}>
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
```

### Component Implementation Strategy

**Shared UI Components** (work with both themes):

```tsx
// frontend/src/components/ui/button.tsx

import { useTheme } from '../ThemeProvider';

interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'default', size = 'md', children }: ButtonProps) {
  const { theme, tokens } = useTheme();
  
  // Base styles that work with both themes via CSS variables
  const baseStyles = 'font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
  
  // Size styles adapt to theme
  const sizeStyles = {
    sm: theme === 'admin' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
    md: theme === 'admin' ? 'h-9 px-4 text-sm' : 'h-12 px-6 text-base',
    lg: theme === 'admin' ? 'h-10 px-6 text-sm' : 'h-14 px-8 text-lg',
  };
  
  // Variant styles use CSS variables
  const variantStyles = {
    default: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
    outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-accent)]',
    ghost: 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
    destructive: 'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90',
  };
  
  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}
      style={{
        minHeight: theme === 'member' ? tokens.layout.touchTargetMin : undefined,
      }}
    >
      {children}
    </button>
  );
}
```

### Route-Based Theme Switching

```tsx
// frontend/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes use admin theme */}
        <Route path="/admin/*" element={
          <ThemeProvider defaultTheme="admin">
            <AdminApp />
          </ThemeProvider>
        } />
        
        {/* Member routes use member theme */}
        <Route path="/m/*" element={
          <ThemeProvider defaultTheme="member">
            <MemberApp />
          </ThemeProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Summary: Design System Benefits

### Unified Token Interface
- **Single source of truth** for design tokens
- **Two theme implementations** (admin and member) sharing the same structure
- **CSS variables** enable runtime theme switching without code changes

### Component Reusability
- **Shared UI primitives** (Button, Input, Card, etc.) work with both themes
- **Theme-aware sizing** adapts to desktop (admin) vs mobile (member) contexts
- **Consistent APIs** across both experiences

### Accessibility by Default
- **WCAG 2.1 AA compliance** built into color tokens
- **Touch target enforcement** for mobile theme
- **Focus management** and keyboard navigation patterns
- **Screen reader support** with proper ARIA labels

### Maintainability
- **Single codebase** supports both admin and member experiences
- **Design token updates** propagate automatically to all components
- **Type safety** with TypeScript interfaces
- **Clear guidelines** for spacing, typography, and color usage

### Scalability
- **Easy to add new themes** (e.g., dark mode, high contrast)
- **Component library grows** with shared primitives
- **Consistent patterns** make onboarding new developers easier
- **Design system documentation** serves as single source of truth
