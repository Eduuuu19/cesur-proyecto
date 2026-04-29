import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/molecules/ProtectedRoute';
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/layout/MainLayout'
import DashboardPage from './pages/DashboardPage'
import FacturasEmitidasPage from './pages/FacturasEmitidasPage';
import PresupuestosPage from './pages/PresupuestosPage';
import FacturasRecibidasPage from './pages/FacturasRecibidasPage';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import AjustesPage from './pages/AjustesPage';
import SoportePage from './pages/SoportePage';
import AdminRoute from './components/molecules/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminTicketsPage from './pages/AdminTicketsPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* RUTA DE MODO MANTENIMIENTO */}
        <Route path="/mantenimiento" element={
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Sistema en Mantenimiento 🚧</h1>
            <p>Vuelve más tarde.</p>
          </div>
        } />

        {/* RUTAS DEL ADMINISTRADOR */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="support" element={<AdminTicketsPage />} />
          <Route path="ajustes" element={<AjustesPage />} />
        </Route>

        {/* RUTAS PRIVADAS */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/facturas-emitidas" element={<FacturasEmitidasPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route path="/facturas-recibidas" element={<FacturasRecibidasPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/ajustes" element={<AjustesPage />} />
          <Route path="/soporte" element={<SoportePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App