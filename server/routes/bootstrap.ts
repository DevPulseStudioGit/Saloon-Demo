import { Router } from 'express';
import { asyncRoute } from '../middleware/errors';
import { collectionNames } from '../database/seed';
import { readCollection, readSingleton } from '../repositories/collectionRepository';

const router = Router();

router.get('/', asyncRoute(async (_req, res) => {
  const result: Record<string, unknown> = {};
  for (const name of collectionNames) {
    result[name] = name === 'settings' ? await readSingleton(name) : await readCollection(name);
  }
  res.json(result);
}));

export default router;
