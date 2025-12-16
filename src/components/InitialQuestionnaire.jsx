import React, { useState } from 'react';
import '../estilos/InitialQuestionnaire.css';

const InitialQuestionnaire = ({ onComplete, onBack, isDark, clienteInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    tipoProyecto: null,
    ubicacion: null,
    superficie: null,
    resistencias: [],
    estilos: []
  });

  const questions = [
    {
      id: 'tipoProyecto',
      question: '¿Qué tipo de proyecto es?',
      type: 'single',
      options: [
        { value: 'residencial', label: 'Residencial', icon: '🏠' },
        { value: 'comercial', label: 'Comercial', icon: '🏢' },
        { value: 'industrial', label: 'Industrial', icon: '🏭' }
      ]
    },
    {
      id: 'ubicacion',
      question: '¿Interior o exterior?',
      type: 'single',
      options: [
        { value: 'interior', label: 'Interior', icon: '🏠' },
        { value: 'exterior', label: 'Exterior', icon: '🌳' },
        { value: 'ambos', label: 'Ambos', icon: '↔️' }
      ]
    },
    {
      id: 'superficie',
      question: '¿Es para piso, muro o ambos?',
      type: 'single',
      options: [
        { value: 'piso', label: 'Piso', icon: '⬇️' },
        { value: 'muro', label: 'Muro', icon: '🧱' },
        { value: 'ambos', label: 'Ambos', icon: '↔️' }
      ]
    },
    {
      id: 'resistencias',
      question: '¿Algo que deba soportar?',
      subtitle: 'Puedes seleccionar varias opciones',
      type: 'multiple',
      options: [
        { value: 'lluvia', label: 'Lluvia', icon: '🌧️' },
        { value: 'grasa', label: 'Grasa', icon: '🛢️' },
        { value: 'alto_trafico', label: 'Alto Tráfico', icon: '👣' },
        { value: 'vehiculos', label: 'Vehículos', icon: '🚗' },
        { value: 'quimicos', label: 'Químicos', icon: '🧪' }
      ],
      allowSkip: true
    },
    {
      id: 'estilos',
      question: '¿Qué estilo buscas?',
      subtitle: 'Puedes seleccionar varios estilos',
      type: 'multiple',
      options: [
        { value: 'madera', label: 'Madera', icon: '🪵' },
        { value: 'marmol', label: 'Mármol', icon: '🪨' },
        { value: 'cemento', label: 'Cemento', icon: '🏗️' },
        { value: 'piedra', label: 'Piedra', icon: '🪨' },
        { value: 'liso', label: 'Liso', icon: '▫️' },
        { value: 'mate', label: 'Mate', icon: '◾' },
        { value: 'monocolor', label: 'Monocolor', icon: '🎨' },
        { value: 'brillante', label: 'Brillante', icon: '✨' }
      ],
      allowSkip: true
    }
  ];

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSingleSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    
    // Auto-avanzar después de selección única
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleComplete({ ...answers, [currentQuestion.id]: value });
      }
    }, 300);
  };

  const handleMultipleSelect = (value) => {
    setAnswers(prev => {
      const currentValues = prev[currentQuestion.id] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [currentQuestion.id]: newValues
      };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = (finalAnswers) => {
    // Construir el mensaje inicial basado en las respuestas
    const message = buildInitialMessage(finalAnswers);
    onComplete(message, finalAnswers);
  };

  const buildInitialMessage = (ans) => {
    let parts = [];
    
    // Tipo de proyecto
    if (ans.tipoProyecto) {
      const tipoLabels = { residencial: 'residencial', comercial: 'comercial', industrial: 'industrial' };
      parts.push(`Busco piso para un proyecto ${tipoLabels[ans.tipoProyecto]}`);
    }
    
    // Ubicación
    if (ans.ubicacion) {
      const ubicLabels = { interior: 'interior', exterior: 'exterior', ambos: 'interior y exterior' };
      parts.push(`para ${ubicLabels[ans.ubicacion]}`);
    }
    
    // Superficie
    if (ans.superficie) {
      const supLabels = { piso: 'piso', muro: 'muro', ambos: 'piso y muro' };
      parts.push(`en ${supLabels[ans.superficie]}`);
    }
    
    // Resistencias
    if (ans.resistencias && ans.resistencias.length > 0) {
      const resistLabels = {
        lluvia: 'lluvia',
        grasa: 'grasa',
        alto_trafico: 'alto tráfico',
        vehiculos: 'vehículos',
        quimicos: 'químicos'
      };
      const resistList = ans.resistencias.map(r => resistLabels[r]).join(', ');
      parts.push(`que soporte ${resistList}`);
    }
    
    // Estilos
    if (ans.estilos && ans.estilos.length > 0) {
      const estiloLabels = {
        madera: 'madera',
        marmol: 'mármol',
        cemento: 'cemento',
        piedra: 'piedra',
        liso: 'liso',
        mate: 'mate',
        monocolor: 'monocolor',
        brillante: 'brillante'
      };
      const estiloList = ans.estilos.map(e => estiloLabels[e]).join(', ');
      parts.push(`con estilo ${estiloList}`);
    }
    
    return parts.join(' ') + '.';
  };

  return (
    <div className={`questionnaire-container ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="questionnaire-header">
        <button className="questionnaire-back-btn" onClick={handlePrev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Regresar</span>
        </button>
        
        {clienteInfo?.nombre && (
          <div className="questionnaire-cliente-badge">
            {clienteInfo.nombre}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="questionnaire-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">{currentStep + 1} de {totalSteps}</span>
      </div>

      {/* Question Content */}
      <div className="questionnaire-content">
        <div className="question-wrapper" key={currentStep}>
          <h2 className="question-title">{currentQuestion.question}</h2>
          {currentQuestion.subtitle && (
            <p className="question-subtitle">{currentQuestion.subtitle}</p>
          )}
          
          <div className={`options-grid ${currentQuestion.type === 'multiple' ? 'multiple' : 'single'}`}>
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.type === 'single'
                ? answers[currentQuestion.id] === option.value
                : (answers[currentQuestion.id] || []).includes(option.value);
              
              return (
                <button
                  key={option.value}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => 
                    currentQuestion.type === 'single' 
                      ? handleSingleSelect(option.value)
                      : handleMultipleSelect(option.value)
                  }
                >
                  <span className="option-label">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer con botón de continuar (solo para selección múltiple) */}
      {currentQuestion.type === 'multiple' && (
        <div className="questionnaire-footer">
          <button 
            className="continue-button"
            onClick={handleNext}
          >
            {currentStep === totalSteps - 1 ? 'Comenzar Chat' : 'Continuar'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          
          {currentQuestion.allowSkip && (answers[currentQuestion.id] || []).length === 0 && (
            <button className="skip-button" onClick={handleNext}>
              Omitir
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InitialQuestionnaire;

