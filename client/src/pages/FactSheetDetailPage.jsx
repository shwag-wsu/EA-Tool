import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCurrentLifecyclePhase, lifecyclePhases } from '@ea-tool/shared';

function renderRelationMeta(relation, source, target) {
  const details = [];
  const isCapabilityToApplication =
    (source?.type === 'Business Capability' && target?.type === 'Application') ||
    (source?.type === 'Application' && target?.type === 'Business Capability');
  const isApplicationToItComponent =
    (source?.type === 'Application' && target?.type === 'IT Component') ||
    (source?.type === 'IT Component' && target?.type === 'Application');

  if (isCapabilityToApplication && relation.businessFit) {
    details.push(`Business fit: ${relation.businessFit}`);
  }

  if (isApplicationToItComponent) {
    if (relation.technicalFit) {
      details.push(`Technical fit: ${relation.technicalFit}`);
    }

    if (relation.annualCost) {
      details.push(`Annual cost: ${relation.annualCost}`);
    }
  }

  return details.join(' · ');
}

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

  const currentLifecyclePhase = useMemo(() => getCurrentLifecyclePhase(factSheet?.lifecycle), [factSheet]);

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
        <span className="badge">{currentLifecyclePhase.label}</span>
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
          <h3>TIME Model</h3>
          <p>{factSheet.timeModel || 'Not applicable.'}</p>
        </div>
        <div>
          <h3>Tags</h3>
          <p>{factSheet.tags?.join(', ') || 'No tags assigned.'}</p>
        </div>
        <div>
          <h3>Lifecycle Timeline</h3>
          <ul>
            {lifecyclePhases.map((phase) => (
              <li key={phase.key}>
                <strong>{phase.label}:</strong> {factSheet.lifecycle?.[phase.key] || 'No date assigned.'}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Attributes</h3>
          <pre>{JSON.stringify(factSheet.attributes, null, 2)}</pre>
        </div>
      </div>

      <div>
        <h3>Relations</h3>
        <ul>
          {relatedItems.map((relation) => {
            const relationMeta = renderRelationMeta(relation, relation.source, relation.target);

            return (
              <li key={relation.id}>
                <strong>{relation.type}</strong>: {relation.source?.name || relation.sourceId} →{' '}
                {relation.target?.name || relation.targetId}
                {relationMeta ? <div>{relationMeta}</div> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
