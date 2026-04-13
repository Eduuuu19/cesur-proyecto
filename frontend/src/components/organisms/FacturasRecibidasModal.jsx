import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import GenericModal from '../atoms/GenericModal';
import FormInput from '../molecules/FormInput';
import FormSelect from '../molecules/FormSelect';
import styles from './DocumentModal.module.css';

export default function FacturasRecibidasModal({ isOpen, onClose, onSave, proveedores, initialData }) {

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    proveedorId: '',
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
          proveedorId: initialData.proveedor?.idProveedor?.toString() || '',
          numeroFactura: initialData.numeroFactura,
          fechaEmision: initialData.fecha,
          estado: initialData.estado,
          baseImponible: (initialData.total / 1.21).toFixed(2),
          iva: '21'
        });
      } else {
        setFormData({ proveedorId: '', numeroFactura: '', fechaEmision: '', estado: 'Pendiente', baseImponible: '', iva: '21' });
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
  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.proveedorId) newErrors.proveedorId = 'Debe seleccionar un proveedor';
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
      proveedor: {
        idProveedor: parseInt(formData.proveedorId)
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
  const proveedoresOptions = proveedores?.map(prov => ({ 
    value: prov.idProveedor, 
    label: `${prov.nombre} (${prov.nif})` 
  })) || [];

  const estadoOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Pagada', label: 'Pagada' },
    { value: 'Vencida', label: 'Vencida' }
  ];

  const ivaOptions = [
    { value: '21', label: '21% (General)' },
    { value: '10', label: '10% (Reducido)' },
    { value: '0', label: '0% (Exento)' }
  ];

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Factura Recibida" : "Añadir Factura Recibida"}
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

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Datos Generales</h3>
        <div className={styles.formStack}>
          <div className={styles.grid2}>
            <FormSelect label="Seleccione un proveedor" name="proveedorId" required={true} value={formData.proveedorId} onChange={handleChange} options={proveedoresOptions} error={errors.proveedorId} />
            <FormInput label="Número de Factura" name="numeroFactura" placeholder="Ej: FAC-2026/04" required={true} value={formData.numeroFactura} onChange={handleChange} error={errors.numeroFactura} />
          </div>
          <div className={styles.grid2}>
            <FormInput type="date" label="Fecha de Emisión" name="fechaEmision" required={true} value={formData.fechaEmision} onChange={handleChange} error={errors.fechaEmision} />
            <FormSelect label="Estado" name="estado" required={true} value={formData.estado} onChange={handleChange} options={estadoOptions} error={errors.estado} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cálculo Económico</h3>
        <div className={styles.calculoContainer}>
          <div className={styles.grid2}>
            <FormInput type="number" label="Base Imponible" name="baseImponible" required={true} value={formData.baseImponible} onChange={handleChange} error={errors.baseImponible} />
            <FormSelect label="IVA (%)" name="iva" required={true} value={formData.iva} onChange={handleChange} options={ivaOptions} />
          </div>
          <div className={styles.totalWrapper}>
            <span className={styles.totalLabel}>Total Factura:</span>
            <span className={styles.totalAmount}>{Number(totalCalculado).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</span>
          </div>
        </div>
      </section>
    </GenericModal>
  );
}