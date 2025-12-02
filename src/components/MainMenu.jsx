import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import LoadingScreen from './LoadingScreen';
import ChangePasswordModal from './ChangePasswordModal';
import '../estilos/MainMenu.css';

const MainMenu = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    anime({
      targets: '.menu-item',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: 'easeOutCubic',
      delay: anime.stagger(100),
    });
  }, []);

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

  const menuOptions = [
    {
      id: 1,
      text: '¿En qué te puedo ayudar?',
      subtitle: user?.first_name || user?.username || '',
      icon: '💬',
      type: 'help',
      action: () => handleOptionClick('help')
    },
    {
      id: 2,
      type: 'catalog',
      text: 'Ver catálogo de pisos',
      icon: '🏠',
      action: () => handleOptionClick('catalog')
    },
    {
      id: 3,
      type: 'budget',
      text: 'Calcular presupuesto',
      icon: '💰',
      action: () => handleOptionClick('budget')
    },
    {
      id: 4,
      type: 'tips',
      text: 'Consejos de instalación',
      icon: '🔨',
      action: () => handleOptionClick('tips')
    },
    {
      id: 5,
      type: 'advisor',
      text: 'Contactar asesor',
      icon: '👨‍💼',
      action: () => handleOptionClick('advisor')
    }
  ];

  const handleOptionClick = (optionType) => {
    setSelectedOption(optionType);
    
    if (optionType === 'help') {
      navigate('/chat');
      return;
    }
    
    const loadingTexts = {
      'catalog': 'Preparando catálogo...',
      'budget': 'Calculando presupuesto...',
      'tips': 'Cargando consejos...',
      'advisor': 'Conectando con asesor...'
    };

    setLoadingText(loadingTexts[optionType] || 'Cargando...');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const displayName = user?.first_name || user?.username || 'amigo';
      const msg = `Función "${optionType}" en desarrollo. Será implementada en la próxima versión. Usuario: ${displayName}`;
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 4000);
  };

  const handleGoToChat = () => {
    navigate('/chat');
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

  const handleChangePasswordSubmit = async (oldPassword, newPassword) => {
    await changePassword(oldPassword, newPassword);
    alert('Contraseña cambiada exitosamente');
  };

  return (
    <div className={`main-menu-container ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="menu-header">
        <div className="header-left">
          <button className="btn-back" onClick={handleGoToChat}>
            ← Regresar al Chat
          </button>
        </div>
        
        <div className="header-logo">
          <img src="/Logo-Cesantoni.svg" alt="Cesantoni" className="logo-image" />
        </div>
        
        <div className="header-right">
          {/* Theme Toggle */}
          <div className="theme-toggle">
            <label className="switch" title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
              <input 
                type="checkbox" 
                checked={isDark}
                onChange={toggleTheme}
              />
              <span className="slider">
                <span className="icon sun">☀️</span>
                <span className="icon moon">🌙</span>
              </span>
            </label>
          </div>
          
          {/* Menu de usuario */}
          <div className="user-menu">
            <button className="btn-user" onClick={() => setShowChangePassword(true)}>
              ⚙️
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="menu-content">
        <div className="menu-wrapper">
          <h1 className="menu-title">Menú Principal</h1>
          <p className="menu-subtitle">Selecciona una opción para continuar</p>

          {/* Opciones del menú */}
          <div className="menu-options">
            {menuOptions.map((option) => (
              <div
                key={option.id}
                className={`menu-item ${selectedOption === option.type ? 'selected' : ''}`}
                onClick={() => option.action && option.action()}
              >
                <span className="menu-item-icon">{option.icon}</span>
                <div className="menu-item-content">
                  <span className="menu-item-text">{option.text}</span>
                  {option.subtitle && (
                    <span className="menu-item-subtitle">{option.subtitle}</span>
                  )}
                </div>
                <span className="menu-item-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="menu-footer">
        <div className="indicator-bar"></div>
      </footer>
      
      {/* Pantalla de carga overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <LoadingScreen isDark={isDark} loadingText={loadingText} onToggleTheme={toggleTheme} />
        </div>
      )}
      
      {/* Toast */}
      {showToast && (
        <div className="toast" role="status">
          {toastMessage}
        </div>
      )}

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePasswordSubmit}
        isDark={isDark}
      />
    </div>
  );
};

export default MainMenu;
