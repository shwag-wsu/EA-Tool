# EA Tool

LeanIX-inspired lightweight enterprise architecture tool designed to run locally and on Azure free tier.

## Goals
- Fact sheet-centric EA inventory
- Configurable meta model
- Relationship graph
- Plug-in dashboards
- Local-first development with Azure-friendly deployment

## Planned stack
- React + TypeScript frontend
- Azure Functions API
- Cosmos DB document model
- Shared TypeScript domain package

## Repo layout
- `apps/web` — UI
- `apps/api` — Azure Functions backend
- `packages/domain` — shared types and meta model helpers
- `docs` — architecture and design docs

## Next milestones
1. Monorepo scaffold
2. Shared meta model package
3. Fact sheet CRUD API
4. Inventory UI
5. Dashboard plugin host
