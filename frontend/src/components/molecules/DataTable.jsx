import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiLock, FiUnlock, FiEye, FiCheck } from 'react-icons/fi';
import styles from './DataTable.module.css';

export default function DataTable({ data = [], columns = [], onEdit, onDelete, onToggleStatus, onSort, onView, onResolve, currentSort, itemsPerPage = 10 }) {

    {/* Lógica de paginación */ }
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    {/* Función auxiliar para pintar las "píldoras" de estado con sus colores */ }
    const renderStatus = (status) => {
        const statusLower = status.toLowerCase();
        let pillClass = styles.pillDefault;

        if (['pagada', 'aceptado', 'activo'].includes(statusLower)) pillClass = styles.pillSuccess;
        if (['pendiente'].includes(statusLower)) pillClass = styles.pillWarning;
        if (['vencida', 'rechazado', 'bloqueado'].includes(statusLower)) pillClass = styles.pillDanger;

        return <span className={`${styles.pill} ${pillClass}`}>{status}</span>;
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.checkboxCell}>
                            <input type="checkbox" className={styles.checkbox} />
                        </th>

                        {columns.map((col, index) => (
                            <th
                                key={index}
                                onClick={() => col.sortable && onSort && onSort(col.key)}
                                className={col.sortable ? styles.sortableHeader : ''}
                            >
                                <div className={styles.thContent}>
                                    {col.label}
                                    {col.sortable && (
                                        <div className={styles.sortIcons}>
                                            <FiChevronUp
                                                size={12}
                                                color={currentSort?.key === col.key && currentSort?.direction === 'asc' ? '#0f172a' : '#7e8a9b'}
                                            />
                                            <FiChevronDown
                                                size={12}
                                                color={currentSort?.key === col.key && currentSort?.direction === 'desc' ? '#0f172a' : '#7e8a9b'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </th>
                        ))}

                        <th className={styles.actionsCell}>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className={styles.checkboxCell}>
                                <input type="checkbox" className={styles.checkbox} />
                            </td>

                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.key === 'estado'
                                        ? renderStatus(row[col.key])
                                        : col.render
                                            ? col.render(row)
                                            : row[col.key]}
                                </td>
                            ))}

                            <td className={styles.actionsCell}>
                                {onEdit && (
                                    <button className={styles.actionBtn} onClick={() => onEdit(row)}>
                                        <FiEdit2 size={16} />
                                    </button>
                                )}
                                {onDelete && (
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(row)}>
                                        <FiTrash2 size={16} />
                                    </button>
                                )}
                                {onToggleStatus && (
                                    <button
                                        className={`${styles.actionBtn} ${row.estado === 'Bloqueado' ? styles.activateBtn : styles.blockBtn}`}
                                        onClick={() => onToggleStatus(row)}
                                        title={row.estado === 'Bloqueado' ? 'Activar Usuario' : 'Bloquear Usuario'}
                                    >
                                        {row.estado === 'Bloqueado' ? <FiUnlock size={16} /> : <FiLock size={16} />}
                                    </button>
                                )}
                                {onView && (
                                    <button className={styles.actionBtn} onClick={() => onView(row)} title="Ver Mensaje">
                                        <FiEye size={16} />
                                    </button>
                                )}

                                {onResolve && row.estado !== 'RESUELTO' && (
                                    <button className={`${styles.actionBtn} ${styles.activateBtn}`} onClick={() => onResolve(row)} title="Marcar como Resuelto">
                                        <FiCheck size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}

                    {paginatedData.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 2} className={styles.emptyMessage}>
                                No hay datos para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 0 && (
                <div className={styles.paginationContainer}>
                    <span className={styles.paginationText}>
                        Mostrando <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                    </span>

                    <div className={styles.paginationButtons}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}