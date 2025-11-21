import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { beneficiariesRouter } from '../modules/beneficiaries/beneficiaries.routes';

const router = Router();

/**
 * API Routes - All mounted under /api/v1
 *
 * This file aggregates all module routes and provides
 * a central location for API route configuration.
 *
 * IMPORTANT: The repository uses NAMED exports for routes:
 * - authRouter (not default export)
 * - beneficiariesRouter (not default export)
 */

// Authentication routes
// POST /api/v1/auth/admin/login
router.use('/auth', authRouter);

// Beneficiaries routes
// GET/POST /api/v1/beneficiaries
router.use('/beneficiaries', beneficiariesRouter);

// Uncomment when engagement module routes are created
// import { engagementRouter } from '../modules/engagement/engagement.routes';
// router.use('/engagement', engagementRouter);

// Health check at API level (in addition to root health check)
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: 'v1',
    timestamp: new Date().toISOString(),
    message: 'API is operational'
  });
});

export default router;
