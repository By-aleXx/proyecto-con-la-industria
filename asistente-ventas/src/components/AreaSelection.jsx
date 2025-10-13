import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/ChatRecommendations.css';
import '../estilos/index.css';

const AreaSelection = ({ userName, clientType, onAreaSelected, onBack, isDark, onToggleTheme }) => {
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    // Animación de entrada
    anime({
      targets: '.area-question',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });

    anime({
      targets: '.area-option',
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

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    
    // Animación de selección
    anime({
      targets: `.area-option[data-area="${area}"]`,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuad'
    });
  };

  const handleContinue = () => {
    if (selectedArea) {
      // Animación de salida
      anime({
        targets: '.area-selection-content',
        opacity: [1, 0],
        translateY: [0, -30],
        duration: 400,
        easing: 'easeInCubic',
        complete: () => {
          onAreaSelected(selectedArea);
        }
      });
    }
  };
  // Use same animated chat background for consistency

  const areas = [
    { id: 'sala-comedor', name: 'Sala / Comedor', hasIcon: true },
    { id: 'recamara', name: 'Recámara', hasIcon: false },
    { id: 'cocina', name: 'Cocina', hasIcon: false },
    { id: 'patio-exterior', name: 'Patio / Exterior', hasIcon: false },
    { id: 'bano', name: 'Baño', hasIcon: false }
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
      <div className="area-selection-content" style={containerStyle}>
        {/* Pregunta principal */}
        <div className="area-question" style={questionStyle}>
          <h1 style={questionTextStyle}>
            ¿En qué área<br />
            de la casa se<br />
            instalará el<br />
            piso?
          </h1>
        </div>

        {/* Opciones de área */}
        <div style={optionsContainerStyle}>
          {areas.map((area) => (
            <div
              key={area.id}
              className="area-option"
              data-area={area.id}
              onClick={() => handleAreaClick(area.id)}
              style={{
                ...optionStyle,
                ...(selectedArea === area.id && selectedOptionStyle),
                ...(area.hasIcon && iconOptionStyle)
              }}
            >
              {area.hasIcon && (
                <div style={houseIconStyle}>
                  <div style={houseRoofStyle}></div>
                  <div style={houseBodyStyle}>
                    <div style={roomDividerStyle}></div>
                  </div>
                </div>
              )}
              <span style={optionTextStyle}>{area.name}</span>
            </div>
          ))}
        </div>

        {/* Botón continuar */}
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedArea}
          style={{
            ...continueButtonStyle,
            ...(selectedArea && continueButtonActiveStyle),
            ...(!selectedArea && continueButtonDisabledStyle)
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
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
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
  justifyContent: 'center',
  gap: '10px'
};

const iconOptionStyle = {
  padding: '20px',
  flexDirection: 'column',
  gap: '15px'
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

// Estilos para el ícono de casa
const houseIconStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '60px',
  height: '50px'
};

const houseRoofStyle = {
  width: '0',
  height: '0',
  borderLeft: '25px solid transparent',
  borderRight: '25px solid transparent',
  borderBottom: '20px solid #8b4513',
  marginBottom: '2px'
};

const houseBodyStyle = {
  width: '50px',
  height: '28px',
  backgroundColor: '#d2b48c',
  position: 'relative',
  borderRadius: '2px'
};

const roomDividerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '2px',
  height: '60%',
  backgroundColor: '#8b4513',
  '::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(90deg)',
    width: '20px',
    height: '2px',
    backgroundColor: '#8b4513'
  }
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

export default AreaSelection;