// api.ts (archivo separado para configuración de Axios)
import axios from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 1. Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor para inyectar el user ID
api.interceptors.request.use(
  (config) => {
    // Solo ejecutar en el lado cliente (Next.js compatibilidad)
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('custom-auth-user');
        if (userData) {
          const { id } = JSON.parse(userData) as { id: string };
          if (id && config.headers) {
            config.headers['userId'] = id;
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Opcional: Limpiar datos corruptos
        localStorage.removeItem('custom-auth-user');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;