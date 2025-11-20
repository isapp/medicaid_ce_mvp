import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../shared/errors';
import { getPrismaClient } from '../../shared/db';
import { requireAuth } from '../../shared/middleware';

export const beneficiariesRouter = Router();

beneficiariesRouter.use(requireAuth);

const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'non_compliant', 'exempt', 'unknown']).optional(),
});

const createBeneficiarySchema = z.object({
  medicaidId: z.string().min(1, 'Medicaid ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  engagementStatus: z.enum(['active', 'non_compliant', 'exempt', 'unknown']).optional(),
});

beneficiariesRouter.get('/', async (req, res, next) => {
  try {
    const parsed = querySchema.parse(req.query);
    const page = parseInt(parsed.page || '1', 10);
    const pageSize = Math.min(parseInt(parsed.pageSize || '20', 10), 100);
    const skip = (page - 1) * pageSize;

    const prisma = getPrismaClient();
    const tenantId = req.user!.tenantId;

    const where: any = {
      tenantId,
    };

    if (parsed.status) {
      where.engagementStatus = parsed.status;
    }

    if (parsed.search) {
      where.OR = [
        { firstName: { contains: parsed.search } },
        { lastName: { contains: parsed.search } },
        { medicaidId: { contains: parsed.search } },
        { email: { contains: parsed.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { lastName: 'asc' },
      }),
      prisma.beneficiary.count({ where }),
    ]);

    res.json({
      data: {
        items,
        page,
        pageSize,
        total,
      },
      error: null,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof z.ZodError) {
      return next(new AppError('VALIDATION_ERROR', 'Invalid query parameters', 400, err.errors));
    }
    return next(new AppError('INTERNAL_ERROR', 'Failed to fetch beneficiaries', 500, err));
  }
});

beneficiariesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = getPrismaClient();
    const tenantId = req.user!.tenantId;

    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!beneficiary) {
      throw new AppError('NOT_FOUND', 'Beneficiary not found', 404);
    }

    res.json({
      data: beneficiary,
      error: null,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('INTERNAL_ERROR', 'Failed to fetch beneficiary', 500, err));
  }
});

beneficiariesRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createBeneficiarySchema.parse(req.body);
    const prisma = getPrismaClient();
    const tenantId = req.user!.tenantId;

    const existing = await prisma.beneficiary.findFirst({
      where: {
        tenantId,
        medicaidId: parsed.medicaidId,
      },
    });

    if (existing) {
      throw new AppError('DUPLICATE_MEDICAID_ID', 'A beneficiary with this Medicaid ID already exists', 400);
    }

    const beneficiary = await prisma.beneficiary.create({
      data: {
        ...parsed,
        tenantId,
        engagementStatus: parsed.engagementStatus || 'unknown',
      },
    });

    res.status(201).json({
      data: beneficiary,
      error: null,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof z.ZodError) {
      return next(new AppError('VALIDATION_ERROR', 'Invalid request body', 400, err.errors));
    }
    return next(new AppError('INTERNAL_ERROR', 'Failed to create beneficiary', 500, err));
  }
});
