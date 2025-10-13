import React, { useEffect } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/ChatRecommendations.css';

const LoadingRecommendations = ({ isDark, onToggleTheme }) => {
  useEffect(() => {
    // Animación del texto principal
    anime({
      targets: '.loading-title',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });

    // Animación de los puntos suspensivos
    anime({
      targets: '.loading-dot',
      opacity: [0.3, 1, 0.3],
      duration: 1500,
      loop: true,
      easing: 'easeInOutQuad',
      delay: anime.stagger(200)
    });

    // Animación del ícono de búsqueda
    anime({
      targets: '.search-icon',
      rotate: [0, 360],
      duration: 2000,
      loop: true,
      easing: 'linear'
    });

    // Animación de las barras de progreso
    anime({
      targets: '.progress-bar',
      width: ['0%', '100%'],
      duration: 3000,
      easing: 'easeInOutQuad',
      delay: 1000
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
      {/* Theme Toggle */}
      <div style={themeToggleContainerStyle}>
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} />
      </div>
  {/* SettingsMenu provided by ThemeToggle to avoid duplicates */}

      {/* Contenido de carga */}
      <div style={containerStyle}>
        {/* Ícono de búsqueda */}
        <div className="search-icon" style={searchIconStyle}>
          🔍
        </div>

        {/* Texto principal */}
        <div className="loading-title" style={loadingTitleStyle}>
          Cargando recomendaciones
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>

        {/* Texto descriptivo */}
        <div style={descriptionStyle}>
          Analizando tus preferencias para encontrar las mejores opciones
        </div>

        {/* Barras de progreso */}
        <div style={progressContainerStyle}>
          <div style={progressLabelStyle}>Buscando productos...</div>
          <div style={progressTrackStyle}>
            <div className="progress-bar" style={progressBarStyle}></div>
          </div>
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
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 0',
  textAlign: 'center'
};

const searchIconStyle = {
  fontSize: '4rem',
  marginBottom: '30px',
  color: '#2d3748'
};

const loadingTitleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#2d3748',
  marginBottom: '20px',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const descriptionStyle = {
  fontSize: '1.1rem',
  color: '#4a5568',
  marginBottom: '40px',
  maxWidth: '300px',
  lineHeight: '1.5'
};

const progressContainerStyle = {
  width: '100%',
  maxWidth: '280px',
  marginTop: '20px'
};

const progressLabelStyle = {
  fontSize: '0.9rem',
  color: '#4a5568',
  marginBottom: '10px',
  textAlign: 'left'
};

const progressTrackStyle = {
  width: '100%',
  height: '8px',
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: '4px',
  overflow: 'hidden'
};

const progressBarStyle = {
  height: '100%',
  backgroundColor: '#4CAF50',
  borderRadius: '4px',
  width: '0%'
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

export default LoadingRecommendations;