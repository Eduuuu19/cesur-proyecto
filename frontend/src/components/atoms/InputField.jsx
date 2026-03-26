import React, { useState } from 'react';
import { FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi'; // Importamos los iconos
import styles from './InputField.module.css';

export default function InputField({ label, type, placeholder, value, onChange, onClear, isRequired }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>
        {label}
        {/* Si es un campo obligatorio se pinta con un asterisco */}
        {isRequired && <span className={styles.requiredMark}>*</span>}
      </label>
      
      <div className={styles.inputWrapper}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.inputField}
        />
        
        {isPassword && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className={styles.iconButton}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}

        {!isPassword && value !== '' && onClear && (
          <button 
            type="button" 
            onClick={onClear} 
            className={`${styles.iconButton} ${styles.iconButtonDanger}`}
          >
            <FiXCircle size={18} />
          </button>
        )}
      </div>
    </div>
  );
}