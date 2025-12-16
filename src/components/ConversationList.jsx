import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import ThemeToggle from './ThemeToggle';
import ChangePasswordModal from './ChangePasswordModal';
import NewConversationModal from './NewConversationModal';
import '../estilos/index.css';
import '../estilos/ConversationList.css';

const ConversationList = () => {
  const { logout, changePassword, user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [error, setError] = useState(null);
  
  // Obtener nombre de la sucursal desde localStorage
  const sucursalNombre = localStorage.getItem('sucursal_nombre') || 'Sucursal';

  // Cargar conversaciones
  const loadConversations = useCallback(async (query = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getSesiones(query);
      setConversations(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error cargando conversaciones:', err);
      setError('No se pudieron cargar las conversaciones');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Animación inicial
    anime({
      targets: '.conversation-list-container',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: 'easeOutCubic'
    });

    // Leer tema persistido
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark-mode');
    }

    // Cargar conversaciones iniciales
    loadConversations();
  }, [loadConversations]);

  // Búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadConversations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadConversations]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    if (next) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      chatService.clearCurrentSessionId();
      chatService.clearCurrentClienteInfo();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleChangePasswordSubmit = async (oldPassword, newPassword) => {
    await changePassword(oldPassword, newPassword);
    alert('Contraseña cambiada exitosamente');
  };

  const handleConversationClick = (conversation) => {
    // Guardar sesión y cliente info
    chatService.setCurrentSessionId(conversation.session_id);
    chatService.setCurrentClienteInfo({
      nombre: conversation.nombre,
      telefono: conversation.telefono
    });
    
    // Navegar al chat
    navigate('/chat');
  };

  const handleNewConversation = (clienteInfo) => {
    // Generar nuevo session_id
    const newSessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    chatService.setCurrentSessionId(newSessionId);
    chatService.setCurrentClienteInfo(clienteInfo);
    
    setShowNewConversation(false);
    navigate('/chat');
  };

  // Formatear fecha relativa
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Obtener iniciales del cliente
  const getInitials = (nombre) => {
    if (!nombre) return '?';
    const parts = nombre.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nombre[0].toUpperCase();
  };

  return (
    <div className={`conversation-list-container ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="conv-header">
        <div className="conv-header-logo">
          <img src="/Logo-Cesantoni.svg" alt="Cesantoni" className="conv-logo-image" />
        </div>
        
        <div className="conv-header-actions">
          <ThemeToggle 
            onToggle={toggleTheme} 
            isDark={isDark} 
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePassword(true)}
          />
        </div>
      </header>

      {/* Info del usuario */}
      <div className="conv-user-info">
        <div className="user-info-row">
          <svg className="user-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="user-name">{user?.nombre || user?.username || 'Usuario'}</span>
        </div>
        <div className="user-info-row">
          <svg className="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="user-sucursal">{sucursalNombre}</span>
        </div>
      </div>

      {/* Barra de búsqueda y botón nueva conversación */}
      <div className="conv-search-section">
        <div className="conv-search-row">
          <div className="conv-search-container">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="conv-search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <button 
            className="new-conv-button"
            onClick={() => setShowNewConversation(true)}
            title="Nueva conversación"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="conv-list-wrapper">
        {isLoading ? (
          <div className="conv-loading">
            <div className="loading-spinner"></div>
            <span>Cargando conversaciones...</span>
          </div>
        ) : error ? (
          <div className="conv-error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
            <button onClick={() => loadConversations(searchQuery)} className="retry-btn">
              Reintentar
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="conv-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3>{searchQuery ? 'Sin resultados' : 'No hay conversaciones'}</h3>
            <p>
              {searchQuery 
                ? `No se encontraron conversaciones para "${searchQuery}"`
                : 'Inicia una nueva conversación con un cliente'
              }
            </p>
            {!searchQuery && (
              <button 
                className="start-conv-btn"
                onClick={() => setShowNewConversation(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nueva conversación
              </button>
            )}
          </div>
        ) : (
          <ul className="conv-list">
            {conversations.map((conv, index) => (
              <li 
                key={conv.session_id}
                className="conv-item"
                onClick={() => handleConversationClick(conv)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="conv-avatar">
                  {getInitials(conv.nombre)}
                </div>
                <div className="conv-info">
                  <div className="conv-info-top">
                    <span className="conv-name">
                      {conv.nombre || 'Cliente sin nombre'}
                    </span>
                    <span className="conv-time">
                      {formatRelativeTime(conv.ultimo_mensaje)}
                    </span>
                  </div>
                  <div className="conv-info-bottom">
                    <span className="conv-phone">
                      {conv.telefono || 'Sin teléfono'}
                    </span>
                  </div>
                  {conv.ultimo_mensaje_usuario && (
                    <p className="conv-preview">
                      {conv.ultimo_mensaje_usuario}
                    </p>
                  )}
                </div>
                <div className="conv-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Indicador inferior */}
      <div className="bottom-indicator">
        <div className="indicator-bar"></div>
      </div>

      {/* Modales */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePasswordSubmit}
        isDark={isDark}
      />

      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onConfirm={handleNewConversation}
        isDark={isDark}
      />
    </div>
  );
};

export default ConversationList;

