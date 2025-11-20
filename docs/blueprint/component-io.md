# Component I/O Contracts

This document defines the input/output contracts (props, events, state, side effects) for all major components in the application.

## Overview

Component contracts specify:
- **Props**: Input parameters and their types
- **Events**: Callbacks and event handlers
- **State**: Internal state management
- **Side Effects**: API calls, navigation, external interactions
- **Return Value**: What the component renders

## Admin Components

### ParticipantsIndex

**Purpose**: Display paginated, filterable list of participants

**Props**:
```typescript
interface ParticipantsIndexProps {
  initialQuery?: Partial<BeneficiaryQuery>;
}
```

**State**:
```typescript
const { query, updateQuery } = useParticipantQuery();
const { data, isLoading, isError, error, refetch } = useBeneficiaries(query);
const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
```

**Events**:
```typescript
const handleRowClick = (participant: Beneficiary) => {
  navigate(`/admin/participants/${participant.id}`);
};

const handleQueryChange = (updates: Partial<BeneficiaryQuery>) => {
  updateQuery(updates);
};
```

**Side Effects**:
- Fetches beneficiaries from API via React Query
- Updates URL query parameters on filter/sort/pagination changes
- Navigates to participant profile on row click

**Return Value**:
```typescript
<AdminShell>
  <PageHeader title="Participants" />
  <DataTable
    columns={participantColumns}
    data={data}
    query={query}
    onQueryChange={handleQueryChange}
    onRowClick={handleRowClick}
  />
</AdminShell>
```

---

### ParticipantProfile

**Purpose**: Display detailed participant information with notes and documents

**Props**:
```typescript
interface ParticipantProfileProps {
  // Route param from React Router
  // id: string (from useParams)
}
```

**State**:
```typescript
const { id } = useParams<{ id: string }>();
const { data: participant, isLoading } = useBeneficiary(id);
const { data: notes } = useBeneficiaryNotes(id);
const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
```

**Events**:
```typescript
const handleAddNote = () => {
  setIsAddNoteModalOpen(true);
};

const handleViewDocument = (document: Document) => {
  setSelectedDocument(document);
  setIsDocumentViewerOpen(true);
};
```

**Side Effects**:
- Fetches participant data from API
- Fetches participant notes from API
- Opens modals for adding notes and viewing documents

**Return Value**:
```typescript
<AdminShell>
  <Breadcrumb>
    <BreadcrumbItem href="/admin/participants">Participants</BreadcrumbItem>
    <BreadcrumbItem>{participant?.fullName}</BreadcrumbItem>
  </Breadcrumb>
  
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <ParticipantInfoCard participant={participant} />
      <EngagementActivitiesCard participantId={id} />
    </div>
    <div>
      <NotesCard notes={notes} onAddNote={handleAddNote} />
      <DocumentsCard documents={participant?.documents} onViewDocument={handleViewDocument} />
    </div>
  </div>
  
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
</AdminShell>
```

---

### DataTable

**Purpose**: Reusable data table with sorting, filtering, and pagination

**Props**:
```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: PaginationResponse<T>;
  query: {
    page: number;
    pageSize: number;
    sort?: string;
    [key: string]: unknown;
  };
  onQueryChange: (query: Partial<DataTableProps<T>['query']>) => void;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
}
```

**State**:
```typescript
const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
const [sorting, setSorting] = useState<SortingState>([]);
```

**Events**:
```typescript
const handlePageChange = (page: number) => {
  onQueryChange({ page });
};

const handleSortChange = (sorting: SortingState) => {
  setSorting(sorting);
  const sortString = sorting.map(s => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(',');
  onQueryChange({ sort: sortString });
};

const handleRowClick = (row: T) => {
  onRowClick?.(row);
};
```

**Side Effects**:
- None (controlled component)

**Return Value**:
```typescript
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <ColumnVisibilityMenu
      columns={columns}
      visibility={columnVisibility}
      onVisibilityChange={setColumnVisibility}
    />
  </div>
  
  <Table>
    <TableHeader>
      {/* Column headers with sort indicators */}
    </TableHeader>
    <TableBody>
      {data.items.map(row => (
        <TableRow key={row.id} onClick={() => handleRowClick(row)}>
          {/* Row cells */}
        </TableRow>
      ))}
    </TableBody>
  </Table>
  
  <Pagination
    page={query.page}
    pageSize={query.pageSize}
    total={data.total}
    onPageChange={handlePageChange}
  />
</div>
```

---

### AddNoteModal

**Purpose**: Modal for adding notes to participants or cases

**Props**:
```typescript
interface AddNoteModalProps {
  beneficiaryId?: string;
  caseId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**State**:
```typescript
const form = useForm<AddNoteFormData>({
  resolver: zodResolver(AddNoteFormSchema),
  defaultValues: { note: '' },
});

const { mutate, isLoading } = beneficiaryId
  ? useAddBeneficiaryNote()
  : useAddCaseNote();
```

**Events**:
```typescript
const onSubmit = (data: AddNoteFormData) => {
  mutate(
    { beneficiaryId, caseId, note: data.note },
    {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    }
  );
};
```

**Side Effects**:
- Posts note to API via mutation
- Invalidates notes query on success
- Shows toast notification

**Return Value**:
```typescript
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogTitle>Add Note</DialogTitle>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Textarea {...form.register('note')} />
      {form.formState.errors.note && (
        <span className="text-destructive">{form.formState.errors.note.message}</span>
      )}
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Note'}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

### CaseDetail

**Purpose**: Display detailed case information with actions

**Props**:
```typescript
interface CaseDetailProps {
  // Route param from React Router
  // id: string (from useParams)
}
```

**State**:
```typescript
const { id } = useParams<{ id: string }>();
const { data: caseDetail, isLoading } = useCase(id);
const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
const [isRequestClarificationModalOpen, setIsRequestClarificationModalOpen] = useState(false);
```

**Events**:
```typescript
const handleAddNote = () => {
  setIsAddNoteModalOpen(true);
};

const handleRequestClarification = () => {
  setIsRequestClarificationModalOpen(true);
};

const handleCloseCase = () => {
  // Show confirmation dialog
};
```

**Side Effects**:
- Fetches case detail from API
- Opens modals for actions
- Updates case status via mutations

**Return Value**:
```typescript
<AdminShell>
  <Breadcrumb>
    <BreadcrumbItem href="/admin/cases">Cases</BreadcrumbItem>
    <BreadcrumbItem>Case #{caseDetail?.id}</BreadcrumbItem>
  </Breadcrumb>
  
  <div className="space-y-6">
    <CaseInfoCard case={caseDetail} />
    <ParticipantSummaryCard participant={caseDetail?.beneficiary} />
    <ActivitiesTimeline activities={caseDetail?.activities} />
    <NotesCard notes={caseDetail?.notes} onAddNote={handleAddNote} />
    
    <div className="flex gap-3">
      <Button onClick={handleAddNote}>Add Note</Button>
      <Button variant="outline" onClick={handleRequestClarification}>
        Request Clarification
      </Button>
      <Button variant="destructive" onClick={handleCloseCase}>
        Close Case
      </Button>
    </div>
  </div>
  
  <AddNoteModal
    caseId={id}
    open={isAddNoteModalOpen}
    onOpenChange={setIsAddNoteModalOpen}
  />
  
  <RequestClarificationModal
    caseId={id}
    open={isRequestClarificationModalOpen}
    onOpenChange={setIsRequestClarificationModalOpen}
  />
</AdminShell>
```

---

## Member Components

### ScreenLayout

**Purpose**: Consistent layout wrapper for member screens

**Props**:
```typescript
interface ScreenLayoutProps {
  showHeader?: boolean;
  headerTitle?: string;
  onHeaderBack?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

**State**:
```typescript
// No internal state
```

**Events**:
```typescript
const handleBack = () => {
  onHeaderBack?.();
};
```

**Side Effects**:
- None

**Return Value**:
```typescript
<div className="flex flex-col min-h-screen">
  {showHeader && (
    <header
      className="sticky top-0 z-10 bg-background border-b"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center h-14 px-4">
        {onHeaderBack && (
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        {headerTitle && <h1 className="text-lg font-semibold ml-2">{headerTitle}</h1>}
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
```

---

### AuthScreen

**Purpose**: Phone number entry for member authentication

**Props**:
```typescript
interface AuthScreenProps {
  // No props
}
```

**State**:
```typescript
const form = useForm<PhoneAuthFormData>({
  resolver: zodResolver(PhoneAuthFormSchema),
  defaultValues: { phone: '' },
});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Events**:
```typescript
const onSubmit = async (data: PhoneAuthFormData) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await api.post('/auth/member/request-code', { phone: data.phone });
    navigate('/m/auth/code', {
      state: {
        requestId: response.requestId,
        phone: data.phone,
        expiresAt: response.expiresAt,
      },
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to send code');
  } finally {
    setIsLoading(false);
  }
};
```

**Side Effects**:
- Posts to API to request SMS code
- Navigates to code verification screen on success

**Return Value**:
```typescript
<ScreenLayout showHeader={false}>
  <div className="flex flex-col items-center justify-center min-h-screen px-4">
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+15551234567"
          style={{ fontSize: '16px' }}
          {...form.register('phone')}
        />
        {form.formState.errors.phone && (
          <span className="text-destructive">{form.formState.errors.phone.message}</span>
        )}
      </div>
      
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? 'Sending code...' : 'Continue'}
      </Button>
    </form>
  </div>
</ScreenLayout>
```

---

### DashboardScreen

**Purpose**: Main dashboard for members showing status and actions

**Props**:
```typescript
interface DashboardScreenProps {
  // No props
}
```

**State**:
```typescript
const { user } = useAuth();
const { data: dashboard, isLoading } = useDashboardSummary();
```

**Events**:
```typescript
const handleVerifyEmployment = () => {
  navigate('/m/work/choose-path');
};

const handleVerifyEducation = () => {
  navigate('/m/education/path-choice');
};

const handleApplyExemption = () => {
  navigate('/m/exemptions/prescreening');
};
```

**Side Effects**:
- Fetches dashboard summary from API
- Navigates to verification flows

**Return Value**:
```typescript
<ScreenLayout showHeader={false}>
  <div className="p-4 space-y-6">
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground">Your engagement status</p>
    </div>
    
    <StatusCard status={dashboard?.beneficiary.engagementStatus} />
    
    <UpcomingDeadlinesCard deadlines={dashboard?.upcomingDeadlines} />
    
    <div className="space-y-3">
      <Button
        className="w-full h-12"
        onClick={handleVerifyEmployment}
        disabled={dashboard?.verificationStatus.employment === 'verified'}
      >
        Verify Employment
      </Button>
      <Button
        className="w-full h-12"
        variant="outline"
        onClick={handleVerifyEducation}
      >
        Verify Education
      </Button>
      <Button
        className="w-full h-12"
        variant="outline"
        onClick={handleApplyExemption}
      >
        Apply for Exemption
      </Button>
    </div>
    
    <RecentActivitiesCard activities={dashboard?.recentActivities} />
  </div>
</ScreenLayout>
```

---

### SelectGigPlatformScreen

**Purpose**: Select gig platform for employment verification

**Props**:
```typescript
interface SelectGigPlatformScreenProps {
  // No props
}
```

**State**:
```typescript
const { setPath, setProvider } = useEmploymentStore();
const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

const platforms = [
  { id: 'uber', name: 'Uber', icon: '/icons/uber.png' },
  { id: 'lyft', name: 'Lyft', icon: '/icons/lyft.png' },
  { id: 'doordash', name: 'DoorDash', icon: '/icons/doordash.png' },
  { id: 'instacart', name: 'Instacart', icon: '/icons/instacart.png' },
];
```

**Events**:
```typescript
const handleSelectPlatform = (platformId: string) => {
  setSelectedPlatform(platformId);
};

const handleContinue = () => {
  if (!selectedPlatform) return;
  
  setPath('gig');
  setProvider(selectedPlatform);
  navigate(`/m/work/gig/${selectedPlatform}/login`);
};
```

**Side Effects**:
- Updates employment store with selected path and provider
- Navigates to platform-specific login screen

**Return Value**:
```typescript
<ScreenLayout
  showHeader={true}
  headerTitle="Select Platform"
  onHeaderBack={() => navigate(-1)}
  actions={
    <Button
      className="w-full h-12"
      onClick={handleContinue}
      disabled={!selectedPlatform}
    >
      Continue
    </Button>
  }
>
  <div className="p-4 space-y-4">
    <p className="text-muted-foreground">
      Select the gig platform you work with
    </p>
    
    <div className="grid grid-cols-2 gap-4">
      {platforms.map(platform => (
        <Card
          key={platform.id}
          className={cn(
            "cursor-pointer transition-colors",
            selectedPlatform === platform.id && "border-primary"
          )}
          onClick={() => handleSelectPlatform(platform.id)}
        >
          <CardContent className="p-6 text-center">
            <img src={platform.icon} alt={platform.name} className="h-12 mx-auto mb-2" />
            <p className="font-medium">{platform.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</ScreenLayout>
```

---

### CheckUploadScreen

**Purpose**: Upload paystub photo for manual employment verification

**Props**:
```typescript
interface CheckUploadScreenProps {
  // No props
}
```

**State**:
```typescript
const { addDocument } = useEmploymentStore();
const [file, setFile] = useState<File | null>(null);
const [preview, setPreview] = useState<string | null>(null);
const [isUploading, setIsUploading] = useState(false);
```

**Events**:
```typescript
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (!selectedFile) return;
  
  setFile(selectedFile);
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    setPreview(e.target?.result as string);
  };
  reader.readAsDataURL(selectedFile);
};

const handleContinue = async () => {
  if (!file) return;
  
  setIsUploading(true);
  try {
    addDocument(file);
    navigate('/m/work/manual/processing');
  } catch (error) {
    toast.error('Failed to process file');
  } finally {
    setIsUploading(false);
  }
};
```

**Side Effects**:
- Reads file and creates preview
- Adds file to employment store
- Navigates to processing screen

**Return Value**:
```typescript
<ScreenLayout
  showHeader={true}
  headerTitle="Upload Paystub"
  onHeaderBack={() => navigate(-1)}
  actions={
    <Button
      className="w-full h-12"
      onClick={handleContinue}
      disabled={!file || isUploading}
    >
      {isUploading ? 'Processing...' : 'Continue'}
    </Button>
  }
>
  <div className="p-4 space-y-6">
    <p className="text-muted-foreground">
      Take a clear photo of your paystub or upload from your device
    </p>
    
    {preview ? (
      <div className="relative">
        <img src={preview} alt="Paystub preview" className="w-full rounded-lg" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => {
            setFile(null);
            setPreview(null);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
        <Camera className="h-12 w-12 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">Tap to upload</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label>
    )}
  </div>
</ScreenLayout>
```

---

## Shared UI Components

### Button

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**State**: None

**Events**: Inherits all button events (onClick, onFocus, etc.)

**Side Effects**: None

---

### Input

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Standard input props
}
```

**State**: None (controlled by parent)

**Events**: Inherits all input events (onChange, onBlur, etc.)

**Side Effects**: None

---

### Dialog

**Props**:
```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
```

**State**:
```typescript
// Focus trap state
const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
```

**Events**:
```typescript
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onOpenChange(false);
  }
};

const handleOverlayClick = () => {
  onOpenChange(false);
};
```

**Side Effects**:
- Traps focus within dialog
- Prevents body scroll when open
- Restores focus on close

---

## Component Patterns

### Page Component Pattern

```typescript
// Pattern for page-level components
interface PageComponentProps {
  // Route params from React Router (if any)
}

function PageComponent(props: PageComponentProps) {
  // 1. Extract route params
  const params = useParams();
  
  // 2. Get auth context
  const { user, tenant } = useAuth();
  
  // 3. Fetch data with React Query
  const { data, isLoading, isError, error } = useQuery(...);
  
  // 4. Local UI state
  const [modalOpen, setModalOpen] = useState(false);
  
  // 5. Event handlers
  const handleAction = () => {
    // ...
  };
  
  // 6. Loading state
  if (isLoading) return <Skeleton />;
  
  // 7. Error state
  if (isError) return <ErrorState error={error} />;
  
  // 8. Render
  return (
    <Layout>
      {/* Content */}
    </Layout>
  );
}
```

### Form Component Pattern

```typescript
// Pattern for form components
interface FormComponentProps {
  initialValues?: Partial<FormData>;
  onSubmit: (values: FormData) => Promise<void>;
  onCancel?: () => void;
}

function FormComponent({ initialValues, onSubmit, onCancel }: FormComponentProps) {
  // 1. Setup form with React Hook Form + Zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || defaultValues,
  });
  
  // 2. Setup mutation
  const { mutate, isLoading } = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      form.reset();
      toast.success('Success');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  // 3. Submit handler
  const handleSubmit = (data: FormData) => {
    mutate(data);
  };
  
  // 4. Render form
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Modal Component Pattern

```typescript
// Pattern for modal components
interface ModalComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Modal-specific props
}

function ModalComponent({ open, onOpenChange, ...props }: ModalComponentProps) {
  // 1. Local state (if needed)
  const [step, setStep] = useState(1);
  
  // 2. Event handlers
  const handleConfirm = () => {
    // Perform action
    onOpenChange(false);
  };
  
  // 3. Render modal
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        {/* Modal content */}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Summary

Component I/O contracts provide:

- **Clear interfaces**: TypeScript props for all major components
- **Consistent patterns**: Page, form, and modal component patterns
- **State management**: Local state, React Query, and Zustand integration
- **Event handling**: Standardized event handler patterns
- **Side effects**: Explicit documentation of API calls and navigation
- **Return values**: Clear component structure and rendering

All components follow these patterns for consistency and maintainability across the application.
