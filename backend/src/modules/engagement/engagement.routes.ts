import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../shared/errors';
import { CbvPayrollService } from '../../integrations/cbv-payroll';

const prisma = new PrismaClient();

// Initialize CBV service (will be configured via env vars)
let cbvService: CbvPayrollService | null = null;

if (process.env.CBV_API_URL && process.env.CBV_API_KEY && process.env.CBV_HMAC_SECRET) {
  cbvService = new CbvPayrollService(
    process.env.CBV_API_URL,
    process.env.CBV_API_KEY,
    process.env.CBV_HMAC_SECRET,
    prisma
  );
}

export const engagementsRouter = Router();

const createActivitySchema = z.object({
  employer_name: z.string().min(1),
  hours_worked: z.number().nonnegative().max(168),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

/**
 * POST /api/v1/engagements/beneficiaries/:beneficiaryId/activities
 * Create a new employment activity
 */
engagementsRouter.post('/beneficiaries/:beneficiaryId/activities', async (req, res, next) => {
  try {
    const body = createActivitySchema.parse(req.body);
    const { beneficiaryId } = req.params;
    const tenantId = (req as any).user?.tenantId;

    if (!tenantId) {
      throw new AppError('UNAUTHORIZED', 'Tenant ID not found in request', 401);
    }

    // Verify beneficiary exists and belongs to tenant
    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        id: beneficiaryId,
        tenantId
      }
    });

    if (!beneficiary) {
      throw new AppError('BENEFICIARY_NOT_FOUND', 'Beneficiary not found', 404);
    }

    // Create employment activity
    const activity = await prisma.employmentActivity.create({
      data: {
        tenantId,
        beneficiaryId,
        employerName: body.employer_name,
        hoursWorked: body.hours_worked,
        activityDate: body.activity_date,
        verificationStatus: 'pending'
      }
    });

    res.status(201).json({
      data: {
        id: activity.id,
        beneficiary_id: activity.beneficiaryId,
        employer_name: activity.employerName,
        hours_worked: activity.hoursWorked,
        activity_date: activity.activityDate,
        verification_status: activity.verificationStatus,
        created_at: activity.createdAt.toISOString()
      },
      error: null
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('VALIDATION_ERROR', 'Invalid request body', 400, err));
  }
});

/**
 * POST /api/v1/engagements/activities/:activityId/verify
 * Initiate external verification for an employment activity
 */
engagementsRouter.post('/activities/:activityId/verify', async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const tenantId = (req as any).user?.tenantId;

    if (!tenantId) {
      throw new AppError('UNAUTHORIZED', 'Tenant ID not found in request', 401);
    }

    if (!cbvService) {
      throw new AppError(
        'SERVICE_UNAVAILABLE',
        'Employment verification service is not configured',
        503
      );
    }

    // Initiate verification
    const result = await cbvService.initiateVerification(activityId, tenantId);

    res.json({
      data: {
        verification_url: result.verificationUrl,
        expires_at: result.expiresAt
      },
      error: null
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('VERIFICATION_ERROR', 'Failed to initiate verification', 500, err));
  }
});

/**
 * GET /api/v1/engagements/activities/:activityId/verification-status
 * Get verification status for an employment activity
 */
engagementsRouter.get('/activities/:activityId/verification-status', async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const tenantId = (req as any).user?.tenantId;

    if (!tenantId) {
      throw new AppError('UNAUTHORIZED', 'Tenant ID not found in request', 401);
    }

    if (!cbvService) {
      throw new AppError(
        'SERVICE_UNAVAILABLE',
        'Employment verification service is not configured',
        503
      );
    }

    const status = await cbvService.getVerificationStatus(activityId, tenantId);

    res.json({
      data: status,
      error: null
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('VERIFICATION_ERROR', 'Failed to get verification status', 500, err));
  }
});
