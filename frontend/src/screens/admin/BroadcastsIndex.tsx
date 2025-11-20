import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';

export const BroadcastsIndex: React.FC = () => {
  const navigate = useNavigate();

  const mockBroadcasts = [
    { id: '1', title: 'Monthly Reminder', recipients: 1234, status: 'sent', sentAt: '2 days ago' },
    { id: '2', title: 'Deadline Extension Notice', recipients: 156, status: 'scheduled', sentAt: 'Tomorrow at 9:00 AM' },
    { id: '3', title: 'New Requirements Update', recipients: 1234, status: 'draft', sentAt: 'Not sent' },
  ];

  return (
    <AdminShell>
      <div className="broadcasts-index">
        <div className="page-header">
          <div>
            <h1>Broadcasts</h1>
            <p>Send messages to participants</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/admin/broadcasts/new')}>
            <Plus size={16} />
            <span>New Broadcast</span>
          </Button>
        </div>

        <Card className="broadcasts-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Recipients</th>
                <th>Status</th>
                <th>Sent At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBroadcasts.map((broadcast) => (
                <tr key={broadcast.id}>
                  <td>{broadcast.title}</td>
                  <td>{broadcast.recipients}</td>
                  <td>
                    <StatusBadge status={broadcast.status as any} />
                  </td>
                  <td>{broadcast.sentAt}</td>
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
