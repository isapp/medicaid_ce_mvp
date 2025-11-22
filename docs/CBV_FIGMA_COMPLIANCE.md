# CBV Integration Figma Design Compliance

This document outlines how the CBV (Consent-Based Verification) integration components follow the Figma design guidelines for the Medicaid Community Engagement MVP.

## Overview

The CBV integration implements employment verification for members using the **mobile-first Member Experience design guidelines** from `/docs/figma-analysis/design-system-guidelines.md`.

## Components Compliance

### VerificationModal Component

**File:** `frontend/src/components/member/VerificationModal.tsx`

#### Typography Compliance ✅

| Element | Guideline | Implementation |
|---------|-----------|----------------|
| **Modal Title** | 20px / semibold / 1.3 line-height | ✅ `font-size: 20px; font-weight: 600; line-height: 1.3` |
| **Body Text** | 16px / normal / 1.5 line-height | ✅ `font-size: 16px; line-height: 1.5` |
| **Help Text** | 14px / normal / 1.4 line-height | ✅ `font-size: 14px; line-height: 1.4` |

**Rationale:** Mobile-optimized typography prevents iOS zoom and ensures readability on small screens.

#### Spacing Compliance ✅

| Element | Guideline | Implementation |
|---------|-----------|----------------|
| **Baseline Grid** | 4px baseline | ✅ All spacing uses multiples of 4px |
| **Header Padding** | 12px vertical, 16px horizontal | ✅ `padding: 12px 16px` (3× and 4× baseline) |
| **Footer Padding** | 12px vertical, 16px horizontal | ✅ `padding: 12px 16px` |
| **Error Padding** | 24px all sides | ✅ `padding: 24px` (6× baseline) |
| **Loading Margin** | 16px bottom | ✅ `margin: 0 auto 16px` |

**Rationale:** Consistent 4px baseline grid creates visual harmony across the mobile interface.

#### Color Compliance ✅

| Element | Guideline | Implementation |
|---------|-----------|----------------|
| **Background** | var(--color-background) | ✅ `background: var(--color-background, #ffffff)` |
| **Foreground** | var(--color-foreground) | ✅ `color: var(--color-foreground, #1d1d1f)` |
| **Border** | var(--color-border) | ✅ `border: 1px solid var(--color-border, #e5e5ea)` |
| **Primary** | var(--color-primary) | ✅ `border-top-color: var(--color-primary, #007aff)` |
| **Destructive** | var(--color-destructive) | ✅ `color: var(--color-destructive, #ff3b30)` |
| **Muted** | var(--color-muted) | ✅ `background: var(--color-muted, #f2f2f7)` |
| **Secondary** | var(--color-secondary) | ✅ `background: var(--color-secondary, #f2f2f7)` |

**Rationale:** iOS-inspired color system with WCAG 2.1 AA compliant contrast ratios.

#### Touch Target Compliance ✅

| Element | Guideline | Implementation |
|---------|-----------|----------------|
| **Close Button** | Minimum 44px × 44px | ✅ `min-width: 44px; min-height: 44px` |
| **Error Action Button** | Minimum 44px height | ✅ `style={{ minHeight: '44px' }}` |
| **Touch Spacing** | Minimum 8px between targets | ✅ Buttons have adequate spacing |

**Rationale:** WCAG 2.1 AA compliance for mobile touch targets ensures accessibility.

#### Accessibility Compliance ✅

| Requirement | Implementation |
|-------------|----------------|
| **ARIA Labels** | ✅ `aria-label="Close verification"` |
| **ARIA Roles** | ✅ `role="dialog"`, `role="alert"`, `role="status"` |
| **ARIA Live Regions** | ✅ `aria-live="polite"` for loading states |
| **ARIA Modal** | ✅ `aria-modal="true"` |
| **ARIA Labelledby** | ✅ `aria-labelledby="verification-modal-title"` |
| **ARIA Hidden** | ✅ `aria-hidden="true"` for decorative elements |
| **Focus Management** | ✅ Prevent close while loading |
| **Keyboard Navigation** | ✅ Button elements with proper keyboard support |
| **Screen Reader Text** | ✅ Descriptive labels for all interactive elements |

**Rationale:** Section 508 and WCAG 2.1 AA compliance for government accessibility requirements.

#### Safe Area Compliance ✅

```css
/* Header safe area support */
padding-top: max(12px, env(safe-area-inset-top));
padding-left: max(16px, env(safe-area-inset-left));
padding-right: max(16px, env(safe-area-inset-right));

/* Footer safe area support */
padding-bottom: max(12px, env(safe-area-inset-bottom));
padding-left: max(16px, env(safe-area-inset-left));
padding-right: max(16px, env(safe-area-inset-right));
```

**Rationale:** Ensures content doesn't get clipped by device notches (iPhone X+, modern Android devices).

#### Animation Compliance ✅

| Animation | Guideline | Implementation |
|-----------|-----------|----------------|
| **Modal Entrance** | Slide up from bottom | ✅ `slideUp` animation |
| **Overlay Fade** | Fade in | ✅ `fadeIn` animation |
| **Button Press** | Scale down 3% | ✅ `transform: scale(0.97)` |
| **Reduced Motion** | Respect prefers-reduced-motion | ✅ `@media (prefers-reduced-motion: reduce)` |

**Rationale:** iOS-style animations with accessibility support for motion-sensitive users.

#### Responsive Breakpoints ✅

| Breakpoint | Behavior | Implementation |
|------------|----------|----------------|
| **Mobile (<768px)** | Full-screen modal | ✅ `position: fixed; inset: 0` |
| **Desktop (≥768px)** | Centered modal with max-width | ✅ `max-width: 800px; border-radius: 12px` |

**Rationale:** Mobile-first approach with progressive enhancement for larger screens.

---

## MemberEmployment Screen

**File:** `frontend/src/screens/member/MemberEmployment.tsx`

### Typography Compliance ✅

Uses existing ScreenLayout component which follows mobile guidelines:
- Screen titles
- Body text at 16px base
- Form labels and inputs

### Touch Target Compliance ✅

| Element | Compliance |
|---------|------------|
| **Primary Buttons** | ✅ 48px height (via `btn` class) |
| **Secondary Buttons** | ✅ 44px minimum height |
| **Form Inputs** | ✅ 48px height with 16px font |

### Form Compliance ✅

| Requirement | Implementation |
|-------------|----------------|
| **Input Font Size** | ✅ 16px (prevents iOS zoom) |
| **Label Association** | ✅ `htmlFor` attributes |
| **Error States** | ✅ Error messages with ARIA |
| **Spacing** | ✅ 16px between form fields |

---

## API Client

**File:** `frontend/src/api/employment-verification.ts`

### Error Handling Compliance ✅

- Clear error messages in plain language
- 5th-6th grade reading level per government accessibility guidelines
- No technical jargon exposed to users

### Status Polling Compliance ✅

- Non-blocking polling mechanism
- Respects battery life (5-second intervals)
- Automatic cleanup to prevent memory leaks

---

## Design Token Usage

All components use CSS variables for theming:

```css
/* Colors */
var(--color-background, #ffffff)
var(--color-foreground, #1d1d1f)
var(--color-primary, #007aff)
var(--color-border, #e5e5ea)
var(--color-destructive, #ff3b30)
var(--color-muted, #f2f2f7)
var(--color-secondary, #f2f2f7)
var(--color-muted-foreground, #6d6d70)
```

**Benefits:**
- Consistent with memberTheme tokens
- Easy to switch themes (light/dark/high-contrast)
- Fallback values for graceful degradation

---

## Accessibility Summary

### WCAG 2.1 AA Compliance ✅

| Criteria | Status |
|----------|--------|
| **Color Contrast** | ✅ 4.5:1 minimum ratio |
| **Touch Targets** | ✅ 44px × 44px minimum |
| **Keyboard Navigation** | ✅ Full keyboard support |
| **Screen Reader Support** | ✅ Complete ARIA labels |
| **Focus Indicators** | ✅ Visible focus states |
| **Motion Sensitivity** | ✅ Reduced motion support |

### Section 508 Compliance ✅

| Requirement | Status |
|-------------|--------|
| **Alt Text** | ✅ All decorative elements marked aria-hidden |
| **Form Labels** | ✅ All inputs have associated labels |
| **Error Identification** | ✅ Errors clearly identified with role="alert" |
| **Status Messages** | ✅ Live regions for dynamic content |

---

## Mobile-First Implementation

### iOS Optimizations ✅

| Optimization | Implementation |
|--------------|----------------|
| **Zoom Prevention** | ✅ 16px input font size |
| **Safe Areas** | ✅ env(safe-area-inset-*) support |
| **Touch Feedback** | ✅ -webkit-tap-highlight-color: transparent |
| **Smooth Scrolling** | ✅ -webkit-overflow-scrolling: touch |
| **Native Feel** | ✅ iOS-style animations and transitions |

### Android Optimizations ✅

| Optimization | Implementation |
|--------------|----------------|
| **Safe Areas** | ✅ Works with Android gesture navigation |
| **Material Feel** | ✅ Ripple-style button feedback |
| **Back Button** | ✅ Modal closes on Android back button |

---

## Performance Considerations

### Loading States ✅

- Skeleton loading for iframe
- Clear loading indicators
- Prevents layout shift

### Error States ✅

- Graceful error handling
- Clear error messages
- Recovery actions (Close button)

### Network Resilience ✅

- Polling with automatic retry
- Timeout handling
- Connection error recovery

---

## Testing Checklist

### Visual Testing ✓

- [x] Modal renders correctly on iPhone SE (375px)
- [x] Modal renders correctly on iPhone 14 Pro (428px)
- [x] Modal renders correctly on iPad (768px+)
- [x] Safe area respected on notched devices
- [x] Typography scales correctly
- [x] Touch targets are minimum 44px

### Interaction Testing ✓

- [x] Close button works with touch
- [x] Close button works with keyboard
- [x] Overlay click closes modal
- [x] Loading state displays correctly
- [x] Error state displays correctly
- [x] PostMessage communication works

### Accessibility Testing ✓

- [x] Screen reader announces modal
- [x] Focus trapped in modal
- [x] Keyboard navigation works
- [x] Reduced motion respected
- [x] Color contrast passes WCAG AA

---

## Future Enhancements

### Planned Improvements

1. **Dark Mode Support**
   - Use CSS variables for automatic theme switching
   - Test all states in dark mode

2. **High Contrast Mode**
   - Enhanced contrast for visually impaired users
   - Forced colors mode support

3. **Internationalization**
   - Multi-language support
   - RTL language support

4. **Offline Support**
   - Service worker for offline detection
   - Queue verification requests

---

## Documentation References

- [Design System Guidelines](/docs/figma-analysis/design-system-guidelines.md)
- [Component Architecture Map](/docs/figma-analysis/component-architecture-map.md)
- [CBV Integration Guide](/docs/CBV_INTEGRATION_GUIDE.md)

---

## Conclusion

The CBV integration fully complies with the Figma mobile-first design guidelines:

✅ **Typography:** Mobile-optimized font sizes and line heights
✅ **Spacing:** 4px baseline grid throughout
✅ **Colors:** iOS-inspired semantic color system
✅ **Touch Targets:** 44px minimum per WCAG 2.1 AA
✅ **Accessibility:** Full ARIA support and keyboard navigation
✅ **Safe Areas:** Device notch support
✅ **Animations:** iOS-style with reduced motion support
✅ **Responsive:** Mobile-first with desktop enhancement

The implementation prioritizes user experience, accessibility, and compliance with government standards while maintaining visual consistency with the Member Experience design system.
