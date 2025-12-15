import apiClient from './axiosInterceptor';
import { v4 as uuidv4 } from 'uuid';

class ChatService {
  // Enviar mensaje con nombre y teléfono opcionales
  async sendMessage(mensaje, sessionId = null, historial = [], clienteInfo = {}) {
    const finalSessionId = sessionId || uuidv4();

    const body = {
      mensaje,
      session_id: finalSessionId,
      historial
    };

    // Agregar nombre y teléfono solo si se proporcionan
    if (clienteInfo.nombre) {
      body.nombre = clienteInfo.nombre;
    }
    if (clienteInfo.telefono) {
      body.telefono = clienteInfo.telefono;
    }

    const response = await apiClient.post('/chat/', body);

    return {
      ...response.data,
      session_id: finalSessionId
    };
  }

  // Obtener historial de conversación (incluye sesion_detalle)
  async getHistorial(sessionId = null) {
    const params = sessionId ? { session_id: sessionId } : {};
    const response = await apiClient.get('/chat/historial/', { params });
    return response.data;
  }

  // Listar sesiones/conversaciones (NUEVO endpoint)
  async getSesiones(query = '', limit = 50) {
    const params = {};
    if (query) params.q = query;
    if (limit) params.limit = limit;
    
    const response = await apiClient.get('/chat/sesiones/', { params });
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

  // Guardar información del cliente actual
  setCurrentClienteInfo(clienteInfo) {
    localStorage.setItem('currentClienteInfo', JSON.stringify(clienteInfo));
  }

  // Obtener información del cliente actual
  getCurrentClienteInfo() {
    const info = localStorage.getItem('currentClienteInfo');
    return info ? JSON.parse(info) : null;
  }

  // Limpiar información del cliente
  clearCurrentClienteInfo() {
    localStorage.removeItem('currentClienteInfo');
  }
}

const chatServiceInstance = new ChatService();
export default chatServiceInstance;
