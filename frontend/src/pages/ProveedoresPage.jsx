import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import ProveedorModal from '../components/organisms/ProveedorModal';
import styles from './SharedPage.module.css';

export default function ProveedoresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Datos de ejemplo para mostrar en la tabla
    const [proveedores, setProveedores] = useState([
        {
            idProveedor: 1,
            nombre: "Suministros Globales S.A.",
            nif: "A11111111",
            direccion: "Polígono Industrial Sur, Nave 3",
            email: "ventas@suministrosglobales.es",
            telefono: "+34 912345678",
            estado: "Activo"
        }
    ]);

    // Configuración de columnas
    const columns = [
        { key: 'nombre', label: 'Razón Social', sortable: true },
        { key: 'nif', label: 'CIF/NIF', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'estado', label: 'Estado', sortable: true }
    ];

    // Función de ejemplo para simular la creación de un proveedor a partir de los datos del modal
    const handleSaveProveedor = (formData) => {
        const nuevoProveedor = {
            idProveedor: Date.now(),
            nombre: formData.nombre,
            nif: formData.nif,
            direccion: formData.direccion,
            email: formData.email,
            telefono: formData.telefono,
            estado: formData.estado
        };

        setProveedores([nuevoProveedor, ...proveedores]);
        setIsModalOpen(false);
    };

    // Funciones para los botones
    const handleEdit = (row) => console.log("Editar proveedor:", row.idProveedor);
    const handleDelete = (row) => console.log("Borrar proveedor:", row.idProveedor);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.breadcrumbs}>Maestros &gt; Proveedores</div>
            <h1 className={styles.title}>Proveedores</h1>

            <div className={styles.contentCard}>
                <div className={styles.toolbar}>
                    <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
                        <FiPlus size={18} /> Añadir proveedor
                    </button>

                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <FiSearch className={styles.searchIcon} />
                            <input type="text" placeholder="Buscar por Nombre..." className={styles.searchInput} />
                        </div>

                        <div className={styles.selectBox}>
                            <FiFilter className={styles.filterIcon} />
                            <select className={styles.statusSelect} defaultValue="">
                                <option value="" disabled>Estado</option>
                                <option value="todos">Todos</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <DataTable data={proveedores} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <ProveedorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProveedor}
            />
        </div>
    );
}