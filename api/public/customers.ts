import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let client: MongoClient | undefined;

async function getCollection() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (!client) client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    return client.db(process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'luma_salon').collection('customers');
  } catch (error) {
    await client.close().catch(() => undefined);
    client = undefined;
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Customers must be an array' });
  if (req.body.length > 25) return res.status(413).json({ error: 'Too many customers in one request' });

  try {
    const collection = await getCollection();
    for (const customer of req.body as Array<Record<string, unknown>>) {
      if (typeof customer.id !== 'string' || !customer.phone) {
        return res.status(400).json({ error: 'Each customer requires an id and phone' });
      }
      await collection.replaceOne({ _id: customer.id }, { ...customer, _id: customer.id }, { upsert: true });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Customer persistence failed', error);
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return res.status(503).json({ error: `Database unavailable: ${message}` });
  }
}
