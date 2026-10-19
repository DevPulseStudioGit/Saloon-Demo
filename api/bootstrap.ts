import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const collections = [
  'settings', 'branches', 'categories', 'services', 'staff', 'appointments',
  'packages', 'products', 'giftCards', 'customers', 'reviews', 'faqs', 'auditLogs'
];

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

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const database = await getDatabase();
    const result: Record<string, unknown> = {};
    for (const name of collections) {
      const documents = await database.collection(name).find().toArray();
      if (name === 'settings') {
        const settings = documents.find((document) => document._id === 'singleton');
        if (!settings) {
          result[name] = {};
        } else {
          const { _id, ...value } = settings;
          result[name] = value;
        }
      } else {
        result[name] = documents.map(({ _id, ...document }) => document);
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Bootstrap API failed', error);
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return res.status(503).json({ error: `Database unavailable: ${message}` });
  }
}
