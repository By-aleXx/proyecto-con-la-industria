import React, { useState, useEffect } from 'react';

const SettingsMenu = ({ onLogout, onChangePassword, isDark, open: externalOpen, setOpen: setExternalOpen }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [changePasswordHover, setChangePasswordHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

  const isControlled = typeof externalOpen === 'boolean' && typeof setExternalOpen === 'function';
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? setExternalOpen : setInternalOpen;

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  // Render only the dropdown; the trigger button is expected to be external (e.g., ThemeToggle)
  return (
    <div style={{ position: 'relative', display: 'inline-block', zIndex: 1200 }}>
      {open && (
        <div
          role="menu"
          aria-label="Menú de configuración"
          style={{
          marginTop: 8,
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: isDark ? '#2b2b2b' : '#fff',
          color: isDark ? '#fff' : '#111',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: 200,
          overflow: 'hidden'
        }}>
          {onChangePassword && (
            <button
              type="button"
              onClick={() => { 
                try { setOpen(false); } catch (e) { /* ignore */ }
                if (typeof onChangePassword === 'function') {
                  setTimeout(() => onChangePassword(), 80);
                }
              }}
              onMouseEnter={() => setChangePasswordHover(true)}
              onMouseLeave={() => setChangePasswordHover(false)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: changePasswordHover
                  ? (isDark ? 'rgba(52,152,219,0.28)' : 'rgba(52,152,219,0.18)')
                  : (isDark ? 'transparent' : 'transparent'),
                color: isDark ? (changePasswordHover ? '#fff' : '#d6eefb') : (changePasswordHover ? '#063852' : '#155a8a'),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
                fontWeight: 600,
                borderBottom: isDark ? '1px solid #444' : '1px solid #eee'
              }}
            >
              🔒 Cambiar contraseña
            </button>
          )}
          <button
            type="button"
            onClick={() => { 
              // Close menu first, then call logout after a short delay so parent navigation can occur
              try { setOpen(false); } catch (e) { /* ignore */ }
              if (typeof onLogout === 'function') {
                setTimeout(() => onLogout(), 80);
              }
            }}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: logoutHover
                ? (isDark ? 'rgba(231,76,60,0.28)' : 'rgba(231,76,60,0.18)')
                : (isDark ? 'transparent' : 'transparent'),
              color: logoutHover ? '#e74c3c' : (isDark ? '#ff8a80' : '#c0392b'),
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease',
              fontWeight: 600
            }}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
