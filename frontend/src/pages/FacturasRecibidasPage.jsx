import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/axiosConfig';
import DataTable from '../components/molecules/DataTable';
import FacturasRecibidasModal from '../components/organisms/FacturasRecibidasModal';
import styles from './SharedPage.module.css';

export default function FacturasRecibidasPage() {

  const navigate = useNavigate();

  // Controlar la apertura del modal y edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Estados reales para conexión con Backend
  const [gastos, setGastos] = useState([]);
  const [proveedoresList, setProveedoresList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filtros y ordenación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Cargar facturas recibidas desde Java
  const fetchGastos = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      
      if (searchTerm) params.proveedorNombre = searchTerm;
      if (statusFilter && statusFilter !== 'todas') params.estado = statusFilter;
      if (sortConfig.key) params.sort = `${sortConfig.key},${sortConfig.direction}`;

      const response = await api.get('/invoices/received', { params });
      setGastos(response.data);
    } catch (error) {
      console.error("Error cargando facturas recibidas:", error);
      setErrorMessage('No se pudieron cargar las facturas recibidas. Revisa la conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar proveedores reales para el select del modal
  const fetchProveedores = async () => {
    try {
      const response = await api.get('/suppliers');
      setProveedoresList(response.data);
    } catch (error) {
      console.error("Error cargando proveedores para el select:", error);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [searchTerm, statusFilter, sortConfig]);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Configuración de columnas 
  const columns = [
    { key: 'numeroFactura', label: 'Factura', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'proveedor', label: 'Proveedor', render: (row) => row.proveedor?.nombre || 'Desconocido' },
    { key: 'nif', label: 'CIF/NIF', render: (row) => row.proveedor?.nif || 'N/A' },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`, sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Función para abrir el modal en modo creación
  const handleOpenNew = () => {
    if (proveedoresList.length === 0) {
      const irAProveedores = window.confirm(
        "No puedes registrar un gasto porque aún no tienes proveedores registrados. ¿Deseas ir a la sección de Proveedores para crear uno ahora?"
      );
      if (irAProveedores) {
        navigate('/proveedores');
      }
      return;
    }
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEdit = (row) => {
    setEditingInvoice(row);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal y limpiar estados
  const handleClose = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  // Función para eliminar una factura recibida
  const handleDelete = async (row) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar la factura ${row.numeroFactura}?`);
    if (confirmar) {
      try {
        await api.delete(`/invoices/received/${row.idFacturaRecibida}`);
        fetchGastos();
      } catch (error) {
        console.error("Error borrando gasto:", error);
        setErrorMessage("No se pudo eliminar la factura.");
      }
    }
  };

  // Función para guardar la factura
  const handleSaveGasto = async (invoicePayload) => {
    try {
      if (editingInvoice) {
        await api.put(`/invoices/received/${editingInvoice.idFacturaRecibida}`, invoicePayload);
      } else {
        await api.post('/invoices/received', invoicePayload);
      }
      handleClose();
      fetchGastos();
    } catch (error) {
      console.error("Error al guardar gasto:", error);
      const mensajeBackend = error.response?.data?.error || "Error de conexión al intentar guardar.";
      throw new Error(mensajeBackend);
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Gastos &gt; Facturas recibidas</div>
      <h1 className={styles.title}>Facturas recibidas</h1>

      {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>

        {/* Toolbar Superior: Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>
          <button className={styles.btnAdd} onClick={handleOpenNew}>
            <FiPlus size={18} /> Añadir factura
          </button>

          <div className={styles.filters}>

            {/* Buscador por Nombre de Proveedor */}
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Buscar por nombre proveedor..." 
                className={styles.searchInput} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por Estado */}
            <div className={styles.selectBox}>
              <FiFilter className={styles.filterIcon} />
              <select 
                className={styles.statusSelect} 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="" disabled>Estado</option>
                <option value="todas">Todos</option>
                <option value="Pagada">Pagada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vencida">Vencida</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        {isLoading ? (
            <div className={styles.loadingState}>Cargando facturas...</div>
        ) : (
            <DataTable 
              data={gastos} 
              columns={columns} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onSort={handleSort}
              currentSort={sortConfig}
            />
        )}
      </div>

      {/* Modal para añadir/editar factura */}
      <FacturasRecibidasModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSaveGasto}
        proveedores={proveedoresList}
        initialData={editingInvoice}
      />

    </div>
  );
}