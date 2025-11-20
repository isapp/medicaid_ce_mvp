import React from 'react';
import { Badge } from '../ui/Badge';

export type StatusType = 
  | 'compliant' 
  | 'at-risk' 
  | 'non-compliant' 
  | 'pending'
  | 'open'
  | 'in-progress'
  | 'resolved'
  | 'closed'
  | 'sent'
  | 'scheduled'
  | 'draft';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { variant: 'default' | 'success' | 'warning' | 'destructive'; label: string }> = {
  'compliant': { variant: 'success', label: 'Compliant' },
  'at-risk': { variant: 'warning', label: 'At Risk' },
  'non-compliant': { variant: 'destructive', label: 'Non-Compliant' },
  'pending': { variant: 'default', label: 'Pending' },
  'open': { variant: 'warning', label: 'Open' },
  'in-progress': { variant: 'default', label: 'In Progress' },
  'resolved': { variant: 'success', label: 'Resolved' },
  'closed': { variant: 'default', label: 'Closed' },
  'sent': { variant: 'success', label: 'Sent' },
  'scheduled': { variant: 'default', label: 'Scheduled' },
  'draft': { variant: 'default', label: 'Draft' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
