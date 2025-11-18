import React, { useEffect } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/ChatRecommendations.css';

const ErrorScreen = ({ errorMessage, onRetry, isDark, onToggleTheme }) => {
  useEffect(() => {
    // Animación de entrada
    anime({
      targets: '.error-content',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });

    anime({
      targets: '.error-icon',
      scale: [0, 1],
      duration: 600,
      delay: 300,
      easing: 'easeOutBounce',
    });
  }, []);

  return (
    <div
      className={`chat-main-container ${isDark ? 'dark' : 'light'}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.5s',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Theme Toggle - Pequeño y en la esquina superior derecha */}
      <div style={themeToggleContainerStyle}>
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} onLogout={undefined} />
      </div>
  {/* SettingsMenu handled by ThemeToggle to avoid duplicate menus */}

      {/* Contenido del error */}
      <div style={containerStyle}>
        <div className="error-content" style={contentStyle}>
          <h1 style={titleStyle}>
            Error al tratar<br />
            de ingresar a<br />
            tu JD
          </h1>
          
          <div className="error-icon" style={iconContainerStyle}>
            <div style={iconStyle}>
              <span style={xIconStyle}>✕</span>
            </div>
          </div>
        </div>

        {/* Botón para reintentar */}
        <button
          onClick={onRetry}
          style={retryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          Intentar de nuevo
        </button>
      </div>

      {/* Indicador inferior */}
      <div style={bottomIndicatorStyle}>
        <div style={indicatorBarStyle}></div>
      </div>
    </div>
  );
};

// Estilos
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 5px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: 'rgba(0,0,0,0.7)'
};

const themeToggleContainerStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  zIndex: 1000,
  transform: 'scale(1.0)' // Tamaño normal para el toggle
};

const timeStyle = {
  fontSize: '16px',
  fontWeight: 'bold'
};

const statusBarStyle = {
  fontSize: '12px'
};

const containerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 0'
};

const contentStyle = {
  textAlign: 'center',
  marginBottom: '60px'
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#2d3748',
  marginBottom: '60px',
  lineHeight: '1.2',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const iconContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const iconStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#e53e3e',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 8px 25px rgba(229, 62, 62, 0.3)'
};

const xIconStyle = {
  color: 'white',
  fontSize: '2.5rem',
  fontWeight: 'bold'
};

const retryButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  borderRadius: '25px',
  padding: '15px 40px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2d3748',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)'
};

const bottomIndicatorStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0',
  paddingBottom: '30px'
};

const indicatorBarStyle = {
  width: '134px',
  height: '5px',
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: '3px'
};

export default ErrorScreen;