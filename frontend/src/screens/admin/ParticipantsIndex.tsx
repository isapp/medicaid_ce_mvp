import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Users } from 'lucide-react';
import { StatusBadge, StatusType } from '../../components/admin/StatusBadge';
import { beneficiariesService } from '../../api/services/beneficiaries';
import { StatsCard } from '../../components/ui/StatsCard';
import { EmptyState } from '../../components/ui/EmptyState';

const mapEngagementStatusToStatusBadge = (engagementStatus: string): StatusType => {
  switch (engagementStatus) {
    case 'active':
      return 'compliant';
    case 'non_compliant':
      return 'non-compliant';
    case 'exempt':
      return 'compliant';
    case 'unknown':
      return 'pending';
    default:
      return 'pending';
  }
};

export const ParticipantsIndex: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['beneficiaries', { search: debouncedSearch }],
    queryFn: () => beneficiariesService.list({ search: debouncedSearch || undefined }),
  });

  const totalCount = data?.total || 0;
  const verifiedCount = data?.items.filter(b => b.engagementStatus === 'active').length || 0;
  const pendingCount = data?.items.filter(b => b.engagementStatus === 'unknown').length || 0;
  const atRiskCount = data?.items.filter(b => b.engagementStatus === 'non_compliant').length || 0;

  return (
    <AdminShell>
      <div className="participants-index">
        <div className="page-header">
          <h1>Participants</h1>
          <p>Manage and monitor participant engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <StatsCard
            title="Total Participants"
            value={totalCount}
            subtitle="All time"
          />
          <StatsCard
            title="Verified"
            value={verifiedCount}
            subtitle="Compliant"
            subtitleClassName="text-success"
          />
          <StatsCard
            title="Pending Review"
            value={pendingCount}
            subtitle="Needs attention"
            subtitleClassName="text-warning"
          />
          <StatsCard
            title="At Risk"
            value={atRiskCount}
            subtitle="Non-compliant"
            subtitleClassName="text-destructive"
          />
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
          {isLoading && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Loading participants...
            </div>
          )}
          
          {error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
              Error loading participants: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          )}
          
          {data && (
            <>
              {data.items.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No participants found"
                  description={searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first participant"}
                />
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Medicaid ID</th>
                        <th>Status</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((beneficiary) => (
                        <tr key={beneficiary.id}>
                          <td>{beneficiary.firstName} {beneficiary.lastName}</td>
                          <td>{beneficiary.medicaidId}</td>
                          <td>
                            <StatusBadge status={mapEngagementStatusToStatusBadge(beneficiary.engagementStatus)} />
                          </td>
                          <td>{beneficiary.phone || 'N/A'}</td>
                          <td>
                            <Button variant="secondary" onClick={() => navigate(`/admin/participants/${beneficiary.id}`)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.total > 0 && (
                    <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                      Showing {data.items.length} of {data.total} participants
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Card>
      </div>
    </AdminShell>
  );
};
