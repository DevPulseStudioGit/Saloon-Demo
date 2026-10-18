import { NextFunction, Request, Response } from 'express';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type AdminUser = { id: string; name: string; email: string; role: 'owner' };

export function getAdmin(req: Request): AdminUser | null {
  const token = parse(req.headers.cookie || '').luma_session;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload & Partial<AdminUser>;
    if (payload.role !== 'owner' || !payload.id || !payload.email || !payload.name) return null;
    return { id: String(payload.id), name: String(payload.name), email: String(payload.email), role: 'owner' };
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const admin = getAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Authentication required' });
  res.locals.admin = admin;
  next();
}
