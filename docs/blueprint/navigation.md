# Navigation Structure

This document defines the complete routing structure, URL patterns, and navigation behavior for both Admin and Member experiences.

## Overview

The application uses **React Router v6** for client-side routing with two distinct route trees:

- **Admin Routes** (`/admin/*`): Desktop-focused navigation with sidebar and breadcrumbs
- **Member Routes** (`/m/*`): Mobile-first navigation with back buttons and bottom actions

Route-based theme switching ensures the correct design system is applied to each experience.

## Technology Stack

- **Router**: React Router v6
- **Route Protection**: Higher-order component for authentication
- **Theme Switching**: Route-scoped ThemeProvider
- **Deep Linking**: Full support for URL state (filters, pagination, search)

## Route Architecture

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ThemeProvider defaultTheme="admin">
              <AdminRoutes />
            </ThemeProvider>
          } />
          
          {/* Member Routes */}
          <Route path="/m/*" element={
            <ThemeProvider defaultTheme="member">
              <MemberRoutes />
            </ThemeProvider>
          } />
          
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/m" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## Admin Routes (`/admin/*`)

### Route Map

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/admin` | Redirect | Redirect to `/admin/participants` | Yes |
| `/admin/participants` | ParticipantsIndex | Participant list with search/filter | Yes |
| `/admin/participants/:id` | ParticipantProfile | Detailed participant view | Yes |
| `/admin/cases` | CasesIndex | Case list with filtering | Yes |
| `/admin/cases/:id` | CaseDetail | Detailed case view | Yes |
| `/admin/broadcasts` | Broadcasts | Broadcast message list | Yes |
| `/admin/broadcasts/new` | NewBroadcast | Create broadcast message | Yes |
| `/admin/reporting` | Reporting | Analytics dashboard | Yes |
| `/admin/settings` | Settings | Settings container with tabs | Yes |
| `/admin/starred` | StarredIndex | Starred items view | Yes |
| `/admin/volunteer-network` | VolunteerNetworkRegistry | Volunteer network management | Yes |

### Settings Tabs

Settings uses tab-based navigation within a single route:

| Tab | Component | URL Pattern |
|-----|-----------|-------------|
| Users | UsersTab | `/admin/settings?tab=users` |
| Notifications | NotificationsTab | `/admin/settings?tab=notifications` |
| Security | SecurityTab | `/admin/settings?tab=security` |
| Data | DataTab | `/admin/settings?tab=data` |
| Modules | ModulesTab | `/admin/settings?tab=modules` |
| System | SystemTab | `/admin/settings?tab=system` |
| Attestation | AttestationTab | `/admin/settings?tab=attestation` |

### Query Parameters

Admin routes use query parameters for filters, sorting, and pagination:

**Participants**:
```
/admin/participants?search=john&status=active&page=2&pageSize=20&sort=lastName:asc
```

**Cases**:
```
/admin/cases?status=appeals_hold&assignedTo=user123&dueDate=overdue&page=1
```

**Broadcasts**:
```
/admin/broadcasts?status=sent&audience=all&page=1
```

### Admin Route Implementation

```typescript
// routes/AdminRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminShell } from '../components/admin/layout/AdminShell';

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AdminShell />}>
          <Route index element={<Navigate to="/admin/participants" replace />} />
          <Route path="participants" element={<ParticipantsIndex />} />
          <Route path="participants/:id" element={<ParticipantProfile />} />
          <Route path="cases" element={<CasesIndex />} />
          <Route path="cases/:id" element={<CaseDetail />} />
          <Route path="broadcasts" element={<Broadcasts />} />
          <Route path="broadcasts/new" element={<NewBroadcast />} />
          <Route path="reporting" element={<Reporting />} />
          <Route path="settings" element={<Settings />} />
          <Route path="starred" element={<StarredIndex />} />
          <Route path="volunteer-network" element={<VolunteerNetworkRegistry />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

### Admin Navigation Components

**Sidebar Navigation**:
```typescript
const adminNavItems = [
  { label: 'Participants', path: '/admin/participants', icon: Users },
  { label: 'Cases', path: '/admin/cases', icon: Briefcase },
  { label: 'Broadcasts', path: '/admin/broadcasts', icon: MessageSquare },
  { label: 'Reporting', path: '/admin/reporting', icon: BarChart },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
  { label: 'Starred', path: '/admin/starred', icon: Star },
  { label: 'Volunteer Network', path: '/admin/volunteer-network', icon: Users },
];
```

**Breadcrumbs**:
```typescript
// ParticipantProfile breadcrumbs
<Breadcrumb>
  <BreadcrumbItem href="/admin/participants">Participants</BreadcrumbItem>
  <BreadcrumbItem>John Doe</BreadcrumbItem>
</Breadcrumb>

// CaseDetail breadcrumbs
<Breadcrumb>
  <BreadcrumbItem href="/admin/cases">Cases</BreadcrumbItem>
  <BreadcrumbItem>Case #12345</BreadcrumbItem>
</Breadcrumb>
```

## Member Routes (`/m/*`)

### Route Map

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/m` | DashboardScreen | Main dashboard | Yes |
| `/m/auth` | AuthScreen | Phone number entry | No |
| `/m/auth/code` | AuthCodeScreen | SMS code verification | No |
| `/m/auth/identity` | AuthIdentityScreen | Identity verification | No |

### Onboarding Flow

| Route | Component | Description |
|-------|-----------|-------------|
| `/m/onboarding/welcome` | OnboardingWelcomeScreen | Welcome message |
| `/m/onboarding/requirements` | OnboardingRequirementsScreen | Requirements overview |
| `/m/onboarding/exemptions` | OnboardingExemptionsScreen | Exemptions overview |
| `/m/onboarding/security` | OnboardingSecurityScreen | Security information |

### Assessment Flow

| Route | Component | Description |
|-------|-----------|-------------|
| `/m/assess` | AssessIntroScreen | Assessment introduction |
| `/m/assess/state-enrollment` | AssessStateEnrollmentScreen | State enrollment check |
| `/m/assess/age` | AssessAgeScreen | Age verification |
| `/m/assess/pregnancy` | AssessPregnancyScreen | Pregnancy status |
| `/m/assess/disability` | AssessDisabilityScreen | Disability status |
| `/m/assess/caregiver` | AssessCaregiverScreen | Caregiver status |
| `/m/assess/snap-tanf` | AssessSnapTanfScreen | SNAP/TANF enrollment |
| `/m/assess/outcome/exempt` | AssessOutcomeExemptScreen | Exempt outcome |
| `/m/assess/outcome/required` | AssessOutcomeRequiredScreen | Required outcome |

### Employment Verification Flow

**Path Selection**:
```
/m/work/choose-path → Select verification method
```

**Gig Platform Path**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/work/gig/select-platform` | SelectGigPlatformScreen | Select gig platform |
| `/m/work/gig/uber/login` | FakeUberLoginScreen | Uber login simulation |
| `/m/work/gig/uber/oauth` | UberOAuthPermissionScreen | Uber OAuth consent |
| `/m/work/gig/uber/progress` | UberProgressLoaderScreen | Connection progress |
| `/m/work/gig/uber/success` | UberConnectionSuccessScreen | Connection success |

**Traditional Employment Path**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/work/traditional/payment-method` | PaymentMethodScreen | Choose payment method |
| `/m/work/traditional/payroll/provider` | PayrollProviderScreen | Select payroll provider |
| `/m/work/traditional/payroll/auth` | PayrollAuthScreen | Payroll login |
| `/m/work/traditional/payroll/oauth` | PayrollOAuthPermissionScreen | Payroll OAuth consent |
| `/m/work/traditional/payroll/verification` | PayrollVerificationScreen | Payroll data verification |

**Bank Verification Path**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/work/bank/provider` | BankProviderScreen | Select bank |
| `/m/work/bank/consent` | BankConsentScreen | Bank connection consent |
| `/m/work/bank/auth` | BankAuthScreen | Bank login |
| `/m/work/bank/oauth` | BankOAuthPermissionScreen | Bank OAuth consent |
| `/m/work/bank/verification` | BankVerificationScreen | Bank transaction verification |

**Manual Upload Path**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/work/manual/upload` | CheckUploadScreen | Upload paycheck image |
| `/m/work/manual/processing` | CheckExtractionLoader | Processing uploaded check |
| `/m/work/manual/review` | CheckReviewScreen | Review extracted data |

**Summary & Submission**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/work/summary` | WorkSummaryScreen | Employment summary |
| `/m/work/submit/loading` | SubmissionLoaderScreen | Submitting verification |
| `/m/work/submit/confirmed` | SubmitConfirmedScreen | Submission confirmed |

### Education Verification Flow

| Route | Component | Description |
|-------|-----------|-------------|
| `/m/education/path-choice` | EducationPathChoiceScreen | Choose education type |
| `/m/education/school-search` | EducationSchoolSearchScreen | Search for school |
| `/m/education/credentials` | EducationCredentialsScreen | Enter school credentials |
| `/m/education/automated-verification` | EducationAutomatedVerificationScreen | Automated verification |
| `/m/education/details` | EducationDetailsScreen | Manual education details |
| `/m/education/document-upload` | EducationDocumentUploadScreen | Upload documents |
| `/m/education/document-extraction` | EducationDocumentExtractionScreen | Processing documents |
| `/m/education/summary` | EducationSummaryScreen | Education summary |
| `/m/education/submit/loading` | EducationSubmitLoadingScreen | Submitting |
| `/m/education/submit/confirmed` | EducationSubmitConfirmedScreen | Submission confirmed |

### Community Service Flow

| Route | Component | Description |
|-------|-----------|-------------|
| `/m/volunteer/details` | CommunityServiceDetailsScreen | Enter service details |
| `/m/volunteer/upload` | CommunityServiceUploadScreen | Upload documentation |
| `/m/volunteer/processing` | CommunityServiceProcessingScreen | Processing submission |
| `/m/volunteer/success` | CommunityServiceSuccessScreen | Success confirmation |

### Exemption Flows

**Pre-screening**:
```
/m/exemptions/prescreening → ExemptionPreScreening
```

**Caregiver Exemption**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/exemptions/caregiver` | CaregiverExemptionScreen | Caregiver exemption intro |
| `/m/exemptions/caregiver/form` | CaregiverExemptionForm | Caregiver details form |
| `/m/exemptions/caregiver/documents` | CaregiverDocumentUpload | Upload caregiver documents |

**Disability Exemption**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/exemptions/disability` | DisabilityExemptionScreen | Disability exemption intro |
| `/m/exemptions/disability/form` | DisabilityExemptionForm | Disability details form |
| `/m/exemptions/disability/documents` | DisabilityDocumentUpload | Upload disability documents |

**Pregnancy Exemption**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/exemptions/pregnancy` | PregnancyExemptionScreen | Pregnancy exemption intro |
| `/m/exemptions/pregnancy/form` | PregnancyExemptionForm | Pregnancy details form |
| `/m/exemptions/pregnancy/documents` | PregnancyDocumentUpload | Upload pregnancy documents |

**Other Exemptions**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/exemptions/other` | OtherExemptionScreen | Other exemption types |
| `/m/exemptions/other/form` | OtherExemptionForm | Other exemption form |
| `/m/exemptions/other/documents` | OtherDocumentUpload | Upload other documents |

**Exemption Processing**:
| Route | Component | Description |
|-------|-----------|-------------|
| `/m/exemptions/period` | ExemptionPeriodSelectionScreen | Select exemption period |
| `/m/exemptions/processing` | ExemptionProcessing | Processing exemption |
| `/m/exemptions/confirmed` | ExemptionConfirmed | Exemption confirmed |

### Settings & Notifications

| Route | Component | Description |
|-------|-----------|-------------|
| `/m/settings` | SettingsScreen | Settings menu |
| `/m/settings/notifications` | NotificationSettingsScreen | Notification preferences |
| `/m/settings/push` | PushNotificationScreen | Push notification permission |
| `/m/notifications` | NotificationsScreen | Notification history |

### Support

| Route | Component | Description |
|-------|-----------|-------------|
| `/m/help` | HelpCenterScreen | Help and FAQs |
| `/m/support/chat` | ChatSupportScreen | Live chat support |
| `/m/outreach` | ProactiveOutreachScreen | Proactive messages |

### Member Route Implementation

```typescript
// routes/MemberRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function MemberRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="auth" element={<AuthScreen />} />
      <Route path="auth/code" element={<AuthCodeScreen />} />
      <Route path="auth/identity" element={<AuthIdentityScreen />} />
      
      {/* Protected member routes */}
      <Route element={<ProtectedRoute requiredRole="member" />}>
        <Route index element={<DashboardScreen />} />
        
        {/* Onboarding */}
        <Route path="onboarding/welcome" element={<OnboardingWelcomeScreen />} />
        <Route path="onboarding/requirements" element={<OnboardingRequirementsScreen />} />
        <Route path="onboarding/exemptions" element={<OnboardingExemptionsScreen />} />
        <Route path="onboarding/security" element={<OnboardingSecurityScreen />} />
        
        {/* Assessment */}
        <Route path="assess" element={<AssessIntroScreen />} />
        <Route path="assess/state-enrollment" element={<AssessStateEnrollmentScreen />} />
        <Route path="assess/age" element={<AssessAgeScreen />} />
        <Route path="assess/pregnancy" element={<AssessPregnancyScreen />} />
        <Route path="assess/disability" element={<AssessDisabilityScreen />} />
        <Route path="assess/caregiver" element={<AssessCaregiverScreen />} />
        <Route path="assess/snap-tanf" element={<AssessSnapTanfScreen />} />
        <Route path="assess/outcome/exempt" element={<AssessOutcomeExemptScreen />} />
        <Route path="assess/outcome/required" element={<AssessOutcomeRequiredScreen />} />
        
        {/* Employment - nested routes */}
        <Route path="work/*" element={<EmploymentRoutes />} />
        
        {/* Education */}
        <Route path="education/*" element={<EducationRoutes />} />
        
        {/* Volunteer */}
        <Route path="volunteer/*" element={<VolunteerRoutes />} />
        
        {/* Exemptions */}
        <Route path="exemptions/*" element={<ExemptionRoutes />} />
        
        {/* Settings */}
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="settings/notifications" element={<NotificationSettingsScreen />} />
        <Route path="settings/push" element={<PushNotificationScreen />} />
        <Route path="notifications" element={<NotificationsScreen />} />
        
        {/* Support */}
        <Route path="help" element={<HelpCenterScreen />} />
        <Route path="support/chat" element={<ChatSupportScreen />} />
        <Route path="outreach" element={<ProactiveOutreachScreen />} />
      </Route>
    </Routes>
  );
}
```

### Member Navigation Patterns

**Back Button**:
```typescript
// ScreenLayout with back button
<ScreenLayout
  showHeader={true}
  headerTitle="Verify Employment"
  onHeaderBack={() => navigate(-1)}
>
  {/* Screen content */}
</ScreenLayout>
```

**Bottom Action Bar**:
```typescript
// ScreenLayout with bottom actions
<ScreenLayout
  showHeader={true}
  headerTitle="Upload Paystub"
  actions={
    <div className="space-y-3 py-4">
      <Button 
        className="w-full h-12" 
        onClick={handleSubmit}
        disabled={!file}
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

**Progress Indicator**:
```typescript
// Multi-step flow with progress
<ScreenLayout
  showHeader={true}
  headerTitle={`Step ${currentStep} of ${totalSteps}`}
>
  <Progress value={(currentStep / totalSteps) * 100} className="mb-6" />
  {/* Screen content */}
</ScreenLayout>
```

## Route Protection

### Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'member';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    // Redirect to appropriate login
    const loginPath = requiredRole === 'admin' ? '/admin/login' : '/m/auth';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    // Role mismatch - redirect to appropriate home
    const homePath = user?.role === 'admin' ? '/admin' : '/m';
    return <Navigate to={homePath} replace />;
  }
  
  return <Outlet />;
}
```

## Deep Linking & URL State

### Admin Deep Linking

Filters, sorting, and pagination are encoded in URL query parameters:

```typescript
// hooks/useParticipantQuery.ts
import { useSearchParams } from 'react-router-dom';

export function useParticipantQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    pageSize: parseInt(searchParams.get('pageSize') || '20'),
    sort: searchParams.get('sort') || 'lastName:asc',
  };
  
  const updateQuery = (updates: Partial<typeof query>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    setSearchParams(newParams);
  };
  
  return { query, updateQuery };
}
```

### Member Flow State

Member flows maintain step state in Zustand stores, with optional URL params for simple enums:

```typescript
// Employment path selection in URL
/m/work/choose-path → user selects "gig"
/m/work/gig/select-platform?path=gig

// Form data in Zustand store
const { path, provider, credentials } = useEmploymentStore();
```

## Navigation Utilities

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom';

function ParticipantRow({ participant }: { participant: Participant }) {
  const navigate = useNavigate();
  
  return (
    <tr onClick={() => navigate(`/admin/participants/${participant.id}`)}>
      {/* Row content */}
    </tr>
  );
}
```

### Navigation with State

```typescript
// Pass state to next route
navigate('/m/work/summary', { 
  state: { fromPath: 'gig', provider: 'uber' } 
});

// Access state in target route
const location = useLocation();
const { fromPath, provider } = location.state || {};
```

### Replace vs Push

```typescript
// Replace (don't add to history)
navigate('/m/work/submit/confirmed', { replace: true });

// Push (add to history)
navigate('/m/work/gig/select-platform');
```

## Scroll Behavior

### Scroll to Top on Route Change

```typescript
// components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Add to App.tsx
<BrowserRouter>
  <ScrollToTop />
  <Routes>{/* routes */}</Routes>
</BrowserRouter>
```

### Preserve Scroll Position

```typescript
// For list views, preserve scroll when navigating back
import { useScrollRestoration } from 'react-router-dom';

function ParticipantsIndex() {
  useScrollRestoration();
  // Component implementation
}
```

## Error Routes

### 404 Not Found

```typescript
// components/NotFound.tsx
export function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">Page not found</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}
```

### Error Boundary with Navigation

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <Button onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## Testing Navigation

### Route Testing

```typescript
// __tests__/navigation.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

test('navigates to participant profile', async () => {
  render(
    <MemoryRouter initialEntries={['/admin/participants/123']}>
      <App />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Participant Profile/i)).toBeInTheDocument();
});
```

## Summary

The navigation structure provides:

- **Clear separation** between Admin and Member experiences via route prefixes
- **Theme-aware routing** with automatic theme switching
- **Deep linking support** for filters, sorting, and pagination
- **Protected routes** with role-based access control
- **Mobile-optimized navigation** with back buttons and bottom actions
- **Desktop navigation** with sidebar and breadcrumbs
- **Type-safe routing** with TypeScript
- **Testable navigation** with React Router testing utilities

All routes are documented with their components, descriptions, and authentication requirements, providing a complete map for implementation.
