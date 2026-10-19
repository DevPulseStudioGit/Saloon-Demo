import { createHmac } from 'node:crypto';
import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const collectionNames = [
  'settings', 'branches', 'categories', 'services', 'staff', 'appointments',
  'packages', 'products', 'giftCards', 'customers', 'reviews', 'faqs', 'auditLogs'
] as const;

let mongoClient: MongoClient | undefined;
let databasePromise: Promise<ReturnType<MongoClient['db']>> | undefined;

async function getDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is not configured');
  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    databasePromise = undefined;
  }
  if (!databasePromise) {
    databasePromise = mongoClient.connect().then(() => (
      mongoClient!.db(process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'luma_salon')
    ));
  }
  try {
    return await databasePromise;
  } catch (error) {
    await mongoClient.close().catch(() => undefined);
    mongoClient = undefined;
    databasePromise = undefined;
    throw error;
  }
}

async function readBootstrap(res: VercelResponse) {
  const database = await getDatabase();
  const result: Record<string, unknown> = {};
  for (const name of collectionNames) {
    const documents = await database.collection(name).find().toArray();
    result[name] = name === 'settings'
      ? (() => {
          const document = documents.find((item) => item._id === 'singleton');
          if (!document) return {};
          const { _id, ...settings } = document;
          return settings;
        })()
      : documents.map(({ _id, ...document }) => document);
  }
  return res.status(200).json(result);
}

async function writePublicCollection(
  collectionName: 'appointments' | 'customers',
  req: VercelRequest,
  res: VercelResponse
) {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: `${collectionName} must be an array` });
  if (req.body.length > 25) return res.status(413).json({ error: 'Too many records in one request' });
  const collection = (await getDatabase()).collection(collectionName);

  for (const record of req.body as Array<Record<string, unknown>>) {
    const id = typeof record.id === 'string' ? record.id : '';
    const customer = record.customer as { phone?: unknown } | undefined;
    const phone = collectionName === 'appointments' ? customer?.phone : record.phone;
    if (!id || !phone) return res.status(400).json({ error: 'Each record requires an id and phone' });
    const existing = await collection.findOne({ _id: id });
    const existingCustomer = existing?.customer as { phone?: unknown } | undefined;
    if (collectionName === 'appointments' && existingCustomer && existingCustomer.phone !== phone) {
      return res.status(403).json({ error: 'Appointment ownership could not be verified' });
    }
    await collection.replaceOne({ _id: id }, { ...record, _id: id }, { upsert: true });
  }
  return res.status(200).json({ ok: true });
}

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
  const queryPath = Array.isArray(req.query.path) ? req.query.path[0] : req.query.path;
  const requestedPath = typeof queryPath === 'string' ? queryPath : '';
  const rawPath = requestedPath || req.url?.split('?')[0] || '';
  const path = decodeURIComponent(rawPath).split('?')[0].replace(/\/+$/, '');
  if (path.endsWith('/api/auth/login')) return handleAuth(req, res, 'login');
  if (path.endsWith('/api/auth/session')) return handleAuth(req, res, 'session');
  if (path.endsWith('/api/auth/logout')) return handleAuth(req, res, 'logout');
  if (path.endsWith('/api/health')) return res.status(200).json({ ok: true });

  try {
    if (path.includes('/api/bootstrap')) return readBootstrap(res);
    if (path.includes('/api/public/appointments')) {
      return writePublicCollection('appointments', req, res);
    }
    if (path.includes('/api/public/customers')) {
      return writePublicCollection('customers', req, res);
    }
    return res.status(404).json({ error: 'API route not found' });
  } catch (error) {
    console.error('Unable to initialize API', error);
    const message = error instanceof Error ? error.message : 'Unknown API initialization error';
    return res.status(503).json({ error: `The API is temporarily unavailable: ${message}` });
  }
}
