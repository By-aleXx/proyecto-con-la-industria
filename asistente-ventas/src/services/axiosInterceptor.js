import axios from 'axios';
import authService from './authService';
import API_BASE_URL from '../config/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request (agregar token)
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response (manejar refresh token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const newAccessToken = await authService.refreshToken();
        
        // Actualizar el header con el nuevo token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Reintentar la petición original
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        authService.clearTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;










