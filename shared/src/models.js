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

export const factSheetExample = {
  id: 'fs-app-crm',
  type: 'Application',
  subtype: 'Business Application',
  name: 'Customer CRM',
  description: 'Central CRM used by sales and support teams.',
  lifecycle: 'active',
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
  type: 'supports'
};
