import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiUserCheck, FiUserX, 
  FiLifeBuoy, FiAlertCircle, FiCheckCircle 
} from 'react-icons/fi';
import styles from './AdminDashboardPage.module.css';
import api from '../services/axiosConfig';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las estadísticas del admin:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando estadísticas del servidor...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>Error 500: No se pudieron cargar los datos del servidor.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Panel de Control</h1>

      <div className={styles.metricsGrid}>
        
        {/* TARJETA 1: USUARIOS */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Usuarios</h3>
            <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
              <FiUsers size={24} />
            </div>
          </div>
          
          <div className={styles.mainNumber}>{stats.usuarios.total}</div>
          <p className={styles.subLabel}>Total Registrados</p>

          <div className={styles.statsDivider}></div>

          <div className={styles.bottomStats}>
            <div className={styles.statItem}>
              <FiUserCheck className={styles.textGreen} size={18} />
              <span className={styles.statValue}>{stats.usuarios.activos} Activos</span>
            </div>
            <div className={styles.statItem}>
              <FiUserX className={styles.textRed} size={18} />
              <span className={styles.statValue}>{stats.usuarios.bloqueados} Bloqueados</span>
            </div>
          </div>
        </div>

        {/* TARJETA 2: TICKETS DE SOPORTE */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Tickets de Soporte</h3>
            <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
              <FiLifeBuoy size={24} />
            </div>
          </div>
          
          <div className={styles.mainNumber}>{stats.tickets.total}</div>
          <p className={styles.subLabel}>Total Histórico</p>

          <div className={styles.statsDivider}></div>

          <div className={styles.bottomStats}>
            <div className={styles.statItem}>
              <FiAlertCircle className={styles.textRed} size={18} />
              <span className={styles.statValue}>{stats.tickets.pendientes} Pendientes</span>
            </div>
            <div className={styles.statItem}>
              <FiCheckCircle className={styles.textGreen} size={18} />
              <span className={styles.statValue}>{stats.tickets.resueltos} Resueltos</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}