import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/axiosConfig';
import DataTable from '../components/molecules/DataTable';
import ProveedorModal from '../components/organisms/ProveedorModal';
import styles from './SharedPage.module.css';

export default function ProveedoresPage() {

    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para el proveedor que se está editando
    const [editingSupplier, setEditingSupplier] = useState(null);

    // Estado para almacenar la lista de proveedores, el estado de carga y los mensajes de error
    const [proveedores, setProveedores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para los filtros de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estado para la configuración de ordenación
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Función para cargar proveedores desde la API con filtros y ordenación
    const fetchProveedores = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await api.get('/suppliers', {
                params: {
                    nombre: searchTerm || undefined,
                    estado: statusFilter || undefined
                }
            });
            setProveedores(response.data);
        } catch (error) {
            console.error("Error cargando proveedores:", error);
            setErrorMessage('No se pudieron cargar los proveedores. Revisa la conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar proveedores al montar el componente y cada vez que cambien los filtros
    useEffect(() => {
        fetchProveedores();
    }, [searchTerm, statusFilter]);

    // Función para manejar la ordenación de columnas
    const proveedoresOrdenados = useMemo(() => {
        let arrayOrdenado = [...proveedores];

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
    }, [proveedores, sortConfig]);

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

    // Funciones para editar proveedor, abrir el modal con datos precargados
    const handleEdit = (row) => {
        setEditingSupplier(row);
        setIsModalOpen(true);
    };

    // Funcion para eliminar un proveedor, con confirmación y manejo de errores
    const handleDelete = async (row) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar al proveedor "${row.nombre}"?`);

        if (confirmacion) {
            try {
                await api.delete(`/suppliers/${row.idProveedor}`);
                fetchProveedores();
            } catch (error) {
                console.error("Error borrando proveedor:", error);
                setErrorMessage("No se pudo eliminar el proveedor. Puede que tenga facturas asociadas.");
            }
        }
    };

    // Función para manejar el guardado de un nuevo proveedor desde el modal
    const handleSaveProveedor = async (datosProveedor) => {
        try {
            if (editingSupplier) {
                await api.put(`/suppliers/${editingSupplier.idProveedor}`, datosProveedor);
            } else {
                await api.post('/suppliers', datosProveedor);
            }

            setIsModalOpen(false);
            fetchProveedores();

        } catch (error) {
            console.error("Error al guardar:", error);
            const mensajeBackend = error.response?.data?.error || "Error de conexión al intentar guardar.";
            throw new Error(mensajeBackend);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.breadcrumbs}>Maestros &gt; Proveedores</div>
            <h1 className={styles.title}>Proveedores</h1>

            {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}
            <div className={styles.contentCard}>
                <div className={styles.toolbar}>
                    <button
                        className={styles.btnAdd}
                        onClick={() => {
                            setEditingSupplier(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <FiPlus size={18} /> Añadir proveedor
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
                        Cargando proveedores...
                    </div>
                ) : (
                    <DataTable
                        data={proveedoresOrdenados}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSort={handleSort}
                        currentSort={sortConfig}
                    />
                )}
            </div>

            <ProveedorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProveedor}
                initialData={editingSupplier}
            />
        </div>
    );
}