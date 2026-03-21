# EA Tool

LeanIX-inspired lightweight enterprise architecture tool designed to run locally with a simple Node-based scaffold.

## Structure
- `client/` — React + Vite frontend
- `server/` — Node + Express backend
- `shared/` — shared constants and model definitions
- `data/` — JSON persistence and seed data
- `docs/` — architecture notes

## Features in this scaffold
- Inventory page listing fact sheets from the API
- Create fact sheet form
- Fact sheet detail view with related relations
- Placeholder dashboard page
- JSON file persistence with automatic data file initialization
- Shared fact sheet and relation model examples

## Getting started
### 1. Install dependencies
```bash
npm install
```

### 2. Run both client and server
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Individual commands
```bash
npm run dev:client
npm run dev:server
npm run build
npm run start
```

## API routes
- `GET /api/health`
- `GET /api/factsheets`
- `POST /api/factsheets`
- `GET /api/factsheets/:id`
- `PUT /api/factsheets/:id`
- `GET /api/relations`
- `POST /api/relations`

## Notes
- Data is stored in `data/factsheets.json` and `data/relations.json`.
- The `server/src/services/fileStore.js` module is the only persistence layer, making it easier to replace with Cosmos DB later.
- The project intentionally uses plain JavaScript for a small, readable starting point.
