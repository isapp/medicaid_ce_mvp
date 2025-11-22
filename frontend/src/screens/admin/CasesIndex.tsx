import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/ui/StatsCard';

export const CasesIndex: React.FC = () => {
  const navigate = useNavigate();
  
  const mockCases = [
    { id: '1', participant: 'John Doe', type: 'Verification Issue', status: 'open', priority: 'high', created: '2 days ago' },
    { id: '2', participant: 'Jane Smith', type: 'Exemption Request', status: 'in-progress', priority: 'medium', created: '1 week ago' },
    { id: '3', participant: 'Bob Johnson', type: 'Document Review', status: 'open', priority: 'low', created: '3 days ago' },
  ];

  const totalCount = mockCases.length;
  const inReviewCount = mockCases.filter(c => c.status === 'in-progress').length;
  const openCount = mockCases.filter(c => c.status === 'open').length;
  const highPriorityCount = mockCases.filter(c => c.priority === 'high').length;

  return (
    <AdminShell>
      <div className="cases-index">
        <div className="page-header">
          <h1>Cases</h1>
          <p>Manage participant cases and issues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <StatsCard
            title="Total Cases"
            value={totalCount}
            subtitle="All time"
          />
          <StatsCard
            title="In Review"
            value={inReviewCount}
            subtitle="Needs attention"
            subtitleClassName="text-warning"
          />
          <StatsCard
            title="Open"
            value={openCount}
            subtitle="Unassigned"
          />
          <StatsCard
            title="High Priority"
            value={highPriorityCount}
            subtitle="Urgent"
            subtitleClassName="text-destructive"
          />
        </div>

        <Card className="cases-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Participant</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td>#{caseItem.id}</td>
                  <td>{caseItem.participant}</td>
                  <td>{caseItem.type}</td>
                  <td>
                    <Badge variant={caseItem.status === 'open' ? 'warning' : 'default'}>
                      {caseItem.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={caseItem.priority === 'high' ? 'destructive' : caseItem.priority === 'medium' ? 'warning' : 'default'}>
                      {caseItem.priority}
                    </Badge>
                  </td>
                  <td>{caseItem.created}</td>
                  <td>
                    <Button variant="secondary" onClick={() => navigate(`/admin/cases/${caseItem.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminShell>
  );
};
