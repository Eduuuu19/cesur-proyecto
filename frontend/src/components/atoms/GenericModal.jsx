import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './GenericModal.module.css';


export default function GenericModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actionPrimaryLabel = 'Guardar', 
  actionPrimaryOnclick,
  actionSecondaryLabel = 'Cancelar', 
  actionSecondaryOnclick,
  isActionPrimaryDisabled = false
}) {
  
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} aria-modal="true" role="dialog">
      
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* CABECERA */}
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar ventana">
            <FiX size={24} />
          </button>
        </div>

        {/* CUERPO DINÁMICO */}
        <div className={styles.modalBody}>
          {children}
        </div>

        {/* FOOTER */}
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={actionSecondaryOnclick || onClose}>
            {actionSecondaryLabel}
          </button>
          <button 
            className={styles.btnSave} 
            onClick={actionPrimaryOnclick}
            disabled={isActionPrimaryDisabled}
          >
            {actionPrimaryLabel}
          </button>
        </div>

      </div>
    </div>
  );
}