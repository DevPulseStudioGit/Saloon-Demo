import { Router } from 'express';
import { asyncRoute } from '../middleware/errors';
import { requireAdmin } from '../middleware/auth';
import { collectionNames, CollectionName } from '../database/seed';
import { deleteDocument, replaceCollection, replaceDocument } from '../repositories/collectionRepository';

const router = Router();
const isCollection = (value: string): value is CollectionName => collectionNames.includes(value as CollectionName);

router.put('/:collection/:id', requireAdmin, asyncRoute(async (req, res) => {
  const collection = req.params.collection;
  if (!isCollection(collection)) return res.status(404).json({ error: 'Unknown collection' });
  res.json(await replaceDocument(collection, req.params.id, req.body));
}));

router.put('/:collection', requireAdmin, asyncRoute(async (req, res) => {
  const collection = req.params.collection;
  if (!isCollection(collection)) return res.status(404).json({ error: 'Unknown collection' });
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Collection data must be an array' });
  await replaceCollection(collection, req.body);
  res.json({ ok: true });
}));

router.delete('/:collection/:id', requireAdmin, asyncRoute(async (req, res) => {
  const collection = req.params.collection;
  if (!isCollection(collection) || collection === 'settings') {
    return res.status(404).json({ error: 'Unknown or protected collection' });
  }
  await deleteDocument(collection, req.params.id);
  res.status(204).send();
}));

export default router;
