import React, { useState, useEffect } from 'react';
import '../estilos/ConversationList.css';

const NewConversationModal = ({ isOpen, onClose, onConfirm, isDark }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoError, setTelefonoError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNombre('');
      setTelefono('');
      setTelefonoError('');
    }
  }, [isOpen]);

  // Validar formato de teléfono: + seguido de 10-15 dígitos
  const validateTelefono = (value) => {
    if (!value) return true; // Es opcional
    const regex = /^\+\d{10,15}$/;
    return regex.test(value);
  };

  const handleTelefonoChange = (e) => {
    let value = e.target.value;
    
    // Permitir solo + al inicio y números
    value = value.replace(/[^\d+]/g, '');
    if (value.indexOf('+') > 0) {
      value = '+' + value.replace(/\+/g, '');
    }
    
    setTelefono(value);
    
    if (value && !validateTelefono(value)) {
      setTelefonoError('Formato: +521234567890 (10-15 dígitos)');
    } else {
      setTelefonoError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (telefono && !validateTelefono(telefono)) {
      setTelefonoError('Formato inválido');
      return;
    }

    onConfirm({
      nombre: nombre.trim() || null,
      telefono: telefono.trim() || null
    });
  };

  const handleClose = () => {
    setNombre('');
    setTelefono('');
    setTelefonoError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className={`modal-container new-conversation-modal ${isDark ? 'dark' : 'light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Nueva Conversación</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del cliente</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="form-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={handleTelefonoChange}
              placeholder="Ej: +521234567890"
              className={`form-input ${telefonoError ? 'error' : ''}`}
            />
            {telefonoError && <span className="error-text">{telefonoError}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!!telefonoError}
            >
              Iniciar Conversación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConversationModal;

