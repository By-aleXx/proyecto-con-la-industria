import React, { useState, useEffect } from 'react';

const SettingsMenu = ({ onLogout, isDark, open: externalOpen, setOpen: setExternalOpen }) => {
  const [internalOpen, setInternalOpen] = useState(false);
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
          minWidth: 180,
          overflow: 'hidden'
        }}>
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
                ? (isDark ? 'rgba(52,152,219,0.28)' : 'rgba(52,152,219,0.18)')
                : (isDark ? 'transparent' : 'transparent'),
              color: isDark ? (logoutHover ? '#fff' : '#d6eefb') : (logoutHover ? '#063852' : '#155a8a'),
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease',
              fontWeight: 600
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
