import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../components/molecules/DataTable';
import FacturasEmitidasModal from '../components/organisms/FacturasEmitidasModal';
import styles from './SharedPage.module.css';

export default function FacturasEmitidasPage() {

  // Controlar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Guardar la factura que estamos editando 
  const [facturaEditando, setFacturaEditando] = useState(null);

  // facturas de ejemplo para mostrar en la tabla
  const [facturas, setFacturas] = useState([
    {
      idFacturaEmitida: 1,
      numeroFactura: "F001",
      fecha: "15 Mar 2026",
      concepto: "Desarrollo web",
      baseImponible: 1000.0,
      iva: 21.0,
      total: 2300.0,
      estado: "Pagada",
      cliente: { idCliente: 1, nombre: "Cliente 1", nif: "B00000001" }
    },
    {
      idFacturaEmitida: 2,
      numeroFactura: "F002",
      fecha: "17 Mar 2026",
      concepto: "Mantenimiento",
      baseImponible: 500.0,
      iva: 21.0,
      total: 1100.0,
      estado: "Pendiente",
      cliente: { idCliente: 2, nombre: "Cliente 2", nif: "B00000002" }
    },
    {
      idFacturaEmitida: 3,
      numeroFactura: "F003",
      fecha: "10 Abril 2026",
      concepto: "Auditoría SEO",
      baseImponible: 800.0,
      iva: 21.0,
      total: 3500.0,
      estado: "Vencida",
      cliente: { idCliente: 3, nombre: "Cliente 3", nif: "B00000003" }
    },
    {
      idFacturaEmitida: 4,
      numeroFactura: "F004",
      fecha: "15 Mar 2026",
      concepto: "Desarrollo web",
      baseImponible: 1000.0,
      iva: 21.0,
      total: 2300.0,
      estado: "Pagada",
      cliente: { idCliente: 1, nombre: "Cliente 1", nif: "B00000001" }
    },
    {
      idFacturaEmitida: 5,
      numeroFactura: "F005",
      fecha: "17 Mar 2026",
      concepto: "Mantenimiento",
      baseImponible: 500.0,
      iva: 21.0,
      total: 1100.0,
      estado: "Pendiente",
      cliente: { idCliente: 2, nombre: "Cliente 2", nif: "B00000002" }
    },
    {
      idFacturaEmitida: 6,
      numeroFactura: "F006",
      fecha: "10 Abril 2026",
      concepto: "Auditoría SEO",
      baseImponible: 800.0,
      iva: 21.0,
      total: 3500.0,
      estado: "Vencida",
      cliente: { idCliente: 3, nombre: "Cliente 3", nif: "B00000003" }
    }
  ]);

  // Clientes de ejemplo para los selects del modal
  const mockClientes = [
    { id: 1, nombre: "Cliente 1", nif: "B00000001" },
    { id: 2, nombre: "Cliente 2", nif: "B00000002" },
    { id: 3, nombre: "Cliente 3", nif: "B00000003" }
  ];

  // Configuración de columnas para la tabla
  const columns = [
    { key: 'numeroFactura', label: 'Factura', sortable: true },
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'cliente', label: 'Cliente', render: (row) => row.cliente.nombre },
    { key: 'nif', label: 'NIF', render: (row) => row.cliente.nif },
    { key: 'total', label: 'Importe', render: (row) => `${row.total.toLocaleString('es-ES')}€` },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Función para abrir el modal en modo creación
  const handleOpenNew = () => {
    setFacturaEditando(null);
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEdit = (factura) => {
    setFacturaEditando(factura);
    setIsModalOpen(true);
  };

  // Función unificada para cerrar el modal y limpiar el estado de edición
  const handleClose = () => {
    setIsModalOpen(false);
    setFacturaEditando(null);
  };

  // Función para simular el borrado
  const handleDelete = (factura) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar la factura ${factura.numeroFactura}?`);
    if (confirmar) {
      const facturasRestantes = facturas.filter(f => f.idFacturaEmitida !== factura.idFacturaEmitida);
      setFacturas(facturasRestantes);
    }
  };

  const handleSaveFactura = (formData) => {
    const totalCalculado = parseFloat(formData.baseImponible) * (1 + parseFloat(formData.iva) / 100);
    const clienteSeleccionado = mockClientes.find(c => c.id.toString() === formData.clienteId);

    const datosFactura = {
      numeroFactura: formData.numeroFactura,
      fecha: formData.fechaEmision,
      concepto: "Varios",
      baseImponible: parseFloat(formData.baseImponible),
      iva: parseFloat(formData.iva),
      total: totalCalculado,
      estado: formData.estado,
      cliente: clienteSeleccionado
    };

    if (facturaEditando) {
      // MODO EDICIÓN: 
      const facturasActualizadas = facturas.map(f =>
        f.idFacturaEmitida === facturaEditando.idFacturaEmitida ? { ...f, ...datosFactura } : f
      );
      setFacturas(facturasActualizadas);
    } else {
      // MODO CREACIÓN:
      const nuevaFactura = {
        idFacturaEmitida: Date.now(),
        ...datosFactura
      };
      setFacturas([nuevaFactura, ...facturas]);
    }

    handleClose();
  };

  return (
    <div className={styles.pageContainer}>

      {/* Migas de pan y Título */}
      <div className={styles.breadcrumbs}>Ingresos &gt; Facturas emitidas</div>
      <h1 className={styles.title}>Facturas Emitidas</h1>

      {/* Contenedor Principal */}
      <div className={styles.contentCard}>

        {/* Toolbar Superior: Filtros y Botón de Añadir */}
        <div className={styles.toolbar}>

          {/* CORRECCIÓN: Conectamos el botón a handleOpenNew en lugar de setIsModalOpen directamente */}
          <button className={styles.btnAdd} onClick={handleOpenNew}>
            <FiPlus size={18} /> Añadir factura
          </button>

          <div className={styles.filters}>
            {/* Buscador por NIF */}
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input type="text" placeholder="Buscar por NIF..." className={styles.searchInput} />
            </div>

            {/* Filtro por Estado */}
            <div className={styles.selectBox}>
              <FiFilter className={styles.filterIcon} />
              <select className={styles.statusSelect} defaultValue="">
                <option value="" disabled>Estado</option>
                <option value="todas">Todas</option>
                <option value="pagada">Pagada</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencida">Vencida</option>
              </select>
            </div>
          </div>

        </div>

        {/* Tabla de Datos */}
        <DataTable
          data={facturas}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* Modal para añadir/editar factura */}
      <FacturasEmitidasModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSaveFactura}
        clientes={mockClientes}
        facturaEditando={facturaEditando}
      />

    </div>
  );
}