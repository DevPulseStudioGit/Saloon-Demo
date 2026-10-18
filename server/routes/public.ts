import { Router } from 'express';
import { asyncRoute } from '../middleware/errors';
import { getCollection } from '../repositories/collectionRepository';
import rateLimit from 'express-rate-limit';

const router = Router();
type PublicRecord = { id?: unknown; phone?: unknown; customer?: { phone?: unknown } };
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many booking requests. Try again later.' }
});

router.use(publicWriteLimiter);

router.put('/appointments', asyncRoute(async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Appointments must be an array' });
  if (req.body.length > 25) return res.status(413).json({ error: 'Too many appointments in one request' });
  const collection = await getCollection('appointments');
  for (const appointment of req.body as PublicRecord[]) {
    if (!appointment || typeof appointment.id !== 'string' || !appointment.customer?.phone) {
      return res.status(400).json({ error: 'Each appointment requires an id and customer phone' });
    }
    if (appointment.id.length > 100 || String(appointment.customer.phone).length > 40) {
      return res.status(400).json({ error: 'Appointment fields exceed allowed limits' });
    }
    const existing = await collection.findOne({ _id: appointment.id });
    const existingCustomer = existing?.customer as { phone?: unknown } | undefined;
    if (existingCustomer && existingCustomer.phone !== appointment.customer.phone) {
      return res.status(403).json({ error: 'Appointment ownership could not be verified' });
    }
    await collection.replaceOne({ _id: appointment.id }, { ...appointment, _id: appointment.id }, { upsert: true });
  }
  res.json({ ok: true });
}));

router.put('/customers', asyncRoute(async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Customers must be an array' });
  if (req.body.length > 25) return res.status(413).json({ error: 'Too many customers in one request' });
  const collection = await getCollection('customers');
  for (const customer of req.body as PublicRecord[]) {
    if (!customer || typeof customer.id !== 'string' || !customer.phone) {
      return res.status(400).json({ error: 'Each customer requires an id and phone' });
    }
    if (customer.id.length > 100 || String(customer.phone).length > 40) {
      return res.status(400).json({ error: 'Customer fields exceed allowed limits' });
    }
    await collection.replaceOne({ _id: customer.id }, { ...customer, _id: customer.id }, { upsert: true });
  }
  res.json({ ok: true });
}));

export default router;
