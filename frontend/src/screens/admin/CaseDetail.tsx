import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, User, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AddNoteModal } from '../../components/admin/AddNoteModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'activity' | 'documents'>('overview');

  const mockCase = {
    id: id || '1',
    participant: 'John Doe',
    participantId: '1',
    type: 'Verification Issue',
    status: 'open',
    priority: 'high',
    created: '11/18/2025',
    updated: '11/19/2025',
    assignedTo: 'Admin User',
    description: 'Participant submitted employment verification documents that require additional review. Documents appear to be from a non-standard payroll provider.',
  };

  const mockNotes = [
    { id: '1', date: '11/19/2025 10:30 AM', author: 'Admin User', text: 'Contacted payroll provider to verify authenticity of documents.' },
    { id: '2', date: '11/18/2025 3:45 PM', author: 'Case Worker', text: 'Documents received and under review.' },
    { id: '3', date: '11/18/2025 2:15 PM', author: 'System', text: 'Case created automatically due to verification flag.' },
  ];

  const mockActions = [
    { id: '1', label: 'Approve Verification', variant: 'primary' as const },
    { id: '2', label: 'Request Clarification', variant: 'secondary' as const },
    { id: '3', label: 'Escalate Case', variant: 'secondary' as const },
    { id: '4', label: 'Close Case', variant: 'secondary' as const },
  ];

  const handleAddNote = (note: string) => {
    console.log('Adding case note:', note);
  };

  const mockActivity = [
    { id: '1', type: 'Status Updated', description: 'Case status changed to In Progress', user: 'Admin User', timestamp: '2024-11-19 10:30 AM' },
    { id: '2', type: 'Note Added', description: 'Contacted payroll provider', user: 'Admin User', timestamp: '2024-11-19 10:30 AM' },
    { id: '3', type: 'Case Created', description: 'Case created automatically', user: 'System', timestamp: '2024-11-18 2:15 PM' },
  ];

  const mockDocuments = [
    { id: '1', name: 'Verification_Documents.pdf', type: 'Employment Verification', uploadedDate: '2024-11-18', status: 'Under Review' },
    { id: '2', name: 'Participant_ID.pdf', type: 'Identity Document', uploadedDate: '2024-11-15', status: 'Approved' },
  ];

  return (
    <AdminShell>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="py-6 space-y-8">
          {/* Back Button */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/cases')}>
              <ArrowLeft size={16} />
              <span>Back to Cases</span>
            </Button>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  Case #{mockCase.id}
                </h1>
                <StatusBadge status={mockCase.status as any} />
                <Badge variant={mockCase.priority === 'high' ? 'destructive' : mockCase.priority === 'medium' ? 'warning' : 'default'}>
                  {mockCase.priority} priority
                </Badge>
              </div>
              <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                {mockCase.type}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="secondary">Assign</Button>
              <Button variant="primary">Resolve</Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="text-sm font-medium">Activity</TabsTrigger>
              <TabsTrigger value="documents" className="text-sm font-medium">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Case Information Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <h2 className="text-lg font-medium">Case Information</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Participant</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">
                          <a href={`/admin/participants/${mockCase.participantId}`} className="text-primary hover:underline">{mockCase.participant}</a>
                        </p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Assigned To</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockCase.assignedTo}</p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Created</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockCase.created}</p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Last Updated</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockCase.updated}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <h2 className="text-lg font-medium">Description</h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-normal leading-relaxed text-foreground">{mockCase.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Actions Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <h2 className="text-lg font-medium">Quick Actions</h2>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {mockActions.map((action) => (
                        <Button key={action.id} variant={action.variant} className="w-full">
                          {action.label}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Notes Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Case Notes</h2>
                        <Button variant="primary" size="sm" onClick={() => setIsAddNoteModalOpen(true)}>Add Note</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockNotes.map((note) => (
                        <div key={note.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium leading-relaxed text-foreground">{note.author}</span>
                            <span className="text-xs font-normal leading-snug text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm font-normal leading-relaxed text-muted-foreground">{note.text}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium leading-relaxed text-foreground">{activity.type}</span>
                        <span className="text-xs font-normal leading-snug text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm font-normal leading-relaxed text-muted-foreground">{activity.description}</p>
                      <p className="text-xs font-normal leading-snug text-muted-foreground">by {activity.user}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium leading-relaxed text-foreground">{doc.name}</p>
                        <p className="text-xs font-normal leading-snug text-muted-foreground">{doc.type} • {doc.uploadedDate} • {doc.status}</p>
                      </div>
                      <Button variant="secondary" size="sm">View</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

        <AddNoteModal
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
          onSave={handleAddNote}
          title="Add Case Note"
        />
      </div>
    </AdminShell>
  );
};
