import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serialize } from 'cookie';

const clearSession = (res: VercelResponse) => {
  res.setHeader('Set-Cookie', serialize('luma_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  }));
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  clearSession(res);
  return res.status(204).end();
}
