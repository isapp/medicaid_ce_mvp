import crypto from 'crypto';
import axios, { AxiosInstance } from 'axios';

/**
 * HTTP Client for iv-cbv-payroll JSON API
 *
 * Handles API authentication, request signing, and error handling
 * for the CBV (Consent-Based Verification) payroll service.
 */
export class CbvPayrollClient {
  private readonly apiClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly hmacSecret: string;

  constructor(
    baseUrl: string,
    apiKey: string,
    hmacSecret: string
  ) {
    this.apiKey = apiKey;
    this.hmacSecret = hmacSecret;

    this.apiClient = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.apiClient.interceptors.request.use(
      (config) => {
        config.headers['Authorization'] = `Bearer ${this.apiKey}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        // Log error details for debugging
        console.error('CBV Payroll API Error:', {
          status,
          message,
          url: error.config?.url,
          method: error.config?.method
        });

        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate HMAC-SHA512 signature for webhook verification
   *
   * @param payload - The webhook payload to sign
   * @returns Hex-encoded HMAC signature
   */
  generateHmacSignature(payload: string): string {
    return crypto
      .createHmac('sha512', this.hmacSecret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Verify HMAC signature from incoming webhook
   *
   * @param payload - The webhook payload
   * @param signature - The signature from X-IVAAS-SIGNATURE header
   * @param timestamp - The timestamp from X-IVAAS-TIMESTAMP header
   * @param maxAge - Maximum age of webhook in seconds (default: 300 = 5 minutes)
   * @returns true if signature is valid, false otherwise
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    timestamp: string,
    maxAge: number = 300
  ): boolean {
    try {
      // Check timestamp to prevent replay attacks
      const webhookTime = parseInt(timestamp, 10);
      const currentTime = Math.floor(Date.now() / 1000);

      if (isNaN(webhookTime) || (currentTime - webhookTime) > maxAge) {
        console.warn('Webhook timestamp is too old or invalid', { timestamp, currentTime });
        return false;
      }

      // Verify signature
      const expectedSignature = this.generateHmacSignature(payload);
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Create an employment verification invitation
   *
   * @param data - Invitation data including applicant metadata
   * @returns Promise with tokenized URL and expiration
   */
  async createInvitation(data: CreateInvitationRequest): Promise<CreateInvitationResponse> {
    try {
      const response = await this.apiClient.post<CreateInvitationResponse>(
        '/api/v1/invitations',
        data
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to create CBV invitation: ${error.response?.data?.message || error.message}`
      );
    }
  }
}

/**
 * Request payload for creating a verification invitation
 */
export interface CreateInvitationRequest {
  agency_partner_metadata: {
    case_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string; // YYYY-MM-DD format
    [key: string]: any; // Additional metadata fields
  };
  language?: 'en' | 'es'; // Default: 'en'
}

/**
 * Response from creating a verification invitation
 */
export interface CreateInvitationResponse {
  tokenized_url: string;
  expiration_date: string; // ISO 8601 datetime
  language: string;
  agency_partner_metadata: Record<string, any>;
}

/**
 * Webhook event payload from CBV service
 */
export interface CbvWebhookEvent {
  event_type: 'verification_started' | 'verification_completed' | 'verification_failed';
  cbv_flow_id: string;
  status: 'pending' | 'verified' | 'failed';
  metadata: {
    case_number: string;
    employers?: Array<{
      name: string;
      income: number;
      period: 'monthly' | 'weekly' | 'biweekly' | 'annual';
      verification_date: string;
    }>;
    error_message?: string;
  };
  created_at: string; // ISO 8601 datetime
}
