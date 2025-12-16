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

    // Create a message with the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        text: '',
        contentType: 'image',
        content: reader.result,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
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
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} />
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons-container">
        <button 
          onClick={onGoToMenu}
          className="menu-button"
        >
          Ir al Menú
        </button>
        
        <button 
          onClick={onLogout}
          className="logout-button"
        >
          Cerrar Sesión
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
                      src="/avatar.png" 
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
                    }}>{message.text}</div>
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
                <div className="user-message-container">
                  <div className="user-message">
                    <div className="user-text">
                      {message.text}
                      {message.contentType === 'image' && (
                        <img
                          src={message.content}
                          alt="Imagen enviada"
                          style={{
                            maxWidth: '100%',
                            borderRadius: '10px',
                            marginTop: '8px'
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="avatar-circle" style={{ position: 'relative', width: 40, height: 40 }}>
                    <img 
                      src="/avatar-user.png" 
                      alt="Usuario"
                      className="avatar-image"
                      style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#3a5673', objectFit: 'cover', display: 'block' }}
                      onError={e => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('.avatar-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="avatar-fallback" style={{
                      display: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: '#3a5673',
                      borderRadius: '12px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#b2d8e6',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}>U</div>
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
                  background: '#23272b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginRight: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                }}
                title="Subir o tomar foto"
              >
                <span role="img" aria-label="camara">📸</span>
              </button>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe tu mensaje..."
                style={{
                  flex: 1,
                  background: '#23272b',
                  color: '#fff',
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