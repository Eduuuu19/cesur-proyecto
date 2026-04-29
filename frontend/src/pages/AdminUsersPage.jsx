import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/axiosConfig'; 
import DataTable from '../components/molecules/DataTable';
import styles from './SharedPage.module.css'; 

export default function AdminUsersPage() {
    // Estados para la lista y la interfaz
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para los filtros locales
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Estado para la configuración de ordenación
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const fetchUsuarios = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await api.get('/admin/users');
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            setErrorMessage('No se pudieron cargar los usuarios. Revisa la conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const usuariosFiltradosYOrdenados = useMemo(() => {
        // A. Filtrado
        let resultado = usuarios.filter(user => {
            const coincideNombre = user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const coincideEstado = statusFilter ? user.estado === statusFilter : true;
            return coincideNombre && coincideEstado;
        });

        if (sortConfig.key !== null) {
            resultado.sort((a, b) => {
                const valorA = a[sortConfig.key]?.toString().toLowerCase() || '';
                const valorB = b[sortConfig.key]?.toString().toLowerCase() || '';

                if (valorA < valorB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valorA > valorB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return resultado;
    }, [usuarios, searchTerm, statusFilter, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Función para Bloquear/Activar
    const handleToggleStatus = async (row) => {
        const accion = row.estado === 'Activo' ? 'bloquear' : 'activar';
        const confirmacion = window.confirm(`¿Estás seguro de que deseas ${accion} al usuario "${row.nombreUsuario}"?`);

        if (confirmacion) {
            try {
                await api.put(`/admin/users/${row.idUsuario}/toggle-status`);
                fetchUsuarios();
            } catch (error) {
                console.error(`Error al ${accion} usuario:`, error);
                setErrorMessage(`No se pudo ${accion} el usuario. Inténtalo de nuevo.`);
            }
        }
    };

    const columns = [
        { key: 'nombreUsuario', label: 'Nombre del Usuario', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'rol', label: 'Rol', sortable: true },
        { key: 'estado', label: 'Estado', sortable: true }
    ];

    return (
        <div className={styles.pageContainer}>
            <div className={styles.breadcrumbs}>Panel de Control &gt; Usuarios</div>
            <h1 className={styles.title}>Gestión de Usuarios</h1>

            {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}
            
            <div className={styles.contentCard}>
                <div className={styles.toolbar}>
                    
                    <div style={{ flex: 1 }}></div>

                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <FiSearch className={styles.searchIcon} />
                            <input 
                                type="text" 
                                placeholder="Buscar por Nombre o Email..." 
                                className={styles.searchInput} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>

                        <div className={styles.selectBox}>
                            <FiFilter className={styles.filterIcon} />
                            <select 
                                className={styles.statusSelect} 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="" disabled>Estado</option>
                                <option value="">Todos</option>
                                <option value="Activo">Activo</option>
                                <option value="Bloqueado">Bloqueado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>
                        Cargando lista de usuarios...
                    </div>
                ) : (
                    <DataTable
                        data={usuariosFiltradosYOrdenados}
                        columns={columns}
                        onSort={handleSort}
                        currentSort={sortConfig}
                        onToggleStatus={handleToggleStatus} 
                    />
                )}   
            </div>
        </div>
    );
}