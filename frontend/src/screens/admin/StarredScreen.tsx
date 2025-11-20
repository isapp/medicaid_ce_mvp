import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';

export const StarredScreen: React.FC = () => {
  const navigate = useNavigate();

  const mockStarredParticipants = [
    { id: '1', name: 'John Doe', medicaidId: 'MED-001', status: 'compliant', lastActivity: '2 days ago', type: 'participant' },
    { id: '2', name: 'Jane Smith', medicaidId: 'MED-002', status: 'at-risk', lastActivity: '1 week ago', type: 'participant' },
  ];

  const mockStarredCases = [
    { id: '1', title: 'Verification Issue - John Doe', status: 'open', priority: 'high', updated: '11/19/2025', type: 'case' },
    { id: '3', title: 'Document Review - Jane Smith', status: 'in-progress', priority: 'medium', updated: '11/18/2025', type: 'case' },
  ];

  return (
    <AdminShell>
      <div className="starred-screen">
        <div className="page-header">
          <div>
            <h1>
              <Star size={24} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
              <span style={{ marginLeft: '12px' }}>Starred Items</span>
            </h1>
            <p>Quick access to your starred participants and cases</p>
          </div>
        </div>

        <Card className="starred-section">
          <h2>Starred Participants</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Medicaid ID</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStarredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--color-muted-foreground)' }}>
                    No starred participants yet
                  </td>
                </tr>
              ) : (
                mockStarredParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.name}</td>
                    <td>{participant.medicaidId}</td>
                    <td>
                      <StatusBadge status={participant.status as any} />
                    </td>
                    <td>{participant.lastActivity}</td>
                    <td>
                      <Button variant="secondary" onClick={() => navigate(`/admin/participants/${participant.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        <Card className="starred-section">
          <h2>Starred Cases</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStarredCases.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--color-muted-foreground)' }}>
                    No starred cases yet
                  </td>
                </tr>
              ) : (
                mockStarredCases.map((caseItem) => (
                  <tr key={caseItem.id}>
                    <td>{caseItem.title}</td>
                    <td>
                      <StatusBadge status={caseItem.status as any} />
                    </td>
                    <td>{caseItem.priority}</td>
                    <td>{caseItem.updated}</td>
                    <td>
                      <Button variant="secondary" onClick={() => navigate(`/admin/cases/${caseItem.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminShell>
  );
};
