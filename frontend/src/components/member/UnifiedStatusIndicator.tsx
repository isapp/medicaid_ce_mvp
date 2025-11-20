import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'pending' | 'error';

interface UnifiedStatusIndicatorProps {
  status: StatusType;
  title: string;
  description?: string;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: 'var(--color-success)',
    bgColor: 'var(--color-success-light)',
  },
  warning: {
    icon: AlertCircle,
    color: 'var(--color-warning)',
    bgColor: 'var(--color-warning-light)',
  },
  pending: {
    icon: Clock,
    color: 'var(--color-muted-foreground)',
    bgColor: 'var(--color-muted)',
  },
  error: {
    icon: XCircle,
    color: 'var(--color-destructive)',
    bgColor: 'var(--color-destructive-light)',
  },
};

export const UnifiedStatusIndicator: React.FC<UnifiedStatusIndicatorProps> = ({
  status,
  title,
  description,
  className = '',
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div 
      className={`unified-status-indicator ${className}`}
      style={{ backgroundColor: config.bgColor }}
    >
      <div className="unified-status-icon" style={{ color: config.color }}>
        <Icon size={24} />
      </div>
      <div className="unified-status-content">
        <div className="unified-status-title">{title}</div>
        {description && <div className="unified-status-description">{description}</div>}
      </div>
    </div>
  );
};
