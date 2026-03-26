import React, { useState } from 'react';
import styles from './RegisterPage.module.css';
import logo from '../assets/logo.png';
import InputField from '../components/atoms/InputField';
import Button from '../components/atoms/Button';
import Checkbox from '../components/atoms/Checkbox';

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    return (
        <div className={styles.backgroundWrapper}>
            <div className={styles.overlay}></div>

            <div className={styles.loginCard}>

                <div className={styles.headerContainer}>
                    <img src={logo} alt="Logo de Konta" className={styles.logo} />
                    <h1 className={styles.appTitle}>Konta</h1>
                </div>

                <h2 className={styles.welcomeText}>Crea tu cuenta</h2>
                <p className={styles.subtitle}>Empieza a controlar tus finanzas.</p>

                <form className={styles.formContainer}>

                    <InputField
                        label="Nombre / Razón social"
                        type="text"
                        placeholder="Nombre completo"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onClear={() => setFirstName('')}
                        isRequired={true}
                    />

                    <InputField
                        label="Correo electrónico"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClear={() => setEmail('')}
                        isRequired={true}
                    />

                    <InputField
                        label="Teléfono (Opcional)"
                        type="tel"
                        placeholder="Ej: +34 600 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onClear={() => setPhone('')}
                    />

                    <InputField
                        label="Contraseña"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isRequired={true}
                    />

                    <InputField
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        isRequired={true}
                    />


                    <Checkbox
                        label="Acepto los términos y condiciones"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                    />

                    <Button
                        text="Crear cuenta"
                        type="submit"
                    />

                </form>

                <div className={styles.footerContainer}>
                    <p>¿Ya tienes una cuenta? <a href="#" className={styles.registerLink}>Inicia sesión</a></p>
                </div>

            </div>
        </div>
    );
}