import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import GenericModal from '../atoms/GenericModal';
import FormInput from '../molecules/FormInput';
import FormSelect from '../molecules/FormSelect';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import styles from './SharedModal.module.css';

export default function ClienteModal({ isOpen, onClose, onSave, initialData }) {    
    
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

    // LIMPIAR O RELLENAR EL FORMULARIO AL ABRIR
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({ nombre: '', nif: '', direccion: '', email: '', telefono: '', estado: 'Activo' });
            }
            setErrors({});
            setBackendError('');
        }
    }, [isOpen, initialData]); 

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
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre o Razón Social es obligatorio';
        if (!formData.nif.trim()) newErrors.nif = 'El NIF/CIF es obligatorio';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';

        // Validación básica de email 
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setBackendError('');
            await onSave(formData); 
        } catch (error) {
            setBackendError(error.message);
        }

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
            title="Añadir Cliente"
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

            {/* SECCIÓN 1: DATOS FISCALES */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Datos Fiscales</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <FormInput label="Razón Social / Nombre" name="nombre" placeholder="Ej: Tech Solutions S.L." required={true} value={formData.nombre} onChange={handleChange} error={errors.nombre} />

                    <div className={styles.grid2}>
                        <FormInput label="NIF / CIF" name="nif" placeholder="Ej: B12345678" required={true} value={formData.nif} onChange={handleChange} error={errors.nif} />
                        <FormInput label="Dirección Fiscal" name="direccion" placeholder="Calle, Número, Ciudad..." required={true} value={formData.direccion} onChange={handleChange} error={errors.direccion} />
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: CONTACTO */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Contacto</h3>
                <div className={styles.formStack}>
                    <FormInput type="email" label="Email" name="email" placeholder="ejemplo@correo.com" value={formData.email} onChange={handleChange} error={errors.email} />

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