import React, { useState } from 'react';
import lunaPng from '../assets/luna.png';
import solPng from '../assets/sol.png';
import gearPng from '../assets/gear.png';
import SettingsMenu from './SettingsMenu';

const ThemeToggle = ({ onToggle, isDark, onLogout, onChangePassword, showGear = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // If the gear is hidden, we don't render the menu trigger or SettingsMenu
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        padding: 6,
        borderRadius: '999px',
        background: isDark ? 'linear-gradient(90deg, #232526, #414345)' : 'linear-gradient(90deg, #a8edea, #fed6e3)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'inline-flex',
        alignItems: 'center'
      }}>
        {showGear && (
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir configuración" style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
            <img
              src={gearPng}
              alt="configuración"
              style={{
                width: 18,
                height: 18,
                objectFit: 'contain',
                // make icon light on dark backgrounds and dark on light backgrounds
                filter: isDark ? 'grayscale(1) brightness(0) invert(1)' : 'none',
                transition: 'filter 160ms ease'
              }}
            />
          </button>
        )}

        <button onClick={onToggle} aria-label={isDark ? 'Activar modo día' : 'Activar modo noche'} title={isDark ? 'Activar modo día' : 'Activar modo noche'} style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}>
          <img
            src={isDark ? solPng : lunaPng}
            alt={isDark ? 'Sol (modo día)' : 'Luna (modo noche)'}
            style={{
              width: 18,
              height: 18,
              objectFit: 'contain',
              // make icon more visible on dark backgrounds
              // if isDark is true we are showing the sun image (solPng) so apply a warm, brighter filter
              filter: isDark
                ? 'sepia(0.9) saturate(3.2) hue-rotate(-20deg) brightness(1.25) drop-shadow(0 1px 2px rgba(0,0,0,0.35))'
                : 'none',
              transition: 'filter 160ms ease'
            }}
          />
        </button>
      </div>

      {showGear && (
        <SettingsMenu
          isDark={isDark}
          onLogout={() => {
            // close the menu first
            setMenuOpen(false);
            // call parent's logout handler if provided
            if (typeof onLogout === 'function') onLogout();
          }}
          onChangePassword={() => {
            // close the menu first
            setMenuOpen(false);
            // call parent's change password handler if provided
            if (typeof onChangePassword === 'function') onChangePassword();
          }}
          open={menuOpen}
          setOpen={setMenuOpen}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
