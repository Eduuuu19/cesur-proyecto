import React from 'react';
import { Outlet } from 'react-router-dom'; // Esta es la herramienta mágica
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.layoutWrapper}>
      
      {/* BARRA LATERAL */}
      <Sidebar />
      
      <div className={styles.contentArea}>
        
        {/* BARRA SUPERIOR */}
        <Topbar />
        
        {/* CONTENIDO PRINCIPAL */}
        <main className={styles.mainContent}>
          <Outlet />
        </main>

      </div>
    </div>
  );
}