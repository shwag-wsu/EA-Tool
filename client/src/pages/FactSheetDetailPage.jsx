import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function FactSheetDetailPage() {
  const { id } = useParams();
  const [factSheet, setFactSheet] = useState(null);
  const [relations, setRelations] = useState([]);
  const [factSheetsById, setFactSheetsById] = useState({});

  useEffect(() => {
    async function load() {
      const [factSheetResponse, relationResponse, factSheetsResponse] = await Promise.all([
        fetch(`/api/factsheets/${id}`),
        fetch('/api/relations'),
        fetch('/api/factsheets')
      ]);

      const [factSheetData, relationData, factSheetsData] = await Promise.all([
        factSheetResponse.json(),
        relationResponse.json(),
        factSheetsResponse.json()
      ]);

      setFactSheet(factSheetData);
      setRelations(relationData.filter((relation) => relation.sourceId === id || relation.targetId === id));
      setFactSheetsById(
        factSheetsData.reduce((lookup, item) => {
          lookup[item.id] = item;
          return lookup;
        }, {})
      );
    }

    load();
  }, [id]);

  const relatedItems = useMemo(
    () =>
      relations.map((relation) => ({
        ...relation,
        source: factSheetsById[relation.sourceId],
        target: factSheetsById[relation.targetId]
      })),
    [factSheetsById, relations]
  );

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
          <p>
            {factSheet.type}
            {factSheet.subtype ? ` · ${factSheet.subtype}` : ''}
          </p>
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
          {relatedItems.map((relation) => (
            <li key={relation.id}>
              <strong>{relation.type}</strong>: {relation.source?.name || relation.sourceId} →{' '}
              {relation.target?.name || relation.targetId}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
