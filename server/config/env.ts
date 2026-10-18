import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required. Configure it in .env.`);
  return value;
};

const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = required('MONGODB_URI');
const jwtSecret = required('JWT_SECRET');
const adminPassword = required('ADMIN_PASSWORD');

if (isProduction) {
  if (jwtSecret.length < 64) throw new Error('JWT_SECRET must be at least 64 characters in production.');
  if (adminPassword.length < 16) throw new Error('ADMIN_PASSWORD must be at least 16 characters in production.');
  if (mongoUri.startsWith('mongodb://127.0.0.1') || mongoUri.startsWith('mongodb://localhost')) {
    throw new Error('Production must use a managed or remote MongoDB connection.');
  }
}

export const env = {
  mongoUri,
  databaseName: process.env.MONGODB_DB_NAME || 'luma_salon',
  jwtSecret,
  adminPassword,
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@lumaatelier.com').toLowerCase(),
  port: Number(process.env.PORT || 8787),
  isProduction
};
