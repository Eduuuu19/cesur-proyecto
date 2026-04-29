import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import logo from '../assets/logo.png';
import Button from '../components/atoms/Button';
import Checkbox from '../components/atoms/Checkbox';
import InputField from '../components/atoms/InputField';

export default function LoginPage() {
  // memoria para los campos del formulario y recordar credenciales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Estados para manejar el feedback visual
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Por favor, rellena todos los campos.');
    }

    const payload = {
      email: email,
      password: password,
      recordarCredenciales: rememberMe
    };

    try {
      setIsLoading(true);

      const response = await api.post('/auth/login', payload);
      const token = response.data.token;

      // Guardar el token en el almacenamiento adecuado
      if (rememberMe) {
        localStorage.setItem('konta_token', token);
      } else {
        sessionStorage.setItem('konta_token', token);
      }

      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      if (decodedPayload.rol === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
    catch (error) {
      console.error(error);
      // Captura de errores
      if (error.response) {
        if (error.response.status === 401 && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        }
        else if (error.response.status >= 400 && error.response.status < 500) {
          setErrorMessage('Correo electrónico o contraseña incorrectos.');
        }
        else {
          setErrorMessage(`Error interno del servidor (${error.response.status}).`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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

        {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}

        <form className={styles.formContainer} onSubmit={handleSubmit}>

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
            text={isLoading ? "Verificando..." : "Iniciar Sesión"}
            type="submit"
            disabled={isLoading}
          />

        </form>

        <div className={styles.footerContainer}>
          <p>¿No tienes una cuenta? <Link to="/register" className={styles.registerLink}>Regístrate</Link></p>
        </div>

      </div>
    </div>
  );
}