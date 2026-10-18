import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSession } from './_session';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const user = getSession(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.status(200).json({ user });
}
