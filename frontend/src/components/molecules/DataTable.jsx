import React from 'react';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import styles from './DataTable.module.css';

export default function DataTable({ data = [], columns = [], onEdit, onDelete }) {

    // Función auxiliar para pintar las "píldoras" de estado con sus colores
    const renderStatus = (status) => {
        const statusLower = status.toLowerCase();
        let pillClass = styles.pillDefault;

        if (['pagada', 'aceptado'].includes(statusLower)) pillClass = styles.pillSuccess;
        if (['pendiente'].includes(statusLower)) pillClass = styles.pillWarning;
        if (['vencida', 'rechazado'].includes(statusLower)) pillClass = styles.pillDanger;

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
                            <th key={index}>
                                <div className={styles.thContent}>
                                    {col.label}
                                    {col.sortable && (
                                        <div className={styles.sortIcons}>
                                            <FiChevronUp size={12} />
                                            <FiChevronDown size={12} />
                                        </div>
                                    )}
                                </div>
                            </th>
                        ))}

                        <th className={styles.actionsCell}>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, rowIndex) => (
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
                                <button className={styles.actionBtn} onClick={() => onEdit && onEdit(row)}>
                                    <FiEdit2 size={16} />
                                </button>
                                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete && onDelete(row)}>
                                    <FiTrash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 2} className={styles.emptyMessage}>
                                No hay datos para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}