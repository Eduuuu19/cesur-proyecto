import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import PresupuestosModal from '../components/organisms/PresupuestosModal';
import styles from './SharedPage.module.css';

export default function PresupuestosPage() {
  
  // Controlar la apertura del modal
    const [isModalOpen, setIsModalOpen] = useState(false);

  // Presupuestos de ejemplo para mostrar en la tabla
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

  // Clientes de ejemplo para el select del modal
  const mockClientes = [
    { id: 1, nombre: "Cliente 1", nif: "B00000001" },
    { id: 2, nombre: "Cliente 2", nif: "B00000002" },
    { id: 3, nombre: "Cliente 3", nif: "B00000003" }
  ];

  // Configuración de columnas para la tabla
  const columns = [
    { key: 'numero', label: 'Presupuesto', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'cliente', label: 'Cliente', render: (row) => row.cliente.nombre },
    { key: 'nif', label: 'NIF', render: (row) => row.cliente.nif },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES')}€` },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Función de ejemplo para simular la creación de un nuevo presupuesto a partir de los datos del modal
  const handleSavePresupuesto = (formData) => {
    const totalCalculado = parseFloat(formData.baseImponible) * (1 + parseFloat(formData.iva) / 100);
    const clienteEncontrado = mockClientes.find(c => c.id.toString() === formData.clienteId);

    const nuevoPresupuesto = {
      id: Date.now(),
      numeroPresupuesto: formData.numeroPresupuesto,
      fecha: formData.fechaEmision,
      total: totalCalculado,
      estado: formData.estado,
      cliente: clienteEncontrado
    };

    setPresupuestos([nuevoPresupuesto, ...presupuestos]);
    setIsModalOpen(false);
  };

  // Funciones para los botones
  const handleEdit = (row) => console.log("Editar presupuesto:", row);
  const handleDelete = (row) => console.log("Borrar presupuesto:", row);

  return (
    
    <div className={styles.pageContainer}>

      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Ingresos &gt; Presupuestos</div>
      <h1 className={styles.title}>Presupuestos</h1>

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>

        {/* Toolbar Superior: Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>
          <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={18} /> Añadir presupuesto
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
                <option value="todas">Todos</option>
                <option value="aceptado">Aceptado</option>
                <option value="pendiente">Pendiente</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        <DataTable 
          data={presupuestos}
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} />
      </div>

      {/* Modal para añadir/editar presupuesto */}
      <PresupuestosModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePresupuesto}
        clientes={mockClientes}
      />

    </div>
  );
}