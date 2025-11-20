import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UnifiedStatusIndicator } from '../../components/member/UnifiedStatusIndicator';
import { Briefcase, GraduationCap, Heart, FileText } from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();

  const mockMember = {
    name: 'John Doe',
    hoursRequired: 80,
    hoursCompleted: 45,
    complianceStatus: 'warning' as const,
    nextDeadline: 'December 31, 2025',
  };

  const verificationOptions = [
    {
      id: 'employment',
      icon: Briefcase,
      title: 'Employment',
      description: 'Verify work hours',
      path: '/m/work',
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Education',
      description: 'Verify school enrollment',
      path: '/m/education',
    },
    {
      id: 'volunteer',
      icon: Heart,
      title: 'Community Service',
      description: 'Verify volunteer hours',
      path: '/m/volunteer',
    },
    {
      id: 'exemption',
      icon: FileText,
      title: 'Request Exemption',
      description: 'Apply for an exemption',
      path: '/m/exemptions',
    },
  ];

  return (
    <ScreenLayout showMenu title="Dashboard">
      <div className="member-dashboard">
        <div className="member-dashboard-header">
          <h2>Welcome back, {mockMember.name}</h2>
        </div>

        <UnifiedStatusIndicator
          status={mockMember.complianceStatus}
          title="Action Needed"
          description={`Complete ${mockMember.hoursRequired - mockMember.hoursCompleted} more hours by ${mockMember.nextDeadline}`}
        />

        <Card className="member-progress-card">
          <h3>Your Progress</h3>
          <div className="member-progress-stats">
            <div className="member-progress-stat">
              <div className="stat-value">{mockMember.hoursCompleted}</div>
              <div className="stat-label">Hours Completed</div>
            </div>
            <div className="member-progress-stat">
              <div className="stat-value">{mockMember.hoursRequired}</div>
              <div className="stat-label">Hours Required</div>
            </div>
            <div className="member-progress-stat">
              <div className="stat-value">
                {Math.round((mockMember.hoursCompleted / mockMember.hoursRequired) * 100)}%
              </div>
              <div className="stat-label">Complete</div>
            </div>
          </div>
          <div className="member-progress-bar">
            <div
              className="member-progress-bar-fill"
              style={{
                width: `${(mockMember.hoursCompleted / mockMember.hoursRequired) * 100}%`,
              }}
            />
          </div>
        </Card>

        <div className="member-verification-options">
          <h3>How would you like to verify?</h3>
          <div className="member-verification-grid">
            {verificationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  className="member-verification-option-wrapper"
                  onClick={() => navigate(option.path)}
                >
                  <Card className="member-verification-option">
                    <div className="verification-option-icon">
                      <Icon size={32} />
                    </div>
                    <div className="verification-option-content">
                      <h4>{option.title}</h4>
                      <p>{option.description}</p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
