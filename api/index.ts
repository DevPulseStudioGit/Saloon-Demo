import { createHmac } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../server/app';
import { ensureSeeded } from '../server/database/seed';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'owner';
};

const base64Url = (value: string) => Buffer.from(value).toString('base64url');

function createToken(user: AdminUser, secret: string): string {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    ...user,
    iss: 'luma-salon',
    exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60
  }));
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function readToken(token: string, secret: string): AdminUser | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const expected = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
  if (expected !== parts[2]) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as AdminUser & { exp?: number };
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000) || payload.role !== 'owner') return null;
    return { id: payload.id, name: payload.name, email: payload.email, role: 'owner' };
  } catch {
    return null;
  }
}

function readCookie(req: VercelRequest, name: string): string | undefined {
  const cookies = req.headers.cookie || '';
  const entry = cookies.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

function setSessionCookie(res: VercelResponse, token: string) {
  res.setHeader('Set-Cookie', `luma_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Max-Age=28800; Path=/`);
}

function clearSessionCookie(res: VercelResponse) {
  res.setHeader('Set-Cookie', 'luma_session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/');
}

function handleAuth(req: VercelRequest, res: VercelResponse, action: 'login' | 'session' | 'logout') {
  if (action === 'logout') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    clearSessionCookie(res);
    return res.status(204).end();
  }

  if (action === 'session') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const token = readCookie(req, 'luma_session');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const user = readToken(token, process.env.JWT_SECRET || '');
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    return res.status(200).json({ user });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const jwtSecret = process.env.JWT_SECRET || '';
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!adminEmail || !adminPassword || !jwtSecret) {
    return res.status(503).json({ error: 'Admin credentials are not configured' });
  }
  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const user: AdminUser = { id: 'usr-owner-1', name: 'Luma Atelier Owner', email: adminEmail, role: 'owner' };
  setSessionCookie(res, createToken(user, jwtSecret));
  return res.status(200).json({ user });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestedPath = typeof req.query.path === 'string' ? req.query.path : '';
  const path = requestedPath || req.url?.split('?')[0] || '';
  if (path.endsWith('/api/auth/login')) return handleAuth(req, res, 'login');
  if (path.endsWith('/api/auth/session')) return handleAuth(req, res, 'session');
  if (path.endsWith('/api/auth/logout')) return handleAuth(req, res, 'logout');
  if (path.endsWith('/api/health')) return res.status(200).json({ ok: true });

  try {
    await ensureSeeded();
    if (requestedPath) req.url = requestedPath;
    return createApp()(req, res);
  } catch (error) {
    console.error('Unable to initialize API', error);
    const message = error instanceof Error ? error.message : 'Unknown API initialization error';
    return res.status(503).json({ error: `The API is temporarily unavailable: ${message}` });
  }
}
