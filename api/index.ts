import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: ReturnType<typeof import('../server/app')['createApp']> | undefined;
let initialization: Promise<void> | undefined;

async function initialize(): Promise<void> {
  if (!initialization) {
    initialization = (async () => {
      const [{ createApp }, { ensureSeeded }] = await Promise.all([
        import('../server/app'),
        import('../server/database/seed')
      ]);
      app = createApp();
      await ensureSeeded();
    })().catch((error) => {
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
    await initialize();
    if (!app) throw new Error('API application was not initialized');
    return app(req, res);
  } catch (error) {
    console.error('Unable to initialize API', error);
    return res.status(503).json({ error: 'The API is temporarily unavailable.' });
  }
}
