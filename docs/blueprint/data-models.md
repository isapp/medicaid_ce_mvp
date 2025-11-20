# Data Models

This document defines all TypeScript interfaces, types, and Zod schemas for the Medicaid Community Engagement application.

## Overview

Data models are defined using:
- **TypeScript interfaces**: For type safety in the application
- **Zod schemas**: For runtime validation and type inference
- **Enums**: For constrained string values

All models follow the multi-tenant pattern with `tenantId` fields.

## Core Domain Models

### User

```typescript
import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'case_worker', 'member']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  role: UserRoleSchema,
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;
```

### Tenant

```typescript
export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Tenant = z.infer<typeof TenantSchema>;
```

### Beneficiary

```typescript
export const EngagementStatusSchema = z.enum([
  'active',
  'non_compliant',
  'exempt',
  'unknown',
]);
export type EngagementStatus = z.infer<typeof EngagementStatusSchema>;

export const BeneficiarySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  medicaidId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  engagementStatus: EngagementStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Beneficiary = z.infer<typeof BeneficiarySchema>;

// Computed properties
export interface BeneficiaryWithComputed extends Beneficiary {
  fullName: string;
  age?: number;
}
```

### Case

```typescript
export const CaseStatusSchema = z.enum(['open', 'appeals_hold', 'closed']);
export type CaseStatus = z.infer<typeof CaseStatusSchema>;

export const CaseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  beneficiaryName: z.string(),
  status: CaseStatusSchema,
  dueDate: z.string().datetime().nullable(),
  assignedTo: z.string().uuid().nullable(),
  assignedToName: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Case = z.infer<typeof CaseSchema>;

export const CaseDetailSchema = CaseSchema.extend({
  beneficiary: BeneficiarySchema,
  activities: z.array(z.any()), // ActivitySchema
  notes: z.array(z.any()), // NoteSchema
  documents: z.array(z.any()), // DocumentSchema
});

export type CaseDetail = z.infer<typeof CaseDetailSchema>;
```

### Note

```typescript
export const NoteSchema = z.object({
  id: z.string().uuid(),
  beneficiaryId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
  authorId: z.string().uuid(),
  authorName: z.string(),
  note: z.string(),
  createdAt: z.string().datetime(),
});

export type Note = z.infer<typeof NoteSchema>;
```

## Activity Models

### Employment Activity

```typescript
export const VerificationStatusSchema = z.enum(['pending', 'verified', 'failed']);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const EmploymentVerificationMethodSchema = z.enum([
  'gig',
  'payroll',
  'bank',
  'manual',
]);
export type EmploymentVerificationMethod = z.infer<typeof EmploymentVerificationMethodSchema>;

export const EmploymentActivitySchema = z.object({
  id: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  tenantId: z.string().uuid(),
  employerName: z.string(),
  hoursWorked: z.number().min(0),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  verificationStatus: VerificationStatusSchema,
  verificationMethod: EmploymentVerificationMethodSchema.nullable(),
  provider: z.string().nullable(),
  documents: z.array(z.any()), // DocumentSchema
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EmploymentActivity = z.infer<typeof EmploymentActivitySchema>;

// Create request
export const CreateEmploymentActivitySchema = z.object({
  employerName: z.string().min(1, 'Employer name is required'),
  hoursWorked: z.number().min(0, 'Hours must be positive').max(168, 'Hours per week cannot exceed 168'),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  verificationMethod: EmploymentVerificationMethodSchema.optional(),
  provider: z.string().optional(),
});

export type CreateEmploymentActivityInput = z.infer<typeof CreateEmploymentActivitySchema>;
```

### Education Activity

```typescript
export const EducationVerificationMethodSchema = z.enum(['automated', 'manual']);
export type EducationVerificationMethod = z.infer<typeof EducationVerificationMethodSchema>;

export const EducationActivitySchema = z.object({
  id: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  tenantId: z.string().uuid(),
  institution: z.string(),
  program: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  hoursPerWeek: z.number().min(0),
  verificationStatus: VerificationStatusSchema,
  verificationMethod: EducationVerificationMethodSchema.nullable(),
  documents: z.array(z.any()), // DocumentSchema
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EducationActivity = z.infer<typeof EducationActivitySchema>;

// Create request
export const CreateEducationActivitySchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  program: z.string().min(1, 'Program is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  hoursPerWeek: z.number().min(1, 'Hours per week must be at least 1').max(168, 'Hours per week cannot exceed 168'),
  verificationMethod: EducationVerificationMethodSchema.optional(),
});

export type CreateEducationActivityInput = z.infer<typeof CreateEducationActivitySchema>;
```

### Volunteer Activity

```typescript
export const VolunteerActivitySchema = z.object({
  id: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  tenantId: z.string().uuid(),
  organizationName: z.string(),
  activityDescription: z.string(),
  hoursCompleted: z.number().min(0),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  verificationStatus: VerificationStatusSchema,
  documents: z.array(z.any()), // DocumentSchema
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type VolunteerActivity = z.infer<typeof VolunteerActivitySchema>;

// Create request
export const CreateVolunteerActivitySchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  activityDescription: z.string().min(1, 'Activity description is required').max(500, 'Description is too long'),
  hoursCompleted: z.number().min(0.5, 'Hours must be at least 0.5').max(168, 'Hours cannot exceed 168'),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
});

export type CreateVolunteerActivityInput = z.infer<typeof CreateVolunteerActivitySchema>;
```

## Exemption Models

### Exemption

```typescript
export const ExemptionTypeSchema = z.enum([
  'caregiver',
  'disability',
  'pregnancy',
  'other',
]);
export type ExemptionType = z.infer<typeof ExemptionTypeSchema>;

export const ExemptionStatusSchema = z.enum(['pending', 'approved', 'denied']);
export type ExemptionStatus = z.infer<typeof ExemptionStatusSchema>;

export const ExemptionSchema = z.object({
  id: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: ExemptionTypeSchema,
  status: ExemptionStatusSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  formData: z.record(z.unknown()),
  documents: z.array(z.any()), // DocumentSchema
  reviewNotes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Exemption = z.infer<typeof ExemptionSchema>;

// Create request
export const CreateExemptionSchema = z.object({
  type: ExemptionTypeSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  formData: z.record(z.unknown()),
});

export type CreateExemptionInput = z.infer<typeof CreateExemptionSchema>;
```

## Document Models

### Document

```typescript
export const DocumentTypeSchema = z.enum([
  'paystub',
  'transcript',
  'volunteer_letter',
  'exemption_proof',
  'other',
]);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  type: DocumentTypeSchema,
  url: z.string().url(),
  mimeType: z.string(),
  size: z.number(),
  createdAt: z.string().datetime(),
});

export type Document = z.infer<typeof DocumentSchema>;
```

## Broadcast Models

### Broadcast

```typescript
export const BroadcastAudienceSchema = z.enum([
  'all',
  'active',
  'non_compliant',
  'custom',
]);
export type BroadcastAudience = z.infer<typeof BroadcastAudienceSchema>;

export const BroadcastStatusSchema = z.enum(['draft', 'scheduled', 'sent']);
export type BroadcastStatus = z.infer<typeof BroadcastStatusSchema>;

export const BroadcastSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  audience: BroadcastAudienceSchema,
  audienceFilter: z.record(z.unknown()).nullable(),
  status: BroadcastStatusSchema,
  scheduledFor: z.string().datetime().nullable(),
  sentAt: z.string().datetime().nullable(),
  recipientCount: z.number(),
  createdBy: z.string().uuid(),
  createdByName: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Broadcast = z.infer<typeof BroadcastSchema>;

// Create request
export const CreateBroadcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  body: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
  audience: BroadcastAudienceSchema,
  audienceFilter: z.record(z.unknown()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

export type CreateBroadcastInput = z.infer<typeof CreateBroadcastSchema>;
```

## Settings Models

### Tenant Settings

```typescript
export const TenantSettingsSchema = z.object({
  notifications: z.object({
    smsEnabled: z.boolean(),
    emailEnabled: z.boolean(),
    reminderDaysBefore: z.number().min(1).max(30),
  }),
  security: z.object({
    sessionTimeout: z.number().min(15).max(1440), // minutes
    requireMfa: z.boolean(),
  }),
  modules: z.object({
    employmentEnabled: z.boolean(),
    educationEnabled: z.boolean(),
    volunteerEnabled: z.boolean(),
    exemptionsEnabled: z.boolean(),
  }),
});

export type TenantSettings = z.infer<typeof TenantSettingsSchema>;
```

### Integration

```typescript
export const IntegrationTypeSchema = z.enum([
  'employment',
  'education',
  'messaging',
  'document',
]);
export type IntegrationType = z.infer<typeof IntegrationTypeSchema>;

export const IntegrationStatusSchema = z.enum([
  'connected',
  'disconnected',
  'error',
]);
export type IntegrationStatus = z.infer<typeof IntegrationStatusSchema>;

export const IntegrationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: IntegrationTypeSchema,
  vendor: z.string(),
  status: IntegrationStatusSchema,
  config: z.record(z.unknown()),
  lastSyncAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Integration = z.infer<typeof IntegrationSchema>;
```

## Dashboard Models

### Dashboard Summary

```typescript
export const DashboardSummarySchema = z.object({
  beneficiary: BeneficiarySchema,
  upcomingDeadlines: z.array(
    z.object({
      type: z.enum(['employment', 'education', 'volunteer']),
      dueDate: z.string().datetime(),
    })
  ),
  recentActivities: z.array(z.any()), // Union of activity types
  verificationStatus: z.object({
    employment: z.enum(['verified', 'pending', 'failed', 'none']),
    education: z.enum(['verified', 'pending', 'failed', 'none']),
    volunteer: z.enum(['verified', 'pending', 'failed', 'none']),
  }),
  exemptions: z.array(ExemptionSchema),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
```

## Reporting Models

### Reporting Overview

```typescript
export const ReportingOverviewSchema = z.object({
  totalBeneficiaries: z.number(),
  activeBeneficiaries: z.number(),
  nonCompliantBeneficiaries: z.number(),
  exemptBeneficiaries: z.number(),
  verificationsByMonth: z.array(
    z.object({
      month: z.string(),
      employment: z.number(),
      education: z.number(),
      volunteer: z.number(),
    })
  ),
  verificationStatusBreakdown: z.object({
    verified: z.number(),
    pending: z.number(),
    failed: z.number(),
  }),
});

export type ReportingOverview = z.infer<typeof ReportingOverviewSchema>;

export const ComplianceReportSchema = z.object({
  complianceRate: z.number(),
  byStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  trends: z.array(
    z.object({
      month: z.string(),
      complianceRate: z.number(),
    })
  ),
});

export type ComplianceReport = z.infer<typeof ComplianceReportSchema>;
```

## Query Models

### Pagination

```typescript
export const PaginationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginationResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  });

export type PaginationResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
```

### Sorting

```typescript
export const SortOrderSchema = z.enum(['asc', 'desc']);
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const SortSchema = z.object({
  field: z.string(),
  order: SortOrderSchema,
});

export type Sort = z.infer<typeof SortSchema>;
```

### Filtering

```typescript
export const BeneficiaryQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  status: EngagementStatusSchema.optional(),
  sort: z.string().optional(), // e.g., "lastName:asc"
});

export type BeneficiaryQuery = z.infer<typeof BeneficiaryQuerySchema>;

export const CaseQuerySchema = PaginationQuerySchema.extend({
  status: CaseStatusSchema.optional(),
  assignedTo: z.string().uuid().optional(),
  dueDate: z.enum(['overdue', 'upcoming']).optional(),
  sort: z.string().optional(),
});

export type CaseQuery = z.infer<typeof CaseQuerySchema>;

export const BroadcastQuerySchema = PaginationQuerySchema.extend({
  status: BroadcastStatusSchema.optional(),
  audience: BroadcastAudienceSchema.optional(),
  sort: z.string().optional(),
});

export type BroadcastQuery = z.infer<typeof BroadcastQuerySchema>;
```

## Assessment Models

### Assessment State

```typescript
export const AssessmentStateSchema = z.object({
  stateEnrollment: z.boolean().nullable(),
  age: z.number().min(0).max(150).nullable(),
  isPregnant: z.boolean().nullable(),
  hasDisability: z.boolean().nullable(),
  isCaregiver: z.boolean().nullable(),
  hasSnapTanf: z.boolean().nullable(),
  outcome: z.enum(['exempt', 'required']).nullable(),
});

export type AssessmentState = z.infer<typeof AssessmentStateSchema>;
```

## Form Validation Schemas

### Add Note Form

```typescript
export const AddNoteFormSchema = z.object({
  note: z.string().min(1, 'Note is required').max(1000, 'Note is too long'),
});

export type AddNoteFormData = z.infer<typeof AddNoteFormSchema>;
```

### Request Clarification Form

```typescript
export const RequestClarificationFormSchema = z.object({
  message: z.string().min(1, 'Message is required').max(500, 'Message is too long'),
});

export type RequestClarificationFormData = z.infer<typeof RequestClarificationFormSchema>;
```

### Phone Authentication Form

```typescript
export const PhoneAuthFormSchema = z.object({
  phone: z.string().regex(/^\+1\d{10}$/, 'Invalid phone number format (use +1XXXXXXXXXX)'),
});

export type PhoneAuthFormData = z.infer<typeof PhoneAuthFormSchema>;

export const VerifyCodeFormSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export type VerifyCodeFormData = z.infer<typeof VerifyCodeFormSchema>;
```

### Admin Login Form

```typescript
export const AdminLoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AdminLoginFormData = z.infer<typeof AdminLoginFormSchema>;
```

## Type Guards

### Activity Type Guards

```typescript
export function isEmploymentActivity(activity: unknown): activity is EmploymentActivity {
  return EmploymentActivitySchema.safeParse(activity).success;
}

export function isEducationActivity(activity: unknown): activity is EducationActivity {
  return EducationActivitySchema.safeParse(activity).success;
}

export function isVolunteerActivity(activity: unknown): activity is VolunteerActivity {
  return VolunteerActivitySchema.safeParse(activity).success;
}
```

### User Role Guards

```typescript
export function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

export function isCaseWorker(user: User): boolean {
  return user.role === 'case_worker';
}

export function isMember(user: User): boolean {
  return user.role === 'member';
}

export function hasAdminAccess(user: User): boolean {
  return user.role === 'admin' || user.role === 'case_worker';
}
```

## Utility Types

### Partial Update Types

```typescript
export type UpdateBeneficiaryInput = Partial<
  Pick<Beneficiary, 'firstName' | 'lastName' | 'phone' | 'email' | 'engagementStatus'>
>;

export type UpdateCaseInput = Partial<
  Pick<Case, 'status' | 'assignedTo' | 'dueDate'>
>;

export type UpdateExemptionInput = Partial<
  Pick<Exemption, 'status' | 'reviewNotes'>
>;
```

### Omit Timestamps

```typescript
export type BeneficiaryInput = Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>;
export type CaseInput = Omit<Case, 'id' | 'createdAt' | 'updatedAt'>;
```

## Enum Constants

### Status Colors

```typescript
export const ENGAGEMENT_STATUS_COLORS: Record<EngagementStatus, string> = {
  active: 'green',
  non_compliant: 'red',
  exempt: 'blue',
  unknown: 'gray',
};

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  verified: 'green',
  pending: 'yellow',
  failed: 'red',
};

export const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
  open: 'blue',
  appeals_hold: 'yellow',
  closed: 'gray',
};
```

### Status Labels

```typescript
export const ENGAGEMENT_STATUS_LABELS: Record<EngagementStatus, string> = {
  active: 'Active',
  non_compliant: 'Non-Compliant',
  exempt: 'Exempt',
  unknown: 'Unknown',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  verified: 'Verified',
  pending: 'Pending Review',
  failed: 'Verification Failed',
};

export const EXEMPTION_TYPE_LABELS: Record<ExemptionType, string> = {
  caregiver: 'Caregiver Exemption',
  disability: 'Disability Exemption',
  pregnancy: 'Pregnancy Exemption',
  other: 'Other Exemption',
};
```

## Model Organization

### File Structure

```
frontend/src/
├── types/
│   ├── index.ts              # Re-exports all types
│   ├── user.ts               # User, Tenant
│   ├── beneficiary.ts        # Beneficiary, Case, Note
│   ├── activities.ts         # Employment, Education, Volunteer
│   ├── exemption.ts          # Exemption
│   ├── document.ts           # Document
│   ├── broadcast.ts          # Broadcast
│   ├── settings.ts           # TenantSettings, Integration
│   ├── dashboard.ts          # DashboardSummary
│   ├── reporting.ts          # ReportingOverview, ComplianceReport
│   ├── query.ts              # Pagination, Sort, Filter types
│   ├── assessment.ts         # AssessmentState
│   └── forms.ts              # Form validation schemas
```

## Best Practices

### 1. Always Validate API Responses

```typescript
// ✅ Good
const data = await api.get('/beneficiaries/123');
const beneficiary = BeneficiarySchema.parse(data);

// ❌ Bad
const beneficiary = await api.get('/beneficiaries/123') as Beneficiary;
```

### 2. Use Type Guards for Union Types

```typescript
// ✅ Good
if (isEmploymentActivity(activity)) {
  console.log(activity.employerName);
}

// ❌ Bad
console.log((activity as EmploymentActivity).employerName);
```

### 3. Leverage Zod for Form Validation

```typescript
// ✅ Good
const form = useForm<AddNoteFormData>({
  resolver: zodResolver(AddNoteFormSchema),
});

// ❌ Bad
const form = useForm<AddNoteFormData>({
  // Manual validation
});
```

### 4. Use Enums for Constrained Values

```typescript
// ✅ Good
const status: VerificationStatus = 'verified';

// ❌ Bad
const status: string = 'verified';
```

### 5. Provide Default Values

```typescript
// ✅ Good
const query: BeneficiaryQuery = {
  page: 1,
  pageSize: 20,
  search: '',
};

// ❌ Bad
const query: Partial<BeneficiaryQuery> = {};
```

## Summary

The data models provide:

- **Type safety** with TypeScript interfaces
- **Runtime validation** with Zod schemas
- **Consistent structure** across all domain entities
- **Form validation** schemas for user input
- **Type guards** for safe type narrowing
- **Utility types** for common patterns
- **Enum constants** for labels and colors

All models follow the multi-tenant pattern and support the complete feature set for both Admin and Member experiences.
