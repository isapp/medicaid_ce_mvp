export interface Participant {
  id: string;
  medicaidId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'Verified' | 'Insufficient' | 'Pending' | 'Appeals Hold';
  hoursRequired: number;
  hoursCompleted: number;
  verificationDate: string | null;
  lastLogin: string | null;
  caseId: string | null;
  assignedReviewer: string | null;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

export interface Case {
  id: string;
  caseNumber: string;
  participantId: string;
  participantName: string;
  medicaidId: string;
  status: 'New' | 'In Review' | 'Verified' | 'Insufficient' | 'Appeals Hold' | 'Extended';
  priority: 'High' | 'Medium' | 'Low';
  confidence: number; // 0-100
  assignedTo: string | null;
  reviewedBy: string | null;
  submittedDate: string;
  reviewDate: string | null;
  dueDate: string;
  hoursRequired: number;
  hoursSubmitted: number;
  documentsCount: number;
  activityCount: number;
  verificationMethod: 'Employer' | 'Volunteer' | 'Education' | 'Self-Attestation';
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Nonprofit' | 'Religious' | 'Educational' | 'Community' | 'Other';
  ein: string;
  status: 'Active' | 'Inactive' | 'Pending Review' | 'Suspended';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  registeredDate: string;
  lastVerified: string | null;
  participantsCount: number;
  totalHours: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Reminder' | 'Verification' | 'Deadline' | 'Welcome' | 'Custom';
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Paused' | 'Cancelled';
  channels: ('Email' | 'SMS' | 'Portal')[];
  audience: string;
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  subject: string;
  message: string;
  scheduledDate: string | null;
  sentDate: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

export interface Activity {
  id: string;
  type: 'Document Submitted' | 'Case Reviewed' | 'Status Changed' | 'Hours Updated' | 'Note Added' | 'Assigned' | 'Extended';
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: 'Verification Letter' | 'Timesheet' | 'Pay Stub' | 'Other';
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedDate: string;
  reviewedDate: string | null;
  reviewedBy: string | null;
  size: number;
  url: string;
  notes: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Reviewer' | 'Analyst';
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string | null;
  createdAt: string;
}
