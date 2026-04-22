import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={styles.layoutWrapper}>
      
      {/* BARRA LATERAL */}
      <Sidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className={styles.contentArea}>
        
        {/* BARRA SUPERIOR */}
        <Topbar 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        {/* CONTENIDO PRINCIPAL */}
        <main className={styles.mainContent}>
          <Outlet />
        </main>

      </div>
    </div>
  );
}