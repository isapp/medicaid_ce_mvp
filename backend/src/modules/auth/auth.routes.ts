import { Router } from 'express';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { AppError } from '../../shared/errors';
import { getPrismaClient } from '../../shared/db';
import { generateToken } from '../../shared/auth';
import { normalizePhone, generateOTP } from '../../shared/phone';
import { getSMSProvider } from '../../shared/sms';
import { config } from '../../shared/config';

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


const requestCodeSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
});

authRouter.post('/member/request-code', async (req, res, next) => {
  try {
    const parsed = requestCodeSchema.parse(req.body);
    const prisma = getPrismaClient();
    const smsProvider = getSMSProvider();

    const normalizedPhone = normalizePhone(parsed.phone);
    
    if (normalizedPhone.length < 10) {
      throw new AppError('INVALID_PHONE', 'Invalid phone number', 400);
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.verificationCode.create({
      data: {
        phone: normalizedPhone,
        code,
        expiresAt,
        tenantId: null, // Will be set on verification if needed
      },
    });

    const message = `Your verification code is: ${code}`;
    await smsProvider.sendSMS(normalizedPhone, message);

    const isDemoMode = config.jwtSecret === 'dev-secret-change-in-production';
    
    res.json({
      data: {
        message: 'Verification code sent',
        ...(isDemoMode && { demoCode: code }),
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

const verifyCodeSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

authRouter.post('/member/verify-code', async (req, res, next) => {
  try {
    const parsed = verifyCodeSchema.parse(req.body);
    const prisma = getPrismaClient();

    const normalizedPhone = normalizePhone(parsed.phone);

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        phone: normalizedPhone,
        consumedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verificationCode) {
      throw new AppError('INVALID_CODE', 'Invalid or expired verification code', 401);
    }

    if (verificationCode.expiresAt < new Date()) {
      throw new AppError('EXPIRED_CODE', 'Verification code has expired', 401);
    }

    if (verificationCode.attempts >= 5) {
      throw new AppError('TOO_MANY_ATTEMPTS', 'Too many verification attempts', 401);
    }

    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { attempts: verificationCode.attempts + 1 },
    });

    if (verificationCode.code !== parsed.code) {
      throw new AppError('INVALID_CODE', 'Invalid verification code', 401);
    }

    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { consumedAt: new Date() },
    });

    const tenant = await prisma.tenant.findFirst({
      where: { slug: 'demo-state' },
    });

    if (!tenant) {
      throw new AppError('INTERNAL_ERROR', 'Tenant not found', 500);
    }

    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        tenantId: tenant.id,
        phone: normalizedPhone,
      },
    });

    let user = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        phone: normalizedPhone,
        role: 'member',
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          role: 'member',
          phone: normalizedPhone,
          name: beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : 'Member User',
          isActive: true,
        },
      });
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
          phone: user.phone,
          name: user.name,
          ...(beneficiary && { beneficiaryId: beneficiary.id }),
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
