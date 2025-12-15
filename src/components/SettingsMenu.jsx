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

  // Colores Cesantoni
  const colors = {
    primary: isDark ? '#B8985F' : '#8B6F47',
    primaryDark: isDark ? '#9A7F4F' : '#6D5738',
    accent: isDark ? '#C0A080' : '#A0826D',
    surface: isDark ? '#2C2C2C' : '#ffffff',
    border: isDark ? '#404040' : '#D4CFC8',
    text: isDark ? '#E8E4E0' : '#333333',
    textMuted: isDark ? '#999999' : '#757575',
    error: isDark ? '#FF6B5A' : '#E74C3C',
    errorBg: isDark ? 'rgba(255, 107, 90, 0.15)' : 'rgba(231, 76, 60, 0.1)'
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block', zIndex: 1200 }}>
      {open && (
        <div
          role="menu"
          aria-label="Menú de configuración"
          style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            background: colors.surface,
            color: colors.text,
            borderRadius: '8px',
            boxShadow: isDark 
              ? '0 8px 24px rgba(0,0,0,0.4)' 
              : '0 8px 24px rgba(0,0,0,0.12)',
            border: `1px solid ${colors.border}`,
            minWidth: 220,
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
                padding: '12px 16px',
                background: themeHover
                  ? (isDark ? 'rgba(184, 152, 95, 0.15)' : 'rgba(139, 111, 71, 0.08)')
                  : 'transparent',
                color: themeHover ? colors.primary : colors.text,
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 500,
                fontSize: '0.9rem',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: colors.primary }}
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
                padding: '12px 16px',
                background: changePasswordHover
                  ? (isDark ? 'rgba(184, 152, 95, 0.15)' : 'rgba(139, 111, 71, 0.08)')
                  : 'transparent',
                color: changePasswordHover ? colors.primary : colors.text,
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 500,
                fontSize: '0.9rem',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: colors.primary }}
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
              try { setOpen(false); } catch (e) { /* ignore */ }
              if (typeof onLogout === 'function') {
                setTimeout(() => onLogout(), 80);
              }
            }}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: logoutHover ? colors.errorBg : 'transparent',
              color: logoutHover ? colors.error : colors.textMuted,
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <svg 
              width="18" 
              height="18" 
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
