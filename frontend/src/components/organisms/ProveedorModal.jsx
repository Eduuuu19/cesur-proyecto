import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import GenericModal from '../atoms/GenericModal';
import FormInput from '../molecules/FormInput';
import FormSelect from '../molecules/FormSelect';
import styles from './DocumentModal.module.css';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

export default function ProveedorModal({ isOpen, onClose, onSave }) {

    // ESTADO DEL FORMULARIO 
    const [formData, setFormData] = useState({
        nombre: '',
        nif: '',
        direccion: '',
        email: '',
        telefono: '',
        estado: 'Activo'
    });

    // ESTADO DE ERRORES
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');

    // LIMPIAR EL FORMULARIO AL ABRIR
    useEffect(() => {
        if (isOpen) {
            setFormData({ nombre: '', nif: '', direccion: '', email: '', telefono: '', estado: 'Activo' });
            setErrors({});
            setBackendError('');
        }
    }, [isOpen]);

    // MANEJADOR DE CAMBIOS EN LOS CAMPOS DEL FORMULARIO
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        if (backendError) setBackendError('');
    };

    // VALIDACIÓN Y GUARDADO
    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'La Razón Social es obligatoria';
        if (!formData.nif.trim()) newErrors.nif = 'El CIF/NIF es obligatorio';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Simulamos un CIF duplicado distinto para proveedores
        if (formData.nif.toUpperCase() === 'A98765432') {
            setBackendError('Error: Ya tienes un proveedor registrado con el CIF A98765432.');
            return;
        }

        onSave(formData);
    };

    // OPCIONES PARA LOS SELECTS
    const estadoOptions = [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' }
    ];

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Añadir Proveedor"
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
                <h3 className={styles.sectionTitle}>Datos Fiscales</h3>
                <div className={styles.formStack}>
                    <FormInput label="Razón Social / Nombre" name="nombre" placeholder="Ej: Suministros Globales S.A." required={true} value={formData.nombre} onChange={handleChange} error={errors.nombre} />
                    <div className={styles.grid2}>
                        <FormInput label="CIF / NIF" name="nif" placeholder="Ej: A98765432" required={true} value={formData.nif} onChange={handleChange} error={errors.nif} />
                        <FormInput label="Dirección Fiscal" name="direccion" placeholder="Calle, Número, Ciudad..." required={true} value={formData.direccion} onChange={handleChange} error={errors.direccion} />
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Contacto</h3>
                <div className={styles.formStack}>
                    <FormInput type="email" label="Email" name="email" placeholder="proveedores@empresa.com" value={formData.email} onChange={handleChange} error={errors.email} />

                    <div className={styles.grid2}>
                        <div className={styles.phoneContainer}>
                            <label className={styles.phoneLabel}>Teléfono</label>
                            <PhoneInput
                                placeholder="Ej: 600 000 000"
                                value={formData.telefono}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, telefono: val }));
                                    if (backendError) setBackendError('');
                                }}
                                defaultCountry="ES"
                            />
                        </div>
                        <FormSelect label="Estado" name="estado" required={true} value={formData.estado} onChange={handleChange} options={estadoOptions} />
                    </div>
                </div>
            </section>

        </GenericModal>
    );
}