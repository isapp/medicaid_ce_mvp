import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { beneficiariesRouter } from '../modules/beneficiaries/beneficiaries.routes';
import { engagementsRouter } from '../modules/engagement/engagement.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/beneficiaries', beneficiariesRouter);
apiRouter.use('/engagements', engagementsRouter);
