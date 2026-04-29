import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FiPieChart,
  FiUsers,
  FiLifeBuoy,
  FiSettings,
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import styles from './Sidebar.module.css';
import logo from '../../assets/logo.png';

export default function AdminSidebar({ isOpen, onClose }) {

  // ESTADO PARA CONTROLAR COLAPSO DE LA BARRA
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // función para cerrar sesión
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('konta_token');
    sessionStorage.removeItem('konta_token');
    navigate('/login');
  };

  // FÓRMULAS DE ESTILO
  const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  const subNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.subNavLink} ${styles.activeLink}` : styles.subNavLink;

  return (
    <>
      {/* capa oscura para móviles */}
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}

      <aside className={`${styles.sidebarContainer} ${isCollapsed ? styles.collapsed : ''} ${isOpen ? styles.mobileOpen : ''}`}>

        <div className={styles.logoContainer}>

          <div className={styles.logoWrapper} onClick={() => navigate('/admin/dashboard')}>
            <img src={logo} alt="Konta Logo" className={styles.logo} />
            {!isCollapsed && <span className={styles.logoText}>Konta</span>}
          </div>

          <button className={styles.toggleBtn} onClick={handleToggleSidebar}>
            <FiMenu size={24} />
          </button>

        </div>

        <nav className={styles.navMenu}>
          {/* 1. Dashboard Admin */}
          <NavLink to="/admin/dashboard" className={navLinkClass}>
            <FiPieChart size={20} className={styles.icon} />
            {!isCollapsed && <span>Panel de Control</span>}
          </NavLink>

          {/* 2. Gestión de Usuarios */}
          <NavLink to="/admin/users" className={navLinkClass}>
            <FiUsers size={20} className={styles.icon} />
            {!isCollapsed && <span>Usuarios</span>}
          </NavLink>

          {/* 3. Centro de Soporte */}
          <NavLink to="/admin/support" className={navLinkClass}>
            <FiLifeBuoy size={20} className={styles.icon} />
            {!isCollapsed && <span>Soporte</span>}
          </NavLink>
        </nav>

        <div className={styles.bottomMenu}>
          <NavLink to="/admin/ajustes" className={navLinkClass}>
            <FiSettings size={20} className={styles.icon} />
            {!isCollapsed && <span>Ajustes</span>}
          </NavLink>

          <Link to="/login" className={styles.navLink} onClick={handleLogout}>
            <FiLogOut size={20} className={styles.icon} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </Link>
        </div>

      </aside>
    </>
  );
}