import React, { useState, useEffect, useRef } from 'react';
import { FiCamera, FiSave, FiTrash2} from 'react-icons/fi';
import styles from './AjustesPage.module.css';
import InputField from '../components/atoms/InputField';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import api from '../services/axiosConfig';

export default function AjustesPage() {
  const [perfil, setPerfil] = useState({
    nombreUsuario: '',
    email: '',
    telefono: '',
    fotoPerfil: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  });

  // Mensaje global para ambos formularios
  const [mensajePerfil, setMensajePerfil] = useState({ texto: '', tipo: '' });
  const [mensajePassword, setMensajePassword] = useState({ texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me'); 
        setPerfil({
          nombreUsuario: response.data.nombreUsuario || '',
          email: response.data.email || '', 
          telefono: response.data.telefono || '',
          fotoPerfil: response.data.fotoPerfil || ''
        });
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        mostrarMensaje('Error al cargar los datos del usuario', 'error');
      }
    };
    fetchUserData();
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
  };

  const getInitials = () => {
    if (!perfil.nombreUsuario) return 'US';
    const words = perfil.nombreUsuario.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return perfil.nombreUsuario.substring(0, 2).toUpperCase();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerfil({ ...perfil, fotoPerfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    setPerfil({ ...perfil, fotoPerfil: '' });
  };

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        nombreUsuario: perfil.nombreUsuario, 
        telefono: perfil.telefono,
        fotoPerfil: perfil.fotoPerfil
      };
      await api.put('/users/me', payload);
      setMensajePerfil({ texto: 'Datos actualizados correctamente', tipo: 'success' });
      setTimeout(() => setMensajePerfil({ texto: '', tipo: '' }), 4000);
    } catch (error) {
      setMensajePerfil({ texto: 'Error al guardar los cambios', tipo: 'error' });
      setTimeout(() => setMensajePerfil({ texto: '', tipo: '' }), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.repeatPassword) {
      setMensajePassword({ texto: 'Las contraseñas nuevas no coinciden', tipo: 'error' });
      setTimeout(() => setMensajePassword({ texto: '', tipo: '' }), 4000);
      return;
    }
    try {
      setIsLoading(true);
      await api.put('/users/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setMensajePassword({ texto: 'Contraseña actualizada con éxito', tipo: 'success' });
      setTimeout(() => setMensajePassword({ texto: '', tipo: '' }), 4000);
      setPasswords({ currentPassword: '', newPassword: '', repeatPassword: '' });
    } catch (error) {
      setMensajePassword({ texto: error.response?.data || 'Error al actualizar contraseña', tipo: 'error' });
      setTimeout(() => setMensajePassword({ texto: '', tipo: '' }), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.pageTitle}>Ajustes de Cuenta</h1>

      <div className={styles.singleCard}>
        
        {/* CABECERA: FOTO DE PERFIL CENTRADA */}
        <div className={styles.fotoSectionWrapper}>
          <div className={styles.fotoSection}>
            <div className={styles.avatarMain}>
              {perfil.fotoPerfil ? (
                <img src={perfil.fotoPerfil} alt="Avatar" className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarInitials}>{getInitials()}</div>
              )}
              <button 
                type="button" 
                className={styles.btnCameraOverlay} 
                onClick={() => fileInputRef.current.click()}
              >
                <FiCamera size={16} />
              </button>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
            
            <div className={styles.fotoActions}>
              <button 
                type="button" 
                className={styles.btnLink} 
                onClick={() => fileInputRef.current.click()}
              >
                Cambiar foto
              </button>

              {perfil.fotoPerfil && (
                <button 
                  type="button" 
                  className={`${styles.btnLink} ${styles.btnDangerLink}`} 
                  onClick={handleRemoveFoto}
                >
                  <FiTrash2 size={14} /> Quitar foto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FORMULARIO 1: DATOS PERSONALES */}
        <form onSubmit={handleGuardarPerfil} className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2>Datos Personales</h2>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.disabledField}>
              <InputField
                label="Nombre de Usuario"
                type="text"
                value={perfil.nombreUsuario}
                onChange={() => {}} 
                readOnly={true}
              />
            </div>

            <div className={styles.disabledField}>
              <InputField
                label="Correo Electrónico"
                type="email"
                value={perfil.email}
                onChange={() => {}} 
                readOnly={true}
              />
            </div>

            <div className={styles.phoneContainer}>
              <label className={styles.phoneLabel}>Teléfono</label>
              <PhoneInput
                placeholder="Ej: 600 000 000"
                value={perfil.telefono}
                onChange={(val) => setPerfil({...perfil, telefono: val})}
                defaultCountry="ES"
              />
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" disabled={isLoading} className={styles.btnGreen}>
              <FiSave size={16} />
              Guardar
            </button>
            {mensajePerfil.texto && (
              <span className={`${styles.inlineAlert} ${mensajePerfil.tipo === 'error' ? styles.alertError : styles.alertSuccess}`}>
                {mensajePerfil.texto}
              </span>
            )}
          </div>
        </form>

        {/* FORMULARIO 2: SEGURIDAD */}
        <form onSubmit={handleActualizarPassword} className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2>Seguridad</h2>
          </div>
          
          <div className={styles.formGrid}>
            <InputField
              label="Contraseña actual"
              type="password"
              placeholder="Contraseña actual"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              isRequired={true}
            />
            <InputField
              label="Nueva Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              isRequired={true}
            />
            <InputField
              label="Repetir Nueva Contraseña"
              type="password"
              placeholder="Repite la contraseña"
              value={passwords.repeatPassword}
              onChange={(e) => setPasswords({...passwords, repeatPassword: e.target.value})}
              isRequired={true}
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" disabled={isLoading} className={styles.btnGreen}>
              <FiSave size={16} />
              Actualizar contraseña
            </button>
            {mensajePassword.texto && (
              <span className={`${styles.inlineAlert} ${mensajePassword.tipo === 'error' ? styles.alertError : styles.alertSuccess}`}>
                {mensajePassword.texto}
              </span>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}