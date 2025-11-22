import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { beneficiariesRouter } from '../modules/beneficiaries/beneficiaries.routes';
import { engagementsRouter } from '../modules/engagement/engagement.routes';

export const apiRouter = Router();

// Health check at API level
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: 'v1',
    timestamp: new Date().toISOString(),
    message: 'API is operational'
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/beneficiaries', beneficiariesRouter);
apiRouter.use('/engagements', engagementsRouter);
