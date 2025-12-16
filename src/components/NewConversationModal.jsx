import React, { useState, useEffect } from 'react';
import '../estilos/ConversationList.css';

const NewConversationModal = ({ isOpen, onClose, onConfirm, isDark }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [telefonoError, setTelefonoError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNombre('');
      setTelefono('');
      setCountryCode('+52');
      setTelefonoError('');
    }
  }, [isOpen]);

  // Validar formato de teléfono: solo dígitos, 10 caracteres para México
  const validateTelefono = (value) => {
    if (!value) return true; // Es opcional
    // Limpiar espacios y guiones
    const cleanValue = value.replace(/[\s-]/g, '');
    // Validar que sean solo dígitos y tenga entre 10 y 15 caracteres
    const regex = /^\d{10,15}$/;
    return regex.test(cleanValue);
  };

  const handleTelefonoChange = (e) => {
    let value = e.target.value;
    
    // Permitir solo números, espacios y guiones
    value = value.replace(/[^\d\s-]/g, '');
    
    setTelefono(value);
    
    const cleanValue = value.replace(/[\s-]/g, '');
    if (cleanValue && !validateTelefono(cleanValue)) {
      setTelefonoError('Ingresa un número de 10 dígitos');
    } else {
      setTelefonoError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanTelefono = telefono.replace(/[\s-]/g, '');
    
    if (cleanTelefono && !validateTelefono(cleanTelefono)) {
      setTelefonoError('Número inválido');
      return;
    }

    // Concatenar código de país + teléfono
    const telefonoCompleto = cleanTelefono ? `${countryCode}${cleanTelefono}` : null;

    onConfirm({
      nombre: nombre.trim() || null,
      telefono: telefonoCompleto
    });
  };

  const handleClose = () => {
    setNombre('');
    setTelefono('');
    setCountryCode('+52');
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
            <div className="phone-input-wrapper">
              <select 
                className="form-input country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+52">🇲🇽 +52</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+57">🇨🇴 +57</option>
                <option value="+51">🇵🇪 +51</option>
                <option value="+34">🇪🇸 +34</option>
              </select>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={handleTelefonoChange}
                placeholder="55 1234 5678"
                className={`form-input phone-number-input ${telefonoError ? 'error' : ''}`}
              />
            </div>
            {telefonoError && <span className="error-text">{telefonoError}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary btn-iniciar"
              disabled={!!telefonoError}
            >
              <span className="btn-text">Iniciar Conversación</span>
              <svg className="btn-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConversationModal;

