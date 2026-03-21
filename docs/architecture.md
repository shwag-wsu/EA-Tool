# Architecture Notes

## Current local-first scaffold
- `client/` contains a small React + Vite UI with routing for dashboard, inventory, and fact sheet details.
- `server/` exposes a simple Express API with JSON-file persistence.
- `shared/` contains plain JavaScript model examples and reusable constants.
- `data/` stores seed data and serves as the persistence boundary for local runs.

## Why this stays lightweight
- Plain JavaScript only for quick iteration.
- File-based storage behind `fileStore` so the API layer stays simple to migrate.
- Minimal frontend state handled with `fetch` and React hooks.

## Future swap to Cosmos DB
1. Replace the `fileStore` service implementation with a Cosmos-backed service.
2. Keep route contracts stable so the React client does not need major changes.
3. Move seed data into provisioning or migration scripts when remote storage is added.
