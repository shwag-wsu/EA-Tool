import express from 'express';
import { normalizeLifecycle, requiresTimeModel } from '@ea-tool/shared';
import { readCollection, writeCollection } from '../services/fileStore.js';

const router = express.Router();

function buildId(type, name) {
  const slug = `${type}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `fs-${slug || Date.now()}`;
}

function normalizeFactSheet(payload = {}, existingFactSheet = {}) {
  const type = payload.type || existingFactSheet.type || 'Application';

  return {
    ...existingFactSheet,
    ...payload,
    type,
    subtype: payload.subtype ?? existingFactSheet.subtype ?? '',
    name: payload.name || existingFactSheet.name || 'Untitled Fact Sheet',
    description: payload.description ?? existingFactSheet.description ?? '',
    lifecycle: normalizeLifecycle(payload.lifecycle ?? existingFactSheet.lifecycle),
    timeModel: requiresTimeModel(type) ? payload.timeModel || existingFactSheet.timeModel || 'Tolerate' : null,
    owner: payload.owner || existingFactSheet.owner || 'Unassigned',
    tags: Array.isArray(payload.tags) ? payload.tags : existingFactSheet.tags || [],
    attributes:
      payload.attributes && typeof payload.attributes === 'object' && !Array.isArray(payload.attributes)
        ? payload.attributes
        : existingFactSheet.attributes || {}
  };
}

router.get('/', async (_req, res) => {
  const factsheets = await readCollection('factsheets');
  res.json(factsheets);
});

router.post('/', async (req, res) => {
  const factsheets = await readCollection('factsheets');
  const now = new Date().toISOString();
  const payload = req.body || {};

  const factSheet = {
    id: payload.id || buildId(payload.type || 'item', payload.name || 'new'),
    ...normalizeFactSheet(payload),
    createdAt: now,
    updatedAt: now
  };

  factsheets.push(factSheet);
  await writeCollection('factsheets', factsheets);
  res.status(201).json(factSheet);
});

router.get('/:id', async (req, res) => {
  const factsheets = await readCollection('factsheets');
  const factSheet = factsheets.find((item) => item.id === req.params.id);

  if (!factSheet) {
    return res.status(404).json({ message: 'Fact sheet not found.' });
  }

  return res.json(factSheet);
});

router.put('/:id', async (req, res) => {
  const factsheets = await readCollection('factsheets');
  const index = factsheets.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Fact sheet not found.' });
  }

  const updatedFactSheet = {
    ...normalizeFactSheet(req.body, factsheets[index]),
    id: factsheets[index].id,
    createdAt: factsheets[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  factsheets[index] = updatedFactSheet;
  await writeCollection('factsheets', factsheets);

  return res.json(updatedFactSheet);
});

export default router;
