import { parse, serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'owner';
};

const getUser = (): AdminUser => ({
  id: 'usr-owner-1',
  name: 'Luma Atelier Owner',
  email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  role: 'owner'
});

export function issueSession(res: VercelResponse) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const user = getUser();
  const token = jwt.sign(user, secret, { expiresIn: '8h', issuer: 'luma-salon' });
  res.setHeader('Set-Cookie', serialize('luma_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60,
    path: '/'
  }));
  return user;
}

export function getSession(req: VercelRequest): AdminUser | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const token = parse(req.headers.cookie || '').luma_session;
  if (!token) return null;
  try {
    return jwt.verify(token, secret, { issuer: 'luma-salon' }) as AdminUser;
  } catch {
    return null;
  }
}

export function clearSession(res: VercelResponse) {
  res.setHeader('Set-Cookie', serialize('luma_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  }));
}
