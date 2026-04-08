import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/layout/MainLayout'
import DashboardPage from './pages/DashboardPage'
import FacturasEmitidasPage from './pages/FacturasEmitidasPage';
import PresupuestosPage from './pages/PresupuestosPage';
import FacturasRecibidasPage from './pages/FacturasRecibidasPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* RUTAS PRIVADAS*/}
        <Route path="/" element={<MainLayout />}>

          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="/facturas-emitidas" element={<FacturasEmitidasPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route path="/facturas-recibidas" element={<FacturasRecibidasPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App