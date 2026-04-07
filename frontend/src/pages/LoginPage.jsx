import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Button from '../components/atoms/Button';
import Checkbox from '../components/atoms/Checkbox';
import InputField from '../components/atoms/InputField';

export default function LoginPage() {
  // memoria para los campos del formulario y recordar credenciales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.overlay}></div>

      <div className={styles.loginCard}>
        
        <div className={styles.headerContainer}>
          <img src={logo} alt="Logo de Konta" className={styles.logo} />
          <h1 className={styles.appTitle}>Konta</h1>
        </div>
        
        <h2 className={styles.welcomeText}>Bienvenido de nuevo</h2>
        <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>

        <form className={styles.formContainer}>
          
          <InputField 
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onClear={() => setEmail('')}
          />

          <InputField 
            label="Contraseña"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={styles.optionsRow}>
            <Checkbox
              label="Recordar por 30 días"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <a href="#" className={styles.forgotPasswordLink}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>


          <Button 
            text="Iniciar Sesión" 
            type="submit" 
          />
                    
        </form>

        <div className={styles.footerContainer}>
          <p>¿No tienes una cuenta? <Link to="/register" className={styles.registerLink}>Regístrate</Link></p>
        </div>

      </div>
    </div>
  );
}