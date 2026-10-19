import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let client: MongoClient | undefined;

async function getDatabase() {
  const configuredUri = process.env.MONGODB_URI;
  if (!configuredUri) throw new Error('MONGODB_URI is not configured');
  const mongoUri = configuredUri.includes('<db_password>') && process.env.MONGODB_PASSWORD
    ? configuredUri.replace('<db_password>', encodeURIComponent(process.env.MONGODB_PASSWORD))
    : configuredUri;
  if (!client) client = new MongoClient(mongoUri);
  try {
    await client.connect();
    return client.db(process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'luma_salon');
  } catch (error) {
    await client.close().catch(() => undefined);
    client = undefined;
    throw error;
  }
}

function normalizePhone(value: unknown) {
  return typeof value === 'string' ? value.replace(/\s+/g, '') : '';
}

async function syncCustomers(
  database: Awaited<ReturnType<MongoClient['db']>>,
  appointments: Array<Record<string, unknown>>
) {
  const customers = new Map<string, {
    name: string;
    phone: string;
    email: string;
    totalVisits: number;
    totalSpend: number;
    lastVisit: string;
  }>();

  for (const appointment of appointments) {
    const customer = appointment.customer as {
      name?: unknown;
      phone?: unknown;
      email?: unknown;
    } | undefined;
    const phone = normalizePhone(customer?.phone);
    if (!phone || typeof customer?.name !== 'string') continue;

    const current = customers.get(phone) || {
      name: customer.name,
      phone: typeof customer.phone === 'string' ? customer.phone : phone,
      email: typeof customer.email === 'string' ? customer.email : '',
      totalVisits: 0,
      totalSpend: 0,
      lastVisit: ''
    };
    const pricing = appointment.pricing as { total?: unknown } | undefined;
    const date = typeof appointment.date === 'string' ? appointment.date : '';
    current.totalVisits += 1;
    current.totalSpend += typeof pricing?.total === 'number' ? pricing.total : 0;
    if (date > current.lastVisit) current.lastVisit = date;
    if (!current.email && typeof customer.email === 'string') current.email = customer.email;
    customers.set(phone, current);
  }

  const collection = database.collection('customers');
  for (const customer of customers.values()) {
    const existing = await collection.findOne({ phone: customer.phone });
    const existingRecord = existing || {};
    await collection.replaceOne(
      { _id: existing?._id || `cust-${customer.phone.replace(/\D/g, '')}` },
      {
        ...existingRecord,
        ...customer,
        _id: existing?._id || `cust-${customer.phone.replace(/\D/g, '')}`,
        createdAt: existingRecord.createdAt || new Date().toISOString()
      },
      { upsert: true }
    );
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Appointments must be an array' });
  if (req.body.length > 25) return res.status(413).json({ error: 'Too many appointments in one request' });

  try {
    const database = await getDatabase();
    const collection = database.collection('appointments');
    for (const appointment of req.body as Array<Record<string, unknown>>) {
      const customer = appointment.customer as { phone?: unknown } | undefined;
      if (typeof appointment.id !== 'string' || !customer?.phone) {
        return res.status(400).json({ error: 'Each appointment requires an id and customer phone' });
      }
      const existing = await collection.findOne({ _id: appointment.id });
      const existingCustomer = existing?.customer as { phone?: unknown } | undefined;
      if (existingCustomer && existingCustomer.phone !== customer.phone) {
        return res.status(403).json({ error: 'Appointment ownership could not be verified' });
      }
      await collection.replaceOne({ _id: appointment.id }, { ...appointment, _id: appointment.id }, { upsert: true });
    }
    await syncCustomers(database, req.body as Array<Record<string, unknown>>);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Appointment persistence failed', error);
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return res.status(503).json({ error: `Database unavailable: ${message}` });
  }
}
