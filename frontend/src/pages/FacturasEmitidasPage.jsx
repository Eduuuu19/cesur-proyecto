import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/axiosConfig';
import DataTable from '../components/molecules/DataTable';
import FacturasEmitidasModal from '../components/organisms/FacturasEmitidasModal';
import styles from './SharedPage.module.css';

export default function FacturasEmitidasPage() {

  // Hook de navegación para redirigir si es necesario
  const navigate = useNavigate(); 

  // Controlar la apertura del modal y edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Estado para la tabla y carga
  const [facturas, setFacturas] = useState([]);
  const [clientesList, setClientesList] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filtros y ordenación delegada al backend
  const [searchTerm, setSearchTerm] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Cargar las facturas desde el backend
  const fetchFacturas = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      
      // Aplicar filtros si existen
      if (searchTerm) params.nombreCliente = searchTerm;
      if (statusFilter && statusFilter !== 'todas') params.estado = statusFilter;
      
      // Aplicar ordenación del servidor si se ha hecho clic en una cabecera
      if (sortConfig.key) {
        params.sort = `${sortConfig.key},${sortConfig.direction}`;
      }

      const response = await api.get('/invoices/issued', { params });
      setFacturas(response.data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
      setErrorMessage('No se pudieron cargar las facturas. Revisa la conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar la lista de clientes reales para pasársela al Modal
  const fetchClientes = async () => {
    try {
      const response = await api.get('/customers');
      setClientesList(response.data);
    } catch (error) {
      console.error("Error cargando clientes para el select:", error);
    }
  };

  // Efecto principal: Recargar cuando cambian filtros o la ordenación
  useEffect(() => {
    fetchFacturas();
  }, [searchTerm, statusFilter, sortConfig]);

  // Cargar los clientes solo una vez al abrir la página
  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para manejar el clic en el encabezado
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Configuración de columnas para la tabla
  const columns = [
    { key: 'numeroFactura', label: 'Factura', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'cliente', label: 'Cliente', render: (row) => row.cliente?.nombre || 'Desconocido' },
    { key: 'nif', label: 'NIF', render: (row) => row.cliente?.nif || 'N/A' },
    { key: 'total', label: 'Total', render: (row) => `${row.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`, sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Función para abrir el modal en modo creación
  const handleOpenNew = () => {
    if (clientesList.length === 0) {
      const goToCustomers = window.confirm(
        "No puedes crear una factura porque aún no tienes clientes registrados. ¿Deseas ir a la sección de Clientes para crear uno ahora?"
      );
      
      if (goToCustomers) {
        navigate('/clientes'); 
      }
      return; 
    }

    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEdit = (factura) => {
    setEditingInvoice(factura);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal y limpiar estados
  const handleClose = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  // Función para borrar en la base de datos
  const handleDelete = async (row) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar la factura ${row.numeroFactura}?`);
    if (confirmar) {
      try {
        await api.delete(`/invoices/issued/${row.idFacturaEmitida}`);
        fetchFacturas();
      } catch (error) {
        console.error("Error borrando factura:", error);
        setErrorMessage("No se pudo eliminar la factura.");
      }
    }
  };

  // Función para guardar la factura
  const handleSaveFactura = async (datosFactura) => {
    try {
      if (editingInvoice) {
        await api.put(`/invoices/issued/${editingInvoice.idFacturaEmitida}`, datosFactura);
      } else {
        await api.post('/invoices/issued', datosFactura);
      }
      handleClose();
      fetchFacturas();
    } catch (error) {
      console.error("Error al guardar factura:", error);
      const mensajeBackend = error.response?.data?.error || "Error de conexión al intentar guardar la factura.";
      throw new Error(mensajeBackend);
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Ingresos &gt; Facturas emitidas</div>
      <h1 className={styles.title}>Facturas Emitidas</h1>

      {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>

        {/* Toolbar Superior: Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>
          <button className={styles.btnAdd} onClick={handleOpenNew}>
            <FiPlus size={18} /> Añadir factura
          </button>

          <div className={styles.filters}>
            {/* Buscador por nombre de cliente */}
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Buscar por nombre cliente..." 
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
                <option value="todas">Todas</option>
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
              data={facturas} 
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSort={handleSort}
              currentSort={sortConfig}
            />
        )}
      </div>

      {/* Modal para añadir/editar factura */}
      <FacturasEmitidasModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSaveFactura}
        clientes={clientesList}
        initialData={editingInvoice}
      />

    </div>
  );
}