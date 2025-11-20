import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <AdminShell>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of participant engagement and case management</p>
        </div>

        <div className="dashboard-stats">
          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Users size={24} color="white" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Participants</div>
              <div className="stat-value">1,234</div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-success)' }}>
              <CheckCircle size={24} color="white" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Compliant</div>
              <div className="stat-value">987</div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning)' }}>
              <AlertCircle size={24} color="white" />
            </div>
            <div className="stat-content">
              <div className="stat-label">At Risk</div>
              <div className="stat-value">156</div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--color-destructive)' }}>
              <Briefcase size={24} color="white" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Open Cases</div>
              <div className="stat-value">91</div>
            </div>
          </Card>
        </div>

        <div className="dashboard-content">
          <Card>
            <h2>Recent Activity</h2>
            <p>Activity feed will be displayed here</p>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
};
