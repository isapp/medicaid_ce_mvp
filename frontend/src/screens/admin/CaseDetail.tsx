import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, User, Clock, AlertCircle } from 'lucide-react';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  return (
    <AdminShell>
      <div className="case-detail">
        <div className="detail-header">
          <Button variant="secondary" onClick={() => navigate('/admin/cases')}>
            <ArrowLeft size={16} />
            <span>Back to Cases</span>
          </Button>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            <Card className="case-info-card">
              <div className="case-info-header">
                <div>
                  <h1>Case #{mockCase.id}</h1>
                  <p className="case-type">{mockCase.type}</p>
                </div>
                <div className="case-badges">
                  <Badge variant={mockCase.status === 'open' ? 'warning' : 'default'}>
                    {mockCase.status}
                  </Badge>
                  <Badge variant={mockCase.priority === 'high' ? 'destructive' : mockCase.priority === 'medium' ? 'warning' : 'default'}>
                    {mockCase.priority} priority
                  </Badge>
                </div>
              </div>

              <div className="case-info-grid">
                <div className="info-item">
                  <User size={16} />
                  <div>
                    <div className="info-label">Participant</div>
                    <div className="info-value">
                      <a href={`/admin/participants/${mockCase.participantId}`}>{mockCase.participant}</a>
                    </div>
                  </div>
                </div>
                <div className="info-item">
                  <User size={16} />
                  <div>
                    <div className="info-label">Assigned To</div>
                    <div className="info-value">{mockCase.assignedTo}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={16} />
                  <div>
                    <div className="info-label">Created</div>
                    <div className="info-value">{mockCase.created}</div>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={16} />
                  <div>
                    <div className="info-label">Last Updated</div>
                    <div className="info-value">{mockCase.updated}</div>
                  </div>
                </div>
              </div>

              <div className="case-description">
                <h3>Description</h3>
                <p>{mockCase.description}</p>
              </div>
            </Card>

            <Card className="case-actions-card">
              <h2>Actions</h2>
              <div className="case-actions-grid">
                {mockActions.map((action) => (
                  <Button key={action.id} variant={action.variant}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="case-notes-card">
              <div className="card-header">
                <h2>Case Notes</h2>
                <Button variant="primary">Add Note</Button>
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
            <Card className="case-timeline-card">
              <div className="card-header">
                <h2>Timeline</h2>
                <AlertCircle size={20} />
              </div>
              <div className="timeline-list">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Case Updated</div>
                    <div className="timeline-date">11/19/2025 10:30 AM</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Documents Reviewed</div>
                    <div className="timeline-date">11/18/2025 3:45 PM</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Case Created</div>
                    <div className="timeline-date">11/18/2025 2:15 PM</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};
