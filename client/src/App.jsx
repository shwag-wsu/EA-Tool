import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import FactSheetDetailPage from './pages/FactSheetDetailPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>EA Tool</h1>
        <p>LeanIX-inspired local architecture inventory.</p>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/factsheets/:id" element={<FactSheetDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
