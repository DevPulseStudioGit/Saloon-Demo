import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const issueSession = (res: VercelResponse) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const user = {
    id: 'usr-owner-1',
    name: 'Luma Atelier Owner',
    email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    role: 'owner' as const
  };
  const token = jwt.sign(user, secret, { expiresIn: '8h', issuer: 'luma-salon' });
  res.setHeader('Set-Cookie', serialize('luma_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60,
    path: '/'
  }));
  return user;
};

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
