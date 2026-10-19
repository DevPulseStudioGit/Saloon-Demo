import {
  SalonSettings, Branch, Staff, ServiceCategory, Service, Appointment,
  PackageDeal, RetailProduct, GiftCard, CustomerRecord, Review, FaqItem, AuditLogItem
} from '../types';
import {
  INITIAL_SETTINGS, INITIAL_BRANCHES, INITIAL_CATEGORIES, INITIAL_SERVICES,
  INITIAL_STAFF, INITIAL_APPOINTMENTS, INITIAL_PACKAGES, INITIAL_PRODUCTS,
  INITIAL_GIFT_CARDS, INITIAL_CUSTOMERS, INITIAL_REVIEWS, INITIAL_FAQS, INITIAL_AUDIT_LOGS
} from '../data/initialData';

type DataMap = {
  settings: SalonSettings;
  branches: Branch[];
  categories: ServiceCategory[];
  services: Service[];
  staff: Staff[];
  appointments: Appointment[];
  packages: PackageDeal[];
  products: RetailProduct[];
  giftCards: GiftCard[];
  customers: CustomerRecord[];
  reviews: Review[];
  faqs: FaqItem[];
  auditLogs: AuditLogItem[];
};

const demoDefaults: DataMap = {
  settings: INITIAL_SETTINGS,
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

const defaults: DataMap = demoDefaults;

const cache: DataMap = {
  settings: defaults.settings,
  branches: [...defaults.branches],
  categories: [...defaults.categories],
  services: [...defaults.services],
  staff: [...defaults.staff],
  appointments: [...defaults.appointments],
  packages: [...defaults.packages],
  products: [...defaults.products],
  giftCards: [...defaults.giftCards],
  customers: [...defaults.customers],
  reviews: [...defaults.reviews],
  faqs: [...defaults.faqs],
  auditLogs: [...defaults.auditLogs]
};

const notify = () => window.dispatchEvent(new Event('luma_data_updated'));

async function persist<K extends keyof DataMap>(collection: K, value: DataMap[K]) {
  try {
    const endpoint = collection === 'settings' ? '/api/settings/singleton' : `/api/${collection}`;
    const request = (url: string) => fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
    const readError = async (response: Response) => {
      const body = await response.json().catch(() => null) as { error?: string } | null;
      return body?.error || `API returned ${response.status}`;
    };
    let response = await request(endpoint);
    if (
      response.status === 401 &&
      (collection === 'appointments' || collection === 'customers')
    ) {
      response = await request(`/api/public/${collection}`);
    }
    if (!response.ok) throw new Error(await readError(response));
  } catch (error) {
    console.error(`Failed to persist ${collection} to MongoDB`, error);
    throw error;
  }
}

const hydrateFromServer = async () => {
  const response = await fetch('/api/bootstrap', { credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `API returned ${response.status}`);
  }
  const data = await response.json() as Partial<DataMap>;
    (Object.keys(defaults) as Array<keyof DataMap>).forEach((key) => {
      if (data[key] !== undefined) Object.assign(cache, { [key]: data[key] });
    });
    notify();
};

void hydrateFromServer().catch((error) => console.error('Failed to hydrate salon data from MongoDB', error));

function save<K extends keyof DataMap>(collection: K, value: DataMap[K]) {
  Object.assign(cache, { [collection]: value });
  notify();
  return persist(collection, value);
}

export const StorageService = {
  getSettings: () => cache.settings,
  saveSettings: (value: SalonSettings) => save('settings', value),
  getBranches: () => cache.branches,
  saveBranches: (value: Branch[]) => save('branches', value),
  getCategories: () => cache.categories,
  saveCategories: (value: ServiceCategory[]) => save('categories', value),
  getServices: () => cache.services,
  saveServices: (value: Service[]) => save('services', value),
  getStaff: () => cache.staff,
  saveStaff: (value: Staff[]) => save('staff', value),
  getAppointments: () => cache.appointments,
  saveAppointments: (value: Appointment[]) => save('appointments', value),
  getPackages: () => cache.packages,
  savePackages: (value: PackageDeal[]) => save('packages', value),
  getProducts: () => cache.products,
  saveProducts: (value: RetailProduct[]) => save('products', value),
  getGiftCards: () => cache.giftCards,
  saveGiftCards: (value: GiftCard[]) => save('giftCards', value),
  getCustomers: () => cache.customers,
  saveCustomers: (value: CustomerRecord[]) => save('customers', value),
  getReviews: () => cache.reviews,
  saveReviews: (value: Review[]) => save('reviews', value),
  getFaqs: () => cache.faqs,
  saveFaqs: (value: FaqItem[]) => save('faqs', value),
  getAuditLogs: () => cache.auditLogs,
  refreshFromServer: async () => {
    try {
      await hydrateFromServer();
    } catch (error) {
      console.error('Failed to refresh salon data from MongoDB', error);
    }
  },
  addAuditLog: (user: string, role: string, action: string, details: string) => {
    const log: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(), user, role, action, details
    };
    save('auditLogs', [log, ...cache.auditLogs].slice(0, 300));
  },
  recordCustomerAppointment: (customer: { name: string; phone: string; email: string }, amount: number) => {
    const customers = [...cache.customers];
    const normalizedPhone = customer.phone.replace(/\s+/g, '');
    const existing = customers.find((item) => item.phone.replace(/\s+/g, '') === normalizedPhone);
    if (existing) {
      existing.totalVisits += 1;
      existing.totalSpend += amount;
      existing.lastVisit = new Date().toISOString().split('T')[0];
      if (customer.email && !existing.email) existing.email = customer.email;
    } else {
      customers.push({
        id: `cust-${Date.now()}`, name: customer.name, phone: customer.phone, email: customer.email,
        totalVisits: 1, totalSpend: amount, lastVisit: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
    }
    return save('customers', customers);
  },
  resetAll: () => {
    (Object.keys(defaults) as Array<keyof DataMap>).forEach((key) => save(key, defaults[key]));
  }
};

export function subscribeToStorageChanges(listener: () => void) {
  window.addEventListener('luma_data_updated', listener);
  return () => window.removeEventListener('luma_data_updated', listener);
}
