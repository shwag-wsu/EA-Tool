import express from 'express';
import { readCollection, writeCollection } from '../services/fileStore.js';

const router = express.Router();

function buildId(type, name) {
  const slug = `${type}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `fs-${slug || Date.now()}`;
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
    type: payload.type || 'Application',
    name: payload.name || 'Untitled Fact Sheet',
    description: payload.description || '',
    lifecycle: payload.lifecycle || 'planned',
    owner: payload.owner || 'Unassigned',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    attributes: payload.attributes && typeof payload.attributes === 'object' ? payload.attributes : {},
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
    ...factsheets[index],
    ...req.body,
    id: factsheets[index].id,
    updatedAt: new Date().toISOString()
  };

  factsheets[index] = updatedFactSheet;
  await writeCollection('factsheets', factsheets);

  return res.json(updatedFactSheet);
});

export default router;
