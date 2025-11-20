import React from 'react';
import { AdminShell } from '../../components/layout/AdminShell';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const SettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('users');

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'data', label: 'Data' },
    { id: 'modules', label: 'Modules' },
    { id: 'system', label: 'System' },
  ];

  return (
    <AdminShell>
      <div className="settings-screen">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Configure system settings and preferences</p>
        </div>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="settings-content">
          {activeTab === 'users' && (
            <div className="settings-section">
              <h2>User Management</h2>
              <p>Manage admin users and permissions</p>
              <div className="settings-form">
                <Button variant="primary">Add New User</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              <p>Configure notification preferences and templates</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <p>Manage authentication and access control</p>
              <div className="settings-form">
                <Input
                  label="Session Timeout (minutes)"
                  type="number"
                  defaultValue="30"
                />
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              <p>Export and manage participant data</p>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="settings-section">
              <h2>Module Configuration</h2>
              <p>Enable or disable system modules</p>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <h2>System Settings</h2>
              <p>General system configuration</p>
            </div>
          )}
        </Card>
      </div>
    </AdminShell>
  );
};
