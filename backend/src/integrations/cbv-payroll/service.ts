import { PrismaClient } from '@prisma/client';
import { CbvPayrollClient, CreateInvitationRequest, CbvWebhookEvent } from './client';
import { AppError } from '../../shared/errors';

/**
 * Service for managing employment verification via CBV Payroll
 *
 * This service coordinates between the medicaid_ce_mvp domain logic
 * and the iv-cbv-payroll external API.
 */
export class CbvPayrollService {
  private client: CbvPayrollClient;
  private prisma: PrismaClient;

  constructor(
    baseUrl: string,
    apiKey: string,
    hmacSecret: string,
    prisma: PrismaClient
  ) {
    this.client = new CbvPayrollClient(baseUrl, apiKey, hmacSecret);
    this.prisma = prisma;
  }

  /**
   * Initiate employment verification for an activity
   *
   * @param activityId - The employment activity ID
   * @param tenantId - The tenant ID (for authorization)
   * @returns Verification URL for the member to complete
   */
  async initiateVerification(
    activityId: string,
    tenantId: string
  ): Promise<{ verificationUrl: string; expiresAt: string }> {
    // Fetch the activity with beneficiary details
    const activity = await this.prisma.employmentActivity.findFirst({
      where: {
        id: activityId,
        tenantId
      },
      include: {
        beneficiary: true
      }
    });

    if (!activity) {
      throw new AppError(
        'ACTIVITY_NOT_FOUND',
        'Employment activity not found',
        404
      );
    }

    if (activity.verificationStatus === 'verified') {
      throw new AppError(
        'ALREADY_VERIFIED',
        'This activity has already been verified',
        400
      );
    }

    // Prepare invitation request
    const invitationRequest: CreateInvitationRequest = {
      agency_partner_metadata: {
        case_number: activityId,
        first_name: activity.beneficiary.firstName,
        last_name: activity.beneficiary.lastName,
        date_of_birth: activity.beneficiary.dateOfBirth || '',
        employer_name: activity.employerName,
        activity_date: activity.activityDate
      },
      language: 'en'
    };

    try {
      // Create invitation via CBV API
      const response = await this.client.createInvitation(invitationRequest);

      // Update activity with verification details
      await this.prisma.employmentActivity.update({
        where: { id: activityId },
        data: {
          verificationStatus: 'pending',
          verificationMethod: 'payroll',
          provider: 'iv-cbv-payroll',
          externalVerificationId: response.tokenized_url.split('/').pop() || null,
          verificationUrl: response.tokenized_url,
          updatedAt: new Date()
        }
      });

      return {
        verificationUrl: response.tokenized_url,
        expiresAt: response.expiration_date
      };
    } catch (error: any) {
      console.error('Error initiating CBV verification:', error);
      throw new AppError(
        'VERIFICATION_INIT_FAILED',
        'Failed to initiate employment verification',
        500,
        error
      );
    }
  }

  /**
   * Handle incoming webhook from CBV service
   *
   * @param webhookPayload - The webhook event data
   * @param signature - HMAC signature from header
   * @param timestamp - Timestamp from header
   */
  async handleWebhook(
    webhookPayload: CbvWebhookEvent,
    signature: string,
    timestamp: string
  ): Promise<void> {
    // Verify webhook signature
    const payloadString = JSON.stringify(webhookPayload);
    const isValid = this.client.verifyWebhookSignature(
      payloadString,
      signature,
      timestamp
    );

    if (!isValid) {
      throw new AppError(
        'INVALID_SIGNATURE',
        'Webhook signature verification failed',
        401
      );
    }

    const { event_type, status, metadata } = webhookPayload;
    const activityId = metadata.case_number;

    // Find the activity
    const activity = await this.prisma.employmentActivity.findUnique({
      where: { id: activityId }
    });

    if (!activity) {
      console.warn(`Webhook received for unknown activity: ${activityId}`);
      return;
    }

    // Update activity based on webhook event
    const updateData: any = {
      verificationData: metadata,
      webhookReceivedAt: new Date(),
      updatedAt: new Date()
    };

    if (event_type === 'verification_completed') {
      updateData.verificationStatus = status === 'verified' ? 'verified' : 'failed';
    } else if (event_type === 'verification_failed') {
      updateData.verificationStatus = 'failed';
    }

    await this.prisma.employmentActivity.update({
      where: { id: activityId },
      data: updateData
    });

    console.info('CBV webhook processed successfully', {
      activityId,
      eventType: event_type,
      status
    });
  }

  /**
   * Get verification status for an activity
   *
   * @param activityId - The employment activity ID
   * @param tenantId - The tenant ID (for authorization)
   * @returns Verification status and details
   */
  async getVerificationStatus(
    activityId: string,
    tenantId: string
  ): Promise<VerificationStatusResponse> {
    const activity = await this.prisma.employmentActivity.findFirst({
      where: {
        id: activityId,
        tenantId
      }
    });

    if (!activity) {
      throw new AppError(
        'ACTIVITY_NOT_FOUND',
        'Employment activity not found',
        404
      );
    }

    return {
      activityId: activity.id,
      verificationStatus: activity.verificationStatus as 'pending' | 'verified' | 'failed',
      verificationMethod: activity.verificationMethod,
      provider: activity.provider,
      verificationUrl: activity.verificationUrl,
      verificationData: activity.verificationData as any,
      webhookReceivedAt: activity.webhookReceivedAt?.toISOString() || null
    };
  }
}

/**
 * Response type for verification status
 */
export interface VerificationStatusResponse {
  activityId: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationMethod: string | null;
  provider: string | null;
  verificationUrl: string | null;
  verificationData: any;
  webhookReceivedAt: string | null;
}
