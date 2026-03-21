export default function DashboardPage() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Dashboard</h2>
      </div>
      <p>This is a simple placeholder dashboard for future KPIs, application landscapes, and lifecycle views.</p>
      <div className="grid two-up">
        <div className="stat-card">
          <strong>Inventory Ready</strong>
          <span>Fact sheets and relations are stored locally in JSON.</span>
        </div>
        <div className="stat-card">
          <strong>Storage Swappable</strong>
          <span>The file store service can be replaced with Cosmos DB later.</span>
        </div>
      </div>
    </section>
  );
}
