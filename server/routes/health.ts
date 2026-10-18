import { Router } from 'express';
import { asyncRoute } from '../middleware/errors';
import { getDatabase } from '../database/client';

const router = Router();

router.get('/', asyncRoute(async (_req, res) => {
  await getDatabase();
  res.json({ ok: true });
}));

export default router;
