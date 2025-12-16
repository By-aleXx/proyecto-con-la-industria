import React from 'react';
import ThemeToggle from './ThemeToggle';
import '../estilos/LoadingScreen.css';

const LoadingScreen = ({ isDark, loadingText, onToggleTheme }) => {
  return (
    <div className={`loading-screen-container ${isDark ? 'dark' : 'light'}`}>
      {/* Theme Toggle */}
      <div className="loading-theme-toggle">
        <ThemeToggle onToggle={onToggleTheme} isDark={isDark} onLogout={undefined} />
      </div>

      {/* Stage de la animación */}
      <div className="loading-stage">
        <svg 
          viewBox="0 0 200 200" 
          className="loading-logo-svg" 
          xmlns="http://www.w3.org/2000/svg" 
          role="img" 
          aria-label="Cargando"
        >
          <g>
            {/* Círculo de fondo oscuro */}
            <circle 
              className="loading-bg-circle" 
              cx="100" 
              cy="100" 
              r="80" 
              fill="var(--loading-ring-bg, #111217)" 
            />

            {/* Outer arcs: base oscuro completo + arco blanco encima que actúa como cuenta atrás */}
            <g transform="rotate(-90 100 100)">
              {/* Dark base (full ring) */}
              <circle 
                className="loading-arc loading-dark-arc" 
                cx="100" 
                cy="100" 
                r="60" 
                fill="none" 
                stroke="var(--loading-dark, #0b0b0b)" 
                strokeWidth="20"
                strokeDasharray="376" 
                strokeDashoffset="0" 
              />

              {/* White countdown on top */}
              <circle 
                className="loading-arc loading-white-arc loading-countdown" 
                cx="100" 
                cy="100" 
                r="60" 
                fill="none" 
                stroke="var(--loading-white, #f6f7f8)"
                strokeWidth="20" 
                strokeDasharray="376" 
                strokeDashoffset="0" 
              />
            </g>

            {/* Loader dentro del SVG, perfectamente centrado */}
            <foreignObject x="70" y="65" width="80" height="80">
              <div className="loading-loader-wrapper-svg">
                <span className="loading-spinner"></span>
              </div>
            </foreignObject>

            {/* Imagen del logo que aparece después del spinner */}
            <g className="loading-center-logo" aria-hidden="true">
              <image 
                href="/loadings/oscuro/imagen/center-logo.png" 
                x="35" 
                y="35" 
                width="120" 
                height="120"
                preserveAspectRatio="xMidYMid meet" 
                opacity="0" 
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Texto de carga opcional */}
      {loadingText && (
        <div className="loading-text-container">
          {loadingText}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
