import { useState } from 'react';
import styles from './RegisterPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import InputField from '../components/atoms/InputField';
import Button from '../components/atoms/Button';
import Checkbox from '../components/atoms/Checkbox';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import axios from 'axios';



export default function RegisterPage() {

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        // Validaciones básicas
        if (!firstName.trim()) return setErrorMessage('El nombre es obligatorio.');
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setErrorMessage('Introduce un email válido.');
        if (password.length < 6) return setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        if (password !== confirmPassword) return setErrorMessage('Las contraseñas no coinciden.');
        if (!acceptTerms) return setErrorMessage('Debes aceptar los términos y condiciones.');

        const payload = {
            nombreUsuario: firstName,
            email: email,
            telefono: phone || "",
            password: password
        };

        try {
            setIsLoading(true);

            const response = await axios.post('http://localhost:8080/api/auth/register', payload);

            setSuccessMessage('¡Cuenta creada con éxito!');

            // Esperar 2 segundos para que el usuario lea el mensaje y se redirige al login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Error en el registro:", error);

            // Mostrar mensaje específico del backend si está disponible, o un mensaje genérico si no se pudo conectar
            if (error.response && error.response.data) {
                setErrorMessage(typeof error.response.data === 'string' ? error.response.data : 'Error al registrar el usuario.');
            } else {
                setErrorMessage('No se pudo conectar con el servidor.');
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

                <h2 className={styles.welcomeText}>Crea tu cuenta</h2>
                <p className={styles.subtitle}>Empieza a controlar tus finanzas.</p>

                {errorMessage && <div className={styles.alertError}>{errorMessage}</div>}
                {successMessage && <div className={styles.alertSuccess}>{successMessage}</div>}

                <form className={styles.formContainer} onSubmit={handleSubmit}>

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

                    <div className={styles.phoneContainer}>
                        <label className={styles.phoneLabel}>
                            Teléfono (Opcional)
                        </label>

                        <PhoneInput
                            placeholder="Ej: 600 000 000"
                            value={phone}
                            onChange={setPhone}
                            defaultCountry="ES"
                        />
                    </div>

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
                        disabled={isLoading}
                    />

                </form>

                <div className={styles.footerContainer}>
                    <p>¿Ya tienes una cuenta? <Link to="/login" className={styles.registerLink}>Inicia sesión</Link></p>
                </div>

            </div>
        </div>
    );
}