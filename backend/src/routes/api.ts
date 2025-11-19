import { Router } from 'express';
import { beneficiariesRouter } from '../modules/beneficiaries/beneficiaries.routes';
import { engagementsRouter } from '../modules/engagement/engagement.routes';

export const apiRouter = Router();

apiRouter.use('/beneficiaries', beneficiariesRouter);
apiRouter.use('/engagements', engagementsRouter);
