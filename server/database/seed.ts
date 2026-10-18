import { getDatabase } from './client';
import {
  INITIAL_SETTINGS, INITIAL_BRANCHES, INITIAL_CATEGORIES, INITIAL_SERVICES,
  INITIAL_STAFF, INITIAL_APPOINTMENTS, INITIAL_PACKAGES, INITIAL_PRODUCTS,
  INITIAL_GIFT_CARDS, INITIAL_CUSTOMERS, INITIAL_REVIEWS, INITIAL_FAQS, INITIAL_AUDIT_LOGS
} from '../data/initialData';

export type CollectionName =
  | 'settings' | 'branches' | 'categories' | 'services' | 'staff'
  | 'appointments' | 'packages' | 'products' | 'giftCards' | 'customers'
  | 'reviews' | 'faqs' | 'auditLogs';

export const collectionNames: CollectionName[] = [
  'settings', 'branches', 'categories', 'services', 'staff', 'appointments',
  'packages', 'products', 'giftCards', 'customers', 'reviews', 'faqs', 'auditLogs'
];

const seedData: Record<CollectionName, readonly object[]> = {
  settings: [INITIAL_SETTINGS],
  branches: INITIAL_BRANCHES,
  categories: INITIAL_CATEGORIES,
  services: INITIAL_SERVICES,
  staff: INITIAL_STAFF,
  appointments: INITIAL_APPOINTMENTS,
  packages: INITIAL_PACKAGES,
  products: INITIAL_PRODUCTS,
  giftCards: INITIAL_GIFT_CARDS,
  customers: INITIAL_CUSTOMERS,
  reviews: INITIAL_REVIEWS,
  faqs: INITIAL_FAQS,
  auditLogs: INITIAL_AUDIT_LOGS
};

export async function ensureSeeded(): Promise<void> {
  const database = await getDatabase();
  for (const name of collectionNames) {
    const collection = database.collection<{ _id: string; [key: string]: unknown }>(name);
    if (await collection.countDocuments() > 0) continue;
    const data = seedData[name];
    if (name === 'settings') {
      await collection.insertOne({ _id: 'singleton', ...(data[0] as object) });
    } else if (data.length > 0) {
      await collection.insertMany(data.map((item) => {
        const record = item as { id?: string };
        return { ...item, _id: String(record.id) };
      }));
    }
  }
  for (const name of collectionNames) {
    await database.collection(name).updateMany(
      { $or: [{ image: { $regex: '^/src/assets/images/' } }, { photo: { $regex: '^/src/assets/images/' } }, { avatar: { $regex: '^/src/assets/images/' } }] },
      [
        {
          $set: {
            image: { $replaceOne: { input: '$image', find: '/src/assets/images/', replacement: '/assets/images/' } },
            photo: { $replaceOne: { input: '$photo', find: '/src/assets/images/', replacement: '/assets/images/' } },
            avatar: { $replaceOne: { input: '$avatar', find: '/src/assets/images/', replacement: '/assets/images/' } }
          }
        }
      ]
    );
  }
}
