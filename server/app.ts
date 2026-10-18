import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import bootstrapRoutes from './routes/bootstrap';
import dataRoutes from './routes/data';
import healthRoutes from './routes/health';
import publicRoutes from './routes/public';
import { errorHandler } from './middleware/errors';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/bootstrap', bootstrapRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api', dataRoutes);
  app.use(errorHandler);
  return app;
}
