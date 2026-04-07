import React from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './Topbar.module.css';

export default function Topbar() {
  return (
    <header className={styles.topbarContainer}>
      
      {/* Buscador */}
      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className={styles.searchInput} 
        />
      </div>

      {/* Perfil */}
      <div className={styles.profileContainer}>
        <img 
          src="https://i.pravatar.cc/150?img=47" 
          alt="Avatar del usuario" 
          className={styles.avatar} 
        />
        <span className={styles.userName}>Usuario</span>
      </div>

    </header>
  );
}