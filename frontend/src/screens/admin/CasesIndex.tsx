import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CasesIndex: React.FC = () => {
  const mockCases = [
    { id: '1', participant: 'John Doe', type: 'Verification Issue', status: 'open', priority: 'high', created: '2 days ago' },
    { id: '2', participant: 'Jane Smith', type: 'Exemption Request', status: 'in-progress', priority: 'medium', created: '1 week ago' },
    { id: '3', participant: 'Bob Johnson', type: 'Document Review', status: 'open', priority: 'low', created: '3 days ago' },
  ];

  return (
    <AdminShell>
      <div className="cases-index">
        <div className="page-header">
          <h1>Cases</h1>
          <p>Manage participant cases and issues</p>
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
                    <Button variant="secondary">View</Button>
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
