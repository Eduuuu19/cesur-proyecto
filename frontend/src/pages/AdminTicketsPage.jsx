import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import api from '../services/axiosConfig';
import DataTable from '../components/molecules/DataTable';
import styles from './SharedPage.module.css';

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'fechaCreacion', direction: 'desc' });

    // Estado para el modal de lectura
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/tickets');
            setTickets(response.data);
        } catch (error) {
            setErrorMessage('Error al cargar los tickets de soporte.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    // Lógica de filtrado y ordenación
    const ticketsFiltrados = useMemo(() => {
        let res = tickets.filter(t => {
            const coincideBusqueda = t.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.emailUsuario.toLowerCase().includes(searchTerm.toLowerCase());
            const coincideEstado = statusFilter ? t.estado === statusFilter : true;
            return coincideBusqueda && coincideEstado;
        });

        if (sortConfig.key) {
            res.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return res;
    }, [tickets, searchTerm, statusFilter, sortConfig]);

    // Función para resolver ticket
    const handleResolve = async (ticket) => {
        if (window.confirm(`¿Marcar como resuelto el ticket: "${ticket.asunto}"?`)) {
            try {
                await api.put(`/admin/tickets/${ticket.id}/resolve`);
                fetchTickets(); // Recargamos la lista
                setSelectedTicket(null); // Cerramos modal si estaba abierto
            } catch (error) {
                alert("No se pudo actualizar el estado del ticket.");
            }
        }
    };

    // Formatear fecha ISO a algo legible (DD/MM/YYYY)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const columns = [
        { key: 'fechaCreacion', label: 'Fecha', sortable: true, render: (row) => formatDate(row.fechaCreacion) },
        { key: 'emailUsuario', label: 'Usuario', sortable: true },
        { key: 'tipoConsulta', label: 'Tipo' },
        { key: 'asunto', label: 'Asunto' },
        { key: 'estado', label: 'Estado', sortable: true }
    ];

    return (
        <div className={styles.pageContainer}>
            <div className={styles.breadcrumbs}>Panel de Control &gt; Tickets</div>
            <h1 className={styles.title}>Centro de Soporte</h1>

            {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}

            <div className={styles.contentCard}>
                <div className={styles.toolbar}>
                    <div style={{ flex: 1 }}></div>
                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Buscar por asunto o email..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.selectBox}>
                            <FiFilter className={styles.filterIcon} />
                            <select className={styles.statusSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="">Todos los estados</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="RESUELTO">Resueltos</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loadingState}>Cargando incidencias...</div>
                ) : (
                    <DataTable
                        data={ticketsFiltrados}
                        columns={columns}
                        onView={(row) => setSelectedTicket(row)}
                        onResolve={handleResolve}
                        onSort={(key) => setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                        currentSort={sortConfig}
                    />
                )}
            </div>

            {/* MODAL SIMPLE PARA LEER EL TICKET */}
            {selectedTicket && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>

                        <button className={styles.closeBtn} onClick={() => setSelectedTicket(null)}>
                            <FiX size={24} />
                        </button>

                        <h2 className={styles.modalTitle}>{selectedTicket.asunto}</h2>

                        <p className={styles.modalMeta}>
                            De: <strong>{selectedTicket.emailUsuario}</strong> | {formatDate(selectedTicket.fechaCreacion)}
                        </p>

                        <hr className={styles.modalDivider} />

                        <div className={styles.modalMessage}>
                            {selectedTicket.mensaje}
                        </div>

                        {selectedTicket.estado !== 'RESUELTO' && (
                            <button
                                className={styles.btnResolve}
                                onClick={() => handleResolve(selectedTicket)}
                            >
                                Marcar como Resuelto
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}