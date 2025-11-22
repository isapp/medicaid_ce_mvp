import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { StatsCard } from '../../components/ui/StatsCard';
import { StarButton } from '../../components/admin/StarButton';

export const BroadcastsIndex: React.FC = () => {
  const navigate = useNavigate();
  const [starredIds, setStarredIds] = React.useState<Set<string>>(new Set());

  const mockBroadcasts = [
    { id: '1', title: 'Monthly Reminder', recipients: 1234, status: 'sent', sentAt: '2 days ago' },
    { id: '2', title: 'Deadline Extension Notice', recipients: 156, status: 'scheduled', sentAt: 'Tomorrow at 9:00 AM' },
    { id: '3', title: 'New Requirements Update', recipients: 1234, status: 'draft', sentAt: 'Not sent' },
  ];

  const totalCampaigns = mockBroadcasts.length;
  const sentCount = mockBroadcasts.filter(b => b.status === 'sent').length;
  const totalRecipients = mockBroadcasts.reduce((sum, b) => sum + b.recipients, 0);
  const scheduledCount = mockBroadcasts.filter(b => b.status === 'scheduled').length;

  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <StatsCard
            title="Total Campaigns"
            value={totalCampaigns}
            subtitle="All time"
          />
          <StatsCard
            title="Sent"
            value={sentCount}
            subtitle="Delivered"
            subtitleClassName="text-success"
          />
          <StatsCard
            title="Total Recipients"
            value={totalRecipients}
            subtitle="Messages sent"
          />
          <StatsCard
            title="Scheduled"
            value={scheduledCount}
            subtitle="Upcoming"
            subtitleClassName="text-warning"
          />
        </div>

        <Card className="broadcasts-table">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
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
                  <td>
                    <StarButton
                      isStarred={starredIds.has(broadcast.id)}
                      onToggle={() => toggleStar(broadcast.id)}
                    />
                  </td>
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
