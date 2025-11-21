import { PrismaClient } from '@prisma/client';
import { config } from './config';

/**
 * Prisma Client Singleton (Compatible with existing repository pattern)
 *
 * This version is compatible with the existing getPrismaClient() pattern
 * but also exports a direct prisma instance for convenience.
 */

let prismaInstance: PrismaClient | null = null;

/**
 * Gets or creates the Prisma Client instance
 * Compatible with existing repository pattern
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: config.isDevelopment
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
      datasources: {
        db: {
          url: config.databaseUrl
        }
      }
    });

    console.log('✅ Prisma Client initialized');
  }
  return prismaInstance;
}

/**
 * Direct export for convenience
 * You can use either:
 * - import { prisma } from './db'  (recommended)
 * - import { getPrismaClient } from './db'; const db = getPrismaClient();
 */
export const prisma = getPrismaClient();

/**
 * Gracefully disconnect from database
 */
export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    console.log('🔌 Prisma Client disconnected');
    prismaInstance = null;
  }
}

/**
 * Graceful shutdown handlers
 * Ensures database connections are properly closed
 */
process.on('SIGINT', async () => {
  console.log('🔌 Disconnecting from database (SIGINT)...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔌 Disconnecting from database (SIGTERM)...');
  await disconnectPrisma();
  process.exit(0);
});
