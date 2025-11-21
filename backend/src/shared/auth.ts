import jwt from 'jsonwebtoken';
import { config } from './config';

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
}

/**
 * Generates a signed JWT token with proper claims
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload as object, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer: 'medicaid-ce-mvp',
    audience: 'medicaid-ce-api'
  } as jwt.SignOptions);
}

/**
 * Verifies and decodes a JWT token
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      issuer: 'medicaid-ce-mvp',
      audience: 'medicaid-ce-api'
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Extracts JWT token from Authorization header
 * Supports both "Bearer token" and just "token" formats
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  // Check for "Bearer token" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Return the token as-is if no Bearer prefix
  return authHeader;
}
