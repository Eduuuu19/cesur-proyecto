import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import FacturasRecibidasModal from '../components/organisms/FacturasRecibidasModal';
import styles from './SharedPage.module.css';

export default function GastosPage() {

  // Controlar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // facturas de ejemplo para mostrar en la tabla
  const [gastos, setGastos] = useState([
    {
      id: 1, numero: "A-992", fecha: "01 Abr 2026",
      total: 125.50, estado: "Pagada",
      proveedor: { nombre: "Papelería Central", cif: "B12345678" }
    },
    {
      id: 2, numero: "FAC-2026/04", fecha: "05 Abr 2026",
      total: 450.00, estado: "Pendiente",
      proveedor: { nombre: "Tech Solutions", cif: "B87654321" }
    }
  ]);

  // proveedores de ejemplo para el select del modal
  const mockProveedores = [
    { id: 1, nombre: "Papelería Central", cif: "B12345678" },
    { id: 2, nombre: "Tech Solutions", cif: "B87654321" }
  ];

  // Configuración de columnas para la tabla
  const columns = [
    { key: 'numero', label: 'Factura', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'proveedor', label: 'Proveedor', render: (row) => row.proveedor.nombre },
    { key: 'cif', label: 'CIF/NIF', render: (row) => row.proveedor.cif },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES')}€` },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Función de ejemplo para simular la creación de una nueva factura a partir de los datos del modal
  const handleSaveGasto = (formData) => {
    const totalCalculado = parseFloat(formData.baseImponible) * (1 + parseFloat(formData.iva) / 100);
    const provEncontrado = mockProveedores.find(p => p.id.toString() === formData.proveedorId);

    const nuevoGasto = {
      id: Date.now(),
      numeroFactura: formData.numeroFactura,
      fecha: formData.fechaEmision,
      total: totalCalculado,
      estado: formData.estado,
      proveedor: provEncontrado
    };

    setGastos([nuevoGasto, ...gastos]);
    setIsModalOpen(false);
  };

  // Funciones para los botones
  const handleEdit = (row) => console.log("Editar gasto:", row);
  const handleDelete = (row) => console.log("Borrar gasto:", row);

  return (
    
    <div className={styles.pageContainer}>

      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Gastos &gt; Facturas recibidas</div>
      <h1 className={styles.title}>Facturas recibidas</h1>

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>

        {/* Toolbar Superior: Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>
          <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={18} /> Añadir factura
          </button>

          <div className={styles.filters}>

            {/* Buscador por NIF */}
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input type="text" placeholder="Buscar por CIF..." className={styles.searchInput} />
            </div>

            {/* Filtro por Estado */}
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

          {/* Tabla de Datos */}
        <DataTable 
          data={gastos} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} />
      </div>

      {/* Modal para añadir/editar factura */}
      <FacturasRecibidasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGasto}
        proveedores={mockProveedores}
      />

    </div>
  );
}