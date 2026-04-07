import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import styles from './FacturasEmitidasPage.module.css';

export default function FacturasEmitidasPage() {
  
  const [facturas, setFacturas] = useState([
    {
      idFacturaEmitida: 1,
      numeroFactura: "F001",
      fecha: "15 Mar 2026",
      concepto: "Desarrollo web",
      baseImponible: 1000.0,
      iva: 21.0,
      total: 2300.0,
      estado: "Pagada",
      cliente: { idCliente: 1, nombre: "Cliente 1", nif: "B00000001" }
    },
    {
      idFacturaEmitida: 2,
      numeroFactura: "F002",
      fecha: "17 Mar 2026",
      concepto: "Mantenimiento",
      baseImponible: 500.0,
      iva: 21.0,
      total: 1100.0,
      estado: "Pendiente",
      cliente: { idCliente: 2, nombre: "Cliente 2", nif: "B00000002" }
    },
    {
      idFacturaEmitida: 3,
      numeroFactura: "F003",
      fecha: "10 Abril 2026",
      concepto: "Auditoría SEO",
      baseImponible: 800.0,
      iva: 21.0,
      total: 3500.0,
      estado: "Vencida",
      cliente: { idCliente: 3, nombre: "Cliente 3", nif: "B00000003" }
    }
  ]);

  const columns = [
    { key: 'numeroFactura', label: 'Factura', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'cliente', label: 'Cliente', render: (row) => row.cliente.nombre },
    { key: 'nif', label: 'NIF', render: (row) => row.cliente.nif },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES')}€` },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Funciones para los botones
  const handleEdit = (factura) => console.log("Editar factura:", factura);
  const handleDelete = (factura) => console.log("Borrar factura:", factura);

  return (
    <div className={styles.pageContainer}>
      
      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Ingresos &gt; Facturas emitidas</div>
      <h1 className={styles.title}>Facturas Emitidas</h1>

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>
        
        {/* Toolbar Superior: Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>
          
          <button className={styles.btnAdd}>
            <FiPlus size={18} /> Añadir factura
          </button>

          <div className={styles.filters}>
            {/* Buscador por NIF */}
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input type="text" placeholder="Buscar por NIF..." className={styles.searchInput} />
            </div>

            {/* Filtro por Estado */}
            <div className={styles.selectBox}>
              <FiFilter className={styles.filterIcon} />
              <select className={styles.statusSelect} defaultValue="">
                <option value="" disabled>Estado</option>
                <option value="todas">Todas</option>
                <option value="pagada">Pagada</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencida">Vencida</option>
              </select>
            </div>
          </div>

        </div>

        {/* Tabla de Datos */}
        <DataTable 
          data={facturas} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
        
      </div>
    </div>
  );
}