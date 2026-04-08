import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import styles from './FacturasRecibidasPage.module.css'; 

export default function GastosPage() {
  
  const [gastos, setGastos] = useState([
    {
      id: 1, numero: "A-992", fecha: "01 Abr 2026", concepto: "Material de oficina",
      total: 125.50, estado: "Pagada", 
      proveedor: { nombre: "Papelería Central", cif: "B12345678" }
    },
    {
      id: 2, numero: "FAC-2026/04", fecha: "05 Abr 2026", concepto: "Licencias de software",
      total: 450.00, estado: "Pendiente", 
      proveedor: { nombre: "Tech Solutions", cif: "B87654321" }
    }
  ]);

  const columns = [
    { key: 'numero', label: 'Factura', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'concepto', label: 'Concepto' },
    { key: 'proveedor', label: 'Proveedor', render: (row) => row.proveedor.nombre },
    { key: 'cif', label: 'CIF/NIF', render: (row) => row.proveedor.cif },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES')}€` },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  const handleEdit = (row) => console.log("Editar gasto:", row);
  const handleDelete = (row) => console.log("Borrar gasto:", row);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>Gastos &gt; Facturas recibidas</div>
      <h1 className={styles.title}>Facturas recibidas</h1>

      <div className={styles.contentCard}>
        <div className={styles.toolbar}>
          <button className={styles.btnAdd}>
            <FiPlus size={18} /> Añadir factura
          </button>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input type="text" placeholder="Buscar por CIF..." className={styles.searchInput} />
            </div>

            <div className={styles.selectBox}>
              <FiFilter className={styles.filterIcon} />
              <select className={styles.statusSelect} defaultValue="">
                <option value="" disabled>Estado</option>
                <option value="todas">Todos</option>
                <option value="pagada">Pagada</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        <DataTable data={gastos} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}