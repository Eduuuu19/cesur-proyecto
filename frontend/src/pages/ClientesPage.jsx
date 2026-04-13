import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/axiosConfig';
import DataTable from '../components/molecules/DataTable';
import ClienteModal from '../components/organisms/ClienteModal';
import styles from './SharedPage.module.css';

export default function ClientesPage() {

    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);

    // Estado para almacenar la lista de clientes, el estado de carga y los mensajes de error
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para los filtros de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estado para la configuración de ordenación
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Función para cargar clientes desde la API con filtros y ordenación
    const fetchClientes = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await api.get('/customers', {
                params: {
                    nombre: searchTerm || undefined,
                    estado: statusFilter || undefined
                }
            });
            setClientes(response.data);
        } catch (error) {
            console.error("Error cargando clientes:", error);
            setErrorMessage('No se pudieron cargar los clientes. Revisa la conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar clientes al montar el componente y cada vez que cambien los filtros
    useEffect(() => {
        fetchClientes();
    }, [searchTerm, statusFilter]);

    // Función para manejar la ordenación de columnas
    const clientesOrdenados = useMemo(() => {
        let arrayOrdenado = [...clientes];

        if (sortConfig.key !== null) {
            arrayOrdenado.sort((a, b) => {
                const valorA = a[sortConfig.key]?.toString().toLowerCase() || '';
                const valorB = b[sortConfig.key]?.toString().toLowerCase() || '';

                if (valorA < valorB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valorA > valorB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return arrayOrdenado;
    }, [clientes, sortConfig]);

    // Función para manejar el clic en el encabezado de la columna para ordenar
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Configuración de columnas
    const columns = [
        { key: 'nombre', label: 'Razón Social', sortable: true },
        { key: 'nif', label: 'NIF/CIF', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'estado', label: 'Estado', sortable: true }
    ];

    // Funciones para editar cliente, abrir el modal con datos precargados
    const handleEdit = (row) => {
        setEditingCustomer(row);
        setIsModalOpen(true);
    };

    // Funcion para eliminar un cliente, con confirmación y manejo de errores
    const handleDelete = async (row) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar al cliente "${row.nombre}"?`);

        if (confirmacion) {
            try {
                await api.delete(`/customers/${row.idCliente}`);
                fetchClientes();
            } catch (error) {
                console.error("Error borrando cliente:", error);
                setErrorMessage("No se pudo eliminar el cliente. Puede que tenga facturas asociadas.");
            }
        }
    };

    // Función para manejar el guardado de un nuevo cliente desde el modal
    const handleSaveCliente = async (datosCliente) => {
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.idCliente}`, datosCliente);
            } else {
                await api.post('/customers', datosCliente);
            }

            setIsModalOpen(false);
            fetchClientes();

        } catch (error) {
            console.error("Error al guardar:", error);
            const mensajeBackend = error.response?.data?.error || "Error de conexión al intentar guardar.";
            throw new Error(mensajeBackend);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.breadcrumbs}>Maestros &gt; Clientes</div>
            <h1 className={styles.title}>Clientes</h1>

            {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}
            <div className={styles.contentCard}>
                <div className={styles.toolbar}>
                    <button
                        className={styles.btnAdd}
                        onClick={() => {
                            setEditingCustomer(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <FiPlus size={18} /> Añadir cliente
                    </button>

                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <FiSearch className={styles.searchIcon} />
                            <input type="text" placeholder="Buscar por Nombre..." className={styles.searchInput} value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className={styles.selectBox}>
                            <FiFilter className={styles.filterIcon} />
                            <select className={styles.statusSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="" disabled>Estado</option>
                                <option value="">Todos</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>
                        Cargando clientes...
                    </div>
                ) : (
                    <DataTable
                        data={clientesOrdenados}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSort={handleSort}
                        currentSort={sortConfig}
                    />
                )}            </div>

            <ClienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCliente}
                initialData={editingCustomer}
            />
        </div>
    );
}