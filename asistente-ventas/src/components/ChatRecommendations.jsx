import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/index.css';

const ChatRecommendations = ({ userName, clientType, selectedArea, selectedSearch, onLogout, onGoToMenu, isDark, onToggleTheme }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: `¡Hola! Mi nombre es Laura y estoy aquí para ayudarte. Con base a las especificaciones que estás buscando, puedo ofrecerte las mejores recomendaciones de pisos para tu proyecto.`,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const questionOptions = {
    clientType: ['Particular', 'Empresa', 'Otro'],
    area: ['Sala', 'Cocina', 'Baño', 'Recámara', 'Oficina'],
    search: ['Laminado', 'Vinílico', 'Cerámico', 'Otro']
  };

  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questionQueue, setQuestionQueue] = useState([]);

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

    // Escuchar preguntas post-login
    const handlePostLoginQuestions = (e) => {
      const questions = e.detail;
      if (questions && questions.length > 0) {
        setQuestionQueue(questions);
        setPendingQuestion(questions[0]);
        // Agregar la primera pregunta como mensaje
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'ai',
          text: '¿Qué tipo de cliente eres?',  // Simplificamos el texto de la pregunta
          questionId: questions[0].id,
          timestamp: new Date()
        }]);
      }
    };
    window.addEventListener('postLoginQuestions', handlePostLoginQuestions);
    return () => {
      window.removeEventListener('postLoginQuestions', handlePostLoginQuestions);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);

    // Create a message with the uploaded image
    const reader = new FileReader();
    reader.onloadend = async () => {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        text: '',
        contentType: 'image',
        content: reader.result,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);

      try {
        // Enviar la imagen al servidor para análisis de color
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

  const response = await fetch('http://localhost:4000/api/extract-colors', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Error al procesar la imagen');
        }

        const colorData = await response.json();
        
        // Crear el mensaje de respuesta con el análisis de color
        const analysisMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: 'He analizado los colores dominantes en la imagen:',
          contentType: 'color-analysis',
          colors: colorData.colors,
          percentages: colorData.percentages,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, analysisMessage]);
      } catch (error) {
        console.error('Error:', error);
        let errorText = 'Lo siento, hubo un error al analizar los colores de la imagen.';
        
        if (error.name === 'AbortError') {
          errorText = 'La operación tomó demasiado tiempo. Por favor, intenta con una imagen más pequeña.';
        } else if (error.message === 'NetworkError') {
          errorText = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión.';
        }

        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: errorText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        text: inputText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const handleOptionClick = (option) => {
    // Toggle selection
    setSelectedAnswers(prev => {
      if (prev.includes(option)) {
        return prev.filter(a => a !== option);
      }
      return [...prev, option];
    });
  };

  const handleAsk = () => {
    // Handle selected answers
    if (selectedAnswers.length > 0) {
      // Add user's selection as a message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        text: selectedAnswers.join(', '),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear selections and move to next question
      setSelectedAnswers([]);
      
      if (questionQueue.length > 1) {
        const newQueue = questionQueue.slice(1);
        setQuestionQueue(newQueue);
        setPendingQuestion(newQueue[0]);
        
        // Add next question
        const nextQuestion = {
          id: Date.now() + 1,
          type: 'ai',
          text: '¿En qué área planeas instalarlo?',
          questionId: newQueue[0].id,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
      } else {
        // No more questions
        setPendingQuestion(null);
        setQuestionQueue([]);
      }
    }
  };

  const handleSuggestionClick = (action) => {
    // Implement suggestion click handler
    console.log('Suggestion clicked:', action);
  };

  return (
    <div className={`chat-main-container ${isDark ? 'dark' : 'light'}`}>
      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} onLogout={onLogout} />
      </div>
  {/* SettingsMenu is provided by ThemeToggle (to avoid duplicate menus) */}

      {/* Navigation Buttons */}
      <div className="nav-buttons-container">
        <button 
          onClick={onGoToMenu}
          className="menu-button"
        >
          Ir al Menú
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
                    {message.contentType === 'image' && (
                      <img
                        src={message.content}
                        alt="Imagen enviada"
                        style={{
                          maxWidth: '100%',
                          borderRadius: '10px',
                          marginBottom: message.text ? '8px' : '0'
                        }}
                      />
                    )}
                    <div className="ai-text" style={{
                      background: message.questionId ? '#0084ff' : '#fff',
                      color: message.questionId ? '#fff' : '#222',
                      padding: message.questionId ? '12px 20px' : '18px 22px',
                      borderRadius: '20px',
                      fontSize: message.questionId ? '0.95rem' : '1.1rem',
                      fontWeight: message.questionId ? '500' : '400',
                      letterSpacing: message.questionId ? '0.3px' : 'normal',
                      boxShadow: message.questionId ? '0 2px 12px rgba(0, 132, 255, 0.2)' : '0 2px 12px rgba(0,0,0,0.1)'
                    }}>
                      {message.text}
                      {message.contentType === 'color-analysis' && message.colors && (
                        <div style={{ marginTop: '10px', maxWidth: '300px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', justifyContent: 'center' }}>
                            {message.colors.map((colorInfo, index) => (
                              <div key={index} style={{ textAlign: 'center', flex: '0 0 calc(50% - 6px)' }}>
                                <div style={{
                                  width: '100%',
                                  height: '60px',
                                  backgroundColor: colorInfo[0],
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                  marginBottom: '6px'
                                }} />
                                <div style={{ 
                                  fontSize: '0.9rem',
                                  backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.9)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  marginTop: '2px'
                                }}>
                                  <div style={{ fontWeight: 'bold' }}>{colorInfo[0]}</div>
                                  <div>{message.percentages[index].toFixed(1)}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {message.questionId && pendingQuestion && message.questionId === pendingQuestion.id && questionOptions[pendingQuestion.id] && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px', maxWidth: '340px' }}>
                        {questionOptions[pendingQuestion.id].map(option => (
                          <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            style={{
                              background: selectedAnswers.includes(option) ? '#0084ff' : '#2c2c2c',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '20px',
                              padding: '10px 0',
                              fontWeight: '500',
                              cursor: 'pointer',
                              width: '100%',
                              fontSize: '0.95rem',
                              boxShadow: selectedAnswers.includes(option) ? '0 2px 8px rgba(0, 132, 255, 0.3)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {option}
                          </button>
                        ))}
                        <button
                          onClick={handleAsk}
                          style={{
                            background: '#40e6b4',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '8px 0',
                            fontWeight: '500',
                            marginTop: '4px',
                            cursor: 'pointer',
                            width: '100%',
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 8px rgba(64, 230, 180, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          disabled={selectedAnswers.length === 0}
                        >
                          Enviar
                        </button>
                      </div>
                    )}
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
                    U
                  </div>
                </div>
              )}
              
              {message.type === 'suggestion' && (
                <button
                  className="suggestion-button"
                  onClick={() => handleSuggestionClick(message.action)}
                >
                  {message.text}
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Input oculto para subir fotos */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          {/* Input Area */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'transparent', padding: '20px 0', zIndex: 100 }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe tu mensaje..."
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
                style={{
                  background: '#43cea2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '12px 32px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Indicator */}
      <div className="bottom-indicator">
        <div className="indicator-bar"></div>
      </div>
    </div>
  );
};

export default ChatRecommendations;