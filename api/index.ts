import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../server/app';
import { ensureSeeded } from '../server/database/seed';

const app = createApp();
let initialization: Promise<void> | undefined;

function initialize(): Promise<void> {
  if (!initialization) {
    initialization = ensureSeeded().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.split('?')[0] || '';
  if (path.endsWith('/api/health')) {
    return res.status(200).json({ ok: true });
  }

  try {
    if (!path.startsWith('/api/auth/')) {
      await initialize();
    }
    return app(req, res);
  } catch (error) {
    console.error('Unable to initialize API', error);
    return res.status(503).json({ error: 'The API is temporarily unavailable.' });
  }
}
