import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import GenericModal from '../atoms/GenericModal';
import FormInput from '../molecules/FormInput';
import FormSelect from '../molecules/FormSelect';
import styles from './SharedModal.module.css';

export default function FacturasEmitidasModal({ isOpen, onClose, onSave, clientes, initialData }) {
  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    clienteId: '',
    numeroFactura: '',
    fechaEmision: '',
    estado: 'Pendiente',
    baseImponible: '',
    iva: '21'
  });

  // ESTADO DE ERRORES
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');

  // FUNCIÓN DEL FORMULARIO AL ABRIR
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          // CAMBIO AQUÍ: Usamos idCliente en lugar de id
          clienteId: initialData.cliente?.idCliente?.toString() || '',
          numeroFactura: initialData.numeroFactura,
          fechaEmision: initialData.fecha,
          estado: initialData.estado,
          // Calculamos la base imponible a partir del total que manda Java
          baseImponible: (initialData.total / 1.21).toFixed(2),
          iva: '21'
        });
      } else {
        setFormData({ clienteId: '', numeroFactura: '', fechaEmision: '', estado: 'Pendiente', baseImponible: '', iva: '21' });
      }
      setErrors({});
      setBackendError('');
    }
  }, [isOpen, initialData]);

  // CÁLCULO EN TIEMPO REAL DEL TOTAL DE LA FACTURA
  const totalCalculado = formData.baseImponible
    ? (parseFloat(formData.baseImponible) * (1 + parseFloat(formData.iva) / 100)).toFixed(2)
    : '0.00';

  // MANEJADOR DE CAMBIOS EN LOS CAMPOS DEL FORMULARIO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (backendError) setBackendError('');
  };

  // VALIDACIÓN Y GUARDADO
  // VALIDACIÓN Y GUARDADO
  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.clienteId) newErrors.clienteId = 'Debe seleccionar un cliente';
    if (!formData.numeroFactura.trim()) newErrors.numeroFactura = 'El número de la factura es obligatorio';
    if (!formData.fechaEmision) newErrors.fechaEmision = 'La fecha es obligatoria';
    if (!formData.estado) newErrors.estado = 'El estado es obligatorio';
    if (!formData.baseImponible) newErrors.baseImponible = 'Indique la base imponible';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const invoicePayload = {
      numeroFactura: formData.numeroFactura,
      fecha: formData.fechaEmision,
      baseImponible: parseFloat(formData.baseImponible),
      iva: parseFloat(formData.iva),
      estado: formData.estado,
      cliente: {
        idCliente: parseInt(formData.clienteId)
      }
    };

    try {
      setBackendError('');
      await onSave(invoicePayload);
    } catch (error) {
      setBackendError(error.message);
    }
  };

  // OPCIONES PARA LOS SELECTS
  const clientesOptions = clientes?.map(cli => ({ value: cli.idCliente, label: `${cli.nombre} (${cli.nif})` })) || []; const estadoOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Pagada', label: 'Pagada' },
    { value: 'Vencida', label: 'Vencida' }
  ];
  const ivaOptions = [
    { value: '21', label: '21% (General)' },
    { value: '10', label: '10% (Reducido)' },
    { value: '4', label: '4% (Superreducido)' },
    { value: '0', label: '0% (Exento)' }
  ];

  // 
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Factura" : "Añadir Factura Emitida"}
      actionPrimaryLabel="Guardar"
      actionPrimaryOnclick={handleSubmit}
      actionSecondaryLabel="Cancelar"
      actionSecondaryOnclick={onClose}
    >

      {backendError && (
        <div className={styles.alertDanger}>
          <FiAlertCircle size={18} />
          <span>{backendError}</span>
        </div>
      )}

      {/* SECCIÓN 1: DATOS GENERALES */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Datos Generales</h3>
        <div className={styles.grid2}>
          <FormSelect
            label="Seleccione un cliente"
            name="clienteId"
            required={true}
            value={formData.clienteId}
            onChange={handleChange}
            options={clientesOptions}
            error={errors.clienteId}
          />
          <FormInput
            label="Número de Factura"
            name="numeroFactura"
            placeholder="Ej: F2026-001"
            required={true}
            value={formData.numeroFactura}
            onChange={handleChange}
            error={errors.numeroFactura}
          />
          <FormInput
            type="date"
            label="Fecha de Emisión"
            name="fechaEmision"
            required={true}
            value={formData.fechaEmision}
            onChange={handleChange}
            error={errors.fechaEmision}
          />
          <FormSelect
            label="Estado"
            name="estado"
            required={true}
            value={formData.estado}
            onChange={handleChange}
            options={estadoOptions}
            error={errors.estado}
          />
        </div>
      </section>

      {/* SECCIÓN 2: CÁLCULO ECONÓMICO */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cálculo Económico</h3>
        <div className={styles.calculoContainer}>
          <div className={styles.grid2}>
            <FormInput
              type="number"
              label="Base Imponible"
              name="baseImponible"
              placeholder="Cantidad total en euros..."
              required={true}
              value={formData.baseImponible}
              onChange={handleChange}
              error={errors.baseImponible}
            />
            <FormSelect
              label="IVA (%)"
              name="iva"
              required={true}
              value={formData.iva}
              onChange={handleChange}
              options={ivaOptions}
            />
          </div>

          <div className={styles.totalWrapper}>
            <span className={styles.totalLabel}>Total Factura:</span>
            <span className={styles.totalAmount}>
              {Number(totalCalculado).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
            </span>
          </div>
        </div>
      </section>

    </GenericModal>
  );
}