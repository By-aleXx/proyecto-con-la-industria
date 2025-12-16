import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import ThemeToggle from './ThemeToggle';
import ChangePasswordModal from './ChangePasswordModal';
import ColorPickerModal from './ColorPickerModal';
import '../estilos/index.css';
import '../estilos/ChatRecommendations.css';

const ChatRecommendations = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generar mensaje de bienvenida
  const getWelcomeMessage = useCallback((cliente) => {
    const clienteName = cliente?.nombre || '';
    const greeting = clienteName 
      ? `¡Hola! Veo que estamos atendiendo a ${clienteName}. `
      : '¡Hola! ';
    
    return {
      id: Date.now(),
      type: 'ai',
      text: `${greeting}Mi nombre es Cesar Antonio pero me puedes llamar CesanTony 😉 Estoy diseñado para guiarte en la búsqueda del piso perfecto para tu proyecto. ¿En qué puedo asistirte hoy?`,
      timestamp: new Date()
    };
  }, []);

  // Cargar historial de conversación
  const loadConversationHistory = useCallback(async (sessionIdToLoad) => {
    try {
      setIsLoadingHistory(true);
      const historialData = await chatService.getHistorial(sessionIdToLoad);
      
      // El historial puede venir como array directamente o dentro de un objeto
      let registros = [];
      if (Array.isArray(historialData)) {
        registros = historialData;
      } else if (historialData?.results && Array.isArray(historialData.results)) {
        registros = historialData.results;
      }
      
      if (registros.length > 0) {
        // El historial viene ordenado del más reciente al más antiguo, hay que invertirlo
        const registrosOrdenados = [...registros].reverse();
        
        // Cada registro contiene mensaje_usuario y mensaje_asistente juntos
        // Necesitamos separarlos en mensajes individuales
        const loadedMessages = [];
        
        registrosOrdenados.forEach((registro, index) => {
          const baseId = Date.now() + (index * 2);
          const timestamp = new Date(registro.fecha_creacion || Date.now());
          
          // Agregar mensaje del usuario
          if (registro.mensaje_usuario) {
            loadedMessages.push({
              id: baseId,
              type: 'user',
              text: registro.mensaje_usuario,
              timestamp: timestamp,
            });
          }
          
          // Agregar mensaje del asistente
          if (registro.mensaje_asistente) {
            loadedMessages.push({
              id: baseId + 1,
              type: 'ai',
              text: registro.mensaje_asistente,
              timestamp: timestamp,
              metadata: registro.metadata,
              productos: registro.productos_recomendados
            });
          }
        });
        
        setMessages(loadedMessages);
        setIsNewConversation(false);
        
        // Actualizar info del cliente desde sesion_detalle si está disponible
        if (registros[0]?.sesion_detalle) {
          const sesionDetalle = registros[0].sesion_detalle;
          if (sesionDetalle.nombre || sesionDetalle.telefono) {
            const clienteFromHistory = {
              nombre: sesionDetalle.nombre,
              telefono: sesionDetalle.telefono
            };
            setClienteInfo(clienteFromHistory);
            chatService.setCurrentClienteInfo(clienteFromHistory);
          }
        }
      } else {
        // No hay historial, mostrar mensaje de bienvenida
        const cliente = chatService.getCurrentClienteInfo();
        setMessages([getWelcomeMessage(cliente)]);
        setIsNewConversation(true);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      // En caso de error, mostrar mensaje de bienvenida
      const cliente = chatService.getCurrentClienteInfo();
      setMessages([getWelcomeMessage(cliente)]);
      setIsNewConversation(true);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [getWelcomeMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const newHeight = Math.min(inputRef.current.scrollHeight, 72);
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [inputText]);

  useEffect(() => {
    // Animación inicial
    anime({
      targets: '.chat-container',
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

    // Obtener session_id y cliente info del localStorage
    const currentSessionId = chatService.getCurrentSessionId();
    const currentClienteInfo = chatService.getCurrentClienteInfo();
    
    if (currentClienteInfo) {
      setClienteInfo(currentClienteInfo);
    }

    if (currentSessionId) {
      setSessionId(currentSessionId);
      // Cargar historial existente
      loadConversationHistory(currentSessionId);
    } else {
      // Nueva conversación sin session_id
      const newSessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      setSessionId(newSessionId);
      chatService.setCurrentSessionId(newSessionId);
      setMessages([getWelcomeMessage(currentClienteInfo)]);
      setIsLoadingHistory(false);
    }
  }, [loadConversationHistory, getWelcomeMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleImageClick = () => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      const useCamera = window.confirm('¿Deseas tomar una foto con la cámara? Presiona Cancelar para subir una foto de tu galería.');
      if (useCamera) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            
            video.onloadedmetadata = () => {
              video.play();
              
              setTimeout(() => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                stream.getTracks().forEach(track => track.stop());
                
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setSelectedImage(imageDataUrl);
                setShowColorPicker(true);
              }, 500);
            };
          })
          .catch(err => {
            console.error('Error accessing camera:', err);
            alert('No se pudo acceder a la cámara. Usando selector de archivos.');
            fileInputRef.current?.click();
          });
      } else {
        fileInputRef.current?.click();
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowColorPicker(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorConfirmed = async (color) => {
    setShowColorPicker(false);
    
    const imageMessage = {
      id: Date.now(),
      type: 'user',
      text: `Color seleccionado: ${color.hex}`,
      contentType: 'image',
      content: selectedImage,
      color: color,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, imageMessage]);
    
    setIsTyping(true);
    
    try {
      const mensajeBusqueda = `Buscar piso con color similar a ${color.hex}`;
      
      const historial = [...messages, imageMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      historial.push({
        role: 'user',
        content: mensajeBusqueda
      });
      
      // Solo enviar cliente info en el primer mensaje de conversación nueva
      const clienteInfoToSend = isNewConversation ? clienteInfo : {};
      const response = await chatService.sendMessage(mensajeBusqueda, sessionId, historial, clienteInfoToSend);
      
      if (isNewConversation) {
        setIsNewConversation(false);
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.respuesta,
        timestamp: new Date(),
        metadata: response.metadata
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
        chatService.setCurrentSessionId(response.session_id);
      }
      
    } catch (error) {
      console.error('Error al buscar por color:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Lo siento, hubo un error al buscar pisos con ese color. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const historial = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      historial.push({
        role: 'user',
        content: inputText
      });

      // Solo enviar cliente info en el primer mensaje de conversación nueva
      const clienteInfoToSend = isNewConversation ? clienteInfo : {};
      const response = await chatService.sendMessage(inputText, sessionId, historial, clienteInfoToSend);

      if (isNewConversation) {
        setIsNewConversation(false);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.respuesta,
        timestamp: new Date(),
        metadata: response.metadata
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
        chatService.setCurrentSessionId(response.session_id);
      }
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  // Botón que ahora regresa al listado de conversaciones
  const handleBackToConversations = () => {
    navigate('/conversaciones');
  };

  const handleChangePasswordSubmit = async (oldPassword, newPassword) => {
    await changePassword(oldPassword, newPassword);
    alert('Contraseña cambiada exitosamente');
  };

  // Obtener el nombre del cliente para mostrar en el header
  const getClienteDisplayName = () => {
    if (clienteInfo?.nombre) {
      return clienteInfo.nombre;
    }
    if (clienteInfo?.telefono) {
      return clienteInfo.telefono;
    }
    return null;
  };

  const clienteDisplayName = getClienteDisplayName();

  return (
    <div className={`chat-main-container ${isDark ? 'dark' : 'light'}`}>
      {/* Header con logo */}
      <header className="chat-header">
        <div className="chat-header-logo">
          {/* Botón de volver al listado */}
          <button 
            onClick={handleBackToConversations}
            className="back-to-list-button"
            title="Volver a conversaciones"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          {clienteDisplayName ? (
            <div className="chat-cliente-info">
              <span className="chat-cliente-name">{clienteDisplayName}</span>
              {clienteInfo?.telefono && clienteInfo?.nombre && (
                <span className="chat-cliente-phone">{clienteInfo.telefono}</span>
              )}
            </div>
          ) : (
            <img src="/Logo-Cesantoni.svg" alt="Cesantoni" className="chat-logo-image" />
          )}
        </div>
        
        <div className="chat-header-actions">
          {/* Theme Toggle y Settings */}
          <ThemeToggle 
            onToggle={toggleTheme} 
            isDark={isDark} 
            onLogout={handleLogout}
            onChangePassword={() => setShowChangePassword(true)}
          />
        </div>
      </header>

      {/* Chat Container */}
      <div className="chat-container">
        {isLoadingHistory ? (
          <div className="chat-loading-history">
            <div className="loading-grid-container">
              <div className="loading-grid">
                <div className="loading-square" style={{'--delay': '0.1s'}}></div>
                <div className="loading-square" style={{'--delay': '0.2s'}}></div>
                <div className="loading-square" style={{'--delay': '0.3s'}}></div>
                <div className="loading-square" style={{'--delay': '0.4s'}}></div>
                <div className="loading-square" style={{'--delay': '0.5s'}}></div>
                <div className="loading-square" style={{'--delay': '0.6s'}}></div>
                <div className="loading-square" style={{'--delay': '0.7s'}}></div>
                <div className="loading-square" style={{'--delay': '0.8s'}}></div>
                <div className="loading-square" style={{'--delay': '0.9s'}}></div>
              </div>
              <div className="loading-grid right">
                <div className="loading-square" style={{'--delay': '0.1s'}}></div>
                <div className="loading-square" style={{'--delay': '0.2s'}}></div>
                <div className="loading-square" style={{'--delay': '0.3s'}}></div>
                <div className="loading-square" style={{'--delay': '0.4s'}}></div>
                <div className="loading-square" style={{'--delay': '0.5s'}}></div>
                <div className="loading-square" style={{'--delay': '0.6s'}}></div>
                <div className="loading-square" style={{'--delay': '0.7s'}}></div>
                <div className="loading-square" style={{'--delay': '0.8s'}}></div>
                <div className="loading-square" style={{'--delay': '0.9s'}}></div>
              </div>
            </div>
            <p className="loading-text">Cargando conversación...</p>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message-${message.type}`}>
                {message.type === 'ai' && (
                  <div className="ai-message-container">
                    <div className="avatar-circle">
                      <img 
                        src="/avatar.svg" 
                        alt="CesanTony"
                        className="avatar-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="avatar-fallback" style={{display: 'none'}}>C</div>
                    </div>
                    <div className="ai-message">
                      <div className="ai-text markdown-content">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'user' && (
                  <div className="user-message-container user-message-right">
                    <div className="user-message">
                      <div className="user-text">
                        {message.text}
                        {message.contentType === 'image' && (
                          <div style={{
                            maxWidth: '280px',
                            margin: '10px 0 0 0',
                            padding: '4px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.1)'
                          }}>
                            <img
                              src={message.content}
                              alt="Imagen enviada"
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '6px'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="user-avatar-circle">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message-ai">
                <div className="ai-message-container">
                  <div className="avatar-circle">
                    <img 
                      src="/avatar.svg" 
                      alt="CesanTony"
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="avatar-fallback" style={{display: 'none'}}>C</div>
                  </div>
                  <div className="ai-message">
                    <div className="loading-grid-container">
                      <div className="loading-grid">
                        <div className="loading-square" style={{'--delay': '0.1s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.2s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.3s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.4s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.5s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.6s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.7s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.8s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.9s'}}></div>
                      </div>
                      <div className="loading-grid right">
                        <div className="loading-square" style={{'--delay': '0.1s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.2s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.3s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.4s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.5s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.6s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.7s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.8s'}}></div>
                        <div className="loading-square" style={{'--delay': '0.9s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input oculto para subir fotos */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>

      {/* Input Area - Fijo abajo */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          {/* Botón de cámara */}
          <button
            onClick={handleImageClick}
            className="chat-camera-button"
            title="Subir o tomar foto"
            disabled={isLoadingHistory}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>

          {/* Área de input */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isTyping || isLoadingHistory}
              rows={1}
              className="chat-input-field"
            />
          </div>

          {/* Botón enviar */}
          <button
            onClick={handleSendMessage}
            disabled={isTyping || !inputText.trim() || isLoadingHistory}
            className="chat-send-button"
            title="Enviar mensaje"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="bottom-indicator">
        <div className="indicator-bar"></div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePasswordSubmit}
        isDark={isDark}
      />

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => {
          setShowColorPicker(false);
          setSelectedImage(null);
        }}
        imageUrl={selectedImage}
        isDark={isDark}
        onColorConfirmed={handleColorConfirmed}
      />
    </div>
  );
};

export default ChatRecommendations;
