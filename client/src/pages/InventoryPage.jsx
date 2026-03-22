import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentLifecyclePhase } from '@ea-tool/shared';
import FactSheetForm from '../components/FactSheetForm.jsx';

export default function InventoryPage() {
  const [factSheets, setFactSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFactSheets() {
    setLoading(true);
    const response = await fetch('/api/factsheets');
    const data = await response.json();
    setFactSheets(data);
    setLoading(false);
  }

  useEffect(() => {
    loadFactSheets();
  }, []);

  return (
    <div className="grid layout-columns">
      <section className="panel">
        <div className="panel-header">
          <h2>Inventory</h2>
          <span className="badge">{factSheets.length} fact sheets</span>
        </div>

        {loading ? <p>Loading fact sheets...</p> : null}

        <div className="table-list">
          {factSheets.map((factSheet) => {
            const lifecyclePhase = getCurrentLifecyclePhase(factSheet.lifecycle);

            return (
              <Link key={factSheet.id} className="list-card" to={`/factsheets/${factSheet.id}`}>
                <div>
                  <strong>{factSheet.name}</strong>
                  <p>{factSheet.description || 'No description yet.'}</p>
                </div>
                <div className="meta-column">
                  <span>{factSheet.type}</span>
                  <span>{factSheet.subtype || 'No subtype'}</span>
                  <span>{lifecyclePhase.label}</span>
                  <span>{factSheet.timeModel || 'No TIME model'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <FactSheetForm onCreated={loadFactSheets} />
    </div>
  );
}
