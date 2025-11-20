# Technical Implementation Blueprint

## Executive Summary

This blueprint provides a comprehensive technical implementation plan for the Medicaid Community Engagement application, a multi-tenant SaaS platform serving two distinct user populations:

- **Admin Users**: Case workers and administrators using a desktop-focused interface to manage participants, cases, broadcasts, and reporting
- **Member Users**: Medicaid beneficiaries using a mobile-first interface to verify engagement activities (employment, education, community service) and manage exemptions

The application architecture balances code reuse through shared UI primitives (45 components) while maintaining experience-specific optimizations (29 admin features, 141 member screens).

### Key Metrics

- **Total Components**: 270 (45 shared, 82 admin, 143 member)
- **Implementation Timeline**: 12 weeks across 4 phases
- **Technology Stack**: React 18 + TypeScript, React Router v6, React Query, Zustand, Radix UI
- **Target Compliance**: WCAG 2.1 AA, Section 508, multi-tenant SaaS security

## Detailed Specifications

This blueprint is organized into focused specification documents covering all aspects of the application:

### Core Architecture
- **[Navigation Structure](./navigation.md)** - Complete routing structure with React Router v6, all admin and member routes, query parameters, route protection, deep linking, and scroll behavior
- **[State Architecture](./state-architecture.md)** - Three-layer state management with React Query (server state), Zustand (feature state), Context API (auth/theme), query key structure, and mutation patterns
- **[API Integration Plan](./api-integration.md)** - Complete endpoint inventory, API client architecture, request/response patterns, error handling, type safety with Zod, and file upload handling
- **[Data Models](./data-models.md)** - TypeScript interfaces and Zod schemas for all domain entities, validation schemas, type guards, and utility types

### Authentication & Security
- **[Authentication Flows](./auth-flows.md)** - Admin authentication (email/password), member authentication (phone + SMS OTP), JWT token management, session persistence, and multi-tenancy context

### User Experience
- **[Error & Loading States](./error-loading.md)** - Loading state patterns (skeletons, spinners, progress), error handling (global boundary, API errors, form validation), empty states, toast notifications, and retry logic
- **[Mobile-First & Accessibility](./mobile-accessibility.md)** - Mobile-first behavior (428px max-width, 44px touch targets, 16px input font), safe area handling, responsive breakpoints, WCAG 2.1 AA compliance, keyboard navigation, and screen reader support

### Implementation Details
- **[Component I/O Contracts](./component-io.md)** - Props, events, state, and side effects for all major components including ParticipantsIndex, DataTable, ScreenLayout, authentication screens, and verification flow screens
- **[Issues & Decisions](./issues-decisions.md)** - 20 open questions requiring clarification, 10 architectural decisions with rationale, assumptions, items for backend/DevOps/design teams, and risk assessment

### Design System
- **[Design System Guidelines](../figma-analysis/design-system-guidelines.md)** - Typography rules, color usage, spacing rules, accessibility requirements, unified token interface, and theme implementation
- **[Component Architecture Map](../figma-analysis/component-architecture-map.md)** - Complete inventory of 270 components (45 shared, 82 admin, 143 member), screen-to-route mapping, and implementation phases

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React SPA)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  Admin Experience│           │ Member Experience│       │
│  │  (Desktop 1280px)│           │  (Mobile 428px)  │       │
│  │  /admin/*        │           │  /m/*            │       │
│  └──────────────────┘           └──────────────────┘       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Shared UI Primitives (45 components)         │  │
│  │  Button, Input, Card, Dialog, Table, Form, etc.     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              State Management Layer                   │  │
│  │  • React Query (server state)                        │  │
│  │  • Zustand (feature state)                           │  │
│  │  • Context (auth, theme)                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                API Client Layer                       │  │
│  │  • Fetch wrapper with auth                           │  │
│  │  • Response envelope handling                        │  │
│  │  • Error normalization                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (/api/v1)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Authentication & Authorization           │  │
│  │  JWT-based, multi-tenant context                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Domain Modules                       │  │
│  │  • Auth, Tenant, Beneficiaries, Engagement           │  │
│  │  • Cases, Broadcasts, Settings, Users                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Integrations Layer                       │  │
│  │  • Employment verification (OAuth, webhooks)         │  │
│  │  • Education verification                            │  │
│  │  • Document processing                               │  │
│  │  • Messaging (SMS, email)                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  Multi-tenant with tenant_id on all data                    │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenancy Model

Every piece of tenant-owned data includes a `tenant_id` column. All queries filter by tenant context derived from the authenticated user's JWT claims. This ensures complete data isolation between tenants (state agencies or sub-organizations).

### Theme Architecture

The application supports two themes (Admin and Member) via CSS variables and a ThemeProvider:

- **Admin Theme**: 14px base font, 8pt grid, OKLCH colors, 1280px max-width
- **Member Theme**: 16px base font, 4px baseline grid, iOS colors, 428px max-width, 44px touch targets

Components consume theme tokens exclusively, enabling runtime theme switching based on route.

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Establish core infrastructure and shared primitives

**Deliverables**:
1. Theme system with adminTheme and memberTheme tokens
2. ThemeProvider with route-based theme switching
3. Routing infrastructure (React Router v6)
4. API client with authentication and error handling
5. Auth context and session persistence
6. Shared UI primitives (priority: Button, Input, Card, Dialog, Form, Badge, Avatar)
7. React Query setup with query client
8. Zustand stores for feature state

**Key Files**:
- `frontend/src/theme/tokens.ts`
- `frontend/src/theme/ThemeProvider.tsx`
- `frontend/src/api/client.ts`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/components/ui/*`

**Success Criteria**:
- Theme switching works between /admin and /m routes
- API client successfully authenticates and handles errors
- Shared UI components render correctly in both themes
- Auth flow stores and retrieves JWT tokens

### Phase 2: Admin Experience (Weeks 3-5)

**Goal**: Implement desktop admin interface for case workers

**Deliverables**:
1. AdminShell layout with header, sidebar, content area
2. Participant management (list, profile, filtering)
3. Case management (list, detail, notes, actions)
4. Broadcast messaging (list, create, send)
5. Reporting dashboard with charts
6. Settings with tabs (users, notifications, security, data, modules, system, attestation)
7. DataTable component with sorting, filtering, pagination
8. Admin-specific UI components (StarButton, StatusBadge, ColumnVisibilityMenu)
9. Modals (AddNote, DocumentViewer, RequestClarification, BulkExtendDeadline, AuditPackage)

**Key Routes**:
- `/admin/participants`, `/admin/participants/:id`
- `/admin/cases`, `/admin/cases/:id`
- `/admin/broadcasts`, `/admin/broadcasts/new`
- `/admin/reporting`
- `/admin/settings`
- `/admin/starred`, `/admin/volunteer-network`

**Success Criteria**:
- Admin can view and filter participant lists
- Admin can view participant profiles with notes and documents
- Admin can manage cases and add notes
- Admin can create and send broadcasts
- Admin can view reporting dashboard
- All admin screens follow 8pt grid and desktop design system

### Phase 3: Member Experience (Weeks 6-10)

**Goal**: Implement mobile-first interface for beneficiaries

**Deliverables**:
1. ScreenLayout with mobile header, safe areas, bottom actions
2. Authentication flow (phone, SMS code, identity verification)
3. Assessment flow (8 screens determining eligibility)
4. Dashboard (main, enhanced, verification variants)
5. Employment verification flows:
   - Gig platform path (Uber, Lyft, DoorDash)
   - Traditional employment path (payroll providers)
   - Bank verification path
   - Manual upload path (paystub photos)
6. Education verification flow (10 screens)
7. Community service verification flow (4 screens)
8. Exemption flows (caregiver, disability, pregnancy, other)
9. Settings and notifications
10. Member-specific UI components (Combobox, InputOTP, YesNoToggle, UnifiedStatusIndicator)

**Key Routes**:
- `/m` (dashboard)
- `/m/auth/*`
- `/m/assess/*`
- `/m/work/*` (gig, traditional, bank, manual paths)
- `/m/education/*`
- `/m/volunteer/*`
- `/m/exemptions/*`
- `/m/settings`, `/m/notifications`

**Success Criteria**:
- Member can authenticate via phone + SMS code
- Member can complete assessment flow
- Member can verify employment via all 4 paths
- Member can verify education and community service
- Member can apply for exemptions
- All screens work on mobile (428px max-width)
- Touch targets meet 44px minimum
- Input font size is 16px to prevent iOS zoom
- Safe areas respected for notched devices

### Phase 4: Integration & Polish (Weeks 11-12)

**Goal**: Production readiness and quality assurance

**Deliverables**:
1. Complete API integration with backend endpoints
2. Error handling and retry logic
3. Loading states and skeletons
4. Empty states with clear CTAs
5. Form validation with inline errors
6. Toast notifications for success/error
7. Accessibility audit and fixes
8. Keyboard navigation testing
9. Screen reader testing
10. Performance optimization (code splitting, lazy loading)
11. Unit tests for critical components
12. Integration tests for key flows
13. E2E tests for happy paths
14. Production deployment

**Success Criteria**:
- All API endpoints integrated and working
- Error states handled gracefully
- Loading states provide feedback
- Forms validate correctly with helpful errors
- WCAG 2.1 AA compliance verified
- Keyboard navigation works throughout
- Screen readers can navigate all content
- Performance metrics meet targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Tests pass with >80% coverage for critical paths
- Application deployed and accessible

## Technology Stack

### Frontend Core

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.6+ | Type safety |
| Vite | 5.0+ | Build tool and dev server |

### Routing & Navigation

| Technology | Purpose |
|------------|---------|
| React Router | v6 - Client-side routing with nested routes |

### State Management

| Technology | Purpose |
|------------|---------|
| React Query (TanStack Query) | Server state management, caching, invalidation |
| Zustand | Feature state for multi-step flows |
| Context API | Auth context, theme context |

### Forms & Validation

| Technology | Purpose |
|------------|---------|
| React Hook Form | Form state management |
| Zod | Schema validation and TypeScript type inference |
| @hookform/resolvers | Integration between RHF and Zod |

### UI Components

| Technology | Purpose |
|------------|---------|
| Radix UI | Unstyled accessible primitives |
| Lucide React | Icon library |
| Recharts | Data visualization |
| Sonner | Toast notifications |

### Styling

| Technology | Purpose |
|------------|---------|
| CSS Variables | Theme tokens |
| CSS Modules (optional) | Component-scoped styles |

### Backend (Existing)

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Backend runtime |
| Express | HTTP server |
| PostgreSQL | Database |
| JWT | Authentication |

## Design System Integration

The application implements a unified design system with two theme variants:

### Admin Theme (Desktop)
- Base font: 14px
- Grid system: 8pt (2px, 4px, 6px, 8px base units)
- Container: max-width 1280px
- Colors: OKLCH color space for perceptual uniformity
- Typography: H1 (24px) → H6 (12px)
- Spacing: 12px, 16px, 24px, 32px, 48px, 64px, 96px

### Member Theme (Mobile)
- Base font: 16px (prevents iOS zoom)
- Grid system: 4px baseline (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- Container: max-width 428px (iPhone 14 Pro Max)
- Colors: iOS-inspired palette (#007aff primary, #30d158 success, #ff3b30 destructive)
- Typography: H1 (32px) → H6 (14px)
- Touch targets: minimum 44px × 44px
- Safe areas: env(safe-area-inset-*)

### Shared Components

45 UI primitives work with both themes via CSS variables:
- Form controls: Button, Input, Label, Textarea, Select, Checkbox, Radio Group, Switch
- Indicators: Badge, Avatar, Separator, Skeleton, Progress, Slider, Tooltip, Alert
- Layout: Card, Accordion, Collapsible, Tabs, Sidebar, Scroll Area, Resizable
- Dialogs: Dialog, Alert Dialog, Sheet, Drawer, Popover, Hover Card
- Navigation: Breadcrumb, Pagination, Navigation Menu, Menubar, Dropdown Menu, Context Menu, Command
- Data: Table, Chart, Carousel, Calendar
- Forms: Form wrapper with React Hook Form integration

## API Integration Strategy

### API Client Architecture

```typescript
// api/client.ts
class APIClient {
  private baseURL: string;
  private getAuthToken: () => string | null;
  
  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    // Add Authorization header
    // Handle response envelope { data, error }
    // Normalize errors
    // Retry logic for transient failures
  }
  
  get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T>
  post<T>(endpoint: string, body: unknown): Promise<T>
  patch<T>(endpoint: string, body: unknown): Promise<T>
  delete<T>(endpoint: string): Promise<T>
}
```

### Response Envelope

All API responses follow a standard envelope:

```json
{
  "data": { /* success payload */ },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### React Query Integration

```typescript
// hooks/useParticipants.ts
export function useParticipants(query: ParticipantQuery) {
  return useQuery({
    queryKey: ['participants', query],
    queryFn: () => api.get('/beneficiaries', query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateEmploymentActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEmploymentActivityInput) =>
      api.post(`/beneficiaries/${data.beneficiaryId}/employment-activities`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employment-activities'] });
    },
  });
}
```

### Error Handling

Errors are normalized to a consistent shape:

```typescript
interface AppError {
  code: string;
  message: string;
  httpStatus?: number;
  details?: Record<string, unknown>;
}
```

React Query's `onError` hooks display toast notifications for user-facing errors.

## Authentication & Authorization

### Admin Authentication

Email/password login (assumption - to be confirmed):

```
POST /api/v1/auth/admin/login
Body: { email, password }
Response: { data: { accessToken, refreshToken?, user }, error: null }
```

### Member Authentication

Phone-based OTP flow:

```
1. POST /api/v1/auth/member/request-code
   Body: { phone }
   Response: { data: { requestId }, error: null }

2. POST /api/v1/auth/member/verify-code
   Body: { requestId, code }
   Response: { data: { accessToken, user }, error: null }
```

### Session Persistence

- **Storage**: localStorage for access token (short-lived, 15-60 minutes)
- **Refresh**: Optional refresh token flow (to be confirmed)
- **Bootstrap**: On app mount, read persisted token and validate
- **Multi-tenancy**: tenant_id derived from JWT claims server-side

### Auth Context

```typescript
interface AuthContextValue {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

## State Management Strategy

### Three-Layer State Architecture

1. **Server State** (React Query)
   - API data, caching, synchronization
   - Query keys: `['beneficiaries', query]`, `['cases', query]`, `['participant', id]`
   - Automatic refetching, invalidation, optimistic updates

2. **Feature State** (Zustand)
   - Multi-step form data across screens
   - Employment flow state, education flow state, exemption flow state
   - Lightweight stores per feature

3. **Global State** (Context)
   - Auth context (user, tenant, tokens)
   - Theme context (route-scoped)

### Example: Employment Flow State

```typescript
// stores/employmentStore.ts
interface EmploymentFlowState {
  path: 'gig' | 'traditional' | 'bank' | 'manual' | null;
  provider: string | null;
  credentials: Record<string, string>;
  documents: File[];
  verificationData: unknown;
  
  setPath: (path: EmploymentFlowState['path']) => void;
  setProvider: (provider: string) => void;
  setCredentials: (credentials: Record<string, string>) => void;
  addDocument: (file: File) => void;
  setVerificationData: (data: unknown) => void;
  reset: () => void;
}

export const useEmploymentStore = create<EmploymentFlowState>((set) => ({
  // implementation
}));
```

## Error & Loading Patterns

### Loading States

- **Skeleton screens**: For lists and cards (participant list, case list)
- **Spinners**: For transient operations (verify, submit)
- **Progress indicators**: For multi-step processes (document upload)
- **Disabled states**: For buttons during async operations

### Error States

- **Global error boundary**: Catches unhandled errors with friendly fallback
- **API errors**: Toast notifications with concise messages
- **Form validation errors**: Inline errors near fields + summary at top
- **Empty states**: Friendly illustrations + clear CTAs
- **Network errors**: Retry button with exponential backoff

### Toast Notifications

Using Sonner for consistent notifications:

```typescript
toast.success('Verification submitted successfully');
toast.error('Failed to submit verification');
toast.info('Processing your request...');
toast.loading('Uploading document...', { id: 'upload' });
toast.success('Document uploaded', { id: 'upload' });
```

## Mobile-First Behavior

### Member Experience Requirements

- **Container**: max-width 428px, centered
- **Touch targets**: minimum 44px × 44px
- **Input font size**: 16px minimum (prevents iOS zoom)
- **Safe areas**: `padding-bottom: env(safe-area-inset-bottom)` for bottom actions
- **Bottom action bar**: Fixed position with safe area padding
- **Progressive disclosure**: Show optional fields only when needed
- **Single column**: All forms use single-column layout
- **Scroll behavior**: Smooth scrolling with overscroll containment

### Responsive Breakpoints

Admin experience uses responsive grids:

```css
/* Mobile-first */
.grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }

/* Tablet */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

## Accessibility Implementation

### WCAG 2.1 AA Compliance

**Color Contrast**:
- All text meets 4.5:1 contrast ratio minimum
- Large text (18px+) meets 3:1 ratio
- Interactive elements have visible focus states

**Keyboard Navigation**:
- All interactive elements are keyboard accessible
- Logical tab order throughout application
- Escape key dismisses dialogs and menus
- Enter/Space activate buttons and links
- Arrow keys navigate lists and menus

**Screen Reader Support**:
- Semantic HTML elements (nav, main, article, aside)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- ARIA describedby for form errors
- ARIA labelledby for dialog titles

**Focus Management**:
- Visible focus indicators (2px outline with offset)
- Focus trap in modal dialogs
- Focus restoration when closing dialogs
- Skip-to-content link for keyboard users

### Implementation Patterns

```tsx
// Accessible button
<button
  className="btn-primary"
  aria-label="Add participant note"
  disabled={isSubmitting}
  aria-busy={isSubmitting}
>
  <Plus className="w-4 h-4" aria-hidden="true" />
  Add Note
</button>

// Accessible form field
<div className="form-field">
  <Label htmlFor="phone">Phone Number</Label>
  <Input
    id="phone"
    type="tel"
    aria-describedby={errors.phone ? 'phone-error' : undefined}
    aria-invalid={!!errors.phone}
    style={{ fontSize: '16px' }}
  />
  {errors.phone && (
    <span id="phone-error" className="error-message" role="alert">
      {errors.phone.message}
    </span>
  )}
</div>

// Accessible dialog
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogTitle id="dialog-title">Add Note</DialogTitle>
    <DialogDescription id="dialog-description">
      Add a note to this participant's record
    </DialogDescription>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

## Component I/O Contracts

### Major Component Patterns

**Page Components**:
```typescript
interface PageProps {
  // Route params from React Router
  params?: Record<string, string>;
  // Query params from URL
  searchParams?: URLSearchParams;
}
```

**List Components**:
```typescript
interface ListProps<T> {
  query: Query;
  onQueryChange: (query: Query) => void;
  onRowClick?: (item: T) => void;
}
```

**Form Components**:
```typescript
interface FormProps<T> {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => Promise<void>;
  onCancel?: () => void;
}
```

**Modal Components**:
```typescript
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Modal-specific props
}
```

See [Component I/O Contracts](./component-io.md) for detailed contracts for major components.

## Open Questions & Decisions

See [Issues & Decisions](./issues-decisions.md) for:

- Admin authentication method (email/password vs SSO)
- Token refresh strategy and storage (localStorage vs httpOnly cookies)
- Complete endpoint inventory for backend implementation
- Verification vendor integration details
- Dark mode scope for MVP
- Tailwind CSS adoption decision
- Localization and translation requirements

## Next Steps

1. **Review this blueprint** with the team for alignment
2. **Clarify open questions** in Issues & Decisions document
3. **Set up development environment** following Phase 1 plan
4. **Begin implementation** starting with foundation (theme system, routing, API client)
5. **Iterate on feedback** and update blueprint as needed

## References

- [Navigation Structure](./navigation.md)
- [State Architecture](./state-architecture.md)
- [API Integration Plan](./api-integration.md)
- [Data Models](./data-models.md)
- [Authentication Flows](./auth-flows.md)
- [Error & Loading States](./error-loading.md)
- [Mobile & Accessibility](./mobile-accessibility.md)
- [Component I/O Contracts](./component-io.md)
- [Design System Guidelines](../figma-analysis/design-system-guidelines.md)
- [Component Architecture Map](../figma-analysis/component-architecture-map.md)
