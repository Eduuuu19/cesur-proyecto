import React from 'react';
import SummaryCard from '../components/atoms/SummaryCard';
import AnnualChart from '../components/atoms/AnnualChart';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {

  const datosIngresos = [0, 150, 0, 0, 420, 0, 0, 50, 0, 0, 800, 0, 0, 0, 120, 0, 0, 0, 230, 0, 0, 0, 0, 1500, 0, 0, 300, 0, 0, 0, 50];
  const datosGastos = [20, 0, 0, 100, 0, 0, 50, 0, 0, 30, 0, 0, 400, 0, 0, 0, 0, 60, 0, 0, 0, 120, 0, 0, 0, 200, 0, 0, 0, 45, 0];

  const ingresosAnuales = [4200, 3800, 5100, 4800, 5500, 6200, 5900, 4500, 6800, 7200, 6100, 8000];
  const gastosAnuales = [2100, 1900, 3000, 2500, 3200, 2800, 2100, 3500, 4100, 3800, 4500, 5200];

  return (
    <div className={styles.dashboardContainer}>

      {/* Título de la página */}
      <h1 className={styles.pageTitle}>Panel de Control</h1>

      {/* Fila de Tarjetas Superiores */}
      <div className={styles.cardsRow}>

        {/* Tarjeta 1: Ingresos */}
        <SummaryCard
          title="Ingresos Totales Mensuales"
          amount="8.378,05€"
          data={datosIngresos}
        />

        {/* Tarjeta 2: Gastos */}
        <SummaryCard
          title="Gastos Totales Mensuales"
          amount="3.145,85€"
          variant="danger"
          data={datosGastos}
        />

        {/* Tarjeta 3: Beneficios */}
        <SummaryCard
          title="Beneficios Mensuales"
          amount="+ 5.232,20€"
          variant="success"
          chartType="bar"
          data={[
            { name: 'Ingresos', value: 8378.05, fill: 'var(--color-primary-400)' },
            { name: 'Gastos', value: 3145.85, fill: 'var(--color-danger-400)' }
          ]}
        />

      </div>

      {/* Gráfico Anual inferior */}
      <AnnualChart 
        ingresosData={ingresosAnuales} 
        gastosData={gastosAnuales} 
      />

    </div>
  );
}