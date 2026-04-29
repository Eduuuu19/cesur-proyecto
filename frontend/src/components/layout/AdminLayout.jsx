import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={styles.layoutWrapper}>
      
      {/* BARRA LATERAL */}
      <AdminSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className={styles.contentArea}>
        
        {/* BARRA SUPERIOR */}
        <AdminTopbar 
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