import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../shared/errors';

export const engagementsRouter = Router();

const createActivitySchema = z.object({
  employer_name: z.string().min(1),
  hours_worked: z.number().nonnegative(),
  activity_date: z.string().min(1)
});

engagementsRouter.post('/beneficiaries/:beneficiaryId/activities', (req, res, next) => {
  try {
    const body = createActivitySchema.parse(req.body);
    const { beneficiaryId } = req.params;

    // TODO: persist to DB and trigger verification if configured
    const activityId = 'placeholder-id';

    res.status(201).json({
      data: {
        id: activityId,
        beneficiary_id: beneficiaryId,
        verification_status: 'pending'
      },
      error: null
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('VALIDATION_ERROR', 'Invalid request body', 400, err));
  }
});
