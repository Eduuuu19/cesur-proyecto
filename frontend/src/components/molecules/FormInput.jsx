import React from 'react';
import styles from './FormFields.module.css'; 

export default function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error 
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input 
        id={name}
        type={type} 
        name={name} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
        className={error ? styles.inputError : styles.inputBase}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}