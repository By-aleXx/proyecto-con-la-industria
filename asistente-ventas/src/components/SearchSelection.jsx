import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/ChatRecommendations.css';
import '../estilos/index.css';

const SearchSelection = ({ userName, clientType, selectedArea, onSearchSelected, onBack, isDark, onToggleTheme }) => {
  const [selectedSearch, setSelectedSearch] = useState(null);

  useEffect(() => {
    // Animación de entrada
    anime({
      targets: '.search-question',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });

    anime({
      targets: '.search-option',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 600,
      easing: 'easeOutCubic',
      delay: anime.stagger(100, {start: 400})
    });

    anime({
      targets: '.continue-button',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: 1000,
      easing: 'easeOutCubic',
    });
  }, []);

  const handleSearchClick = (search) => {
    setSelectedSearch(search);
    
    // Animación de selección
    anime({
      targets: `.search-option[data-search="${search}"]`,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuad'
    });
  };

  const handleContinue = () => {
    if (selectedSearch) {
      // Animación de salida
      anime({
        targets: '.search-selection-content',
        opacity: [1, 0],
        translateY: [0, -30],
        duration: 400,
        easing: 'easeInCubic',
        complete: () => {
          onSearchSelected(selectedSearch);
        }
      });
    }
  };

  // Use same animated chat background
  const searchOptions = [
    { id: 'economico', name: 'Piso Económico' },
    { id: 'antideslizante', name: 'Antideslizante' },
    { id: 'facil-limpiar', name: 'Fácil de limpiar' },
    { id: 'alta-durabilidad', name: 'Alta durabilidad' },
    { id: 'color-especifico', name: 'Color específico' }
  ];

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
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} />
      </div>
  {/* SettingsMenu provided by ThemeToggle */}

      {/* Botón de regresar */}
      <button 
        type="button"
        aria-label="Regresar"
        onClick={onBack}
        style={backButtonStyle}
      >
        ← Regresar
      </button>

      {/* Contenido principal */}
      <div className="search-selection-content" style={containerStyle}>
        {/* Pregunta principal */}
        <div className="search-question" style={questionStyle}>
          <h1 style={questionTextStyle}>
            ¿Qué está<br />
            buscando el<br />
            cliente?
          </h1>
        </div>

        {/* Opciones de búsqueda */}
        <div style={optionsContainerStyle}>
          {searchOptions.map((option) => (
            <div
              key={option.id}
              className="search-option"
              data-search={option.id}
              onClick={() => handleSearchClick(option.id)}
              style={{
                ...optionStyle,
                ...(selectedSearch === option.id && selectedOptionStyle)
              }}
            >
              <span style={optionTextStyle}>{option.name}</span>
            </div>
          ))}
        </div>

        {/* Botón continuar */}
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedSearch}
          style={{
            ...continueButtonStyle,
            ...(selectedSearch && continueButtonActiveStyle),
            ...(!selectedSearch && continueButtonDisabledStyle)
          }}
        >
          Siguiente
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

const backButtonStyle = {
  position: 'absolute',
  top: '60px',
  left: '20px',
  background: 'rgba(0,123,255,0.2)',
  border: 'none',
  color: 'rgba(0,0,0,0.7)',
  padding: '8px 12px',
  borderRadius: '20px',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background 0.3s'
};

const containerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 0',
  gap: '30px',
  marginTop: '40px'
};

const questionStyle = {
  textAlign: 'center',
  marginBottom: '10px'
};

const questionTextStyle = {
  fontSize: '2.2rem',
  fontWeight: 'bold',
  color: 'white',
  lineHeight: '1.2',
  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
  margin: 0
};

const optionsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  maxWidth: '300px'
};

const optionStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '15px 20px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  border: '2px solid transparent',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const selectedOptionStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '2px solid #4299e1',
  transform: 'scale(1.02)',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
};

const optionTextStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d3748',
  lineHeight: '1.3'
};

const continueButtonStyle = {
  width: '90%',
  maxWidth: '300px',
  padding: '18px',
  borderRadius: '25px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)'
};

const continueButtonActiveStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white'
};

const continueButtonDisabledStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  color: '#999',
  cursor: 'not-allowed'
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

export default SearchSelection;