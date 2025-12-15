import React, { useState } from 'react';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit, isDark }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Colores Cesantoni
  const colors = {
    primary: isDark ? '#B8985F' : '#8B6F47',
    primaryDark: isDark ? '#9A7F4F' : '#6D5738',
    surface: isDark ? '#2C2C2C' : '#ffffff',
    bg: isDark ? '#1A1A1A' : '#E8E4E0',
    bgInput: isDark ? '#2C2C2C' : '#ffffff',
    border: isDark ? '#404040' : '#D4CFC8',
    text: isDark ? '#E8E4E0' : '#333333',
    textMuted: isDark ? '#999999' : '#757575',
    error: isDark ? '#FF6B5A' : '#E74C3C'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.old_password?.[0] || err.response?.data?.error || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          color: colors.text,
          padding: '32px',
          borderRadius: '8px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
            : '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '8px', 
          fontSize: '1.5rem',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: colors.text
        }}>
          Cambiar Contraseña
        </h2>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '0.9rem',
          color: colors.textMuted
        }}>
          Ingresa tu contraseña actual y la nueva contraseña
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: colors.text,
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Contraseña actual
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '6px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bgInput,
                color: colors.text,
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: colors.text,
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '6px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bgInput,
                color: colors.text,
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: colors.text,
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '6px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bgInput,
                color: colors.text,
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>
          {error && (
            <div
              style={{
                color: colors.error,
                marginBottom: '16px',
                fontSize: '0.9rem',
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor: isDark ? 'rgba(255, 107, 90, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                border: `1px solid ${colors.error}`
              }}
            >
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: `2px solid ${colors.border}`,
                backgroundColor: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: loading ? colors.textMuted : colors.primary,
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Cambiando...' : 'Cambiar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
