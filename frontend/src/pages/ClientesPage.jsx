import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import ClienteModal from '../components/organisms/ClienteModal';
import styles from './SharedPage.module.css';

export default function ClientesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Datos de ejemplo para mostrar en la tabla
    const [clientes, setClientes] = useState([
        {
            idCliente: 1,
            nombre: "Tech Solutions S.L.",
            nif: "A00000000", // Puesto diferente para no hacer saltar la alerta por defecto
            direccion: "Calle Innovación 45, Madrid",
            email: "contacto@techsolutions.com",
            telefono: "600111222",
            estado: "Activo"
        }
    ]);

    // Configuración de columnas
    const columns = [
        { key: 'nombre', label: 'Razón Social', sortable: true },
        { key: 'nif', label: 'NIF/CIF', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'estado', label: 'Estado', sortable: true }
    ];

    // Función de ejemplo para simular la creación de un cliente a partir de los datos del modal
    const handleSaveCliente = (formData) => {
        const nuevoCliente = {
            idCliente: Date.now(),
            nombre: formData.nombre,
            nif: formData.nif,
            direccion: formData.direccion,
            email: formData.email,
            telefono: formData.telefono,
            estado: formData.estado
        };

        setClientes([nuevoCliente, ...clientes]);
        setIsModalOpen(false);
    };

    // Funciones para los botones
    const handleEdit = (row) => console.log("Editar cliente:", row.idCliente);
    const handleDelete = (row) => console.log("Borrar cliente:", row.idCliente);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.breadcrumbs}>Maestros &gt; Clientes</div>
            <h1 className={styles.title}>Clientes</h1>

            <div className={styles.contentCard}>
                <div className={styles.toolbar}>
                    <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
                        <FiPlus size={18} /> Añadir cliente
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

                <DataTable data={clientes} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <ClienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCliente}
            />
        </div>
    );
}