import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env

/**
 * Validates and retrieves a required environment variable
 * @throws Error if the variable is not set
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 */
function getEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Validates JWT secret is strong enough
 */
function validateJWTSecret(secret: string): void {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Allow weak secrets in development only
  if (nodeEnv === 'development' || nodeEnv === 'test') {
    if (secret.length < 16) {
      console.warn('⚠️  WARNING: JWT_SECRET is too short. This is only acceptable in development.');
    }
    return;
  }

  // Strict validation for production
  if (secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters in production. ' +
      'Generate a secure secret with: openssl rand -base64 64'
    );
  }

  // Check for common weak secrets
  const weakSecrets = [
    'secret',
    'dev-secret',
    'dev-secret-change-in-production',
    'test',
    'password',
    '12345'
  ];

  if (weakSecrets.some(weak => secret.toLowerCase().includes(weak))) {
    throw new Error(
      'JWT_SECRET appears to be a weak or default value. ' +
      'Generate a secure secret with: openssl rand -base64 64'
    );
  }
}

/**
 * Validates DATABASE_URL format
 */
function validateDatabaseUrl(url: string): void {
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    throw new Error(
      'DATABASE_URL must be a PostgreSQL connection string starting with postgresql:// or postgres://'
    );
  }
}

// Build and validate configuration
const nodeEnv = getEnv('NODE_ENV', 'development');
const jwtSecret = requireEnv('JWT_SECRET');
const databaseUrl = requireEnv('DATABASE_URL');

// Run validations
validateJWTSecret(jwtSecret);
validateDatabaseUrl(databaseUrl);

/**
 * Application Configuration
 * All values are validated at module load time
 */
export const config = {
  // Environment
  nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',

  // Server
  port: parseInt(getEnv('PORT', '4000'), 10),

  // Database
  databaseUrl,

  // Authentication
  jwtSecret,
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '24h'),

  // CORS
  allowedOrigins: getEnv(
    'ALLOWED_ORIGINS',
    'http://localhost:5173,http://localhost:3000'
  ).split(',').map(origin => origin.trim()),

  // Logging
  logLevel: getEnv('LOG_LEVEL', nodeEnv === 'production' ? 'info' : 'debug'),
};

// Log configuration on startup (but not secrets!)
console.log('⚙️  Configuration loaded:', {
  nodeEnv: config.nodeEnv,
  port: config.port,
  databaseUrl: config.databaseUrl.replace(/:[^:@]+@/, ':***@'), // Hide password
  jwtSecretLength: config.jwtSecret.length,
  allowedOrigins: config.allowedOrigins,
  logLevel: config.logLevel,
});

// Export helper functions for testing
export { requireEnv, getEnv };
