export const factSheetTypes = [
  'Objective',
  'Platform',
  'Initiative',
  'Organization',
  'Business Capability',
  'Business Context',
  'Data Object',
  'Application',
  'Interface',
  'Provider',
  'IT Component',
  'Tech Category',
  'System'
];

export const factSheetSubtypes = {
  Objective: ['Strategic Objective', 'Operational Objective', 'Transformation Objective'],
  Platform: ['Business Platform', 'Technology Platform', 'Integration Platform'],
  Initiative: ['Idea', 'Program', 'Project', 'Epic'],
  Organization: ['Business Unit', 'Region', 'Legal Entity', 'Team', 'Customer'],
  'Business Capability': ['Core Capability', 'Supporting Capability', 'Differentiating Capability'],
  'Business Context': ['Value Stream', 'Customer Journey', 'Process', 'Business Product', 'ESG Capability'],
  'Data Object': ['Master Data', 'Transactional Data', 'Reference Data'],
  Application: ['Business Application', 'AI Agent', 'Microservice'],
  Interface: ['Logical Interface', 'API', 'MCP Server'],
  Provider: ['Strategic Provider', 'Managed Service Provider', 'Cloud Provider'],
  'IT Component': ['SaaS', 'PaaS', 'IaaS', 'Software', 'Hardware', 'Service', 'AI Model'],
  'Tech Category': ['Business Technology', 'Data Technology', 'Integration Technology'],
  System: ['Internal System', 'External System', 'Partner System']
};

export const relationTypes = [
  'supports',
  'affects',
  'owns',
  'improves',
  'associatedWith',
  'uses',
  'runs',
  'transfers',
  'provides',
  'consumes',
  'CRUD',
  'implements',
  'offers',
  'belongsTo',
  'runsOn'
];

export const timeModelOptions = ['Invest', 'Tolerate', 'Migrate', 'Eliminate'];

export const lifecyclePhases = [
  { key: 'plan', label: 'Plan' },
  { key: 'phaseIn', label: 'Phase-In' },
  { key: 'active', label: 'Active' },
  { key: 'phaseOut', label: 'Phase-Out' },
  { key: 'endOfLife', label: 'End-of-Life' }
];

export function createEmptyLifecycle() {
  return lifecyclePhases.reduce((timeline, phase) => ({
    ...timeline,
    [phase.key]: ''
  }), {});
}

export function normalizeLifecycle(lifecycle) {
  if (lifecycle && typeof lifecycle === 'object' && !Array.isArray(lifecycle)) {
    return lifecyclePhases.reduce((timeline, phase) => ({
      ...timeline,
      [phase.key]: lifecycle[phase.key] || ''
    }), {});
  }

  return createEmptyLifecycle();
}

export function getCurrentLifecyclePhase(lifecycle, referenceDate = new Date()) {
  const normalizedLifecycle = normalizeLifecycle(lifecycle);
  const datedPhases = lifecyclePhases
    .map((phase) => ({
      ...phase,
      value: normalizedLifecycle[phase.key],
      date: normalizedLifecycle[phase.key] ? new Date(normalizedLifecycle[phase.key]) : null
    }))
    .filter((phase) => phase.date && !Number.isNaN(phase.date.valueOf()))
    .sort((left, right) => left.date - right.date);

  if (!datedPhases.length) {
    return lifecyclePhases[0];
  }

  let currentPhase = datedPhases[0];

  for (const phase of datedPhases) {
    if (phase.date <= referenceDate) {
      currentPhase = phase;
    }
  }

  return currentPhase;
}

export function requiresTimeModel(type) {
  return type === 'Application' || type === 'IT Component';
}

export const factSheetExample = {
  id: 'fs-app-crm',
  type: 'Application',
  subtype: 'Business Application',
  name: 'Customer CRM',
  description: 'Central CRM used by sales and support teams.',
  timeModel: 'Invest',
  lifecycle: {
    plan: '2025-01-15',
    phaseIn: '2025-04-01',
    active: '2025-07-01',
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
};

export const relationExample = {
  id: 'rel-cap-crm',
  sourceId: 'fs-cap-order-to-cash',
  targetId: 'fs-app-crm',
  type: 'supports',
  businessFit: 'Strong'
};
