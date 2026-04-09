import React from 'react';
import styles from './FormFields.module.css';

export default function FormSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false, 
  error,
  defaultOptionLabel = "Seleccione una opción..."
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select 
        id={name}
        name={name} 
        value={value} 
        onChange={onChange}
        className={error ? styles.inputError : styles.inputBase}
      >
        <option value="" disabled>{defaultOptionLabel}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}