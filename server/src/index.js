import express from 'express';
import factsheetRoutes from './routes/factsheets.js';
import relationRoutes from './routes/relations.js';
import { readCollection } from './services/fileStore.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const factsheets = await readCollection('factsheets');
  const relations = await readCollection('relations');

  res.json({
    status: 'ok',
    factsheets: factsheets.length,
    relations: relations.length
  });
});

app.use('/api/factsheets', factsheetRoutes);
app.use('/api/relations', relationRoutes);

app.listen(port, () => {
  console.log(`EA Tool server listening on http://localhost:${port}`);
});
