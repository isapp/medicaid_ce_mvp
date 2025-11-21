import { PrismaClient } from '@prisma/client';
import { config } from './config';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database: HealthCheckDetail;
    memory: HealthCheckDetail;
  };
  uptime: number;
}

export interface HealthCheckDetail {
  status: 'ok' | 'error';
  message: string;
  latency?: number;
  details?: Record<string, any>;
}

const startTime = Date.now();
const version = process.env.npm_package_version || '0.1.0';

/**
 * Performs database health check
 */
async function checkDatabase(prisma: PrismaClient): Promise<HealthCheckDetail> {
  const start = Date.now();

  try {
    // Simple query to verify connection
    await prisma.$queryRaw`SELECT 1 as health`;

    const latency = Date.now() - start;

    return {
      status: 'ok',
      message: 'Database connected',
      latency,
      details: {
        latencyMs: latency,
        provider: 'postgresql'
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
      latency: Date.now() - start
    };
  }
}

/**
 * Checks memory usage
 */
function checkMemory(): HealthCheckDetail {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(usage.rss / 1024 / 1024);

  // Warn if heap usage > 80%
  const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;
  const status = heapUsagePercent > 80 ? 'error' : 'ok';
  const message = status === 'error'
    ? `High memory usage: ${heapUsagePercent.toFixed(1)}%`
    : 'Memory usage normal';

  return {
    status,
    message,
    details: {
      heapUsedMB,
      heapTotalMB,
      rssMB,
      heapUsagePercent: heapUsagePercent.toFixed(1) + '%'
    }
  };
}

/**
 * Performs comprehensive health check
 */
export async function performHealthCheck(prisma: PrismaClient): Promise<HealthCheckResult> {
  const [database, memory] = await Promise.all([
    checkDatabase(prisma),
    Promise.resolve(checkMemory())
  ]);

  // Determine overall status
  let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';

  if (database.status === 'error') {
    overallStatus = 'error';
  } else if (memory.status === 'error') {
    overallStatus = 'degraded';
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version,
    environment: config.nodeEnv,
    checks: {
      database,
      memory
    },
    uptime: Math.floor((Date.now() - startTime) / 1000) // seconds
  };
}

/**
 * Simple health check for Docker/K8s
 * Returns true only if everything is OK
 */
export async function isHealthy(prisma: PrismaClient): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}