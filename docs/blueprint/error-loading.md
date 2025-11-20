# Error & Loading States

This document defines comprehensive patterns for error handling, loading states, and user feedback throughout the application.

## Overview

The application implements consistent patterns for:

- **Loading States**: Skeletons, spinners, progress indicators
- **Error States**: Global error boundary, API errors, form validation errors
- **Empty States**: Friendly messages with clear actions
- **Success Feedback**: Toast notifications, confirmation screens
- **Retry Logic**: Automatic retries with exponential backoff

## Loading States

### Loading State Types

| Type | Use Case | Component |
|------|----------|-----------|
| **Skeleton** | List views, cards, profiles | `<Skeleton />` |
| **Spinner** | Button actions, inline loading | `<Spinner />` |
| **Progress Bar** | File uploads, multi-step processes | `<Progress />` |
| **Loading Screen** | Full-page loading (auth bootstrap) | `<LoadingScreen />` |
| **Disabled State** | Buttons during async operations | `disabled` prop |

### Skeleton Screens

```typescript
// components/skeletons/ParticipantListSkeleton.tsx
export function ParticipantListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Usage in component
function ParticipantsIndex() {
  const { data, isLoading, isError, error } = useBeneficiaries(query);
  
  if (isLoading) return <ParticipantListSkeleton />;
  if (isError) return <ErrorState error={error} />;
  
  return <DataTable data={data} />;
}
```

### Button Loading States

```typescript
// Button with loading state
<Button disabled={isLoading}>
  {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>

// Spinner component
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
```

### Progress Indicators

```typescript
// File upload with progress
function DocumentUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      await uploadFile(file, (p) => setProgress(p));
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <input type="file" onChange={(e) => handleUpload(e.target.files?.[0])} />
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
```

### Loading Screen (Full Page)

```typescript
// components/LoadingScreen.tsx
export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Spinner className="h-12 w-12 mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Usage in auth bootstrap
function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // ... rest of component
}
```

## Error States

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // Optional: Send to error tracking service
    // trackError(error, errorInfo);
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 p-4 bg-muted rounded-lg max-w-2xl w-full">
              <summary className="cursor-pointer font-semibold">Error Details</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage in App.tsx
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>{/* routes */}</Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

### API Error Handling

```typescript
// components/ErrorState.tsx
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isNetworkError = error.message.includes('network') || error.message.includes('fetch');
  
  return (
    <div className="flex items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {isNetworkError ? 'Connection Error' : 'Error Loading Data'}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {error.message}
        </AlertDescription>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Alert>
    </div>
  );
}

// Usage with React Query
function ParticipantsIndex() {
  const { data, isLoading, isError, error, refetch } = useBeneficiaries(query);
  
  if (isLoading) return <ParticipantListSkeleton />;
  if (isError) return <ErrorState error={error as Error} onRetry={refetch} />;
  
  return <DataTable data={data} />;
}
```

### Form Validation Errors

```typescript
// Inline field errors
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    {...form.register('email')}
    aria-invalid={!!form.formState.errors.email}
    aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
  />
  {form.formState.errors.email && (
    <span id="email-error" className="text-sm text-destructive" role="alert">
      {form.formState.errors.email.message}
    </span>
  )}
</div>

// Form-level error summary
{Object.keys(form.formState.errors).length > 0 && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Please fix the following errors:</AlertTitle>
    <AlertDescription>
      <ul className="list-disc list-inside mt-2">
        {Object.entries(form.formState.errors).map(([field, error]) => (
          <li key={field}>{error.message}</li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
)}
```

### Network Error Handling

```typescript
// components/NetworkErrorBanner.tsx
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { WifiOff } from 'lucide-react';

export function NetworkErrorBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You are currently offline. Some features may not be available.
      </AlertDescription>
    </Alert>
  );
}
```

## Empty States

### Empty List State

```typescript
// components/EmptyState.tsx
import { ReactNode } from 'react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Usage
function Broadcasts() {
  const { data, isLoading } = useBroadcasts(query);
  
  if (isLoading) return <BroadcastListSkeleton />;
  
  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-16 w-16" />}
        title="No broadcasts yet"
        description="Create your first broadcast message to communicate with participants"
        action={{
          label: 'Create Broadcast',
          onClick: () => navigate('/admin/broadcasts/new'),
        }}
      />
    );
  }
  
  return <BroadcastList broadcasts={data.items} />;
}
```

### No Results State

```typescript
// Empty search results
function ParticipantsIndex() {
  const { query, updateQuery } = useParticipantQuery();
  const { data, isLoading } = useBeneficiaries(query);
  
  if (isLoading) return <ParticipantListSkeleton />;
  
  if (data.items.length === 0 && query.search) {
    return (
      <EmptyState
        icon={<Search className="h-16 w-16" />}
        title="No results found"
        description={`No participants match "${query.search}"`}
        action={{
          label: 'Clear Search',
          onClick: () => updateQuery({ search: '' }),
        }}
      />
    );
  }
  
  return <DataTable data={data} />;
}
```

## Toast Notifications

### Toast Setup (Sonner)

```typescript
// App.tsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>{/* routes */}</Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}
```

### Toast Patterns

```typescript
import { toast } from 'sonner';

// Success
toast.success('Note added successfully');

// Error
toast.error('Failed to add note');

// Info
toast.info('Processing your request...');

// Warning
toast.warning('This action cannot be undone');

// Loading with promise
const promise = api.post('/beneficiaries/123/notes', { note: 'Test' });
toast.promise(promise, {
  loading: 'Adding note...',
  success: 'Note added successfully',
  error: 'Failed to add note',
});

// Loading with manual control
const toastId = toast.loading('Uploading document...');
try {
  await uploadFile(file);
  toast.success('Document uploaded', { id: toastId });
} catch (error) {
  toast.error('Upload failed', { id: toastId });
}

// Custom action
toast('Verification submitted', {
  action: {
    label: 'View',
    onClick: () => navigate('/m/work/summary'),
  },
});

// Dismissible
toast('This is a message', {
  duration: 5000,
  dismissible: true,
});
```

### Toast in Mutations

```typescript
// hooks/mutations/useBeneficiaryMutations.ts
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
```

## Retry Logic

### React Query Retry Configuration

```typescript
// providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Retry on network errors, not on 4xx errors
      retryOnMount: true,
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
```

### Manual Retry

```typescript
// Component with manual retry
function ParticipantsIndex() {
  const { data, isLoading, isError, error, refetch, isFetching } = useBeneficiaries(query);
  
  if (isLoading) return <ParticipantListSkeleton />;
  
  if (isError) {
    return (
      <ErrorState
        error={error as Error}
        onRetry={() => {
          toast.info('Retrying...');
          refetch();
        }}
      />
    );
  }
  
  return (
    <>
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <Alert>
            <Spinner className="h-4 w-4" />
            <AlertDescription>Refreshing...</AlertDescription>
          </Alert>
        </div>
      )}
      <DataTable data={data} />
    </>
  );
}
```

## Confirmation Dialogs

### Destructive Action Confirmation

```typescript
// components/ConfirmDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : ''}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Usage
function CaseDetail({ id }: { id: string }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: closeCase, isLoading } = useUpdateCase();
  
  const handleCloseCase = () => {
    closeCase(
      { id, status: 'closed' },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          toast.success('Case closed');
        },
      }
    );
  };
  
  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsConfirmOpen(true)}
      >
        Close Case
      </Button>
      
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Close Case"
        description="Are you sure you want to close this case? This action cannot be undone."
        confirmLabel="Close Case"
        onConfirm={handleCloseCase}
        variant="destructive"
      />
    </>
  );
}
```

## Success States

### Success Screen (Member Flows)

```typescript
// pages/member/SubmitConfirmedScreen.tsx
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmploymentStore } from '../../stores/employmentStore';

export function SubmitConfirmedScreen() {
  const navigate = useNavigate();
  const resetStore = useEmploymentStore((state) => state.reset);
  
  useEffect(() => {
    // Reset store after successful submission
    return () => resetStore();
  }, [resetStore]);
  
  return (
    <ScreenLayout showHeader={false}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <CheckCircle className="h-20 w-20 text-success mb-6" />
        <h1 className="text-2xl font-bold mb-2">Verification Submitted</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Your employment verification has been submitted successfully. We'll review it and update your status within 2-3 business days.
        </p>
        <Button
          className="w-full max-w-sm h-12"
          onClick={() => navigate('/m')}
        >
          Return to Dashboard
        </Button>
      </div>
    </ScreenLayout>
  );
}
```

## Loading State Best Practices

### 1. Skeleton Screens for Initial Load

```typescript
// ✅ Good - Skeleton for initial load
if (isLoading) return <ParticipantListSkeleton />;

// ❌ Bad - Spinner for initial load
if (isLoading) return <Spinner />;
```

### 2. Inline Loading for Refetches

```typescript
// ✅ Good - Show data with inline loading indicator
return (
  <>
    {isFetching && <InlineLoadingBanner />}
    <DataTable data={data} />
  </>
);

// ❌ Bad - Replace entire view with loading state
if (isFetching) return <Spinner />;
```

### 3. Optimistic Updates

```typescript
// ✅ Good - Optimistic update with rollback
const mutation = useMutation({
  mutationFn: updateCase,
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: ['case', variables.id] });
    const previous = queryClient.getQueryData(['case', variables.id]);
    queryClient.setQueryData(['case', variables.id], variables);
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['case', variables.id], context.previous);
  },
});

// ❌ Bad - Wait for server response
const mutation = useMutation({
  mutationFn: updateCase,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['case'] });
  },
});
```

### 4. Disabled State During Loading

```typescript
// ✅ Good - Disable button during loading
<Button disabled={isLoading}>
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>

// ❌ Bad - No disabled state
<Button onClick={handleSubmit}>Submit</Button>
```

## Error Handling Best Practices

### 1. User-Friendly Error Messages

```typescript
// ✅ Good - User-friendly message
toast.error('Failed to add note. Please try again.');

// ❌ Bad - Technical error message
toast.error('Error: ECONNREFUSED 127.0.0.1:3000');
```

### 2. Provide Retry Options

```typescript
// ✅ Good - Offer retry
<ErrorState error={error} onRetry={refetch} />

// ❌ Bad - No retry option
<ErrorState error={error} />
```

### 3. Contextual Error Messages

```typescript
// ✅ Good - Context-specific message
if (error.code === 'VALIDATION_ERROR') {
  toast.error('Please check your input and try again');
} else if (error.code === 'UNAUTHORIZED') {
  toast.error('Your session has expired. Please log in again');
} else {
  toast.error('An unexpected error occurred');
}

// ❌ Bad - Generic message
toast.error(error.message);
```

## Summary

The error and loading state patterns provide:

- **Consistent loading states**: Skeletons for lists, spinners for actions, progress bars for uploads
- **Comprehensive error handling**: Global error boundary, API errors, form validation, network errors
- **User-friendly feedback**: Toast notifications, success screens, confirmation dialogs
- **Empty states**: Clear messaging with actionable next steps
- **Retry logic**: Automatic retries with exponential backoff, manual retry options
- **Optimistic updates**: Immediate UI feedback with rollback on error

All patterns follow accessibility best practices with ARIA attributes and keyboard support.
