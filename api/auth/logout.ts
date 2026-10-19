import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearSession } from './session-utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  clearSession(res);
  return res.status(204).end();
}
