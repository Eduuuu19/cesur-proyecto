import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/axiosConfig';
import DataTable from '../components/molecules/DataTable';
import PresupuestosModal from '../components/organisms/PresupuestosModal';
import styles from './SharedPage.module.css';

export default function PresupuestosPage() {
  
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presupuestoEditando, setPresupuestoEditando] = useState(null);

  // Estados reales para conexión con Backend
  const [presupuestos, setPresupuestos] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filtros y ordenación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Cargar presupuestos desde Java
  const fetchPresupuestos = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      
      if (searchTerm) params.clienteNombre = searchTerm;
      if (statusFilter && statusFilter !== 'todas') params.estado = statusFilter;
      if (sortConfig.key) params.sort = `${sortConfig.key},${sortConfig.direction}`;

      const response = await api.get('/budgets', { params });
      setPresupuestos(response.data);
    } catch (error) {
      console.error("Error cargando presupuestos:", error);
      setErrorMessage('No se pudieron cargar los presupuestos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar clientes para el Modal
  const fetchClientes = async () => {
    try {
      const response = await api.get('/customers');
      setClientesList(response.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, [searchTerm, statusFilter, sortConfig]);

  useEffect(() => {
    fetchClientes();
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
    { key: 'numeroPresupuesto', label: 'Presupuesto', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'cliente', label: 'Cliente', render: (row) => row.cliente?.nombre || 'Desconocido' },
    { key: 'nif', label: 'NIF', render: (row) => row.cliente?.nif || 'N/A' },
    { key: 'total', label: 'Total', render: (row) => `${row.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€`, sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  const handleOpenNew = () => {
    if (clientesList.length === 0) {
      const irAClientes = window.confirm(
        "No puedes crear un presupuesto porque aún no tienes clientes registrados. ¿Deseas ir a la sección de Clientes para crear uno ahora?"
      );
      if (irAClientes) {
        navigate('/clientes'); 
      }
      return; 
    }
    setPresupuestoEditando(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setPresupuestoEditando(row);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPresupuestoEditando(null);
  };

  const handleDelete = async (row) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar el presupuesto ${row.numeroPresupuesto}?`);
    if (confirmar) {
      try {
        await api.delete(`/budgets/${row.idPresupuesto}`);
        fetchPresupuestos();
      } catch (error) {
        console.error("Error borrando presupuesto:", error);
        setErrorMessage("No se pudo eliminar el presupuesto.");
      }
    }
  };

  const handleSavePresupuesto = async (datosParaJava) => {
    try {
      if (presupuestoEditando) {
        await api.put(`/budgets/${presupuestoEditando.idPresupuesto}`, datosParaJava);
      } else {
        await api.post('/budgets', datosParaJava);
      }
      handleClose();
      fetchPresupuestos();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      const mensajeBackend = error.response?.data?.error || "Error de conexión al intentar guardar.";
      throw new Error(mensajeBackend);
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Ingresos &gt; Presupuestos</div>
      <h1 className={styles.title}>Presupuestos</h1>

      {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>

        {/* Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>
          <button className={styles.btnAdd} onClick={handleOpenNew}>
            <FiPlus size={18} /> Añadir presupuesto
          </button>

          <div className={styles.filters}>
            {/* Buscador por Nombre */}
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
                <option value="todas">Todos</option>
                <option value="Aceptado">Aceptado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        {isLoading ? (
            <div className={styles.loadingState}>Cargando presupuestos...</div>
        ) : (
            <DataTable 
              data={presupuestos}
              columns={columns} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onSort={handleSort}
              currentSort={sortConfig}
            />
        )}
      </div>

      {/* Modal para añadir/editar presupuesto */}
      <PresupuestosModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        onSave={handleSavePresupuesto}
        clientes={clientesList}
        initialData={presupuestoEditando}
      />

    </div>
  );
}