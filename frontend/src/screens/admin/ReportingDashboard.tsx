import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { TrendingUp, TrendingDown, Users, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ReportingDashboard: React.FC = () => {
  const engagementTrendsData = [
    { month: 'Jan', verified: 120, pending: 45, insufficient: 15 },
    { month: 'Feb', verified: 145, pending: 38, insufficient: 12 },
    { month: 'Mar', verified: 168, pending: 42, insufficient: 18 },
    { month: 'Apr', verified: 192, pending: 35, insufficient: 14 },
    { month: 'May', verified: 215, pending: 40, insufficient: 10 },
    { month: 'Jun', verified: 238, pending: 32, insufficient: 8 },
  ];

  const verificationMethodsData = [
    { name: 'Employment', value: 450 },
    { name: 'Education', value: 280 },
    { name: 'Volunteer', value: 180 },
    { name: 'Training', value: 120 },
  ];

  const complianceByOrganizationData = [
    { organization: 'Org A', compliant: 85, nonCompliant: 15 },
    { organization: 'Org B', compliant: 92, nonCompliant: 8 },
    { organization: 'Org C', compliant: 78, nonCompliant: 22 },
    { organization: 'Org D', compliant: 88, nonCompliant: 12 },
    { organization: 'Org E', compliant: 95, nonCompliant: 5 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <AdminShell>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="py-6 space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
              Reporting
            </h1>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground">
              Analytics and insights on participant engagement
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase">
                    Compliance Rate
                  </h6>
                  <TrendingUp size={20} className="text-success" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">80%</p>
                <p className="text-xs font-normal leading-snug text-success">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase">
                    Active Participants
                  </h6>
                  <Users size={20} className="text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">1,234</p>
                <p className="text-xs font-normal leading-snug text-success">+12 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase">
                    Verifications
                  </h6>
                  <CheckCircle size={20} className="text-success" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">456</p>
                <p className="text-xs font-normal leading-snug text-success">+23 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase">
                    At Risk
                  </h6>
                  <TrendingDown size={20} className="text-destructive" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">156</p>
                <p className="text-xs font-normal leading-snug text-destructive">+8 from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-6">
                <h2 className="text-lg font-medium">Engagement Trends</h2>
                <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                  Participant status over time
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} name="Verified" />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                    <Line type="monotone" dataKey="insufficient" stroke="#ef4444" strokeWidth={2} name="Insufficient" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-6">
                <h2 className="text-lg font-medium">Verification Methods</h2>
                <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                  Distribution by verification type
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={verificationMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {verificationMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-6">
                <h2 className="text-lg font-medium">Compliance by Organization</h2>
                <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                  Compliance rates across partner organizations
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={complianceByOrganizationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="organization" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="compliant" fill="#10b981" name="Compliant" />
                    <Bar dataKey="nonCompliant" fill="#ef4444" name="Non-Compliant" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};
