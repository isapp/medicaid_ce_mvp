import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { TrendingUp, TrendingDown, Users, CheckCircle } from 'lucide-react';

export const ReportingDashboard: React.FC = () => {
  return (
    <AdminShell>
      <div className="reporting-dashboard">
        <div className="page-header">
          <h1>Reporting</h1>
          <p>Analytics and insights on participant engagement</p>
        </div>

        <div className="reporting-stats">
          <Card className="reporting-stat-card">
            <div className="reporting-stat-header">
              <h3>Compliance Rate</h3>
              <TrendingUp size={20} color="var(--color-success)" />
            </div>
            <div className="reporting-stat-value">80%</div>
            <div className="reporting-stat-change positive">+5% from last month</div>
          </Card>

          <Card className="reporting-stat-card">
            <div className="reporting-stat-header">
              <h3>Active Participants</h3>
              <Users size={20} color="var(--color-primary)" />
            </div>
            <div className="reporting-stat-value">1,234</div>
            <div className="reporting-stat-change positive">+12 from last week</div>
          </Card>

          <Card className="reporting-stat-card">
            <div className="reporting-stat-header">
              <h3>Verifications</h3>
              <CheckCircle size={20} color="var(--color-success)" />
            </div>
            <div className="reporting-stat-value">456</div>
            <div className="reporting-stat-change positive">+23 this week</div>
          </Card>

          <Card className="reporting-stat-card">
            <div className="reporting-stat-header">
              <h3>At Risk</h3>
              <TrendingDown size={20} color="var(--color-destructive)" />
            </div>
            <div className="reporting-stat-value">156</div>
            <div className="reporting-stat-change negative">+8 from last week</div>
          </Card>
        </div>

        <div className="reporting-charts">
          <Card>
            <h2>Engagement Trends</h2>
            <div className="chart-placeholder">
              <p>Chart visualization will be displayed here</p>
            </div>
          </Card>

          <Card>
            <h2>Verification Methods</h2>
            <div className="chart-placeholder">
              <p>Chart visualization will be displayed here</p>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
};
