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

// Member authentication schemas
const memberRequestCodeSchema = z.object({
  phoneNumber: z.string().min(1, 'Valid phone number required'),
});

const memberVerifyCodeSchema = z.object({
  phoneNumber: z.string().min(1, 'Valid phone number required'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

// Request verification code for member login
authRouter.post('/member/request-code', async (req, res, next) => {
  try {
    const parsed = memberRequestCodeSchema.parse(req.body);
    const prisma = getPrismaClient();

    // Normalize phone number - format as XXX-XXX-XXXX
    const cleanPhone = parsed.phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10
      ? `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
      : parsed.phoneNumber;

    // Find beneficiary by phone number
    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        phone: formattedPhone,
      },
    });

    if (!beneficiary) {
      throw new AppError('NOT_FOUND', 'Phone number not found', 404);
    }

    // For demo: Just return success without actually sending SMS
    // In production, you would integrate with Twilio or similar service here
    res.json({
      data: {
        message: 'Verification code sent',
        // For demo purposes, include the code in response (remove in production!)
        demoCode: '123456',
      },
      error: null,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof z.ZodError) {
      return next(new AppError('VALIDATION_ERROR', 'Invalid request body', 400, err.errors));
    }
    return next(new AppError('INTERNAL_ERROR', 'Failed to send verification code', 500, err));
  }
});

// Verify code and login member
authRouter.post('/member/verify-code', async (req, res, next) => {
  try {
    const parsed = memberVerifyCodeSchema.parse(req.body);
    const prisma = getPrismaClient();

    // Normalize phone number - format as XXX-XXX-XXXX
    const cleanPhone = parsed.phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10
      ? `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
      : parsed.phoneNumber;

    // Find beneficiary by phone number
    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        phone: formattedPhone,
      },
      include: {
        tenant: true,
      },
    });

    if (!beneficiary) {
      throw new AppError('NOT_FOUND', 'Phone number not found', 404);
    }

    // For demo: Accept code "123456" (in production, verify against stored code)
    const trimmedCode = parsed.code.trim();

    if (trimmedCode !== '123456') {
      throw new AppError('INVALID_CODE', 'Invalid verification code', 401);
    }

    const token = generateToken({
      userId: beneficiary.id,
      tenantId: beneficiary.tenantId,
      role: 'member',
      phoneNumber: beneficiary.phone || undefined,
    });

    res.json({
      data: {
        accessToken: token,
        user: {
          id: beneficiary.id,
          tenantId: beneficiary.tenantId,
          role: 'member',
          phoneNumber: beneficiary.phone,
          name: `${beneficiary.firstName} ${beneficiary.lastName}`,
        },
      },
      error: null,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof z.ZodError) {
      return next(new AppError('VALIDATION_ERROR', 'Invalid request body', 400, err.errors));
    }
    return next(new AppError('INTERNAL_ERROR', 'Verification failed', 500, err));
  }
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
