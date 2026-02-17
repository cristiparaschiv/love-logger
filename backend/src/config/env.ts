import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  GEOCODING_API_URL: z.string().url().default('https://nominatim.openstreetmap.org'),
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
  UPLOAD_DIR: z.string().default('./uploads'),
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().default('mailto:admin@localhost'),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const env = validateEnv();
