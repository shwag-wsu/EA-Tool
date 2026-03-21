import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function FactSheetDetailPage() {
  const { id } = useParams();
  const [factSheet, setFactSheet] = useState(null);
  const [relations, setRelations] = useState([]);

  useEffect(() => {
    async function load() {
      const [factSheetResponse, relationResponse] = await Promise.all([
        fetch(`/api/factsheets/${id}`),
        fetch('/api/relations')
      ]);

      const factSheetData = await factSheetResponse.json();
      const relationData = await relationResponse.json();

      setFactSheet(factSheetData);
      setRelations(
        relationData.filter((relation) => relation.sourceId === id || relation.targetId === id)
      );
    }

    load();
  }, [id]);

  if (!factSheet) {
    return <p>Loading fact sheet details...</p>;
  }

  return (
    <section className="panel">
      <Link to="/inventory" className="back-link">
        ← Back to inventory
      </Link>

      <div className="panel-header">
        <div>
          <h2>{factSheet.name}</h2>
          <p>{factSheet.type}</p>
        </div>
        <span className="badge">{factSheet.lifecycle}</span>
      </div>

      <div className="detail-grid">
        <div>
          <h3>Description</h3>
          <p>{factSheet.description || 'No description available.'}</p>
        </div>
        <div>
          <h3>Owner</h3>
          <p>{factSheet.owner}</p>
        </div>
        <div>
          <h3>Tags</h3>
          <p>{factSheet.tags?.join(', ') || 'No tags assigned.'}</p>
        </div>
        <div>
          <h3>Attributes</h3>
          <pre>{JSON.stringify(factSheet.attributes, null, 2)}</pre>
        </div>
      </div>

      <div>
        <h3>Relations</h3>
        <ul>
          {relations.map((relation) => (
            <li key={relation.id}>
              {relation.type}: {relation.sourceId} → {relation.targetId}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
