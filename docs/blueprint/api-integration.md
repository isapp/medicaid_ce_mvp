# API Integration Plan

This document defines the complete API integration strategy, including the API client architecture, endpoint inventory, request/response patterns, error handling, and type safety.

## Overview

The application uses a REST JSON API under `/api/v1` with:

- **Standard response envelope**: `{ data, error }`
- **JWT authentication**: Bearer token in Authorization header
- **Multi-tenancy**: tenant_id derived from JWT claims server-side
- **Type safety**: Zod schemas for runtime validation and TypeScript type inference

## API Client Architecture

### Base Client

```typescript
// api/client.ts
import { z } from 'zod';

interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
}

interface APIResponse<T> {
  data: T;
  error: {
    code: string | null;
    message: string | null;
  } | null;
}

export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public httpStatus?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;
  private getAuthToken: () => string | null;
  
  constructor(baseURL: string, getAuthToken: () => string | null) {
    this.baseURL = baseURL;
    this.getAuthToken = getAuthToken;
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    // Build URL with query params
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    // Add auth header
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make request
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
    });
    
    // Parse response
    const json: APIResponse<T> = await response.json();
    
    // Handle errors
    if (!response.ok || json.error) {
      throw new APIError(
        json.error?.code || 'UNKNOWN_ERROR',
        json.error?.message || 'An unknown error occurred',
        response.status
      );
    }
    
    return json.data;
  }
  
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }
  
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
  }
  
  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new APIClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  () => localStorage.getItem('accessToken')
);
```

### Type-Safe API Calls with Zod

```typescript
// api/schemas/beneficiary.ts
import { z } from 'zod';

export const BeneficiarySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  medicaidId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  engagementStatus: z.enum(['active', 'non_compliant', 'exempt', 'unknown']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Beneficiary = z.infer<typeof BeneficiarySchema>;

export const BeneficiaryListResponseSchema = z.object({
  items: z.array(BeneficiarySchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export type BeneficiaryListResponse = z.infer<typeof BeneficiaryListResponseSchema>;

// Usage in API call
export async function getBeneficiaries(query: BeneficiaryQuery): Promise<BeneficiaryListResponse> {
  const data = await api.get('/beneficiaries', query);
  return BeneficiaryListResponseSchema.parse(data);
}
```

## Complete Endpoint Inventory

### Authentication Endpoints

#### Admin Authentication

```typescript
// POST /api/v1/auth/admin/login
interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    tenantId: string;
    role: 'admin' | 'case_worker';
    email: string;
    name: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

// POST /api/v1/auth/admin/logout
// No request body
// Response: { data: null, error: null }

// POST /api/v1/auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}
```

#### Member Authentication

```typescript
// POST /api/v1/auth/member/request-code
interface RequestCodeRequest {
  phone: string; // E.164 format: +15551234567
}

interface RequestCodeResponse {
  requestId: string;
  expiresAt: string; // ISO 8601 datetime
}

// POST /api/v1/auth/member/verify-code
interface VerifyCodeRequest {
  requestId: string;
  code: string; // 6-digit code
}

interface VerifyCodeResponse {
  accessToken: string;
  user: {
    id: string;
    tenantId: string;
    role: 'member';
    phone: string;
    name?: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

// GET /api/v1/auth/me
// No request body
interface AuthMeResponse {
  user: User;
  tenant: Tenant;
}
```

### Beneficiary Endpoints

```typescript
// GET /api/v1/beneficiaries
interface BeneficiaryQuery {
  search?: string;
  status?: 'active' | 'non_compliant' | 'exempt' | 'unknown';
  page?: number;
  pageSize?: number;
  sort?: string; // e.g., "lastName:asc"
}

interface BeneficiaryListResponse {
  items: Beneficiary[];
  page: number;
  pageSize: number;
  total: number;
}

// GET /api/v1/beneficiaries/:id
// Response: Beneficiary

// PATCH /api/v1/beneficiaries/:id
interface UpdateBeneficiaryRequest {
  firstName?: string;
  lastName?: string;
  engagementStatus?: 'active' | 'non_compliant' | 'exempt' | 'unknown';
}
// Response: Beneficiary

// GET /api/v1/beneficiaries/:id/notes
interface Note {
  id: string;
  beneficiaryId: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
}
// Response: Note[]

// POST /api/v1/beneficiaries/:id/notes
interface CreateNoteRequest {
  note: string;
}
// Response: Note

// GET /api/v1/beneficiaries/:id/dashboard
interface DashboardSummary {
  beneficiary: Beneficiary;
  upcomingDeadlines: {
    type: 'employment' | 'education' | 'volunteer';
    dueDate: string;
  }[];
  recentActivities: Activity[];
  verificationStatus: {
    employment: 'verified' | 'pending' | 'failed' | 'none';
    education: 'verified' | 'pending' | 'failed' | 'none';
    volunteer: 'verified' | 'pending' | 'failed' | 'none';
  };
  exemptions: Exemption[];
}
// Response: DashboardSummary
```

### Case Endpoints

```typescript
// GET /api/v1/cases
interface CaseQuery {
  status?: 'open' | 'appeals_hold' | 'closed';
  assignedTo?: string; // User ID
  dueDate?: 'overdue' | 'upcoming';
  page?: number;
  pageSize?: number;
  sort?: string;
}

interface Case {
  id: string;
  tenantId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  status: 'open' | 'appeals_hold' | 'closed';
  dueDate: string | null;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CaseListResponse {
  items: Case[];
  page: number;
  pageSize: number;
  total: number;
}

// GET /api/v1/cases/:id
interface CaseDetail extends Case {
  beneficiary: Beneficiary;
  activities: Activity[];
  notes: Note[];
  documents: Document[];
}
// Response: CaseDetail

// PATCH /api/v1/cases/:id
interface UpdateCaseRequest {
  status?: 'open' | 'appeals_hold' | 'closed';
  assignedTo?: string;
  dueDate?: string;
}
// Response: Case

// POST /api/v1/cases/:id/notes
interface CreateCaseNoteRequest {
  note: string;
}
// Response: Note

// POST /api/v1/cases/:id/request-clarification
interface RequestClarificationRequest {
  message: string;
}
// Response: { success: boolean }

// POST /api/v1/cases/bulk-extend-deadline
interface BulkExtendDeadlineRequest {
  caseIds: string[];
  newDueDate: string;
}
// Response: { updated: number }
```

### Employment Activity Endpoints

```typescript
// GET /api/v1/beneficiaries/:id/employment-activities
interface EmploymentActivity {
  id: string;
  beneficiaryId: string;
  tenantId: string;
  employerName: string;
  hoursWorked: number;
  activityDate: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationMethod: 'gig' | 'payroll' | 'bank' | 'manual' | null;
  provider: string | null;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}
// Response: EmploymentActivity[]

// POST /api/v1/beneficiaries/:id/employment-activities
interface CreateEmploymentActivityRequest {
  employerName: string;
  hoursWorked: number;
  activityDate: string;
  verificationMethod?: 'gig' | 'payroll' | 'bank' | 'manual';
  provider?: string;
}
// Response: EmploymentActivity

// GET /api/v1/employment-activities/:id
// Response: EmploymentActivity

// POST /api/v1/employment-activities/:id/verify
interface VerifyEmploymentRequest {
  provider: string;
  credentials?: Record<string, string>;
}
// Response: EmploymentActivity

// POST /api/v1/employment-activities/:id/documents
// Request: FormData with 'file' field
interface UploadDocumentResponse {
  document: Document;
}
// Response: UploadDocumentResponse

// POST /api/v1/webhooks/employment
// Webhook endpoint for employment verification vendors
// Validates signature and updates employment activity records
```

### Education Activity Endpoints

```typescript
// GET /api/v1/beneficiaries/:id/education-activities
interface EducationActivity {
  id: string;
  beneficiaryId: string;
  tenantId: string;
  institution: string;
  program: string;
  startDate: string;
  endDate: string | null;
  hoursPerWeek: number;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationMethod: 'automated' | 'manual' | null;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}
// Response: EducationActivity[]

// POST /api/v1/beneficiaries/:id/education-activities
interface CreateEducationActivityRequest {
  institution: string;
  program: string;
  startDate: string;
  endDate?: string;
  hoursPerWeek: number;
  verificationMethod?: 'automated' | 'manual';
}
// Response: EducationActivity

// GET /api/v1/education-activities/:id
// Response: EducationActivity

// POST /api/v1/education-activities/:id/verify
interface VerifyEducationRequest {
  schoolId?: string;
  credentials?: {
    username: string;
    password: string;
  };
}
// Response: EducationActivity

// POST /api/v1/education-activities/:id/documents
// Request: FormData with 'file' field
// Response: UploadDocumentResponse

// POST /api/v1/webhooks/education
// Webhook endpoint for education verification vendors
```

### Community Service (Volunteer) Endpoints

```typescript
// GET /api/v1/beneficiaries/:id/volunteer-activities
interface VolunteerActivity {
  id: string;
  beneficiaryId: string;
  tenantId: string;
  organizationName: string;
  activityDescription: string;
  hoursCompleted: number;
  activityDate: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}
// Response: VolunteerActivity[]

// POST /api/v1/beneficiaries/:id/volunteer-activities
interface CreateVolunteerActivityRequest {
  organizationName: string;
  activityDescription: string;
  hoursCompleted: number;
  activityDate: string;
}
// Response: VolunteerActivity

// GET /api/v1/volunteer-activities/:id
// Response: VolunteerActivity

// POST /api/v1/volunteer-activities/:id/documents
// Request: FormData with 'file' field
// Response: UploadDocumentResponse

// POST /api/v1/volunteer-activities/:id/verify
// Response: VolunteerActivity
```

### Exemption Endpoints

```typescript
// GET /api/v1/beneficiaries/:id/exemptions
interface Exemption {
  id: string;
  beneficiaryId: string;
  tenantId: string;
  type: 'caregiver' | 'disability' | 'pregnancy' | 'other';
  status: 'pending' | 'approved' | 'denied';
  startDate: string;
  endDate: string;
  formData: Record<string, unknown>;
  documents: Document[];
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
// Response: Exemption[]

// POST /api/v1/beneficiaries/:id/exemptions
interface CreateExemptionRequest {
  type: 'caregiver' | 'disability' | 'pregnancy' | 'other';
  startDate: string;
  endDate: string;
  formData: Record<string, unknown>;
}
// Response: Exemption

// GET /api/v1/exemptions/:id
// Response: Exemption

// PATCH /api/v1/exemptions/:id
interface UpdateExemptionRequest {
  status?: 'pending' | 'approved' | 'denied';
  reviewNotes?: string;
}
// Response: Exemption

// POST /api/v1/exemptions/:id/documents
// Request: FormData with 'file' field
// Response: UploadDocumentResponse
```

### Broadcast Endpoints

```typescript
// GET /api/v1/broadcasts
interface BroadcastQuery {
  status?: 'draft' | 'scheduled' | 'sent';
  audience?: 'all' | 'active' | 'non_compliant';
  page?: number;
  pageSize?: number;
  sort?: string;
}

interface Broadcast {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  audience: 'all' | 'active' | 'non_compliant' | 'custom';
  audienceFilter: Record<string, unknown> | null;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor: string | null;
  sentAt: string | null;
  recipientCount: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

interface BroadcastListResponse {
  items: Broadcast[];
  page: number;
  pageSize: number;
  total: number;
}

// GET /api/v1/broadcasts/:id
// Response: Broadcast

// POST /api/v1/broadcasts
interface CreateBroadcastRequest {
  title: string;
  body: string;
  audience: 'all' | 'active' | 'non_compliant' | 'custom';
  audienceFilter?: Record<string, unknown>;
  scheduledFor?: string;
}
// Response: Broadcast

// PATCH /api/v1/broadcasts/:id
interface UpdateBroadcastRequest {
  title?: string;
  body?: string;
  audience?: 'all' | 'active' | 'non_compliant' | 'custom';
  audienceFilter?: Record<string, unknown>;
  scheduledFor?: string;
}
// Response: Broadcast

// POST /api/v1/broadcasts/:id/send
// Response: Broadcast
```

### Document Endpoints

```typescript
// POST /api/v1/uploads
// Request: FormData with 'file' field
interface UploadResponse {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}
// Response: UploadResponse

// GET /api/v1/documents/:id
interface Document {
  id: string;
  type: 'paystub' | 'transcript' | 'volunteer_letter' | 'exemption_proof' | 'other';
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}
// Response: Document

// DELETE /api/v1/documents/:id
// Response: { success: boolean }
```

### Settings & User Management Endpoints

```typescript
// GET /api/v1/users
interface UserQuery {
  role?: 'admin' | 'case_worker';
  page?: number;
  pageSize?: number;
}

interface User {
  id: string;
  tenantId: string;
  role: 'admin' | 'case_worker' | 'member';
  email?: string;
  phone?: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserListResponse {
  items: User[];
  page: number;
  pageSize: number;
  total: number;
}

// POST /api/v1/users
interface CreateUserRequest {
  email: string;
  name: string;
  role: 'admin' | 'case_worker';
  password: string;
}
// Response: User

// PATCH /api/v1/users/:id
interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'case_worker';
  isActive?: boolean;
}
// Response: User

// DELETE /api/v1/users/:id
// Response: { success: boolean }

// GET /api/v1/settings
interface TenantSettings {
  notifications: {
    smsEnabled: boolean;
    emailEnabled: boolean;
    reminderDaysBefore: number;
  };
  security: {
    sessionTimeout: number;
    requireMfa: boolean;
  };
  modules: {
    employmentEnabled: boolean;
    educationEnabled: boolean;
    volunteerEnabled: boolean;
    exemptionsEnabled: boolean;
  };
}
// Response: TenantSettings

// PATCH /api/v1/settings
// Request: Partial<TenantSettings>
// Response: TenantSettings
```

### Integration Endpoints

```typescript
// GET /api/v1/integrations
interface Integration {
  id: string;
  tenantId: string;
  type: 'employment' | 'education' | 'messaging' | 'document';
  vendor: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}
// Response: Integration[]

// POST /api/v1/integrations
interface CreateIntegrationRequest {
  type: 'employment' | 'education' | 'messaging' | 'document';
  vendor: string;
  config: Record<string, unknown>;
}
// Response: Integration

// PATCH /api/v1/integrations/:id
interface UpdateIntegrationRequest {
  status?: 'connected' | 'disconnected';
  config?: Record<string, unknown>;
}
// Response: Integration

// DELETE /api/v1/integrations/:id
// Response: { success: boolean }

// POST /api/v1/integrations/:id/test
// Response: { success: boolean; message: string }
```

### Reporting Endpoints

```typescript
// GET /api/v1/reporting/overview
interface ReportingOverview {
  totalBeneficiaries: number;
  activeBeneficiaries: number;
  nonCompliantBeneficiaries: number;
  exemptBeneficiaries: number;
  verificationsByMonth: {
    month: string;
    employment: number;
    education: number;
    volunteer: number;
  }[];
  verificationStatusBreakdown: {
    verified: number;
    pending: number;
    failed: number;
  };
}
// Response: ReportingOverview

// GET /api/v1/reporting/compliance
interface ComplianceReport {
  complianceRate: number;
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  trends: {
    month: string;
    complianceRate: number;
  }[];
}
// Response: ComplianceReport
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  data: null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | User lacks permission for this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Error Handling in API Client

```typescript
// Automatic retry for transient errors
async function requestWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry client errors (4xx)
      if (error instanceof APIError && error.httpStatus && error.httpStatus < 500) {
        throw error;
      }
      
      // Exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.min(1000 * 2 ** i, 30000))
        );
      }
    }
  }
  
  throw lastError!;
}
```

### Error Handling in React Query

```typescript
// Global error handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: unknown) => {
        if (error instanceof APIError) {
          if (error.code === 'UNAUTHORIZED') {
            // Redirect to login
            window.location.href = '/auth';
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  },
});
```

## Request/Response Interceptors

### Request Interceptor (Add Request ID)

```typescript
// Add unique request ID for tracing
class APIClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const requestId = crypto.randomUUID();
    
    const headers: HeadersInit = {
      'X-Request-ID': requestId,
      ...options.headers,
    };
    
    // ... rest of request logic
  }
}
```

### Response Interceptor (Token Refresh)

```typescript
class APIClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      return await this.makeRequest<T>(endpoint, options);
    } catch (error) {
      if (error instanceof APIError && error.code === 'UNAUTHORIZED') {
        // Attempt token refresh
        try {
          await this.refreshToken();
          // Retry original request
          return await this.makeRequest<T>(endpoint, options);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/auth';
          throw refreshError;
        }
      }
      throw error;
    }
  }
  
  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const data = await this.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    localStorage.setItem('accessToken', data.accessToken);
  }
}
```

## Type Safety with Zod

### Schema Definitions

```typescript
// api/schemas/index.ts
import { z } from 'zod';

// Common schemas
export const UUIDSchema = z.string().uuid();
export const DateTimeSchema = z.string().datetime();
export const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Beneficiary schemas
export const BeneficiarySchema = z.object({
  id: UUIDSchema,
  tenantId: UUIDSchema,
  medicaidId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  engagementStatus: z.enum(['active', 'non_compliant', 'exempt', 'unknown']),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export type Beneficiary = z.infer<typeof BeneficiarySchema>;

// Employment Activity schemas
export const EmploymentActivitySchema = z.object({
  id: UUIDSchema,
  beneficiaryId: UUIDSchema,
  tenantId: UUIDSchema,
  employerName: z.string(),
  hoursWorked: z.number().min(0),
  activityDate: DateSchema,
  verificationStatus: z.enum(['pending', 'verified', 'failed']),
  verificationMethod: z.enum(['gig', 'payroll', 'bank', 'manual']).nullable(),
  provider: z.string().nullable(),
  documents: z.array(DocumentSchema),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export type EmploymentActivity = z.infer<typeof EmploymentActivitySchema>;

// Document schema
export const DocumentSchema = z.object({
  id: UUIDSchema,
  type: z.enum(['paystub', 'transcript', 'volunteer_letter', 'exemption_proof', 'other']),
  url: z.string().url(),
  mimeType: z.string(),
  size: z.number(),
  createdAt: DateTimeSchema,
});

export type Document = z.infer<typeof DocumentSchema>;
```

### Validated API Calls

```typescript
// api/beneficiaries.ts
import { api } from './client';
import { BeneficiarySchema, BeneficiaryListResponseSchema } from './schemas';

export async function getBeneficiary(id: string): Promise<Beneficiary> {
  const data = await api.get(`/beneficiaries/${id}`);
  return BeneficiarySchema.parse(data);
}

export async function getBeneficiaries(query: BeneficiaryQuery): Promise<BeneficiaryListResponse> {
  const data = await api.get('/beneficiaries', query);
  return BeneficiaryListResponseSchema.parse(data);
}
```

## File Upload Handling

### Upload with Progress

```typescript
// api/uploads.ts
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Progress tracking
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });
    
    // Success
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.data);
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });
    
    // Error
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    // Send request
    const token = localStorage.getItem('accessToken');
    xhr.open('POST', `${import.meta.env.VITE_API_BASE_URL}/uploads`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.send(formData);
  });
}
```

### Usage in Component

```typescript
function DocumentUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      const result = await uploadFile(file, setProgress);
      toast.success('File uploaded successfully');
      return result;
    } catch (error) {
      toast.error('Upload failed');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {isUploading && <Progress value={progress} />}
    </div>
  );
}
```

## Pagination Patterns

### Cursor-Based Pagination (Optional)

```typescript
interface CursorPaginationQuery {
  cursor?: string;
  limit?: number;
}

interface CursorPaginationResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// React Query infinite query
function useBeneficiariesInfinite() {
  return useInfiniteQuery({
    queryKey: ['beneficiaries', 'infinite'],
    queryFn: ({ pageParam = undefined }) =>
      api.get('/beneficiaries', { cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
```

## WebSocket Support (Future)

### Real-Time Updates

```typescript
// api/websocket.ts
class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
  
  connect(token: string) {
    this.ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const listeners = this.listeners.get(message.type);
      if (listeners) {
        listeners.forEach(listener => listener(message.data));
      }
    };
  }
  
  subscribe(type: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
    
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }
  
  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

export const wsClient = new WebSocketClient();
```

## Testing API Integration

### Mock API Client

```typescript
// __tests__/mocks/api.ts
export const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

// Usage in tests
import { mockApi } from './__tests__/mocks/api';

test('fetches beneficiaries', async () => {
  mockApi.get.mockResolvedValue({
    items: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
    page: 1,
    pageSize: 20,
    total: 1,
  });
  
  const result = await getBeneficiaries({ page: 1, pageSize: 20 });
  expect(result.items).toHaveLength(1);
  expect(mockApi.get).toHaveBeenCalledWith('/beneficiaries', { page: 1, pageSize: 20 });
});
```

## Summary

The API integration plan provides:

- **Type-safe API client** with Zod validation
- **Complete endpoint inventory** for all features
- **Standardized error handling** with retry logic
- **Authentication integration** with token refresh
- **File upload support** with progress tracking
- **React Query integration** for efficient data fetching
- **Testing utilities** for mocking API calls

All endpoints follow the standard response envelope and support multi-tenant data isolation via JWT claims.
