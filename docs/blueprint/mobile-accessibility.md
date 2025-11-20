# Mobile-First & Accessibility

This document defines mobile-first behavior patterns and WCAG 2.1 AA accessibility implementation for the Medicaid Community Engagement application.

## Overview

The application implements:

- **Mobile-First Design**: Member experience optimized for mobile devices (428px max-width)
- **Responsive Design**: Admin experience adapts from mobile to desktop (1280px max-width)
- **WCAG 2.1 AA Compliance**: Accessibility standards for government applications
- **Section 508 Compliance**: Federal accessibility requirements
- **Touch-Friendly**: 44px minimum touch targets for mobile
- **Keyboard Navigation**: Full keyboard accessibility for desktop

## Mobile-First Behavior

### Member Experience Requirements

#### Viewport Configuration

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
```

**Key Points**:
- `initial-scale=1.0`: Prevent initial zoom
- `maximum-scale=5.0`: Allow zoom up to 5x for accessibility
- `user-scalable=yes`: Allow pinch-to-zoom (required for accessibility)

#### Container Constraints

```css
/* Member container */
.member-container {
  max-width: 428px; /* iPhone 14 Pro Max */
  margin: 0 auto;
  padding: 0 16px;
}

/* Admin container */
.admin-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
```

#### Touch Target Sizing

All interactive elements must meet minimum touch target size:

```css
/* Minimum touch target: 44px × 44px */
.btn-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Icon-only buttons */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Implementation**:
```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2", // 40px height
        sm: "h-9 px-3", // 36px height
        lg: "h-12 px-6", // 48px height (mobile-friendly)
        icon: "h-11 w-11", // 44px × 44px (mobile-friendly)
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);
```

#### Input Font Size

Prevent iOS auto-zoom on input focus:

```css
/* All inputs must be at least 16px on mobile */
input,
textarea,
select {
  font-size: 16px;
}

@media (min-width: 768px) {
  input,
  textarea,
  select {
    font-size: 14px; /* Can be smaller on desktop */
  }
}
```

**Implementation**:
```typescript
// components/ui/input.tsx
<Input
  type="tel"
  style={{ fontSize: '16px' }} // Inline style to ensure it's not overridden
  {...props}
/>
```

#### Safe Area Handling

Support for notched devices (iPhone X and later):

```css
/* Bottom action bar with safe area */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: var(--background);
  border-top: 1px solid var(--border);
}

/* Full-height content with safe area */
.screen-content {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

**Implementation**:
```typescript
// components/member/layout/ScreenLayout.tsx
export function ScreenLayout({
  showHeader = true,
  headerTitle,
  onHeaderBack,
  actions,
  children,
}: ScreenLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && (
        <header
          className="sticky top-0 z-10 bg-background border-b"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex items-center h-14 px-4">
            {onHeaderBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderBack}
                aria-label="Go back"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {headerTitle && (
              <h1 className="text-lg font-semibold ml-2">{headerTitle}</h1>
            )}
          </div>
        </header>
      )}
      
      <main className="flex-1 pb-24">
        {children}
      </main>
      
      {actions && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-background border-t px-4 py-3"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
```

#### Bottom Action Bar Pattern

```typescript
// Consistent bottom action bar for member flows
<ScreenLayout
  showHeader={true}
  headerTitle="Upload Paystub"
  onHeaderBack={() => navigate(-1)}
  actions={
    <div className="space-y-3">
      <Button
        className="w-full h-12"
        onClick={handleContinue}
        disabled={!isValid}
      >
        Continue
      </Button>
      <Button
        variant="ghost"
        className="w-full h-10"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  }
>
  {/* Screen content */}
</ScreenLayout>
```

### Responsive Breakpoints

```css
/* Mobile-first breakpoints */
/* xs: 0-639px (default, mobile) */
/* sm: 640px-767px (large mobile) */
/* md: 768px-1023px (tablet) */
/* lg: 1024px-1279px (small desktop) */
/* xl: 1280px+ (desktop) */

/* Example usage */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
  }
}
```

### Touch Interactions

#### Tap Feedback

```css
/* Visual feedback on touch */
.touchable {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.15s ease;
}

.touchable:active {
  background-color: var(--accent);
}
```

#### Swipe Gestures (Optional)

```typescript
// hooks/useSwipe.ts
import { useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe(handlers: SwipeHandlers) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      
      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
      
      // Horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      }
      
      touchStart.current = null;
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers]);
}
```

### Scroll Behavior

```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Overscroll containment */
body {
  overscroll-behavior-y: contain;
}

/* Momentum scrolling on iOS */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
```

## Accessibility Implementation

### WCAG 2.1 AA Requirements

#### 1. Perceivable

**Color Contrast**:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

```typescript
// Theme tokens with WCAG AA compliant colors
export const memberTheme: DesignTokens = {
  color: {
    primary: '#007aff', // Blue with sufficient contrast
    background: '#ffffff',
    foreground: '#000000', // 21:1 contrast ratio
    muted: '#f2f2f7',
    mutedForeground: '#3c3c43', // 11:1 contrast ratio
    success: '#30d158',
    destructive: '#ff3b30',
    warning: '#ff9500',
  },
};
```

**Text Alternatives**:
```typescript
// Images with alt text
<img src="/logo.png" alt="Medicaid Community Engagement" />

// Icon-only buttons with aria-label
<Button variant="ghost" size="icon" aria-label="Close dialog">
  <X className="h-4 w-4" aria-hidden="true" />
</Button>

// Decorative icons hidden from screen readers
<CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
```

**Audio/Video Alternatives** (if applicable):
```typescript
// Video with captions
<video controls>
  <source src="tutorial.mp4" type="video/mp4" />
  <track kind="captions" src="captions.vtt" srclang="en" label="English" />
</video>
```

#### 2. Operable

**Keyboard Navigation**:
```typescript
// All interactive elements must be keyboard accessible
<Button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Submit
</Button>

// Skip to main content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

**Focus Management**:
```css
/* Visible focus indicators */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Remove default outline, use custom */
*:focus {
  outline: none;
}

/* Focus within (for containers) */
.card:focus-within {
  box-shadow: 0 0 0 2px var(--primary);
}
```

**Focus Trap in Modals**:
```typescript
// components/ui/dialog.tsx
import { useEffect, useRef } from 'react';

export function Dialog({ open, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!open) return;
    
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    // Get all focusable elements
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Focus first element
    firstElement?.focus();
    
    // Trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    dialog.addEventListener('keydown', handleKeyDown);
    
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);
  
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

**Escape Key to Close**:
```typescript
// Close dialog on Escape
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      onOpenChange(false);
    }
  };
  
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [open, onOpenChange]);
```

**No Keyboard Trap** (except modals):
```typescript
// Ensure users can navigate away from all components
// Don't prevent default Tab behavior outside of modals
```

#### 3. Understandable

**Language Declaration**:
```html
<!-- index.html -->
<html lang="en">
```

**Consistent Navigation**:
```typescript
// Admin sidebar navigation - consistent across all pages
const adminNavItems = [
  { label: 'Participants', path: '/admin/participants', icon: Users },
  { label: 'Cases', path: '/admin/cases', icon: Briefcase },
  { label: 'Broadcasts', path: '/admin/broadcasts', icon: MessageSquare },
  { label: 'Reporting', path: '/admin/reporting', icon: BarChart },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];
```

**Form Labels and Instructions**:
```typescript
// Every input has a label
<div className="space-y-2">
  <Label htmlFor="phone">Phone Number</Label>
  <Input
    id="phone"
    type="tel"
    aria-describedby="phone-help"
  />
  <p id="phone-help" className="text-sm text-muted-foreground">
    Format: +1 followed by 10 digits
  </p>
</div>

// Required fields indicated
<Label htmlFor="email">
  Email <span className="text-destructive" aria-label="required">*</span>
</Label>
```

**Error Identification**:
```typescript
// Clear error messages
<Input
  id="email"
  type="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <span id="email-error" className="text-sm text-destructive" role="alert">
    {errors.email.message}
  </span>
)}
```

**Reading Level**:
- Target: 5th-6th grade reading level for member-facing content
- Use simple, clear language
- Avoid jargon and technical terms
- Break up long paragraphs

```typescript
// ✅ Good - Simple language
"We need to verify your employment. Choose how you'd like to verify."

// ❌ Bad - Complex language
"Employment verification is required to establish eligibility. Please select your preferred verification methodology."
```

#### 4. Robust

**Valid HTML**:
```typescript
// Use semantic HTML elements
<nav>
  <ul>
    <li><a href="/admin/participants">Participants</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Participant Profile</h1>
    <section>
      <h2>Personal Information</h2>
    </section>
  </article>
</main>

<aside>
  <h2>Quick Actions</h2>
</aside>
```

**ARIA Attributes**:
```typescript
// Landmark roles
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">

// Widget roles
<div role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
<div role="alert" aria-live="assertive">
<div role="status" aria-live="polite">
<button role="button" aria-pressed="false">

// Live regions
<div aria-live="polite" aria-atomic="true">
  {successMessage}
</div>

// Hidden content
<span className="sr-only">Loading...</span>
<div aria-hidden="true">Decorative content</div>
```

### Screen Reader Support

#### Screen Reader Only Content

```css
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

#### Descriptive Labels

```typescript
// Data table with screen reader descriptions
<table>
  <caption className="sr-only">List of participants</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>
        <Badge variant="success">
          <span className="sr-only">Status: </span>
          Active
        </Badge>
      </td>
      <td>
        <Button size="icon" aria-label="View John Doe's profile">
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>
      </td>
    </tr>
  </tbody>
</table>
```

#### Live Regions

```typescript
// Toast notifications with live region
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="toast"
>
  {message}
</div>

// Error alerts with assertive live region
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  className="alert-destructive"
>
  {errorMessage}
</div>
```

### Keyboard Shortcuts

```typescript
// Global keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K: Open command palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen(true);
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
      closeAllModals();
    }
    
    // Arrow keys: Navigate lists
    if (e.key === 'ArrowDown' && focusedIndex < items.length - 1) {
      e.preventDefault();
      setFocusedIndex(focusedIndex + 1);
    }
    if (e.key === 'ArrowUp' && focusedIndex > 0) {
      e.preventDefault();
      setFocusedIndex(focusedIndex - 1);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [focusedIndex, items.length]);
```

### Testing Accessibility

#### Automated Testing

```typescript
// __tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('ParticipantsIndex has no accessibility violations', async () => {
  const { container } = render(<ParticipantsIndex />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Manual Testing Checklist

- [ ] Keyboard navigation works throughout the app
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Screen reader announces all content correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] All images have alt text
- [ ] Forms have proper labels and error messages
- [ ] Modals trap focus correctly
- [ ] Live regions announce dynamic content

#### Screen Reader Testing

Test with:
- **NVDA** (Windows, free)
- **JAWS** (Windows, commercial)
- **VoiceOver** (macOS/iOS, built-in)
- **TalkBack** (Android, built-in)

### Accessibility Best Practices

#### 1. Semantic HTML

```typescript
// ✅ Good - Semantic elements
<nav>
  <ul>
    <li><a href="/admin/participants">Participants</a></li>
  </ul>
</nav>

// ❌ Bad - Divs for everything
<div className="nav">
  <div className="nav-item" onClick={() => navigate('/admin/participants')}>
    Participants
  </div>
</div>
```

#### 2. Proper Heading Hierarchy

```typescript
// ✅ Good - Logical heading structure
<h1>Participant Profile</h1>
<section>
  <h2>Personal Information</h2>
  <h3>Contact Details</h3>
</section>
<section>
  <h2>Engagement Activities</h2>
  <h3>Employment</h3>
  <h3>Education</h3>
</section>

// ❌ Bad - Skipping heading levels
<h1>Participant Profile</h1>
<h4>Personal Information</h4>
```

#### 3. Form Accessibility

```typescript
// ✅ Good - Accessible form
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Personal Information</legend>
    
    <div className="space-y-2">
      <Label htmlFor="firstName">First Name *</Label>
      <Input
        id="firstName"
        type="text"
        required
        aria-required="true"
        aria-invalid={!!errors.firstName}
        aria-describedby={errors.firstName ? 'firstName-error' : undefined}
      />
      {errors.firstName && (
        <span id="firstName-error" className="text-sm text-destructive" role="alert">
          {errors.firstName.message}
        </span>
      )}
    </div>
  </fieldset>
  
  <Button type="submit">Submit</Button>
</form>

// ❌ Bad - Inaccessible form
<form>
  <div>
    <span>First Name</span>
    <input type="text" />
  </div>
  <div onClick={handleSubmit}>Submit</div>
</form>
```

#### 4. Button vs Link

```typescript
// ✅ Good - Button for actions, link for navigation
<Button onClick={handleSubmit}>Submit</Button>
<a href="/admin/participants">View Participants</a>

// ❌ Bad - Link for actions, button for navigation
<a href="#" onClick={handleSubmit}>Submit</a>
<Button onClick={() => navigate('/admin/participants')}>View Participants</Button>
```

## Summary

The mobile-first and accessibility implementation provides:

- **Mobile-optimized**: 428px max-width, 44px touch targets, 16px input font size
- **Safe area support**: Notched device compatibility with env() variables
- **Responsive design**: Breakpoints from mobile to desktop
- **WCAG 2.1 AA compliance**: Color contrast, keyboard navigation, screen reader support
- **Touch-friendly**: Appropriate sizing and feedback for touch interactions
- **Keyboard accessible**: Full keyboard navigation with visible focus indicators
- **Screen reader support**: ARIA labels, live regions, semantic HTML
- **Government standards**: Section 508 compliance, 5th-6th grade reading level

All patterns follow best practices for inclusive design and government accessibility requirements.
