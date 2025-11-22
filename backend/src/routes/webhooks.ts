import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../shared/errors';
import { CbvPayrollService, CbvWebhookEvent } from '../integrations/cbv-payroll';

const prisma = new PrismaClient();
const webhooksRouter = Router();

// Initialize CBV service
let cbvService: CbvPayrollService | null = null;

if (process.env.CBV_API_URL && process.env.CBV_API_KEY && process.env.CBV_HMAC_SECRET) {
  cbvService = new CbvPayrollService(
    process.env.CBV_API_URL,
    process.env.CBV_API_KEY,
    process.env.CBV_HMAC_SECRET,
    prisma
  );
}

/**
 * POST /api/v1/webhooks/employment-verification
 *
 * Webhook endpoint for receiving employment verification events
 * from the iv-cbv-payroll service.
 *
 * Headers:
 * - X-IVAAS-SIGNATURE: HMAC-SHA512 signature of the request body
 * - X-IVAAS-TIMESTAMP: Unix timestamp of the request
 *
 * Body: CbvWebhookEvent (JSON)
 */
webhooksRouter.post(
  '/employment-verification',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!cbvService) {
        throw new AppError(
          'SERVICE_UNAVAILABLE',
          'Employment verification service is not configured',
          503
        );
      }

      // Extract headers
      const signature = req.headers['x-ivaas-signature'] as string;
      const timestamp = req.headers['x-ivaas-timestamp'] as string;

      if (!signature || !timestamp) {
        throw new AppError(
          'MISSING_HEADERS',
          'Required webhook headers are missing',
          400
        );
      }

      // Parse webhook payload
      const webhookEvent = req.body as CbvWebhookEvent;

      if (!webhookEvent.event_type || !webhookEvent.cbv_flow_id) {
        throw new AppError(
          'INVALID_PAYLOAD',
          'Webhook payload is missing required fields',
          400
        );
      }

      // Handle webhook (includes signature verification)
      await cbvService.handleWebhook(webhookEvent, signature, timestamp);

      // Respond with 200 OK
      res.status(200).json({
        data: {
          message: 'Webhook received',
          event_type: webhookEvent.event_type
        },
        error: null
      });
    } catch (err) {
      if (err instanceof AppError) {
        // Log failed webhook attempts
        console.error('Webhook processing failed:', {
          error: err.message,
          code: err.code,
          headers: {
            signature: req.headers['x-ivaas-signature'],
            timestamp: req.headers['x-ivaas-timestamp']
          }
        });
        return next(err);
      }

      console.error('Unexpected webhook error:', err);
      return next(new AppError('WEBHOOK_ERROR', 'Failed to process webhook', 500, err));
    }
  }
);

/**
 * GET /api/v1/webhooks/health
 *
 * Health check endpoint for webhook receiver
 */
webhooksRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    data: {
      status: 'ok',
      cbv_service_configured: !!cbvService
    },
    error: null
  });
});

export { webhooksRouter };
