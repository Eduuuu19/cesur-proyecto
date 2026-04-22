import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import DateSelector from './DateSelector';
import styles from './AnnualChart.module.css';

export default function AnnualChart({
  ingresosData = [],
  gastosData = [],
  selectedDate,
  onDateChange,
  fechasDisponibles = {}
}) {

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const formattedData = meses.map((mes, index) => ({
    name: mes,
    Ingresos: ingresosData[index] || 0,
    Gastos: gastosData[index] || 0
  }));

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        Gráfico Anual de Ingresos vs Gastos
      </div>

      <div className={styles.chartBody}>

        <div className={styles.controlsRow}>
          <div className={styles.legendGroup}>
            <div className={styles.legendItem}>
              <span className={styles.dotIncome}></span> Ingresos
            </div>
            <div className={styles.legendItem}>
              <span className={styles.dotExpense}></span> Gastos
            </div>
          </div>

          <DateSelector
            type="year"
            selectedDate={selectedDate}
            onChange={onDateChange}
            fechasDisponibles={fechasDisponibles}
          />

          <div className={styles.menuIcon}>
            <FiMoreHorizontal size={20} />
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={8}>
              <CartesianGrid vertical={false} stroke="var(--color-gray-200)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: 'var(--color-gray-500)', fontSize: 11, fontWeight: 500 }} dy={12} />
              <Tooltip cursor={{ fill: 'var(--color-gray-50)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="Ingresos" fill="var(--color-primary-400)" radius={[4, 4, 0, 0]} maxBarSize={16} />
              <Bar dataKey="Gastos" fill="var(--color-danger-400)" radius={[4, 4, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}