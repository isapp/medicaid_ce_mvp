import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { StarButton } from '../../components/admin/StarButton';
import { AddNoteModal } from '../../components/admin/AddNoteModal';
import { DocumentViewerModal } from '../../components/admin/DocumentViewerModal';

export const ParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = React.useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<{ name: string; url: string; type: string } | null>(null);

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

  return (
    <AdminShell>
      <div className="participant-detail">
        <div className="detail-header">
          <Button variant="secondary" onClick={() => navigate('/admin/participants')}>
            <ArrowLeft size={16} />
            <span>Back to Participants</span>
          </Button>
          <div className="detail-header-actions">
            <StarButton isStarred={isStarred} onToggle={() => setIsStarred(!isStarred)} />
            <Button variant="secondary">
              <Mail size={16} />
              <span>Send Message</span>
            </Button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            <Card className="participant-info-card">
              <div className="participant-info-header">
                <div>
                  <h1>{mockParticipant.name}</h1>
                  <p className="participant-medicaid-id">{mockParticipant.medicaidId}</p>
                </div>
                <StatusBadge status={mockParticipant.status as any} />
              </div>

              <div className="participant-info-grid">
                <div className="info-item">
                  <Mail size={16} />
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">{mockParticipant.email}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={16} />
                  <div>
                    <div className="info-label">Phone</div>
                    <div className="info-value">{mockParticipant.phone}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={16} />
                  <div>
                    <div className="info-label">Date of Birth</div>
                    <div className="info-value">{mockParticipant.dateOfBirth}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={16} />
                  <div>
                    <div className="info-label">Enrollment Date</div>
                    <div className="info-value">{mockParticipant.enrollmentDate}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="engagement-stats-card">
              <h2>Engagement Statistics</h2>
              <div className="engagement-stats-grid">
                <div className="stat-item">
                  <div className="stat-label">Hours Required</div>
                  <div className="stat-value">{mockParticipant.hoursRequired}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Hours Completed</div>
                  <div className="stat-value">{mockParticipant.hoursCompleted}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Compliance Rate</div>
                  <div className="stat-value">{mockParticipant.complianceRate}%</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Last Activity</div>
                  <div className="stat-value">{mockParticipant.lastActivity}</div>
                </div>
              </div>
            </Card>

            <Card className="notes-card">
              <div className="card-header">
                <h2>Notes</h2>
                <Button variant="primary" onClick={() => setIsAddNoteModalOpen(true)}>
                  Add Note
                </Button>
              </div>
              <div className="notes-list">
                {mockNotes.map((note) => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-date">{note.date}</span>
                    </div>
                    <p className="note-text">{note.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="detail-sidebar">
            <Card className="documents-card">
              <div className="card-header">
                <h2>Documents</h2>
                <FileText size={20} />
              </div>
              <div className="documents-list">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <div className="document-name">{doc.name}</div>
                      <div className="document-meta">
                        <span className="document-type">{doc.type}</span>
                        <span className="document-date">{doc.uploadDate}</span>
                      </div>
                    </div>
                    <Button variant="secondary" onClick={() => handleViewDocument(doc)}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
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
