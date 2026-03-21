export const factSheetTypes = ["Application", "BusinessCapability", "Interface", "Project"];

export const relationTypes = ["supports", "dependsOn", "interfacesWith", "ownedBy"];

export const factSheetExample = {
  id: "fs-app-crm",
  type: "Application",
  name: "Customer CRM",
  description: "Central CRM used by sales and support teams.",
  lifecycle: "active",
  owner: "Sales Operations",
  tags: ["customer", "core"],
  attributes: {
    vendor: "Contoso",
    criticality: "high"
  },
  createdAt: "2026-03-21T00:00:00.000Z",
  updatedAt: "2026-03-21T00:00:00.000Z"
};

export const relationExample = {
  id: "rel-crm-billing",
  sourceId: "fs-app-crm",
  targetId: "fs-app-billing",
  type: "interfacesWith"
};
