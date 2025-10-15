import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import ThemeToggle from './ThemeToggle';
import ChangePasswordModal from './ChangePasswordModal';
import ColorPickerModal from './ColorPickerModal';
import '../estilos/index.css';

const ChatRecommendations = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: `¡Hola ${user?.first_name || user?.username || ''}! Mi nombre es Laura y estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Animación inicial
    anime({
      targets: '.chat-container',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: 'easeOutCubic'
    });

    // Auto scroll al final
    scrollToBottom();
    
    // Obtener o crear session_id
    const currentSessionId = chatService.getCurrentSessionId();
    if (currentSessionId) {
      setSessionId(currentSessionId);
      // Cargar historial de esta sesión si es necesario
    } else {
      // Crear nueva sesión
      const newSessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      setSessionId(newSessionId);
      chatService.setCurrentSessionId(newSessionId);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageClick = () => {
    // Verificar si el dispositivo tiene cámara
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      // Si tiene cámara, mostrar opciones
      const useCamera = window.confirm('¿Deseas tomar una foto con la cámara? Presiona Cancelar para subir una foto de tu galería.');
      if (useCamera) {
        // Abrir la cámara
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            // Crear elemento de video temporal
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            
            // Esperar a que el video esté listo
            video.onloadedmetadata = () => {
              video.play();
              
              // Esperar un momento para que la cámara se estabilice
              setTimeout(() => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                // Detener el stream
                stream.getTracks().forEach(track => track.stop());
                
                // Obtener la imagen
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
      // Si no tiene cámara, abrir directamente el selector de archivos
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

  const handleColorConfirmed = (color) => {
    setShowColorPicker(false);
    
    // Agregar la imagen al chat como mensaje del usuario
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
    
    // Respuesta de la IA
    const responseMessage = {
      id: Date.now() + 1,
      type: 'ai',
      text: `Perfecto, he detectado el color **${color.hex}** (RGB: ${color.rgb}). Ahora buscaré pisos que coincidan con este color. Esta funcionalidad estará disponible cuando el backend esté implementado.`,
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
    
    // Aquí puedes agregar lógica adicional para buscar productos
    console.log('Color seleccionado para búsqueda:', color);
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
      // Preparar historial para enviar al backend
      const historial = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Agregar el mensaje actual
      historial.push({
        role: 'user',
        content: inputText
      });

      // Enviar mensaje al backend
      const response = await chatService.sendMessage(inputText, sessionId, historial);

      // Agregar respuesta del asistente
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.respuesta,
        timestamp: new Date(),
        metadata: response.metadata
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Actualizar session_id si es necesario
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
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleGoToMenu = () => {
    navigate('/menu');
  };

  const handleNewConversation = () => {
    // Crear nueva conversación
    const newSessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    setSessionId(newSessionId);
    chatService.setCurrentSessionId(newSessionId);
    
    // Limpiar mensajes
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        text: `¡Hola ${user?.first_name || user?.username || ''}! Iniciemos una nueva conversación. ¿En qué puedo ayudarte?`,
        timestamp: new Date()
      }
    ]);
  };

  const handleChangePasswordSubmit = async (oldPassword, newPassword) => {
    await changePassword(oldPassword, newPassword);
    alert('Contraseña cambiada exitosamente');
  };

  return (
    <div className={`chat-main-container ${isDark ? 'dark' : 'light'}`}>
      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <ThemeToggle 
          onToggle={() => setIsDark(!isDark)} 
          isDark={isDark} 
          onLogout={handleLogout}
          onChangePassword={() => setShowChangePassword(true)}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons-container">
        <button 
          onClick={handleGoToMenu}
          className="menu-button"
          style={{
            background: 'rgba(52, 152, 219, 0.2)',
            border: 'none',
            color: 'rgba(52, 152, 219, 1)',
            padding: '8px 12px',
            borderRadius: '15px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            marginRight: '8px'
          }}
        >
          📋 Menú
        </button>
        <button 
          onClick={handleNewConversation}
          className="new-conversation-button"
          style={{
            background: 'rgba(46, 204, 113, 0.2)',
            border: 'none',
            color: 'rgba(39, 174, 96, 1)',
            padding: '8px 12px',
            borderRadius: '15px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          ➕ Nueva conversación
        </button>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message-${message.type}`}>
              {message.type === 'ai' && (
                <div className="ai-message-container">
                  <div className="avatar-circle">
                    <img 
                      src="/avatar-laura.svg" 
                      alt="Laura"
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="avatar-fallback" style={{display: 'none', backgroundColor: '#8B4A42'}}>L</div>
                  </div>
                  <div className="ai-message">
                    <div className="ai-text markdown-content" style={{
                      background: '#fff',
                      color: '#222',
                      padding: '18px 22px',
                      borderRadius: '20px',
                      fontSize: '1.1rem',
                      fontWeight: '400',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
                    }}>
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
                          maxWidth: '300px',
                          margin: '8px 0',
                          background: isDark ? 'rgba(255,255,255,0.1)' : '#fff',
                          padding: '4px',
                          borderRadius: '8px'
                        }}>
                          <img
                            src={message.content}
                            alt="Imagen enviada"
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                              borderRadius: '4px'
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
                  <div className="avatar-fallback" style={{backgroundColor: '#8B4A42'}}>L</div>
                </div>
                <div className="ai-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input oculto para subir fotos */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {/* Input Area */}
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          background: 'transparent', 
          padding: '20px 0', 
          zIndex: 100 
        }}>
          <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '0 20px'
          }}>
            {/* Botón de cámara a la izquierda */}
            <button
              onClick={handleImageClick}
              style={{
                background: 'transparent',
                color: isDark ? '#fff' : '#000',
                border: 'none',
                borderRadius: '50%',
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                marginRight: '16px',
                alignSelf: 'center',
                lineHeight: 0,
                cursor: 'pointer',
                transform: 'translateY(-6px)',
                boxShadow: 'none'
              }}
              title="Subir o tomar foto"
            >
              <span role="img" aria-label="camara" style={{ fontSize: 48 }}>📸</span>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '20px',
                padding: '16px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !inputText.trim()}
              style={{
                background: isTyping || !inputText.trim() ? '#95a5a6' : '#43cea2',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                padding: '12px 32px',
                fontSize: '1rem',
                cursor: isTyping || !inputText.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}
            >
              Enviar
            </button>
          </div>
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
