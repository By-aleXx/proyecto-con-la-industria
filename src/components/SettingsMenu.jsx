import React, { useState, useEffect, useRef } from 'react';

const SettingsMenu = ({ onLogout, onChangePassword, onToggle, isDark, open: externalOpen, setOpen: setExternalOpen }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [themeHover, setThemeHover] = useState(false);
  const [changePasswordHover, setChangePasswordHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);
  const menuRef = useRef(null);

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

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  // Render only the dropdown; the trigger button is expected to be external (e.g., ThemeToggle)
  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block', zIndex: 1200 }}>
      {open && (
        <div
          role="menu"
          aria-label="Menú de configuración"
          style={{
          position: 'absolute',
          top: '30px',
          right: 0,
          background: isDark ? '#2b2b2b' : '#fff',
          color: isDark ? '#fff' : '#111',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: 200,
          overflow: 'hidden'
        }}>
          {onToggle && (
            <button
              type="button"
              onClick={() => { 
                if (typeof onToggle === 'function') {
                  onToggle();
                }
              }}
              onMouseEnter={() => setThemeHover(true)}
              onMouseLeave={() => setThemeHover(false)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: themeHover
                  ? (isDark ? 'rgba(108,92,231,0.28)' : 'rgba(108,92,231,0.18)')
                  : (isDark ? 'transparent' : 'transparent'),
                color: isDark ? (themeHover ? '#fff' : '#d6d6fb') : (themeHover ? '#3a2d7a' : '#6c5ce7'),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
                fontWeight: 600,
                borderBottom: isDark ? '1px solid #444' : '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {isDark ? (
                  // Sol
                  <>
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </>
                ) : (
                  // Luna
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                )}
              </svg>
              {isDark ? 'Modo claro' : 'Modo oscuro'}
            </button>
          )}
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
                borderBottom: isDark ? '1px solid #444' : '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Cambiar contraseña
            </button>
          )}
          {onLogout && (
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
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar sesión
          </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
