import type { VercelRequest, VercelResponse } from '@vercel/node';
import { issueSession } from './session-utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin credentials are not configured' });
  }
  if (email !== process.env.ADMIN_EMAIL.trim().toLowerCase() || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.status(200).json({ user: issueSession(res) });
}
