import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../shared/errors';

export const beneficiariesRouter = Router();

const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  search: z.string().optional()
});

beneficiariesRouter.get('/', (req, res, next) => {
  try {
    const parsed = querySchema.parse(req.query);
    const page = parseInt(parsed.page || '1', 10);
    const pageSize = parseInt(parsed.pageSize || '20', 10);

    // TODO: replace with real DB query
    const items: unknown[] = [];

    res.json({
      data: {
        items,
        page,
        pageSize,
        total: 0
      },
      error: null
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('VALIDATION_ERROR', 'Invalid query parameters', 400, err));
  }
});
