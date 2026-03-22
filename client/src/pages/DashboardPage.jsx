import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const viewOptions = [
  { value: 'businessCriticality', label: 'Business Criticality' },
  { value: 'timeModel', label: 'TIME Model' },
  { value: 'businessFit', label: 'Business Fit' }
];

const legendConfig = {
  businessCriticality: [
    { key: 'n/a', label: 'n/a', className: 'portfolio-dot criticality-na' },
    { key: 'administrative', label: 'Administrative service', className: 'portfolio-dot criticality-administrative' },
    { key: 'operational', label: 'Business operational', className: 'portfolio-dot criticality-operational' },
    { key: 'business', label: 'Business critical', className: 'portfolio-dot criticality-business' },
    { key: 'mission', label: 'Mission critical', className: 'portfolio-dot criticality-mission' }
  ],
  timeModel: [
    { key: 'Invest', label: 'Invest', className: 'portfolio-dot time-invest' },
    { key: 'Tolerate', label: 'Tolerate', className: 'portfolio-dot time-tolerate' },
    { key: 'Migrate', label: 'Migrate', className: 'portfolio-dot time-migrate' },
    { key: 'Eliminate', label: 'Eliminate', className: 'portfolio-dot time-eliminate' }
  ],
  businessFit: [
    { key: 'Strong', label: 'Strong fit', className: 'portfolio-dot fit-strong' },
    { key: 'Good', label: 'Good fit', className: 'portfolio-dot fit-good' },
    { key: 'Moderate', label: 'Moderate fit', className: 'portfolio-dot fit-moderate' },
    { key: 'Weak', label: 'Weak fit', className: 'portfolio-dot fit-weak' },
    { key: 'Unknown', label: 'Unknown', className: 'portfolio-dot fit-unknown' }
  ]
};

function normalizeBusinessCriticality(value) {
  const normalized = String(value || 'n/a').trim().toLowerCase();

  if (normalized.includes('mission')) {
    return 'mission';
  }

  if (normalized.includes('business operational') || normalized.includes('operational')) {
    return 'operational';
  }

  if (normalized.includes('business')) {
    return 'business';
  }

  if (normalized.includes('administrative')) {
    return 'administrative';
  }

  return 'n/a';
}

function getCardTone(view, app) {
  if (view === 'timeModel') {
    return {
      key: app.timeModel || 'Tolerate',
      className: `application-card tone-${String(app.timeModel || 'Tolerate').toLowerCase()}`
    };
  }

  if (view === 'businessFit') {
    const businessFit = app.businessFit || 'Unknown';

    return {
      key: businessFit,
      className: `application-card tone-fit-${businessFit.toLowerCase()}`
    };
  }

  const criticality = normalizeBusinessCriticality(app.attributes?.criticality);

  return {
    key: criticality,
    className: `application-card tone-criticality-${criticality.replace(/\s+/g, '-')}`
  };
}

function summarizePortfolio(applications) {
  return applications.reduce(
    (summary, app) => {
      const criticality = normalizeBusinessCriticality(app.attributes?.criticality);
      summary[criticality] = (summary[criticality] || 0) + 1;
      return summary;
    },
    { 'n/a': 0, administrative: 0, operational: 0, business: 0, mission: 0 }
  );
}

export default function DashboardPage() {
  const [view, setView] = useState('businessCriticality');
  const [factSheets, setFactSheets] = useState([]);
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [factSheetsResponse, relationsResponse] = await Promise.all([
        fetch('/api/factsheets'),
        fetch('/api/relations')
      ]);

      const [factSheetsData, relationsData] = await Promise.all([
        factSheetsResponse.json(),
        relationsResponse.json()
      ]);

      setFactSheets(factSheetsData);
      setRelations(relationsData);
      setLoading(false);
    }

    load();
  }, []);

  const portfolio = useMemo(() => {
    const applications = factSheets.filter((item) => item.type === 'Application');
    const capabilities = factSheets.filter((item) => item.type === 'Business Capability');
    const appLookup = applications.reduce((lookup, app) => {
      lookup[app.id] = app;
      return lookup;
    }, {});
    const capabilityLookup = capabilities.reduce((lookup, capability) => {
      lookup[capability.id] = { ...capability, applications: [] };
      return lookup;
    }, {});

    for (const relation of relations) {
      const sourceCapability = capabilityLookup[relation.sourceId];
      const targetCapability = capabilityLookup[relation.targetId];
      const sourceApp = appLookup[relation.sourceId];
      const targetApp = appLookup[relation.targetId];

      if (sourceCapability && targetApp) {
        sourceCapability.applications.push({
          ...targetApp,
          businessFit: relation.businessFit || 'Unknown',
          relationId: relation.id
        });
      }

      if (targetCapability && sourceApp) {
        targetCapability.applications.push({
          ...sourceApp,
          businessFit: relation.businessFit || 'Unknown',
          relationId: relation.id
        });
      }
    }

    const mappedAppIds = new Set();
    const capabilityCards = Object.values(capabilityLookup)
      .map((capability) => {
        const dedupedApplications = Array.from(
          new Map(
            capability.applications.map((application) => {
              mappedAppIds.add(application.id);
              return [application.id, application];
            })
          ).values()
        ).sort((left, right) => left.name.localeCompare(right.name));

        return {
          ...capability,
          applications: dedupedApplications
        };
      })
      .filter((capability) => capability.applications.length > 0)
      .sort((left, right) => left.name.localeCompare(right.name));

    const unmappedApplications = applications
      .filter((application) => !mappedAppIds.has(application.id))
      .map((application) => ({ ...application, businessFit: 'Unknown' }))
      .sort((left, right) => left.name.localeCompare(right.name));

    if (unmappedApplications.length > 0) {
      capabilityCards.push({
        id: 'unmapped-applications',
        name: 'Unmapped Applications',
        description: 'Applications without a connected business capability yet.',
        applications: unmappedApplications
      });
    }

    return {
      applications,
      capabilities: capabilityCards,
      summary: summarizePortfolio(applications)
    };
  }, [factSheets, relations]);

  const currentLegend = legendConfig[view];

  return (
    <section className="panel portfolio-panel">
      <div className="panel-header portfolio-header">
        <div>
          <h2>Application Portfolio</h2>
          <p>
            LeanIX-inspired landscape grouped by business capability with TIME and Business Fit shown on each
            application card.
          </p>
        </div>
        <div className="portfolio-summary">
          <span className="badge">{portfolio.applications.length} applications</span>
          <span className="badge">{portfolio.capabilities.length} portfolio groups</span>
        </div>
      </div>

      <div className="portfolio-toolbar">
        <label className="portfolio-control">
          <span>View</span>
          <select value={view} onChange={(event) => setView(event.target.value)}>
            {viewOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="portfolio-stat-strip">
          <div>
            <strong>{portfolio.summary.mission}</strong>
            <span>Mission critical</span>
          </div>
          <div>
            <strong>{portfolio.summary.business}</strong>
            <span>Business critical</span>
          </div>
          <div>
            <strong>{portfolio.summary.operational}</strong>
            <span>Operational</span>
          </div>
        </div>
      </div>

      <div className="portfolio-legend" aria-label="Application portfolio legend">
        {currentLegend.map((item) => (
          <div key={item.key} className="legend-item">
            <span className={item.className} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {loading ? <p>Loading application portfolio...</p> : null}

      <div className="portfolio-grid">
        {portfolio.capabilities.map((capability) => (
          <section key={capability.id} className="portfolio-column">
            <header>
              <h3>{capability.name}</h3>
              <p>{capability.description || 'Business capability grouping for related applications.'}</p>
            </header>
            <div className="application-grid">
              {capability.applications.map((application) => {
                const tone = getCardTone(view, application);

                return (
                  <Link key={application.relationId || application.id} to={`/factsheets/${application.id}`} className={tone.className}>
                    <div className="application-card-header">
                      <span className="application-type">{application.subtype || application.type}</span>
                      <span className="application-view-pill">{currentLegend.find((item) => item.key === tone.key)?.label || tone.key}</span>
                    </div>
                    <div>
                      <strong>{application.name}</strong>
                      <p>{application.owner || 'No owner assigned'}</p>
                    </div>
                    <div className="application-card-meta">
                      <span>
                        <small>TIME</small>
                        <strong>{application.timeModel || 'n/a'}</strong>
                      </span>
                      <span>
                        <small>Business Fit</small>
                        <strong>{application.businessFit || 'Unknown'}</strong>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
