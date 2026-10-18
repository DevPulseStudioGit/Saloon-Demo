import { Db, MongoClient } from 'mongodb';
import { env } from '../config/env';

const client = new MongoClient(env.mongoUri);
let database: Db | undefined;

export async function getDatabase(): Promise<Db> {
  if (!database) {
    await client.connect();
    database = client.db(env.databaseName);
  }
  return database;
}

export async function closeDatabase(): Promise<void> {
  await client.close();
  database = undefined;
}
