# State Architecture

This document defines the comprehensive state management strategy for the Medicaid Community Engagement application, covering server state, feature state, global state, and UI state.

## Overview

The application uses a **three-layer state architecture** to separate concerns and optimize for different state types:

1. **Server State** (React Query): API data, caching, synchronization, invalidation
2. **Feature State** (Zustand): Multi-step flow data, ephemeral form state
3. **Global State** (Context API): Authentication, theme, tenant context

This separation ensures:
- Server data is cached and synchronized efficiently
- Form data persists across multi-step flows
- Global configuration is accessible throughout the app
- UI state remains local and performant

## Technology Stack

| Technology | Purpose | Use Cases |
|------------|---------|-----------|
| **React Query (TanStack Query)** | Server state management | API data, caching, refetching, invalidation |
| **Zustand** | Feature state management | Multi-step flows, ephemeral form data |
| **Context API** | Global state management | Auth, theme, tenant context |
| **React Hook Form** | Form state management | Individual form state, validation |
| **Local Component State** | UI state | Modals, dropdowns, toggles |

## Layer 1: Server State (React Query)

### Setup

```typescript
// providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Key Structure

Query keys follow a hierarchical structure for easy invalidation:

```typescript
// constants/queryKeys.ts
export const queryKeys = {
  // Beneficiaries
  beneficiaries: ['beneficiaries'] as const,
  beneficiariesList: (query: BeneficiaryQuery) => 
    [...queryKeys.beneficiaries, 'list', query] as const,
  beneficiary: (id: string) => 
    [...queryKeys.beneficiaries, 'detail', id] as const,
  beneficiaryNotes: (id: string) => 
    [...queryKeys.beneficiaries, 'notes', id] as const,
  
  // Cases
  cases: ['cases'] as const,
  casesList: (query: CaseQuery) => 
    [...queryKeys.cases, 'list', query] as const,
  case: (id: string) => 
    [...queryKeys.cases, 'detail', id] as const,
  caseNotes: (id: string) => 
    [...queryKeys.cases, 'notes', id] as const,
  
  // Employment Activities
  employmentActivities: ['employment-activities'] as const,
  employmentActivitiesList: (beneficiaryId: string) => 
    [...queryKeys.employmentActivities, 'list', beneficiaryId] as const,
  employmentActivity: (id: string) => 
    [...queryKeys.employmentActivities, 'detail', id] as const,
  
  // Education Activities
  educationActivities: ['education-activities'] as const,
  educationActivitiesList: (beneficiaryId: string) => 
    [...queryKeys.educationActivities, 'list', beneficiaryId] as const,
  educationActivity: (id: string) => 
    [...queryKeys.educationActivities, 'detail', id] as const,
  
  // Exemptions
  exemptions: ['exemptions'] as const,
  exemptionsList: (beneficiaryId: string) => 
    [...queryKeys.exemptions, 'list', beneficiaryId] as const,
  exemption: (id: string) => 
    [...queryKeys.exemptions, 'detail', id] as const,
  
  // Broadcasts
  broadcasts: ['broadcasts'] as const,
  broadcastsList: (query: BroadcastQuery) => 
    [...queryKeys.broadcasts, 'list', query] as const,
  broadcast: (id: string) => 
    [...queryKeys.broadcasts, 'detail', id] as const,
  
  // Settings
  settings: ['settings'] as const,
  users: ['users'] as const,
  integrations: ['integrations'] as const,
  
  // Member Dashboard
  dashboard: ['dashboard'] as const,
  dashboardSummary: (beneficiaryId: string) => 
    [...queryKeys.dashboard, 'summary', beneficiaryId] as const,
};
```

### Query Hooks

#### Admin Queries

```typescript
// hooks/queries/useBeneficiaries.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';

export interface BeneficiaryQuery {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
  sort?: string;
}

export function useBeneficiaries(query: BeneficiaryQuery) {
  return useQuery({
    queryKey: queryKeys.beneficiariesList(query),
    queryFn: () => api.get('/beneficiaries', query),
    keepPreviousData: true, // Smooth pagination
  });
}

export function useBeneficiary(id: string) {
  return useQuery({
    queryKey: queryKeys.beneficiary(id),
    queryFn: () => api.get(`/beneficiaries/${id}`),
    enabled: !!id,
  });
}

export function useBeneficiaryNotes(id: string) {
  return useQuery({
    queryKey: queryKeys.beneficiaryNotes(id),
    queryFn: () => api.get(`/beneficiaries/${id}/notes`),
    enabled: !!id,
  });
}
```

```typescript
// hooks/queries/useCases.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';

export interface CaseQuery {
  status?: string;
  assignedTo?: string;
  dueDate?: 'overdue' | 'upcoming';
  page: number;
  pageSize: number;
  sort?: string;
}

export function useCases(query: CaseQuery) {
  return useQuery({
    queryKey: queryKeys.casesList(query),
    queryFn: () => api.get('/cases', query),
    keepPreviousData: true,
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: queryKeys.case(id),
    queryFn: () => api.get(`/cases/${id}`),
    enabled: !!id,
  });
}
```

#### Member Queries

```typescript
// hooks/queries/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';
import { useAuth } from '../../contexts/AuthContext';

export function useDashboardSummary() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.dashboardSummary(user?.id || ''),
    queryFn: () => api.get(`/beneficiaries/${user?.id}/dashboard`),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard
  });
}
```

```typescript
// hooks/queries/useEmploymentActivities.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';
import { useAuth } from '../../contexts/AuthContext';

export function useEmploymentActivities() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.employmentActivitiesList(user?.id || ''),
    queryFn: () => api.get(`/beneficiaries/${user?.id}/employment-activities`),
    enabled: !!user?.id,
  });
}

export function useEmploymentActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.employmentActivity(id),
    queryFn: () => api.get(`/employment-activities/${id}`),
    enabled: !!id,
  });
}
```

### Mutation Hooks

#### Admin Mutations

```typescript
// hooks/mutations/useBeneficiaryMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';
import { toast } from 'sonner';

export function useAddBeneficiaryNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ beneficiaryId, note }: { beneficiaryId: string; note: string }) =>
      api.post(`/beneficiaries/${beneficiaryId}/notes`, { note }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.beneficiaryNotes(variables.beneficiaryId) 
      });
      toast.success('Note added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });
}

export function useUpdateBeneficiary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Beneficiary> }) =>
      api.patch(`/beneficiaries/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.beneficiary(variables.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.beneficiaries 
      });
      toast.success('Beneficiary updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update beneficiary: ${error.message}`);
    },
  });
}
```

```typescript
// hooks/mutations/useCaseMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';
import { toast } from 'sonner';

export function useAddCaseNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, note }: { caseId: string; note: string }) =>
      api.post(`/cases/${caseId}/notes`, { note }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.caseNotes(variables.caseId) 
      });
      toast.success('Note added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });
}

export function useRequestClarification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, message }: { caseId: string; message: string }) =>
      api.post(`/cases/${caseId}/request-clarification`, { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.case(variables.caseId) 
      });
      toast.success('Clarification request sent');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send request: ${error.message}`);
    },
  });
}
```

#### Member Mutations

```typescript
// hooks/mutations/useEmploymentMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { queryKeys } from '../../constants/queryKeys';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export function useCreateEmploymentActivity() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (data: CreateEmploymentActivityInput) =>
      api.post(`/beneficiaries/${user?.id}/employment-activities`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.employmentActivitiesList(user?.id || '') 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.dashboard 
      });
      toast.success('Employment activity created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create activity: ${error.message}`);
    },
  });
}

export function useVerifyEmployment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ activityId, provider }: { activityId: string; provider: string }) =>
      api.post(`/employment-activities/${activityId}/verify`, { provider }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.employmentActivity(variables.activityId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.employmentActivities 
      });
      toast.success('Verification initiated');
    },
    onError: (error: Error) => {
      toast.error(`Verification failed: ${error.message}`);
    },
  });
}

export function useUploadEmploymentDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ activityId, file }: { activityId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post(`/employment-activities/${activityId}/documents`, formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.employmentActivity(variables.activityId) 
      });
      toast.success('Document uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}
```

### Optimistic Updates

For immediate UI feedback:

```typescript
export function useUpdateCaseStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/cases/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.case(id) });
      
      // Snapshot previous value
      const previousCase = queryClient.getQueryData(queryKeys.case(id));
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.case(id), (old: any) => ({
        ...old,
        status,
      }));
      
      return { previousCase };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        queryClient.setQueryData(queryKeys.case(variables.id), context.previousCase);
      }
      toast.error('Failed to update case status');
    },
    onSettled: (_, __, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.case(variables.id) });
    },
  });
}
```

### Prefetching

For improved perceived performance:

```typescript
// Prefetch participant profile on row hover
function ParticipantRow({ participant }: { participant: Participant }) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.beneficiary(participant.id),
      queryFn: () => api.get(`/beneficiaries/${participant.id}`),
    });
  };
  
  return (
    <tr onMouseEnter={handleMouseEnter}>
      {/* Row content */}
    </tr>
  );
}
```

## Layer 2: Feature State (Zustand)

### Employment Flow Store

```typescript
// stores/employmentStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EmploymentPath = 'gig' | 'traditional' | 'bank' | 'manual';

interface EmploymentFlowState {
  // Path selection
  path: EmploymentPath | null;
  
  // Provider selection
  provider: string | null;
  
  // Credentials (for OAuth flows)
  credentials: Record<string, string>;
  
  // Documents (for manual upload)
  documents: File[];
  
  // Verification data
  verificationData: {
    employerName?: string;
    hoursWorked?: number;
    activityDate?: string;
    payAmount?: number;
  };
  
  // Activity ID (once created)
  activityId: string | null;
  
  // Actions
  setPath: (path: EmploymentPath) => void;
  setProvider: (provider: string) => void;
  setCredentials: (credentials: Record<string, string>) => void;
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  setVerificationData: (data: Partial<EmploymentFlowState['verificationData']>) => void;
  setActivityId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  path: null,
  provider: null,
  credentials: {},
  documents: [],
  verificationData: {},
  activityId: null,
};

export const useEmploymentStore = create<EmploymentFlowState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setPath: (path) => set({ path }),
      
      setProvider: (provider) => set({ provider }),
      
      setCredentials: (credentials) => set({ credentials }),
      
      addDocument: (file) => 
        set((state) => ({ documents: [...state.documents, file] })),
      
      removeDocument: (index) =>
        set((state) => ({
          documents: state.documents.filter((_, i) => i !== index),
        })),
      
      setVerificationData: (data) =>
        set((state) => ({
          verificationData: { ...state.verificationData, ...data },
        })),
      
      setActivityId: (activityId) => set({ activityId }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'employment-flow',
      // Only persist certain fields
      partialize: (state) => ({
        path: state.path,
        provider: state.provider,
        verificationData: state.verificationData,
        activityId: state.activityId,
      }),
    }
  )
);
```

### Education Flow Store

```typescript
// stores/educationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EducationFlowState {
  // Path selection
  pathType: 'automated' | 'manual' | null;
  
  // School selection
  school: {
    id?: string;
    name?: string;
  } | null;
  
  // Credentials (for automated verification)
  credentials: {
    username?: string;
    password?: string;
  };
  
  // Manual details
  details: {
    institution?: string;
    program?: string;
    startDate?: string;
    endDate?: string;
    hoursPerWeek?: number;
  };
  
  // Documents
  documents: File[];
  
  // Activity ID
  activityId: string | null;
  
  // Actions
  setPathType: (pathType: 'automated' | 'manual') => void;
  setSchool: (school: EducationFlowState['school']) => void;
  setCredentials: (credentials: Partial<EducationFlowState['credentials']>) => void;
  setDetails: (details: Partial<EducationFlowState['details']>) => void;
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  setActivityId: (id: string) => void;
  reset: () => void;
}

export const useEducationStore = create<EducationFlowState>()(
  persist(
    (set) => ({
      pathType: null,
      school: null,
      credentials: {},
      details: {},
      documents: [],
      activityId: null,
      
      setPathType: (pathType) => set({ pathType }),
      setSchool: (school) => set({ school }),
      setCredentials: (credentials) =>
        set((state) => ({
          credentials: { ...state.credentials, ...credentials },
        })),
      setDetails: (details) =>
        set((state) => ({
          details: { ...state.details, ...details },
        })),
      addDocument: (file) =>
        set((state) => ({ documents: [...state.documents, file] })),
      removeDocument: (index) =>
        set((state) => ({
          documents: state.documents.filter((_, i) => i !== index),
        })),
      setActivityId: (activityId) => set({ activityId }),
      reset: () =>
        set({
          pathType: null,
          school: null,
          credentials: {},
          details: {},
          documents: [],
          activityId: null,
        }),
    }),
    {
      name: 'education-flow',
    }
  )
);
```

### Exemption Flow Store

```typescript
// stores/exemptionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExemptionType = 'caregiver' | 'disability' | 'pregnancy' | 'other';

interface ExemptionFlowState {
  // Exemption type
  type: ExemptionType | null;
  
  // Form data
  formData: Record<string, unknown>;
  
  // Documents
  documents: File[];
  
  // Period
  period: {
    startDate?: string;
    endDate?: string;
  };
  
  // Exemption ID
  exemptionId: string | null;
  
  // Actions
  setType: (type: ExemptionType) => void;
  setFormData: (data: Record<string, unknown>) => void;
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  setPeriod: (period: Partial<ExemptionFlowState['period']>) => void;
  setExemptionId: (id: string) => void;
  reset: () => void;
}

export const useExemptionStore = create<ExemptionFlowState>()(
  persist(
    (set) => ({
      type: null,
      formData: {},
      documents: [],
      period: {},
      exemptionId: null,
      
      setType: (type) => set({ type }),
      setFormData: (formData) => set({ formData }),
      addDocument: (file) =>
        set((state) => ({ documents: [...state.documents, file] })),
      removeDocument: (index) =>
        set((state) => ({
          documents: state.documents.filter((_, i) => i !== index),
        })),
      setPeriod: (period) =>
        set((state) => ({
          period: { ...state.period, ...period },
        })),
      setExemptionId: (exemptionId) => set({ exemptionId }),
      reset: () =>
        set({
          type: null,
          formData: {},
          documents: [],
          period: {},
          exemptionId: null,
        }),
    }),
    {
      name: 'exemption-flow',
    }
  )
);
```

### Assessment Store

```typescript
// stores/assessmentStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AssessmentState {
  stateEnrollment: boolean | null;
  age: number | null;
  isPregnant: boolean | null;
  hasDisability: boolean | null;
  isCaregiver: boolean | null;
  hasSnapTanf: boolean | null;
  outcome: 'exempt' | 'required' | null;
  
  setStateEnrollment: (value: boolean) => void;
  setAge: (value: number) => void;
  setIsPregnant: (value: boolean) => void;
  setHasDisability: (value: boolean) => void;
  setIsCaregiver: (value: boolean) => void;
  setHasSnapTanf: (value: boolean) => void;
  setOutcome: (value: 'exempt' | 'required') => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      stateEnrollment: null,
      age: null,
      isPregnant: null,
      hasDisability: null,
      isCaregiver: null,
      hasSnapTanf: null,
      outcome: null,
      
      setStateEnrollment: (stateEnrollment) => set({ stateEnrollment }),
      setAge: (age) => set({ age }),
      setIsPregnant: (isPregnant) => set({ isPregnant }),
      setHasDisability: (hasDisability) => set({ hasDisability }),
      setIsCaregiver: (isCaregiver) => set({ isCaregiver }),
      setHasSnapTanf: (hasSnapTanf) => set({ hasSnapTanf }),
      setOutcome: (outcome) => set({ outcome }),
      reset: () =>
        set({
          stateEnrollment: null,
          age: null,
          isPregnant: null,
          hasDisability: null,
          isCaregiver: null,
          hasSnapTanf: null,
          outcome: null,
        }),
    }),
    {
      name: 'assessment',
    }
  )
);
```

## Layer 3: Global State (Context API)

### Auth Context

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

interface User {
  id: string;
  tenantId: string;
  role: 'admin' | 'case_worker' | 'member';
  email?: string;
  phone?: string;
  name?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface AuthContextValue {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Bootstrap auth on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Validate token and fetch user
      api.get('/auth/me')
        .then((data) => {
          setUser(data.user);
          setTenant(data.tenant);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    const data = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    setTenant(data.tenant);
  };
  
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setTenant(null);
  };
  
  const refreshToken = async () => {
    const data = await api.post('/auth/refresh');
    localStorage.setItem('accessToken', data.accessToken);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Theme Context

```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminTheme, memberTheme, DesignTokens } from '../theme/tokens';

type ThemeType = 'admin' | 'member';

interface ThemeContextValue {
  theme: ThemeType;
  tokens: DesignTokens;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'admin',
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}) {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);
  const tokens = theme === 'admin' ? adminTheme : memberTheme;
  
  useEffect(() => {
    // Apply theme class
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

## Layer 4: Form State (React Hook Form)

### Form Setup

```typescript
// Example: Add Note Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const addNoteSchema = z.object({
  note: z.string().min(1, 'Note is required').max(1000, 'Note is too long'),
});

type AddNoteFormData = z.infer<typeof addNoteSchema>;

function AddNoteModal({ beneficiaryId, open, onOpenChange }: AddNoteModalProps) {
  const { mutate, isLoading } = useAddBeneficiaryNote();
  
  const form = useForm<AddNoteFormData>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      note: '',
    },
  });
  
  const onSubmit = (data: AddNoteFormData) => {
    mutate(
      { beneficiaryId, note: data.note },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Add Note</DialogTitle>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                {...form.register('note')}
                rows={4}
                aria-invalid={!!form.formState.errors.note}
                aria-describedby={form.formState.errors.note ? 'note-error' : undefined}
              />
              {form.formState.errors.note && (
                <span id="note-error" className="text-sm text-destructive" role="alert">
                  {form.formState.errors.note.message}
                </span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Note'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## Layer 5: UI State (Local Component State)

### Modal State

```typescript
function ParticipantProfile({ id }: { id: string }) {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  return (
    <>
      <Button onClick={() => setIsAddNoteModalOpen(true)}>
        Add Note
      </Button>
      
      <AddNoteModal
        beneficiaryId={id}
        open={isAddNoteModalOpen}
        onOpenChange={setIsAddNoteModalOpen}
      />
      
      <DocumentViewerModal
        document={selectedDocument}
        open={isDocumentViewerOpen}
        onOpenChange={setIsDocumentViewerOpen}
      />
    </>
  );
}
```

### Dropdown State

```typescript
function DataTableRow({ row }: { row: Participant }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>View Profile</DropdownMenuItem>
        <DropdownMenuItem>Add Note</DropdownMenuItem>
        <DropdownMenuItem>Request Clarification</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## State Flow Diagrams

### Admin: Participant List Flow

```
User Action → Update URL Query Params → useParticipantQuery hook
                                              ↓
                                    React Query fetches data
                                              ↓
                                    Cache updated, component re-renders
                                              ↓
                                    DataTable displays new data
```

### Member: Employment Verification Flow

```
User selects path → useEmploymentStore.setPath('gig')
                                              ↓
                    Navigate to /m/work/gig/select-platform
                                              ↓
User selects provider → useEmploymentStore.setProvider('uber')
                                              ↓
                    Navigate to /m/work/gig/uber/login
                                              ↓
User enters credentials → useEmploymentStore.setCredentials({...})
                                              ↓
                    Navigate to /m/work/gig/uber/oauth
                                              ↓
User confirms → useCreateEmploymentActivity mutation
                                              ↓
                    API creates activity, returns activityId
                                              ↓
                    useEmploymentStore.setActivityId(id)
                                              ↓
                    React Query invalidates employment activities
                                              ↓
                    Navigate to /m/work/submit/confirmed
                                              ↓
                    useEmploymentStore.reset()
```

## Best Practices

### 1. Query Key Consistency

Always use the centralized `queryKeys` object to ensure consistent invalidation:

```typescript
// ✅ Good
queryClient.invalidateQueries({ queryKey: queryKeys.beneficiaries });

// ❌ Bad
queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
```

### 2. Mutation Error Handling

Always handle errors in mutations with user-friendly messages:

```typescript
onError: (error: Error) => {
  toast.error(`Failed to update: ${error.message}`);
}
```

### 3. Loading States

Use React Query's loading states for UI feedback:

```typescript
const { data, isLoading, isError, error } = useBeneficiaries(query);

if (isLoading) return <Skeleton />;
if (isError) return <ErrorState error={error} />;
return <DataTable data={data} />;
```

### 4. Zustand Store Cleanup

Reset stores when flows complete:

```typescript
// After successful submission
useEmploymentStore.getState().reset();
```

### 5. Persist Sensitive Data Carefully

Don't persist sensitive data (credentials, documents) in localStorage:

```typescript
persist(
  (set) => ({ /* state */ }),
  {
    name: 'employment-flow',
    partialize: (state) => ({
      // Only persist non-sensitive fields
      path: state.path,
      provider: state.provider,
      // Don't persist credentials or documents
    }),
  }
)
```

## Summary

The three-layer state architecture provides:

- **React Query** for efficient server state management with caching and invalidation
- **Zustand** for lightweight feature state across multi-step flows
- **Context API** for global configuration (auth, theme)
- **React Hook Form** for individual form state with validation
- **Local state** for transient UI state (modals, dropdowns)

This separation ensures optimal performance, maintainability, and developer experience while supporting both Admin and Member experiences.
