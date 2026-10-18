import { Collection } from 'mongodb';
import { getDatabase } from '../database/client';
import { CollectionName } from '../database/seed';

export type StoredDocument = { _id: string; [key: string]: unknown };

export async function getCollection(name: CollectionName): Promise<Collection<StoredDocument>> {
  const database = await getDatabase();
  return database.collection<StoredDocument>(name);
}

export async function readCollection(name: CollectionName): Promise<Record<string, unknown>[]> {
  const documents = await (await getCollection(name)).find().toArray();
  return documents.map(({ _id, ...document }) => document);
}

export async function readSingleton(name: CollectionName): Promise<Record<string, unknown>> {
  const document = await (await getCollection(name)).findOne({ _id: 'singleton' });
  if (!document) return {};
  const { _id, ...result } = document;
  return result;
}

export async function replaceDocument(name: CollectionName, id: string, value: Record<string, unknown>) {
  const document = { ...value, _id: name === 'settings' ? 'singleton' : id };
  await (await getCollection(name)).replaceOne({ _id: document._id }, document, { upsert: true });
  const { _id, ...result } = document;
  return result;
}

export async function replaceCollection(name: CollectionName, values: Record<string, unknown>[]) {
  const collection = await getCollection(name);
  await collection.deleteMany({});
  if (name === 'settings') {
    await collection.insertOne({ _id: 'singleton', ...(values[0] || {}) });
  } else if (values.length > 0) {
    await collection.insertMany(values.map((value) => ({ ...value, _id: String(value.id) })));
  }
}

export async function deleteDocument(name: CollectionName, id: string) {
  await (await getCollection(name)).deleteOne({ _id: id });
}
