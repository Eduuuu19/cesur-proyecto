import React, { useState, useEffect } from 'react';
import api from '../services/axiosConfig';
import SummaryCard from '../components/atoms/SummaryCard';
import AnnualChart from '../components/atoms/AnnualChart';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const [errorMessage, setErrorMessage] = useState('');

  const [fechasDisponibles, setFechasDisponibles] = useState({});
  const [dateIngresos, setDateIngresos] = useState(new Date());
  const [dateGastos, setDateGastos] = useState(new Date());
  const [dateBeneficios, setDateBeneficios] = useState(new Date());
  const [dateAnual, setDateAnual] = useState(new Date());

  const [datosIngresos, setDatosIngresos] = useState({ total: 0, chart: [] });
  const [datosGastos, setDatosGastos] = useState({ total: 0, chart: [] });
  const [datosBeneficios, setDatosBeneficios] = useState({ total: 0, chart: [] });
  const [datosAnuales, setDatosAnuales] = useState({ ingresos: [], gastos: [] });

  useEffect(() => {
    api.get('/dashboard/fechas-disponibles').then(res => {
      const fechas = res.data;
      setFechasDisponibles(fechas);
      const años = Object.keys(fechas).map(Number).sort((a, b) => b - a);
      
      if (años.length > 0) {
        const añoReciente = años[0];
        const mesReciente = fechas[añoReciente].sort((a, b) => b - a)[0];
        const defaultDate = new Date(añoReciente, mesReciente - 1, 1);
        
        setDateIngresos(defaultDate);
        setDateGastos(defaultDate);
        setDateBeneficios(defaultDate);
        setDateAnual(defaultDate);
      }
    }).catch(() => setErrorMessage("No se pudo conectar con el servidor."));
  }, []);

  useEffect(() => {
    const y = dateIngresos.getFullYear();
    const m = dateIngresos.getMonth() + 1;
    api.get(`/dashboard/mensual?year=${y}&month=${m}`).then(res => {
      setDatosIngresos({ total: res.data.ingresosTotales, chart: res.data.graficoIngresos });
    }).catch(console.error);
  }, [dateIngresos]);

  useEffect(() => {
    const y = dateGastos.getFullYear();
    const m = dateGastos.getMonth() + 1;
    api.get(`/dashboard/mensual?year=${y}&month=${m}`).then(res => {
      setDatosGastos({ total: res.data.gastosTotales, chart: res.data.graficoGastos });
    }).catch(console.error);
  }, [dateGastos]);

  useEffect(() => {
    const y = dateBeneficios.getFullYear();
    const m = dateBeneficios.getMonth() + 1;
    api.get(`/dashboard/mensual?year=${y}&month=${m}`).then(res => {
      setDatosBeneficios({ 
        total: res.data.beneficios, 
        chart: [
          { name: 'Ingresos', value: res.data.ingresosTotales, fill: 'var(--color-primary-400)' },
          { name: 'Gastos', value: res.data.gastosTotales, fill: 'var(--color-danger-400)' }
        ]
      });
    }).catch(console.error);
  }, [dateBeneficios]);

  useEffect(() => {
    const y = dateAnual.getFullYear();
    api.get(`/dashboard/anual?year=${y}`).then(res => {
      setDatosAnuales({ ingresos: res.data.graficoIngresosAnual, gastos: res.data.graficoGastosAnual });
    }).catch(console.error);
  }, [dateAnual]);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Panel de Control</h1>
      
      {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}

      <div className={styles.cardsRow}>
        <SummaryCard
          title="Ingresos Totales"
          amount={`${datosIngresos.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
          data={datosIngresos.chart}
          selectedDate={dateIngresos}
          onDateChange={(date) => setDateIngresos(date)}
          fechasDisponibles={fechasDisponibles}
        />

        <SummaryCard
          title="Gastos Totales"
          amount={`${datosGastos.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
          variant="danger"
          data={datosGastos.chart}
          selectedDate={dateGastos}
          onDateChange={(date) => setDateGastos(date)}
          fechasDisponibles={fechasDisponibles}
        />

        <SummaryCard
          title="Beneficios"
          amount={`${datosBeneficios.total >= 0 ? '+' : '-'} ${Math.abs(datosBeneficios.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`}
          variant={datosBeneficios.total >= 0 ? "success" : "danger"}
          chartType="bar"
          data={datosBeneficios.chart}
          selectedDate={dateBeneficios}
          onDateChange={(date) => setDateBeneficios(date)}
          fechasDisponibles={fechasDisponibles}
        />
      </div>

      <AnnualChart 
        ingresosData={datosAnuales.ingresos} 
        gastosData={datosAnuales.gastos} 
        selectedDate={dateAnual}
        onDateChange={(date) => setDateAnual(date)}
        fechasDisponibles={fechasDisponibles}
      />
    </div>
  );
}