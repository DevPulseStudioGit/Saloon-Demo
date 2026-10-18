import { Router } from 'express';
import { serialize } from 'cookie';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getAdmin } from '../middleware/auth';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});

function issueSession(res: import('express').Response) {
  const user = { id: 'usr-owner-1', name: 'Luma Atelier Owner', email: env.adminEmail, role: 'owner' as const };
  const token = jwt.sign(user, env.jwtSecret, { expiresIn: '8h', issuer: 'luma-salon' });
  res.setHeader('Set-Cookie', serialize('luma_session', token, {
    httpOnly: true, secure: env.isProduction, sameSite: 'strict', maxAge: 8 * 60 * 60, path: '/'
  }));
  return user;
}

router.post('/login', loginLimiter, (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (email !== env.adminEmail || password !== env.adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ user: issueSession(res) });
});

router.post('/demo', (_req, res) => {
  if (env.isProduction) return res.status(404).json({ error: 'Demo login is disabled in production' });
  res.json({ user: issueSession(res) });
});

router.get('/session', (req, res) => {
  const user = getAdmin(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user });
});

router.post('/logout', (_req, res) => {
  res.setHeader('Set-Cookie', serialize('luma_session', '', {
    httpOnly: true, secure: env.isProduction, sameSite: 'strict', maxAge: 0, path: '/'
  }));
  res.status(204).send();
});

export default router;
