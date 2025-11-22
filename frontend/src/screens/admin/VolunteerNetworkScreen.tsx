import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Phone, Mail, Users } from 'lucide-react';
import { StatsCard } from '../../components/ui/StatsCard';

export const VolunteerNetworkScreen: React.FC = () => {
  const mockOrganizations = [
    {
      id: '1',
      name: 'Community Food Bank',
      type: 'Food Assistance',
      location: 'Downtown',
      contact: '(555) 123-4567',
      email: 'info@foodbank.org',
      activeParticipants: 12,
      status: 'active',
    },
    {
      id: '2',
      name: 'Local Library System',
      type: 'Education',
      location: 'Multiple Locations',
      contact: '(555) 234-5678',
      email: 'volunteer@library.org',
      activeParticipants: 8,
      status: 'active',
    },
    {
      id: '3',
      name: 'Senior Care Center',
      type: 'Healthcare Support',
      location: 'Westside',
      contact: '(555) 345-6789',
      email: 'volunteers@seniorcare.org',
      activeParticipants: 5,
      status: 'active',
    },
  ];

  const totalOrganizations = mockOrganizations.length;
  const activeOrganizations = mockOrganizations.filter(o => o.status === 'active').length;
  const totalParticipants = mockOrganizations.reduce((sum, o) => sum + o.activeParticipants, 0);
  const avgParticipants = totalOrganizations > 0 ? Math.round(totalParticipants / totalOrganizations) : 0;

  return (
    <AdminShell>
      <div className="volunteer-network-screen">
        <div className="page-header">
          <div>
            <h1>Volunteer Network</h1>
            <p>Manage community service organizations and partnerships</p>
          </div>
          <Button variant="primary">
            <Users size={16} />
            <span>Add Organization</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <StatsCard
            title="Total Organizations"
            value={totalOrganizations}
            subtitle="Active partners"
          />
          <StatsCard
            title="Active"
            value={activeOrganizations}
            subtitle="Currently partnered"
            subtitleClassName="text-success"
          />
          <StatsCard
            title="Total Participants"
            value={totalParticipants}
            subtitle="Across all organizations"
          />
          <StatsCard
            title="Avg per Organization"
            value={avgParticipants}
            subtitle="Participants"
          />
        </div>

        <div className="volunteer-network-grid">
          {mockOrganizations.map((org) => (
            <Card key={org.id} className="volunteer-org-card">
              <div className="org-header">
                <div>
                  <h3>{org.name}</h3>
                  <Badge variant="default">{org.type}</Badge>
                </div>
                <Badge variant="success">{org.status}</Badge>
              </div>

              <div className="org-details">
                <div className="org-detail-item">
                  <MapPin size={16} />
                  <span>{org.location}</span>
                </div>
                <div className="org-detail-item">
                  <Phone size={16} />
                  <span>{org.contact}</span>
                </div>
                <div className="org-detail-item">
                  <Mail size={16} />
                  <span>{org.email}</span>
                </div>
              </div>

              <div className="org-stats">
                <div className="org-stat">
                  <div className="stat-value">{org.activeParticipants}</div>
                  <div className="stat-label">Active Participants</div>
                </div>
              </div>

              <div className="org-actions">
                <Button variant="secondary">View Details</Button>
                <Button variant="secondary">Contact</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminShell>
  );
};
