import axios from 'axios';
import API_BASE_URL from '../config/api';

const AUTH_API = `${API_BASE_URL}/auth`;

class AuthService {
  // Almacenar tokens
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Obtener access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Obtener refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  // Limpiar tokens
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  // Registro
  async register(userData) {
    const response = await axios.post(`${AUTH_API}/register/`, userData);
    return response.data;
  }

  // Login
  async login(username, password) {
    const response = await axios.post(`${AUTH_API}/login/`, {
      username,
      password
    });
    
    const { access, refresh, user } = response.data;
    
    // Guardar tokens y usuario
    this.setTokens(access, refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  }

  // Obtener usuario actual
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Refresh token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${AUTH_API}/refresh/`, {
      refresh: refreshToken
    });

    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    
    return access;
  }

  // Logout
  async logout() {
    const refreshToken = this.getRefreshToken();
    
    try {
      await axios.post(
        `${AUTH_API}/logout/`,
        { refresh: refreshToken },
        {
          headers: {
            'Authorization': `Bearer ${this.getAccessToken()}`
          }
        }
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Cambiar contraseña
  async changePassword(oldPassword, newPassword) {
    const response = await axios.post(
      `${AUTH_API}/change-password/`,
      {
        old_password: oldPassword,
        new_password: newPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`
        }
      }
    );
    
    return response.data;
  }

  // Obtener información del usuario desde el servidor
  async getMe() {
    const response = await axios.get(`${API_BASE_URL}/me/`, {
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`
      }
    });
    
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;

