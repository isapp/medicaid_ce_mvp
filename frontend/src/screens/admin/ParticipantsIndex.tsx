import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter } from 'lucide-react';

export const ParticipantsIndex: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const mockParticipants = [
    { id: '1', name: 'John Doe', medicaidId: 'MED-001', status: 'compliant', lastActivity: '2 days ago' },
    { id: '2', name: 'Jane Smith', medicaidId: 'MED-002', status: 'at-risk', lastActivity: '1 week ago' },
    { id: '3', name: 'Bob Johnson', medicaidId: 'MED-003', status: 'compliant', lastActivity: '1 day ago' },
  ];

  return (
    <AdminShell>
      <div className="participants-index">
        <div className="page-header">
          <h1>Participants</h1>
          <p>Manage and monitor participant engagement</p>
        </div>

        <Card className="participants-filters">
          <div className="filters-row">
            <div className="search-input">
              <Search size={20} />
              <Input
                type="text"
                placeholder="Search by name or Medicaid ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="secondary">
              <Filter size={16} />
              <span>Filters</span>
            </Button>
          </div>
        </Card>

        <Card className="participants-table">
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
              {mockParticipants.map((participant) => (
                <tr key={participant.id}>
                  <td>{participant.name}</td>
                  <td>{participant.medicaidId}</td>
                  <td>
                    <Badge variant={participant.status === 'compliant' ? 'success' : 'warning'}>
                      {participant.status}
                    </Badge>
                  </td>
                  <td>{participant.lastActivity}</td>
                  <td>
                    <Button variant="secondary" onClick={() => navigate(`/admin/participants/${participant.id}`)}>
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
