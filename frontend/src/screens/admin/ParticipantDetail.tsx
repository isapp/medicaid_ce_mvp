import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { StarButton } from '../../components/admin/StarButton';
import { AddNoteModal } from '../../components/admin/AddNoteModal';
import { DocumentViewerModal } from '../../components/admin/DocumentViewerModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Progress } from '../../components/ui/Progress';

export const ParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = React.useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<{ name: string; url: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'cases' | 'activity' | 'documents'>('overview');

  const mockParticipant = {
    id: id || '1',
    name: 'John Doe',
    medicaidId: 'MED-001',
    status: 'compliant',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '01/15/1985',
    enrollmentDate: '03/01/2024',
    lastActivity: '2 days ago',
    hoursRequired: 80,
    hoursCompleted: 65,
    complianceRate: 81,
  };

  const mockNotes = [
    { id: '1', date: '11/18/2025', author: 'Admin User', text: 'Participant submitted employment verification documents.' },
    { id: '2', date: '11/15/2025', author: 'Case Worker', text: 'Follow-up call scheduled for next week.' },
    { id: '3', date: '11/10/2025', author: 'Admin User', text: 'Initial assessment completed.' },
  ];

  const mockDocuments = [
    { id: '1', name: 'Paystub_Nov_2025.pdf', uploadDate: '11/18/2025', type: 'Employment Verification', url: '/mock/paystub.pdf', mimeType: 'application/pdf' },
    { id: '2', name: 'ID_Verification.pdf', uploadDate: '11/01/2025', type: 'Identity Document', url: '/mock/id.pdf', mimeType: 'application/pdf' },
    { id: '3', name: 'Exemption_Request.pdf', uploadDate: '10/15/2025', type: 'Exemption', url: '/mock/exemption.pdf', mimeType: 'application/pdf' },
  ];

  const handleAddNote = (note: string) => {
    console.log('Adding note:', note);
  };

  const handleViewDocument = (doc: typeof mockDocuments[0]) => {
    setSelectedDocument({ name: doc.name, url: doc.url, type: doc.mimeType });
    setIsDocViewerOpen(true);
  };

  const mockCases = [
    { id: '1', caseNumber: 'CASE-001', status: 'Open', type: 'Verification', createdAt: '2024-11-01' },
    { id: '2', caseNumber: 'CASE-002', status: 'Closed', type: 'Appeal', createdAt: '2024-10-15' },
  ];

  const mockActivity = [
    { id: '1', type: 'Status Changed', description: 'Status changed from Pending to Verified', user: 'Admin User', timestamp: '2024-11-20' },
    { id: '2', type: 'Document Uploaded', description: 'Paystub uploaded', user: mockParticipant.name, timestamp: '2024-11-18' },
  ];

  return (
    <AdminShell>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="py-6 space-y-8">
          {/* Back Button */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/participants')}>
              <ArrowLeft size={16} />
              <span>Back to Participants</span>
            </Button>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  {mockParticipant.name}
                </h1>
                <StatusBadge status={mockParticipant.status as any} />
              </div>
              <p className="text-xs font-normal font-mono leading-snug tracking-normal text-muted-foreground">
                {mockParticipant.medicaidId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <StarButton isStarred={isStarred} onToggle={() => setIsStarred(!isStarred)} />
              <Button variant="secondary">
                <Mail size={16} />
                <span>Send Message</span>
              </Button>
              <Button variant="primary">Verify</Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
              <TabsTrigger value="cases" className="text-sm font-medium">Cases</TabsTrigger>
              <TabsTrigger value="activity" className="text-sm font-medium">Activity</TabsTrigger>
              <TabsTrigger value="documents" className="text-sm font-medium">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Profile Information Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <h2 className="text-lg font-medium">Profile Information</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Email</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockParticipant.email}</p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Phone</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockParticipant.phone}</p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Date of Birth</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockParticipant.dateOfBirth}</p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Enrollment Date</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockParticipant.enrollmentDate}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Case Summary Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <h2 className="text-lg font-medium">Case Summary</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Total Cases</h6>
                          <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">{mockCases.length}</p>
                        </div>
                        <div>
                          <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Open Cases</h6>
                          <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">{mockCases.filter(c => c.status === 'Open').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Verification Status Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <h2 className="text-lg font-medium">Verification Status</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-normal leading-relaxed text-muted-foreground">Hours Completed</span>
                          <span className="text-sm font-medium leading-relaxed text-foreground">{mockParticipant.hoursCompleted} / {mockParticipant.hoursRequired}</span>
                        </div>
                        <Progress value={(mockParticipant.hoursCompleted / mockParticipant.hoursRequired) * 100} />
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Compliance Rate</h6>
                        <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">{mockParticipant.complianceRate}%</p>
                      </div>
                      <div>
                        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase mb-1">Last Activity</h6>
                        <p className="text-sm font-normal leading-relaxed text-foreground">{mockParticipant.lastActivity}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes Card */}
                  <Card>
                    <CardHeader className="pb-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Notes</h2>
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

            {/* Cases Tab */}
            <TabsContent value="cases" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Case Number</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCases.map((caseItem) => (
                        <tr key={caseItem.id}>
                          <td>{caseItem.caseNumber}</td>
                          <td>{caseItem.type}</td>
                          <td><StatusBadge status={caseItem.status.toLowerCase() as any} /></td>
                          <td>{caseItem.createdAt}</td>
                          <td><Button variant="secondary" size="sm">View</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
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
                        <p className="text-xs font-normal leading-snug text-muted-foreground">{doc.type} • {doc.uploadDate}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleViewDocument(doc)}>View</Button>
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
        />

        {selectedDocument && (
          <DocumentViewerModal
            isOpen={isDocViewerOpen}
            onClose={() => {
              setIsDocViewerOpen(false);
              setSelectedDocument(null);
            }}
            documentName={selectedDocument.name}
            documentUrl={selectedDocument.url}
            documentType={selectedDocument.type}
          />
        )}
      </div>
    </AdminShell>
  );
};
