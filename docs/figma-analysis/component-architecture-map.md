# Component Architecture Map

This document provides a comprehensive mapping of all components from the Figma exports (Admin and Member experiences) to a proposed React component hierarchy for the Medicaid Community Engagement application.

## Table of Contents

1. [Overview](#overview)
2. [UI Atoms (Primitives)](#ui-atoms-primitives)
3. [UI Molecules (Composite Components)](#ui-molecules-composite-components)
4. [Admin Feature Components](#admin-feature-components)
5. [Member Screen Components](#member-screen-components)
6. [Shared vs Unique Components](#shared-vs-unique-components)
7. [Proposed Component Hierarchy](#proposed-component-hierarchy)
8. [Implementation Recommendations](#implementation-recommendations)

---

## Overview

### Component Counts

| Category | Admin | Member | Shared |
|----------|-------|--------|--------|
| UI Primitives (Atoms) | 53 | 47 | 45 |
| Feature Components | 29 | 141 | 0 |
| **Total** | **82** | **188** | **45** |

### Architecture Philosophy

- **Atoms**: Basic UI primitives (Button, Input, Badge) that are theme-aware and work with both Admin and Member experiences
- **Molecules**: Composite components (Card, Modal, Form) built from atoms
- **Organisms**: Feature-specific components (ParticipantProfile, EmploymentVerification) built from molecules
- **Templates**: Page layouts (AdminShell, ScreenLayout) that define structure
- **Pages**: Complete screens that combine templates and organisms

---

## UI Atoms (Primitives)

### Shared Atoms (Present in Both Exports)

These components exist in both Admin and Member exports with identical or very similar APIs:

| Component | File | Purpose | Variants | Props |
|-----------|------|---------|----------|-------|
| **Button** | `button.tsx` | Primary interactive element | default, outline, ghost, destructive, link | variant, size, disabled |
| **Input** | `input.tsx` | Text input field | text, email, password, number, tel | type, placeholder, disabled |
| **Label** | `label.tsx` | Form field label | - | htmlFor |
| **Textarea** | `textarea.tsx` | Multi-line text input | - | rows, placeholder, disabled |
| **Select** | `select.tsx` | Dropdown selection | - | options, value, onChange |
| **Checkbox** | `checkbox.tsx` | Boolean selection | - | checked, onCheckedChange |
| **Radio Group** | `radio-group.tsx` | Single selection from options | - | value, onValueChange |
| **Switch** | `switch.tsx` | Toggle switch | - | checked, onCheckedChange |
| **Badge** | `badge.tsx` | Status indicator | default, secondary, destructive, outline | variant |
| **Avatar** | `avatar.tsx` | User profile image | - | src, fallback |
| **Separator** | `separator.tsx` | Visual divider | horizontal, vertical | orientation |
| **Skeleton** | `skeleton.tsx` | Loading placeholder | - | className |
| **Progress** | `progress.tsx` | Progress indicator | - | value, max |
| **Slider** | `slider.tsx` | Range input | - | min, max, step, value |
| **Tooltip** | `tooltip.tsx` | Hover information | - | content, side |
| **Alert** | `alert.tsx` | Notification message | default, destructive | variant |
| **Aspect Ratio** | `aspect-ratio.tsx` | Maintain aspect ratio | - | ratio |
| **Toggle** | `toggle.tsx` | Toggle button | default, outline | variant, pressed |
| **Toggle Group** | `toggle-group.tsx` | Group of toggles | single, multiple | type, value |

### Admin-Specific Atoms

Components unique to the Admin export:

| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| **Star Button** | `star-button.tsx` | Favorite/bookmark toggle | Participant/case starring |
| **Status Badge** | `status-badge.tsx` | Semantic status indicator | Case status, verification status |
| **User Avatar** | `user-avatar.tsx` | Enhanced avatar with status | Case worker profiles |
| **Column Visibility Menu** | `column-visibility-menu.tsx` | Table column toggle | DataTable customization |
| **Sorting Menu** | `sorting-menu.tsx` | Table sorting controls | DataTable sorting |
| **Confirmation Modal** | `confirmation-modal.tsx` | Action confirmation dialog | Destructive actions |

### Member-Specific Atoms

Components unique to the Member export:

| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| **Combobox** | `combobox.tsx` | Searchable select | School search, provider selection |
| **Input OTP** | `input-otp.tsx` | One-time password input | SMS verification codes |

---

## UI Molecules (Composite Components)

### Layout Molecules

| Component | File | Admin | Member | Purpose |
|-----------|------|-------|--------|---------|
| **Card** | `card.tsx` | ✓ | ✓ | Content container with header/content/footer |
| **Accordion** | `accordion.tsx` | ✓ | ✓ | Collapsible content sections |
| **Collapsible** | `collapsible.tsx` | ✓ | ✓ | Simple collapsible content |
| **Tabs** | `tabs.tsx` | ✓ | ✓ | Tabbed navigation |
| **Sidebar** | `sidebar.tsx` | ✓ | ✓ | Side navigation panel |
| **Scroll Area** | `scroll-area.tsx` | ✓ | ✓ | Custom scrollable region |
| **Resizable** | `resizable.tsx` | ✓ | ✓ | Resizable panel layout |

### Dialog Molecules

| Component | File | Admin | Member | Purpose |
|-----------|------|-------|--------|---------|
| **Dialog** | `dialog.tsx` | ✓ | ✓ | Modal dialog |
| **Alert Dialog** | `alert-dialog.tsx` | ✓ | ✓ | Confirmation dialog |
| **Sheet** | `sheet.tsx` | ✓ | ✓ | Slide-in panel |
| **Drawer** | `drawer.tsx` | ✓ | ✓ | Bottom drawer (mobile) |
| **Popover** | `popover.tsx` | ✓ | ✓ | Floating content |
| **Hover Card** | `hover-card.tsx` | ✓ | ✓ | Hover-triggered card |

### Navigation Molecules

| Component | File | Admin | Member | Purpose |
|-----------|------|-------|--------|---------|
| **Breadcrumb** | `breadcrumb.tsx` | ✓ | ✓ | Breadcrumb navigation |
| **Pagination** | `pagination.tsx` | ✓ | ✓ | Page navigation |
| **Navigation Menu** | `navigation-menu.tsx` | ✓ | ✓ | Main navigation |
| **Menubar** | `menubar.tsx` | ✓ | ✓ | Desktop menu bar |
| **Dropdown Menu** | `dropdown-menu.tsx` | ✓ | ✓ | Dropdown actions |
| **Context Menu** | `context-menu.tsx` | ✓ | ✓ | Right-click menu |
| **Command** | `command.tsx` | ✓ | ✓ | Command palette |

### Data Display Molecules

| Component | File | Admin | Member | Purpose |
|-----------|------|-------|--------|---------|
| **Table** | `table.tsx` | ✓ | ✓ | Basic table |
| **Data Table** | `data-table.tsx` | ✓ | - | Advanced table with sorting/filtering |
| **Chart** | `chart.tsx` | ✓ | ✓ | Data visualization wrapper |
| **Carousel** | `carousel.tsx` | ✓ | ✓ | Image/content carousel |
| **Calendar** | `calendar.tsx` | ✓ | ✓ | Date picker |

### Form Molecules

| Component | File | Admin | Member | Purpose |
|-----------|------|-------|--------|---------|
| **Form** | `form.tsx` | ✓ | ✓ | Form wrapper with React Hook Form |

---

## Admin Feature Components

### Layout Components

| Component | File | Purpose | Routes |
|-----------|------|---------|--------|
| **AdminShell** | `AdminShell.tsx` | Main layout with header, sidebar, content | All /admin/* routes |

### Participant Management

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **ParticipantsIndex** | `ParticipantsIndex.tsx` | Participant list with search/filter | /admin/participants |
| **ParticipantProfile** | `ParticipantProfile.tsx` | Detailed participant view | /admin/participants/:id |
| **ParticipantFilterManager** | `ParticipantFilterManager.tsx` | Advanced filtering UI | Used in ParticipantsIndex |

### Case Management

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **CasesIndex** | `CasesIndex.tsx` | Case list with filtering | /admin/cases |
| **CaseDetail** | `CaseDetail.tsx` | Detailed case view | /admin/cases/:id |
| **CaseFilterManager** | `CaseFilterManager.tsx` | Advanced case filtering | Used in CasesIndex |

### Broadcast Messaging

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **Broadcasts** | `Broadcasts.tsx` | Broadcast message list | /admin/broadcasts |
| **NewBroadcast** | `NewBroadcast.tsx` | Create broadcast message | /admin/broadcasts/new |
| **BroadcastFilterManager** | `BroadcastFilterManager.tsx` | Filter broadcasts | Used in Broadcasts |

### Reporting & Analytics

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **Reporting** | `Reporting.tsx` | Analytics dashboard with charts | /admin/reporting |

### Settings

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **Settings** | `Settings.tsx` | Settings container with tabs | /admin/settings |
| **UsersTab** | `UsersTab.tsx` | User management | /admin/settings (tab) |
| **NotificationsTab** | `NotificationsTab.tsx` | Notification settings | /admin/settings (tab) |
| **SecurityTab** | `SecurityTab.tsx` | Security settings | /admin/settings (tab) |
| **DataTab** | `DataTab.tsx` | Data management | /admin/settings (tab) |
| **ModulesTab** | `ModulesTab.tsx` | Module configuration | /admin/settings (tab) |
| **SystemTab** | `SystemTab.tsx` | System settings | /admin/settings (tab) |
| **AttestationTab** | `AttestationTab.tsx` | Attestation settings | /admin/settings (tab) |

### Other Features

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **StarredIndex** | `StarredIndex.tsx` | Starred items view | /admin/starred |
| **VolunteerNetworkRegistry** | `VolunteerNetworkRegistry.tsx` | Volunteer network management | /admin/volunteer-network |
| **CECopilot** | `CECopilot.tsx` | AI copilot assistant | Overlay/sidebar |

### Modals & Dialogs

| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| **AddNoteModal** | `AddNoteModal.tsx` | Add note to case/participant | Case/participant details |
| **AuditPackageModal** | `AuditPackageModal.tsx` | Audit package review | Case management |
| **BulkExtendDeadlineModal** | `BulkExtendDeadlineModal.tsx` | Extend deadlines in bulk | Case management |
| **DocumentViewerModal** | `DocumentViewerModal.tsx` | View uploaded documents | Document review |
| **RequestClarificationModal** | `RequestClarificationModal.tsx` | Request clarification from participant | Case management |

---

## Member Screen Components

### Authentication Flow (3 screens)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **AuthScreen** | `AuthScreen.tsx` | Phone number entry | /m/auth |
| **AuthCodeScreen** | `AuthCodeScreen.tsx` | SMS code verification | /m/auth/code |
| **AuthIdentityScreen** | `AuthIdentityScreen.tsx` | Identity verification | /m/auth/identity |

### Onboarding Flow (4 screens)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **OnboardingWelcomeScreen** | `OnboardingWelcomeScreen.tsx` | Welcome message | /m/onboarding/welcome |
| **OnboardingRequirementsScreen** | `OnboardingRequirementsScreen.tsx` | Requirements overview | /m/onboarding/requirements |
| **OnboardingExemptionsScreen** | `OnboardingExemptionsScreen.tsx` | Exemptions overview | /m/onboarding/exemptions |
| **OnboardingSecurityScreen** | `OnboardingSecurityScreen.tsx` | Security information | /m/onboarding/security |

### Assessment Flow (8 screens)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **AssessIntroScreen** | `AssessIntroScreen.tsx` | Assessment introduction | /m/assess |
| **AssessStateEnrollmentScreen** | `AssessStateEnrollmentScreen.tsx` | State enrollment check | /m/assess/state-enrollment |
| **AssessAgeScreen** | `AssessAgeScreen.tsx` | Age verification | /m/assess/age |
| **AssessPregnancyScreen** | `AssessPregnancyScreen.tsx` | Pregnancy status | /m/assess/pregnancy |
| **AssessDisabilityScreen** | `AssessDisabilityScreen.tsx` | Disability status | /m/assess/disability |
| **AssessCaregiverScreen** | `AssessCaregiverScreen.tsx` | Caregiver status | /m/assess/caregiver |
| **AssessSnapTanfScreen** | `AssessSnapTanfScreen.tsx` | SNAP/TANF enrollment | /m/assess/snap-tanf |
| **AssessOutcomeExemptScreen** | `AssessOutcomeExemptScreen.tsx` | Exempt outcome | /m/assess/outcome/exempt |
| **AssessOutcomeRequiredScreen** | `AssessOutcomeRequiredScreen.tsx` | Required outcome | /m/assess/outcome/required |

### Dashboard Screens (3 variants)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **DashboardScreen** | `DashboardScreen.tsx` | Main dashboard | /m |
| **EnhancedDashboard** | `EnhancedDashboard.tsx` | Enhanced dashboard variant | /m/dashboard/enhanced |
| **VerificationDashboard** | `VerificationDashboard.tsx` | Verification-focused dashboard | /m/dashboard/verification |

### Employment Verification Flow (20+ screens)

#### Gig Platform Path
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **ChoosePathScreen** | `ChoosePathScreen.tsx` | Choose verification method | /m/work/choose-path |
| **SelectGigPlatformScreen** | `SelectGigPlatformScreen.tsx` | Select gig platform | /m/work/gig/select-platform |
| **FakeUberLoginScreen** | `FakeUberLoginScreen.tsx` | Uber login simulation | /m/work/gig/uber/login |
| **UberOAuthPermissionScreen** | `UberOAuthPermissionScreen.tsx` | Uber OAuth consent | /m/work/gig/uber/oauth |
| **UberProgressLoaderScreen** | `UberProgressLoaderScreen.tsx` | Uber connection progress | /m/work/gig/uber/progress |
| **UberConnectionSuccessScreen** | `UberConnectionSuccessScreen.tsx` | Uber connection success | /m/work/gig/uber/success |

#### Traditional Employment Path
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **PaymentMethodScreen** | `PaymentMethodScreen.tsx` | Choose payment method | /m/work/traditional/payment-method |
| **PayrollProviderScreen** | `PayrollProviderScreen.tsx` | Select payroll provider | /m/work/traditional/payroll/provider |
| **PayrollAuthScreen** | `PayrollAuthScreen.tsx` | Payroll login | /m/work/traditional/payroll/auth |
| **PayrollOAuthPermissionScreen** | `PayrollOAuthPermissionScreen.tsx` | Payroll OAuth consent | /m/work/traditional/payroll/oauth |
| **PayrollVerificationScreen** | `PayrollVerificationScreen.tsx` | Payroll data verification | /m/work/traditional/payroll/verification |

#### Bank Verification Path
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **BankProviderScreen** | `BankProviderScreen.tsx` | Select bank | /m/work/bank/provider |
| **BankConsentScreen** | `BankConsentScreen.tsx` | Bank connection consent | /m/work/bank/consent |
| **BankAuthScreen** | `BankAuthScreen.tsx` | Bank login | /m/work/bank/auth |
| **BankOAuthPermissionScreen** | `BankOAuthPermissionScreen.tsx` | Bank OAuth consent | /m/work/bank/oauth |
| **BankVerificationScreen** | `BankVerificationScreen.tsx` | Bank transaction verification | /m/work/bank/verification |

#### Manual Upload Path
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **CheckUploadScreen** | `CheckUploadScreen.tsx` | Upload paycheck image | /m/work/manual/upload |
| **CheckExtractionLoader** | `CheckExtractionLoader.tsx` | Processing uploaded check | /m/work/manual/processing |
| **CheckReviewScreen** | `CheckReviewScreen.tsx` | Review extracted data | /m/work/manual/review |

#### Summary & Submission
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **WorkSummaryScreen** | `WorkSummaryScreen.tsx` | Employment summary | /m/work/summary |
| **SubmissionLoaderScreen** | `SubmissionLoaderScreen.tsx` | Submitting verification | /m/work/submit/loading |
| **SubmitConfirmedScreen** | `SubmitConfirmedScreen.tsx` | Submission confirmed | /m/work/submit/confirmed |

### Education Verification Flow (10 screens)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **EducationPathChoiceScreen** | `EducationPathChoiceScreen.tsx` | Choose education type | /m/education/path-choice |
| **EducationSchoolSearchScreen** | `EducationSchoolSearchScreen.tsx` | Search for school | /m/education/school-search |
| **EducationCredentialsScreen** | `EducationCredentialsScreen.tsx` | Enter school credentials | /m/education/credentials |
| **EducationAutomatedVerificationScreen** | `EducationAutomatedVerificationScreen.tsx` | Automated verification | /m/education/automated-verification |
| **EducationDetailsScreen** | `EducationDetailsScreen.tsx` | Manual education details | /m/education/details |
| **EducationDocumentUploadScreen** | `EducationDocumentUploadScreen.tsx` | Upload documents | /m/education/document-upload |
| **EducationDocumentExtractionScreen** | `EducationDocumentExtractionScreen.tsx` | Processing documents | /m/education/document-extraction |
| **EducationSummaryScreen** | `EducationSummaryScreen.tsx` | Education summary | /m/education/summary |
| **EducationSubmitLoadingScreen** | `EducationSubmitLoadingScreen.tsx` | Submitting | /m/education/submit/loading |
| **EducationSubmitConfirmedScreen** | `EducationSubmitConfirmedScreen.tsx` | Submission confirmed | /m/education/submit/confirmed |

### Community Service Flow (4 screens)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **CommunityServiceDetailsScreen** | `CommunityServiceDetailsScreen.tsx` | Enter service details | /m/volunteer/details |
| **CommunityServiceUploadScreen** | `CommunityServiceUploadScreen.tsx` | Upload documentation | /m/volunteer/upload |
| **CommunityServiceProcessingScreen** | `CommunityServiceProcessingScreen.tsx` | Processing submission | /m/volunteer/processing |
| **CommunityServiceSuccessScreen** | `CommunityServiceSuccessScreen.tsx` | Success confirmation | /m/volunteer/success |

### Exemption Flows (15+ screens)

#### Pre-screening
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **ExemptionPreScreening** | `ExemptionPreScreening.tsx` | Exemption eligibility check | /m/exemptions/prescreening |

#### Caregiver Exemption
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **CaregiverExemptionScreen** | `CaregiverExemptionScreen.tsx` | Caregiver exemption intro | /m/exemptions/caregiver |
| **CaregiverExemptionForm** | `CaregiverExemptionForm.tsx` | Caregiver details form | /m/exemptions/caregiver/form |
| **CaregiverDocumentUpload** | `CaregiverDocumentUpload.tsx` | Upload caregiver documents | /m/exemptions/caregiver/documents |

#### Disability Exemption
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **DisabilityExemptionScreen** | `DisabilityExemptionScreen.tsx` | Disability exemption intro | /m/exemptions/disability |
| **DisabilityExemptionForm** | `DisabilityExemptionForm.tsx` | Disability details form | /m/exemptions/disability/form |
| **DisabilityDocumentUpload** | `DisabilityDocumentUpload.tsx` | Upload disability documents | /m/exemptions/disability/documents |

#### Pregnancy Exemption
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **PregnancyExemptionScreen** | `PregnancyExemptionScreen.tsx` | Pregnancy exemption intro | /m/exemptions/pregnancy |
| **PregnancyExemptionForm** | `PregnancyExemptionForm.tsx` | Pregnancy details form | /m/exemptions/pregnancy/form |
| **PregnancyDocumentUpload** | `PregnancyDocumentUpload.tsx` | Upload pregnancy documents | /m/exemptions/pregnancy/documents |

#### Other Exemptions
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **OtherExemptionScreen** | `OtherExemptionScreen.tsx` | Other exemption types | /m/exemptions/other |
| **OtherExemptionForm** | `OtherExemptionForm.tsx` | Other exemption form | /m/exemptions/other/form |
| **OtherDocumentUpload** | `OtherDocumentUpload.tsx` | Upload other documents | /m/exemptions/other/documents |

#### Exemption Processing
| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **ExemptionPeriodSelectionScreen** | `ExemptionPeriodSelectionScreen.tsx` | Select exemption period | /m/exemptions/period |
| **ExemptionProcessing** | `ExemptionProcessing.tsx` | Processing exemption | /m/exemptions/processing |
| **ExemptionConfirmed** | `ExemptionConfirmed.tsx` | Exemption confirmed | /m/exemptions/confirmed |

### Settings & Profile (4 screens)

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **SettingsScreen** | `SettingsScreen.tsx` | Settings menu | /m/settings |
| **NotificationSettingsScreen** | `NotificationSettingsScreen.tsx` | Notification preferences | /m/settings/notifications |
| **NotificationsScreen** | `NotificationsScreen.tsx` | Notification history | /m/notifications |
| **PushNotificationScreen** | `PushNotificationScreen.tsx` | Push notification permission | /m/settings/push |

### Utility Screens

| Component | File | Purpose | Route |
|-----------|------|---------|-------|
| **HelpCenterScreen** | `HelpCenterScreen.tsx` | Help and FAQs | /m/help |
| **ChatSupportScreen** | `ChatSupportScreen.tsx` | Live chat support | /m/support/chat |
| **ProactiveOutreachScreen** | `ProactiveOutreachScreen.tsx` | Proactive messages | /m/outreach |

### Reusable Member Components

| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| **ScreenLayout** | `ScreenLayout.tsx` | Mobile screen wrapper | All member screens |
| **IPhoneFrame** | `IPhoneFrame.tsx` | iPhone simulator frame | Demo/preview only |
| **HeaderSection** | `HeaderSection.tsx` | Reusable header | Multiple screens |
| **UnifiedStatusIndicator** | `UnifiedStatusIndicator.tsx` | Status badge | Dashboard, summaries |
| **YesNoToggle** | `YesNoToggle.tsx` | Yes/No selection | Assessment questions |
| **AppLogo** | `AppLogo.tsx` | Application logo | Headers, auth screens |
| **MockDocumentSelector** | `MockDocumentSelector.tsx` | Demo document selector | Demo mode only |

---

## Shared vs Unique Components

### Shared Components (45 UI Primitives)

These components have identical or very similar implementations in both exports and should be unified in the shared UI library:

**Form Controls**: Button, Input, Label, Textarea, Select, Checkbox, Radio Group, Switch

**Indicators**: Badge, Avatar, Separator, Skeleton, Progress, Slider, Tooltip, Alert

**Layout**: Card, Accordion, Collapsible, Tabs, Sidebar, Scroll Area, Resizable

**Dialogs**: Dialog, Alert Dialog, Sheet, Drawer, Popover, Hover Card

**Navigation**: Breadcrumb, Pagination, Navigation Menu, Menubar, Dropdown Menu, Context Menu, Command

**Data**: Table, Chart, Carousel, Calendar

**Form**: Form (with React Hook Form integration)

**Utilities**: Aspect Ratio, Toggle, Toggle Group

### Admin-Unique Components (8)

Components that are specific to the Admin experience and won't be used in Member:

1. **Star Button** - Favoriting functionality
2. **Status Badge** - Admin-specific status styling
3. **User Avatar** - Case worker avatars with status
4. **Column Visibility Menu** - DataTable customization
5. **Sorting Menu** - DataTable sorting
6. **Confirmation Modal** - Admin action confirmations
7. **Data Table** - Advanced table with server-side features
8. **All Admin Feature Components** (29 components)

### Member-Unique Components (143)

Components specific to the Member mobile experience:

1. **Combobox** - Searchable select for mobile
2. **Input OTP** - SMS code verification
3. **All Member Screen Components** (141 components)

---

## Proposed Component Hierarchy

### Directory Structure

```
frontend/src/
├── components/
│   ├── ui/                          # Shared UI primitives (45 components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── admin/                       # Admin-specific components
│   │   ├── layout/
│   │   │   └── AdminShell.tsx
│   │   ├── participants/
│   │   │   ├── ParticipantsIndex.tsx
│   │   │   ├── ParticipantProfile.tsx
│   │   │   └── ParticipantFilterManager.tsx
│   │   ├── cases/
│   │   │   ├── CasesIndex.tsx
│   │   │   ├── CaseDetail.tsx
│   │   │   └── CaseFilterManager.tsx
│   │   ├── broadcasts/
│   │   │   ├── Broadcasts.tsx
│   │   │   ├── NewBroadcast.tsx
│   │   │   └── BroadcastFilterManager.tsx
│   │   ├── reporting/
│   │   │   └── Reporting.tsx
│   │   ├── settings/
│   │   │   ├── Settings.tsx
│   │   │   ├── UsersTab.tsx
│   │   │   ├── NotificationsTab.tsx
│   │   │   └── ...
│   │   ├── modals/
│   │   │   ├── AddNoteModal.tsx
│   │   │   ├── AuditPackageModal.tsx
│   │   │   └── ...
│   │   └── ui/                      # Admin-specific UI components
│   │       ├── data-table.tsx
│   │       ├── star-button.tsx
│   │       ├── status-badge.tsx
│   │       └── ...
│   │
│   └── member/                      # Member-specific components
│       ├── layout/
│       │   ├── ScreenLayout.tsx
│       │   └── IPhoneFrame.tsx
│       ├── auth/
│       │   ├── AuthScreen.tsx
│       │   ├── AuthCodeScreen.tsx
│       │   └── AuthIdentityScreen.tsx
│       ├── onboarding/
│       │   ├── OnboardingWelcomeScreen.tsx
│       │   └── ...
│       ├── assessment/
│       │   ├── AssessIntroScreen.tsx
│       │   ├── AssessAgeScreen.tsx
│       │   └── ...
│       ├── dashboard/
│       │   ├── DashboardScreen.tsx
│       │   ├── EnhancedDashboard.tsx
│       │   └── VerificationDashboard.tsx
│       ├── employment/
│       │   ├── ChoosePathScreen.tsx
│       │   ├── gig/
│       │   │   ├── SelectGigPlatformScreen.tsx
│       │   │   └── ...
│       │   ├── traditional/
│       │   │   ├── PayrollProviderScreen.tsx
│       │   │   └── ...
│       │   ├── bank/
│       │   │   ├── BankProviderScreen.tsx
│       │   │   └── ...
│       │   └── manual/
│       │       ├── CheckUploadScreen.tsx
│       │       └── ...
│       ├── education/
│       │   ├── EducationPathChoiceScreen.tsx
│       │   └── ...
│       ├── volunteer/
│       │   ├── CommunityServiceDetailsScreen.tsx
│       │   └── ...
│       ├── exemptions/
│       │   ├── ExemptionPreScreening.tsx
│       │   ├── caregiver/
│       │   ├── disability/
│       │   ├── pregnancy/
│       │   └── other/
│       ├── settings/
│       │   ├── SettingsScreen.tsx
│       │   └── NotificationSettingsScreen.tsx
│       ├── support/
│       │   ├── HelpCenterScreen.tsx
│       │   └── ChatSupportScreen.tsx
│       └── ui/                      # Member-specific UI components
│           ├── combobox.tsx
│           ├── input-otp.tsx
│           ├── HeaderSection.tsx
│           ├── UnifiedStatusIndicator.tsx
│           └── YesNoToggle.tsx
│
├── theme/
│   ├── tokens.ts                    # Design tokens (adminTheme, memberTheme)
│   └── ThemeProvider.tsx            # Theme context provider
│
└── styles/
    ├── globals.css                  # Global styles and CSS variables
    ├── admin.css                    # Admin-specific styles
    └── member.css                   # Member-specific styles
```

---

## Implementation Recommendations

### Phase 1: Foundation (Weeks 1-2)

1. **Set up theme system**
   - Implement `tokens.ts` with adminTheme and memberTheme
   - Create ThemeProvider component
   - Set up CSS variables in globals.css

2. **Build shared UI primitives** (Priority order)
   - Button, Input, Label, Textarea
   - Select, Checkbox, Radio Group, Switch
   - Card, Dialog, Sheet
   - Badge, Avatar, Separator
   - Form (with React Hook Form)
   - Alert, Tooltip, Progress

3. **Set up routing**
   - Install react-router-dom
   - Create route structure for /admin/* and /m/*
   - Implement route-based theme switching

### Phase 2: Admin Experience (Weeks 3-5)

1. **Admin layout**
   - AdminShell with header, sidebar, content area
   - Navigation structure

2. **Admin UI components**
   - DataTable with sorting, filtering, pagination
   - Star Button, Status Badge, User Avatar
   - Column Visibility Menu, Sorting Menu

3. **Admin feature pages** (Priority order)
   - ParticipantsIndex and ParticipantProfile
   - CasesIndex and CaseDetail
   - Broadcasts and NewBroadcast
   - Settings with tabs
   - Reporting dashboard

4. **Admin modals**
   - AddNoteModal
   - DocumentViewerModal
   - RequestClarificationModal

### Phase 3: Member Experience (Weeks 6-10)

1. **Member layout**
   - ScreenLayout with mobile-optimized header and actions
   - Safe area handling for iOS

2. **Member UI components**
   - Combobox, Input OTP
   - HeaderSection, UnifiedStatusIndicator
   - YesNoToggle

3. **Member flows** (Priority order)
   - Authentication (AuthScreen, AuthCodeScreen, AuthIdentityScreen)
   - Assessment (8 screens)
   - Dashboard (DashboardScreen)
   - Employment verification (20+ screens)
   - Education verification (10 screens)
   - Community service (4 screens)
   - Exemptions (15+ screens)
   - Settings and notifications

### Phase 4: Integration & Polish (Weeks 11-12)

1. **API integration**
   - Connect components to backend endpoints
   - Implement data fetching and mutations
   - Add loading and error states

2. **Testing**
   - Unit tests for UI primitives
   - Integration tests for flows
   - E2E tests for critical paths

3. **Accessibility audit**
   - WCAG 2.1 AA compliance verification
   - Keyboard navigation testing
   - Screen reader testing

4. **Performance optimization**
   - Code splitting by route
   - Lazy loading for heavy components
   - Image optimization

### Component Reuse Strategy

1. **Maximize shared primitives**
   - All 45 shared UI components should be theme-aware
   - Use CSS variables exclusively (no hard-coded colors/sizes)
   - Implement responsive behavior via theme tokens

2. **Feature-specific components**
   - Keep Admin and Member feature components separate
   - Don't try to force reuse where experiences diverge
   - Focus on reusing patterns and APIs, not implementations

3. **Composition over inheritance**
   - Build complex components from simple primitives
   - Use compound component patterns (e.g., Card.Header, Card.Content)
   - Favor props and slots over subclassing

4. **Theme-aware sizing**
   - Admin: Smaller, denser components (14px base)
   - Member: Larger touch targets (16px base, 44px minimum height)
   - Components adapt sizing based on active theme

### Missing Assets & Unclear Instructions

Based on the Figma exports analysis, the following items need clarification:

1. **Brand Assets**
   - Application logo (referenced in AppLogo component)
   - Favicon and app icons
   - Email templates for notifications

2. **Third-Party Logos**
   - Bank logos (Chase, Bank of America, Wells Fargo, etc.)
   - Payroll provider logos (ADP, Paychex, Gusto, etc.)
   - Gig platform logos (Uber, Lyft, DoorDash, etc.)
   - Educational institution logos

3. **Mock Data**
   - Participant/case sample data for Admin
   - User profile sample data for Member
   - Document samples for upload testing

4. **Integration Specifications**
   - OAuth flow details for payroll/bank/gig platforms
   - Document extraction API specifications
   - SMS verification service details
   - Push notification service configuration

5. **Business Logic**
   - Exemption eligibility rules
   - Assessment scoring logic
   - Verification approval criteria
   - Deadline calculation rules

6. **Content & Copy**
   - Error messages
   - Empty state messages
   - Help text and tooltips
   - Email/SMS notification templates

7. **Design Clarifications**
   - Dark mode support (CSS exists but unclear if required for MVP)
   - IPhoneFrame component (demo-only or production?)
   - Multiple dashboard variants (which is primary?)
   - Broadcast message formatting rules

### Next Steps

1. **Review this architecture map** with the team
2. **Prioritize features** for MVP vs future releases
3. **Clarify missing assets** and business logic
4. **Set up development environment** with theme system
5. **Begin Phase 1 implementation** (shared UI primitives)

---

## Summary

This component architecture provides a scalable foundation for the Medicaid Community Engagement application:

- **270 total components** across Admin and Member experiences
- **45 shared UI primitives** that work with both themes
- **Clear separation** between Admin (desktop) and Member (mobile) experiences
- **Unified design system** with theme-aware components
- **Phased implementation plan** for systematic development
- **Identified gaps** requiring clarification before full implementation

The architecture balances code reuse (shared primitives) with experience-specific optimization (separate feature components), ensuring both Admin and Member experiences feel native to their respective contexts while maintaining a consistent design language.
