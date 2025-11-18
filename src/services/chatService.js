import apiClient from './axiosInterceptor';
import { v4 as uuidv4 } from 'uuid';

class ChatService {
  // Enviar mensaje
  async sendMessage(mensaje, sessionId = null, historial = []) {
    // Si no hay sessionId, generar uno nuevo
    const finalSessionId = sessionId || uuidv4();

    const response = await apiClient.post('/chat/', {
      mensaje,
      session_id: finalSessionId,
      historial
    });

    return {
      ...response.data,
      session_id: finalSessionId
    };
  }

  // Obtener historial de conversación
  async getHistorial(sessionId = null) {
    const params = sessionId ? { session_id: sessionId } : {};
    const response = await apiClient.get('/chat/historial/', { params });
    return response.data;
  }

  // Listar sesiones
  async getSessions() {
    const response = await apiClient.get('/chat/sessions/');
    return response.data;
  }

  // Crear nueva sesión
  async createSession(titulo = 'Nueva conversación') {
    const response = await apiClient.post('/chat/sessions/', { titulo });
    return response.data;
  }

  // Obtener sesión actual del localStorage
  getCurrentSessionId() {
    return localStorage.getItem('currentSessionId');
  }

  // Guardar sesión actual
  setCurrentSessionId(sessionId) {
    localStorage.setItem('currentSessionId', sessionId);
  }

  // Limpiar sesión actual
  clearCurrentSessionId() {
    localStorage.removeItem('currentSessionId');
  }
}

const chatServiceInstance = new ChatService();
export default chatServiceInstance;

