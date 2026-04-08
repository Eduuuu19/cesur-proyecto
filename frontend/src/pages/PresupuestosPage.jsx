import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import styles from './PresupuestosPage.module.css';

export default function PresupuestosPage() {
  
  const [presupuestos, setPresupuestos] = useState([
    {
      id: 1, numero: "PRE-001", fecha: "22 Mar 2026", 
      total: 1500.0, estado: "Aceptado", 
      cliente: { nombre: "Cliente 1", nif: "B00000001" }
    },
    {
      id: 2, numero: "PRE-002", fecha: "25 Mar 2026", 
      total: 3200.0, estado: "Pendiente", 
      cliente: { nombre: "Cliente 2", nif: "B00000002" }
    },
    {
      id: 3, numero: "PRE-003", fecha: "02 Abr 2026", 
      total: 850.0, estado: "Rechazado", 
      cliente: { nombre: "Cliente 3", nif: "B00000003" }
    }
  ]);

  const columns = [
    { key: 'numero', label: 'Presupuesto', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'cliente', label: 'Cliente', render: (row) => row.cliente.nombre },
    { key: 'nif', label: 'NIF', render: (row) => row.cliente.nif },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES')}€` },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  const handleEdit = (row) => console.log("Editar presupuesto:", row);
  const handleDelete = (row) => console.log("Borrar presupuesto:", row);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>Ingresos &gt; Presupuestos</div>
      <h1 className={styles.title}>Presupuestos</h1>

      <div className={styles.contentCard}>
        <div className={styles.toolbar}>
          <button className={styles.btnAdd}>
            <FiPlus size={18} /> Añadir presupuesto
          </button>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input type="text" placeholder="Buscar por NIF..." className={styles.searchInput} />
            </div>

            <div className={styles.selectBox}>
              <FiFilter className={styles.filterIcon} />
              <select className={styles.statusSelect} defaultValue="">
                <option value="" disabled>Estado</option>
                <option value="todas">Todos</option>
                <option value="aceptado">Aceptado</option>
                <option value="pendiente">Pendiente</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        <DataTable data={presupuestos} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}