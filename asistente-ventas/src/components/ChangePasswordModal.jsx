import React, { useState } from 'react';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit, isDark }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isDark ? '#2b2b2b' : '#fff',
          color: isDark ? '#fff' : '#333',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem' }}>
          Cambiar Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                color: isDark ? '#fff' : '#333',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                color: isDark ? '#fff' : '#333',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                color: isDark ? '#fff' : '#333',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {error && (
            <div
              style={{
                color: '#ff5757',
                marginBottom: '15px',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isDark ? '#444' : '#ddd',
                color: isDark ? '#fff' : '#333',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loading ? '#999' : '#3498db',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
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









