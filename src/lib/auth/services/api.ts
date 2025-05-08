// api.ts (archivo separado para configuración de Axios)
import type { User } from '@/types/user';
import axios, { type AxiosError } from 'axios';

const API_URL: string = import.meta.env.VITE_BACKEND_URL as string || 'http://localhost:8081';

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error("La variable VITE_BACKEND_URL no está definida");
}
// 1. Crear instancia de Axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
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
        const userData: User = JSON.parse(localStorage.getItem('custom-auth-user') || '') as User;
        if (userData) {
          if (userData.id && config.headers) {
            config.headers['userId'] = userData.id;
          }
        }
      } catch (error) {
        // Opcional: Limpiar datos corruptos
        localStorage.removeItem('custom-auth-user');
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;