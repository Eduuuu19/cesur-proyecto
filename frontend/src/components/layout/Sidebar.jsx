import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FiPieChart,
  FiDatabase,
  FiTrendingUp,
  FiTrendingDown,
  FiHeadphones,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiMenu
} from 'react-icons/fi';
import styles from './Sidebar.module.css';
import logo from '../../assets/logo.png';

export default function Sidebar() {
  // ESTADOS PARA CONTROLAR LOS ACORDEONES
  const [isMaestrosOpen, setIsMaestrosOpen] = useState(false);
  const [isIngresosOpen, setIsIngresosOpen] = useState(false);

  // ESTADO PARA CONTROLAR COLAPSO DE LA BARRA
  const [isCollapsed, setIsCollapsed] = useState(false);

  // funcion para cerrar los acordeones al colapsar la barra
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setIsMaestrosOpen(false);
      setIsIngresosOpen(false);
    }
  };

  // funciones para abrir la barra si se hace click en un acordeón estando colapsada
  const handleMaestrosClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false); // Abrimos la barra entera
      setIsMaestrosOpen(true); // Y abrimos el acordeón
    } else {
      setIsMaestrosOpen(!isMaestrosOpen);
    }
  };

  const handleIngresosClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsIngresosOpen(true);
    } else {
      setIsIngresosOpen(!isIngresosOpen);
    }
  };

  // FÓRMULAS DE ESTILO
  const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  const subNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.subNavLink} ${styles.activeLink}` : styles.subNavLink;

  return (
    <aside className={`${styles.sidebarContainer} ${isCollapsed ? styles.collapsed : ''}`}>

      <div className={styles.logoContainer}>

        <div className={styles.logoWrapper}>
          <img src={logo} alt="Konta Logo" className={styles.logo} />
          {!isCollapsed && <span className={styles.logoText}>Konta</span>}
        </div>
        
        <button className={styles.toggleBtn} onClick={handleToggleSidebar}>
          <FiMenu size={24} />
        </button>
        
      </div>

      <nav className={styles.navMenu}>
        <NavLink to="/dashboard" className={navLinkClass}>
          <FiPieChart size={20} className={styles.icon} />
          {!isCollapsed && <span>Panel de Control</span>}
        </NavLink>

        {/* --- ACORDEÓN: MAESTROS --- */}
        <button className={`${styles.navButton} ${styles.navLink}`} onClick={handleMaestrosClick}>
          <div className={styles.navButtonLeft}>
            <FiDatabase size={20} className={styles.icon} />
            {!isCollapsed && <span>Maestros</span>}
          </div>
          {!isCollapsed && (isMaestrosOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />)}
        </button>

        {!isCollapsed && isMaestrosOpen && (
          <div className={styles.subMenu}>
            <NavLink to="/clientes" className={subNavLinkClass}>Clientes</NavLink>
            <NavLink to="/proveedores" className={subNavLinkClass}>Proveedores</NavLink>
          </div>
        )}

        {/* --- ACORDEÓN: INGRESOS --- */}
        <button className={`${styles.navButton} ${styles.navLink}`} onClick={handleIngresosClick}>
          <div className={styles.navButtonLeft}>
            <FiTrendingUp size={20} className={styles.icon} />
            {!isCollapsed && <span>Ingresos</span>}
          </div>
          {!isCollapsed && (isIngresosOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />)}
        </button>

        {!isCollapsed && isIngresosOpen && (
          <div className={styles.subMenu}>
            <NavLink to="/presupuestos" className={subNavLinkClass}>Presupuestos</NavLink>
            <NavLink to="/facturas-emitidas" className={subNavLinkClass}>Facturas Emitidas</NavLink>
          </div>
        )}

        {/* --- RESTO DE ENLACES --- */}
        <NavLink to="/facturas-recibidas" className={navLinkClass}>
          <FiTrendingDown size={20} className={styles.icon} />
          {!isCollapsed && <span>Gastos</span>}
        </NavLink>

        <NavLink to="/soporte" className={navLinkClass}>
          <FiHeadphones size={20} className={styles.icon} />
          {!isCollapsed && <span>Soporte</span>}
        </NavLink>
      </nav>

      <div className={styles.bottomMenu}>
        <NavLink to="/ajustes" className={navLinkClass}>
          <FiSettings size={20} className={styles.icon} />
          {!isCollapsed && <span>Ajustes</span>}
        </NavLink>
        
        <Link to="/login" className={styles.navLink}>
          <FiLogOut size={20} className={styles.icon} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </Link>
      </div>

    </aside>
  );
}