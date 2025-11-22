import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

/**
 * API client for employment verification operations
 */

export interface EmploymentActivity {
  id: string;
  beneficiary_id: string;
  employer_name: string;
  hours_worked: number;
  activity_date: string;
  verification_status: 'pending' | 'verified' | 'failed';
  created_at: string;
}

export interface CreateActivityRequest {
  employer_name: string;
  hours_worked: number;
  activity_date: string; // YYYY-MM-DD format
}

export interface InitiateVerificationResponse {
  verification_url: string;
  expires_at: string;
}

export interface VerificationStatusResponse {
  activityId: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationMethod: string | null;
  provider: string | null;
  verificationUrl: string | null;
  verificationData: any;
  webhookReceivedAt: string | null;
}

/**
 * Create a new employment activity
 */
export async function createEmploymentActivity(
  beneficiaryId: string,
  data: CreateActivityRequest,
  token: string
): Promise<EmploymentActivity> {
  const response = await axios.post(
    `${API_BASE_URL}/engagements/beneficiaries/${beneficiaryId}/activities`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data;
}

/**
 * Initiate external verification for an employment activity
 */
export async function initiateVerification(
  activityId: string,
  token: string
): Promise<InitiateVerificationResponse> {
  const response = await axios.post(
    `${API_BASE_URL}/engagements/activities/${activityId}/verify`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data;
}

/**
 * Get verification status for an employment activity
 */
export async function getVerificationStatus(
  activityId: string,
  token: string
): Promise<VerificationStatusResponse> {
  const response = await axios.get(
    `${API_BASE_URL}/engagements/activities/${activityId}/verification-status`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data.data;
}

/**
 * Poll for verification status updates
 *
 * @param activityId - The activity ID to poll
 * @param token - Auth token
 * @param onStatusChange - Callback when status changes
 * @param intervalMs - Polling interval in milliseconds (default: 5000)
 * @returns Function to stop polling
 */
export function pollVerificationStatus(
  activityId: string,
  token: string,
  onStatusChange: (status: VerificationStatusResponse) => void,
  intervalMs: number = 5000
): () => void {
  let lastStatus: string | null = null;
  let isStopped = false;

  const poll = async () => {
    if (isStopped) return;

    try {
      const status = await getVerificationStatus(activityId, token);

      // Only call callback if status actually changed
      if (status.verificationStatus !== lastStatus) {
        lastStatus = status.verificationStatus;
        onStatusChange(status);
      }

      // Continue polling if still pending
      if (status.verificationStatus === 'pending' && !isStopped) {
        setTimeout(poll, intervalMs);
      }
    } catch (error) {
      console.error('Error polling verification status:', error);
      // Retry after interval
      if (!isStopped) {
        setTimeout(poll, intervalMs);
      }
    }
  };

  // Start polling
  poll();

  // Return stop function
  return () => {
    isStopped = true;
  };
}
