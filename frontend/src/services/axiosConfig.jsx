import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('konta_token') || sessionStorage.getItem('konta_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Respuestas para Modo Mantenimiento
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 503) {
            const token = localStorage.getItem('konta_token') || sessionStorage.getItem('konta_token');
            let isAdmin = false;

            if (token) {
                try {
                    const payloadBase64 = token.split('.')[1];
                    const decodedPayload = JSON.parse(atob(payloadBase64));
                    isAdmin = decodedPayload.rol === 'ADMIN';
                } catch (e) {
                    console.error("Error al leer el token en el interceptor:", e);
                }
            }

            if (!isAdmin) {
                window.location.href = '/mantenimiento';
            }
            
        }
        return Promise.reject(error);
    }
);

export default api;