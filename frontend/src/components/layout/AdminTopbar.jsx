import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiMenu, FiSearch, FiPieChart, FiUsers, FiLifeBuoy,
    FiSettings, FiLogOut, FiPower
} from 'react-icons/fi';
import styles from './Topbar.module.css';
import api from '../../services/axiosConfig';

export default function AdminTopbar({ onMenuClick }) {

    // --- ESTADO PARA EL BUSCADOR ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // --- ESTADO PARA EL MENÚ DE PERFIL ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const [userData, setUserData] = useState({
        nombreUsuario: 'Cargando...',
        fotoPerfil: ''
    });

    // --- NAVEGACIÓN ---
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // --- ESTADO PARA MODO MANTENIMIENTO ---
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    const handleToggleMaintenance = async () => {
        try {
            const response = await api.put('/admin/system/maintenance/toggle');
            setIsMaintenanceMode(!isMaintenanceMode);
            alert(response.data);
        } catch (error) {
            console.error('Error al alternar mantenimiento:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    // --- RUTAS PARA EL BUSCADOR ---
    const searchableRoutes = [
        { name: 'Panel de Control', path: '/admin/dashboard', icon: <FiPieChart /> },
        { name: 'Usuarios', path: '/admin/users', icon: <FiUsers /> },
        { name: 'Soporte', path: '/admin/support', icon: <FiLifeBuoy /> },
        { name: 'Ajustes', path: '/ajustes', icon: <FiSettings /> },
    ];

    // --- FILTRAR RUTAS SEGÚN EL TÉRMINO DE BÚSQUEDA ---
    const filteredRoutes = searchableRoutes.filter(route =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- MANEJO DE CLIC FUERA DEL BUSCADOR ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- MANEJADOR DE CIERRE DE SESIÓN ---
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('konta_token');
        sessionStorage.removeItem('konta_token');
        navigate('/login');
    };

    // --- CARGAR DATOS DEL USUARIO AL INICIAR ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/me');
                setUserData({
                    nombreUsuario: response.data.nombreUsuario || 'Usuario',
                    fotoPerfil: response.data.fotoPerfil || ''
                });
            } catch (error) {
                console.error('Error al cargar perfil en el Topbar:', error);
                setUserData(prev => ({ ...prev, nombreUsuario: 'Usuario' }));
            }
        };
        fetchUserData();
    }, []);

    // --- FUNCIÓN PARA FOTO DE PERFIL CON INICIALES DE USUARIO ---
    const getInitials = (name) => {
        if (!name || name === 'Cargando...') return 'US';
        const words = name.trim().split(/\s+/);
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // --- MANEJADORES DE EVENTOS ---
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    // --- MANEJADOR DE SELECCIÓN DE RUTA ---
    const handleSelectRoute = (path) => {
        navigate(path);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <header className={styles.topbarContainer}>

            {/* BOTÓN MENÚ MÓVIL (Solo visible en pantallas pequeñas) */}
            <button className={styles.mobileMenuBtn} onClick={onMenuClick}>
                <FiMenu size={24} />
            </button>

            {/* BUSCADOR */}
            <div className={styles.searchWrapper} ref={searchRef}>
                <div className={styles.searchContainer}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar sección..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {isOpen && searchTerm.length > 0 && (
                    <div className={styles.dropdownMenu}>
                        {filteredRoutes.length > 0 ? (
                            filteredRoutes.map((route, index) => (
                                <button
                                    key={index}
                                    className={styles.dropdownItem}
                                    onClick={() => handleSelectRoute(route.path)}
                                >
                                    <span className={styles.itemIcon}>{route.icon}</span>
                                    <span className={styles.itemName}>{route.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                No se encontraron resultados para "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTÓN MODO MANTENIMIENTO */}
            <div className={styles.rightSection}>

                {/* BADGE DE ESTADO DEL SISTEMA */}
                <button
                    onClick={handleToggleMaintenance}
                    className={`${styles.maintenanceBtn} ${isMaintenanceMode ? styles.maintenanceActive : styles.maintenanceInactive}`}
                    title="Alternar Modo Mantenimiento"
                >
                    {/* Puntito luminoso de estado */}
                    <div className={`${styles.statusDot} ${isMaintenanceMode ? styles.dotActive : styles.dotInactive}`}></div>
                    <span>{isMaintenanceMode ? 'Mantenimiento' : 'Sistema Activo'}</span>
                </button>

                {/* PERFIL DINÁMICO */}
                <div className={styles.profileWrapper} ref={profileRef}>

                    {/* Botón del perfil*/}
                    <div
                        className={styles.profileContainer}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className={styles.avatarMain}>
                            {userData.fotoPerfil ? (
                                <img src={userData.fotoPerfil} alt="Avatar" className={styles.avatar} />
                            ) : (
                                <div className={styles.avatarInitials}>{getInitials(userData.nombreUsuario)}</div>
                            )}
                        </div>
                        <span className={styles.userName}>{userData.nombreUsuario}</span>
                    </div>

                    {/* Desplegable */}
                    {isMenuOpen && (
                        <div className={styles.userDropdown}>
                            <div className={styles.dropdownHeader}>
                                <p className={styles.userEmail}>{userData.nombreUsuario}</p>
                                <p className={styles.userRole}>Plan Pro</p>
                            </div>

                            <div className={styles.dropdownDivider}></div>

                            <button className={styles.dropdownAction} onClick={() => { navigate('/ajustes'); setIsMenuOpen(false); }}>
                                <FiSettings size={16} />
                                Ajustes
                            </button>

                            <div className={styles.dropdownDivider}></div>

                            <button className={`${styles.dropdownAction} ${styles.logoutAction}`} onClick={handleLogout}>
                                <FiLogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}

                </div>

            </div>
        </header>
    );
}