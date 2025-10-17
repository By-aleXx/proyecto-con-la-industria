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
      text: `¡Hola ${user?.first_name || user?.username || ''}! Mi nombre es Cesar Antonio pero me puedes llamar CesanTony 😉 Estoy diseñado para guiarte en la búsqueda del piso perfecto para tu proyecto. ¿En qué puedo asistirte hoy?`,
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

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const newHeight = Math.min(inputRef.current.scrollHeight, 72); // 72px = 3 líneas aproximadamente
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

    // Auto scroll al final
    scrollToBottom();
    
    // Leer tema persistido
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
    }

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

  const handleColorConfirmed = async (color) => {
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
    
    // Enviar mensaje al backend para buscar por color
    setIsTyping(true);
    
    try {
      // Preparar el mensaje para el backend
      const mensajeBusqueda = `Buscar piso con color similar a ${color.hex}`;
      
      // Preparar historial incluyendo el mensaje de la imagen
      const historial = [...messages, imageMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Agregar el mensaje de búsqueda
      historial.push({
        role: 'user',
        content: mensajeBusqueda
      });
      
      // Enviar al backend
      const response = await chatService.sendMessage(mensajeBusqueda, sessionId, historial);
      
      // Agregar respuesta de Laura con los resultados
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
        text: `¡Hola ${user?.first_name || user?.username || ''}! Mi nombre es Cesar Antonio pero me puedes llamar CesanTony 😉 Estoy diseñado para guiarte en la búsqueda del piso perfecto para tu proyecto. ¿En qué puedo asistirte hoy?`,
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
          onToggle={() => {
            const next = !isDark;
            setIsDark(next);
            localStorage.setItem('theme', next ? 'dark' : 'light');
          }} 
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
            display: 'none'
          }}
        >
          📋 Menú
        </button>
        <button 
          onClick={handleNewConversation}
          className="new-conversation-button"
          style={{
            background: 'rgba(52, 152, 219, 0.9)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            padding: '12px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
          title="Nueva conversación"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449L4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.9879 2.6687 12.2555 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328ZM15.7791 4.2207C15.3753 3.81702 14.7366 3.79124 14.3035 4.14453L14.2195 4.2207L9.17261 9.26856C8.81541 9.62578 8.56774 10.0756 8.45679 10.5654L8.41772 10.7773L8.28296 11.7158L9.22241 11.582L9.43433 11.543C9.92426 11.432 10.3749 11.1844 10.7322 10.8271L15.7791 5.78027L15.8552 5.69629C16.185 5.29194 16.1852 4.708 15.8552 4.30371L15.7791 4.2207Z"></path>
          </svg>
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
            maxWidth: window.innerWidth >= 1400 ? '1400px' : '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: window.innerWidth >= 1400 ? '0 40px' : '0 20px'
          }}>
            {/* Botón de cámara a la izquierda */}
            <button
              onClick={handleImageClick}
              className="chat-camera-button"
              style={{
                background: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              title="Subir o tomar foto"
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
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isTyping}
              rows={1}
              style={{
                flex: 1,
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '20px',
                padding: '12px 16px',
                fontSize: '1rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                maxHeight: '72px',
                minHeight: '24px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.2) transparent'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !inputText.trim()}
              className="chat-send-button"
              style={{
                background: isTyping || !inputText.trim() ? '#95a5a6' : '#43cea2',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                cursor: isTyping || !inputText.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
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
