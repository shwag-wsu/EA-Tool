import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../../data');

const seedData = {
  factsheets: [
    {
      id: 'fs-app-crm',
      type: 'Application',
      subtype: 'Business Application',
      name: 'Customer CRM',
      description: 'Central CRM used by sales and support teams.',
      timeModel: 'Invest',
      lifecycle: {
        plan: '2024-01-15',
        phaseIn: '2024-04-01',
        active: '2024-07-01',
        phaseOut: '2028-01-01',
        endOfLife: '2028-12-31'
      },
      owner: 'Sales Operations',
      tags: ['customer', 'core'],
      attributes: {
        vendor: 'Contoso',
        criticality: 'high'
      },
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z'
    },
    {
      id: 'fs-app-billing',
      type: 'Application',
      subtype: 'Business Application',
      name: 'Billing Platform',
      description: 'Handles invoicing and payment reconciliation.',
      timeModel: 'Migrate',
      lifecycle: {
        plan: '2023-08-01',
        phaseIn: '2023-11-01',
        active: '2024-02-01',
        phaseOut: '2027-01-01',
        endOfLife: '2027-12-31'
      },
      owner: 'Finance IT',
      tags: ['finance'],
      attributes: {
        vendor: 'Northwind',
        criticality: 'medium'
      },
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z'
    },
    {
      id: 'fs-cap-order-to-cash',
      type: 'Business Capability',
      subtype: 'Core Capability',
      name: 'Order to Cash',
      description: 'Capability covering order processing through payment collection.',
      timeModel: null,
      lifecycle: {
        plan: '2025-01-01',
        phaseIn: '2025-05-01',
        active: '2025-08-01',
        phaseOut: '2028-06-01',
        endOfLife: '2028-12-31'
      },
      owner: 'Business Architecture',
      tags: ['capability'],
      attributes: {
        domain: 'Revenue',
        priority: '2026'
      },
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z'
    }
  ],
  relations: [
    {
      id: 'rel-crm-billing',
      sourceId: 'fs-app-crm',
      targetId: 'fs-app-billing',
      type: 'interfacesWith'
    },
    {
      id: 'rel-cap-crm',
      sourceId: 'fs-cap-order-to-cash',
      targetId: 'fs-app-crm',
      type: 'supports',
      businessFit: 'Strong'
    }
  ]
};

async function ensureFile(name) {
  const filePath = path.join(dataDir, `${name}.json`);

  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(seedData[name], null, 2));
  }

  return filePath;
}

export async function readCollection(name) {
  const filePath = await ensureFile(name);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content || '[]');
}

export async function writeCollection(name, records) {
  const filePath = await ensureFile(name);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2));
  return records;
}
