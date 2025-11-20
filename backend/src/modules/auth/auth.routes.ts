import { Router } from 'express';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { AppError } from '../../shared/errors';
import { getPrismaClient } from '../../shared/db';
import { generateToken } from '../../shared/auth';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

authRouter.post('/admin/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const prisma = getPrismaClient();

    const user = await prisma.user.findFirst({
      where: {
        email: parsed.email,
        role: { in: ['admin', 'case_worker'] },
        isActive: true,
      },
      include: {
        tenant: true,
      },
    });

    if (!user || !user.password) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(parsed.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email || undefined,
    });

    res.json({
      data: {
        accessToken: token,
        user: {
          id: user.id,
          tenantId: user.tenantId,
          role: user.role,
          email: user.email,
          name: user.name,
        },
      },
      error: null,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof z.ZodError) {
      return next(new AppError('VALIDATION_ERROR', 'Invalid request body', 400, err.errors));
    }
    return next(new AppError('INTERNAL_ERROR', 'Login failed', 500, err));
  }
});
