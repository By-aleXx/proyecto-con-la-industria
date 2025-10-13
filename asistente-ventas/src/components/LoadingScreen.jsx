import React, { useEffect } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/ChatRecommendations.css';

const LoadingScreen = ({ isDark, loadingText = "Cargando...", onToggleTheme }) => {
  useEffect(() => {
    // Animación del texto
    anime({
      targets: '.loading-text',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });

    // Animación de los puntos suspensivos
    anime({
      targets: '.loading-dots',
      opacity: [0.3, 1, 0.3],
      duration: 1500,
      loop: true,
      easing: 'easeInOutQuad',
      delay: anime.stagger(200)
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
  {/* SettingsMenu handled by ThemeToggle to avoid duplicates */}

      {/* Contenido de carga */}
      <div style={containerStyle}>
        <div className="loading-text" style={loadingTextStyle}>
          {loadingText}
          <span className="loading-dots">.</span>
          <span className="loading-dots">.</span>
          <span className="loading-dots">.</span>
        </div>
      </div>

      {/* Indicador inferior */}
      <div style={bottomIndicatorStyle}>
        <div style={indicatorBarStyle}></div>
      </div>
    </div>
  );
};

// Estilos
const themeToggleContainerStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  zIndex: 1000,
  transform: 'scale(1.0)' // Tamaño normal para el toggle
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 5px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: 'rgba(0,0,0,0.7)'
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
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 0'
};

const loadingTextStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#2d3748',
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
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

export default LoadingScreen;