import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const getSession = (req: VercelRequest) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const token = parse(req.headers.cookie || '').luma_session;
  if (!token) return null;
  try {
    return jwt.verify(token, secret, { issuer: 'luma-salon' });
  } catch {
    return null;
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const user = getSession(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.status(200).json({ user });
}
