import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import '../estilos/index.css';

const ClientTypeSelection = ({ userName, onClientTypeSelected, onBack, isDark, onToggleTheme }) => {
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    // Animación de entrada
    anime({
      targets: '.client-question',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });

    anime({
      targets: '.client-option',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 600,
      easing: 'easeOutCubic',
      delay: anime.stagger(150, {start: 400})
    });

    anime({
      targets: '.continue-button',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: 800,
      easing: 'easeOutCubic',
    });
  }, []);

  const handleClientTypeClick = (type) => {
    setSelectedType(type);
    
    // Animación de selección
    anime({
      targets: `.client-option[data-type="${type}"]`,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuad'
    });
  };

  const handleContinue = () => {
    if (selectedType) {
      // Animación de salida
      anime({
        targets: '.client-selection-content',
        opacity: [1, 0],
        translateY: [0, -30],
        duration: 400,
        easing: 'easeInCubic',
        complete: () => {
          onClientTypeSelected(selectedType);
        }
      });
    }
  };

  const bgGradient = isDark
    ? 'linear-gradient(135deg, #434343 0%, #000000 100%)'
    : 'linear-gradient(135deg, #a8e6cf 0%, #88d8c0 50%, #7cc7bb 100%)';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: bgGradient,
        transition: 'background 0.5s',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Theme Toggle - Pequeño y en la esquina superior derecha */}
      <div style={themeToggleContainerStyle}>
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} />
      </div>

      {/* Botón de regresar */}
      {onBack && (
        <button 
          onClick={onBack}
          style={backButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0,123,255,0.3)';
            e.target.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,123,255,0.2)';
            e.target.style.transform = 'translateX(0px)';
          }}
        >
          ← Regresar
        </button>
      )}
  {/* SettingsMenu provided by ThemeToggle */}

      {/* Contenido principal */}
      <div className="client-selection-content" style={containerStyle}>
        {/* Pregunta principal */}
        <div className="client-question" style={questionStyle}>
          <h1 style={questionTextStyle}>
            ¿A qué tipo<br />
            de cliente<br />
            estás<br />
            atendiendo?
          </h1>
        </div>

        {/* Opciones de cliente */}
        <div style={optionsContainerStyle}>
          <div
            className="client-option"
            data-type="professional"
            onClick={() => handleClientTypeClick('professional')}
            style={{
              ...optionStyle,
              ...(selectedType === 'professional' && selectedOptionStyle)
            }}
          >
            <span style={optionTextStyle}>Arquitecto/<br />Ingeniero</span>
          </div>

          <div
            className="client-option"
            data-type="ordinary"
            onClick={() => handleClientTypeClick('ordinary')}
            style={{
              ...optionStyle,
              ...(selectedType === 'ordinary' && selectedOptionStyle)
            }}
          >
            <span style={optionTextStyle}>Cliente Ordinario</span>
          </div>
        </div>

        {/* Botón continuar */}
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedType}
          style={{
            ...continueButtonStyle,
            ...(selectedType && continueButtonActiveStyle),
            ...(!selectedType && continueButtonDisabledStyle)
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
  gap: '40px'
};

const questionStyle = {
  textAlign: 'center',
  marginBottom: '20px'
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
  gap: '15px',
  width: '100%',
  maxWidth: '300px'
};

const optionStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '25px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  border: '2px solid transparent',
  userSelect: 'none'
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

export default ClientTypeSelection;