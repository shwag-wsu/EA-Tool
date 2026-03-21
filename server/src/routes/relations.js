import express from 'express';
import { readCollection, writeCollection } from '../services/fileStore.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const relations = await readCollection('relations');
  res.json(relations);
});

router.post('/', async (req, res) => {
  const relations = await readCollection('relations');
  const payload = req.body || {};

  const relation = {
    id: payload.id || `rel-${Date.now()}`,
    sourceId: payload.sourceId,
    targetId: payload.targetId,
    type: payload.type || 'supports'
  };

  relations.push(relation);
  await writeCollection('relations', relations);
  res.status(201).json(relation);
});

export default router;
