import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import LoadingScreen from './LoadingScreen';
import ThemeToggle from './ThemeToggle';
import ChangePasswordModal from './ChangePasswordModal';
import '../estilos/MainMenu.css';
import '../estilos/ChatRecommendations.css';

const MainMenu = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const [selectedImage, setSelectedImage] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const fileInputRef = React.useRef(null);

  // Función para manejar el click en el botón de foto
  const handlePhotoClick = () => {
    // Verificar si el dispositivo tiene cámara
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      // Si tiene cámara, mostrar opciones
      const useCamera = window.confirm('¿Deseas tomar una foto con la cámara? Presiona Cancelar para subir una foto de tu galería.');
      if (useCamera) {
        // Abrir la cámara
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0);
              stream.getTracks().forEach(track => track.stop());
              const imageDataUrl = canvas.toDataURL('image/jpeg');
              setSelectedImage(imageDataUrl);
            };
            video.play();
          })
          .catch(err => {
            console.error('Error accessing camera:', err);
            fileInputRef.current.click();
          });
      } else {
        fileInputRef.current.click();
      }
    } else {
      // Si no tiene cámara, abrir directamente el selector de archivos
      fileInputRef.current.click();
    }
  };

  // Función para manejar la subida de fotos
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    anime({
      targets: '.menu-item',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: 'easeOutCubic',
      delay: anime.stagger(100),
    });
  }, []);

  const menuOptions = [
    {
      id: 1,
      text: '¿En qué te puedo ayudar?',
      subtitle: user?.first_name || user?.username || '',
      icon: '💬',
      action: () => handleOptionClick('help')
    },
    {
      id: 2,
      type: 'catalog',
      text: 'Ver catálogo de pisos',
      icon: '🏠',
      action: () => handleOptionClick('catalog')
    },
    {
      id: 3,
      type: 'budget',
      text: 'Calcular presupuesto',
      icon: '💰',
      action: () => handleOptionClick('budget')
    },
    {
      id: 4,
      type: 'tips',
      text: 'Consejos de instalación',
      icon: '🔨',
      action: () => handleOptionClick('tips')
    },
    {
      id: 5,
      type: 'advisor',
      text: 'Contactar asesor',
      icon: '👨‍💼',
      action: () => handleOptionClick('advisor')
    }
  ];

  const handleOptionClick = (optionType) => {
    setSelectedOption(optionType);
    
    if (optionType === 'help') {
      // Ir directamente al chat
      navigate('/chat');
      return;
    }
    
    const loadingTexts = {
      'catalog': 'Preparando catálogo...',
      'budget': 'Calculando presupuesto...',
      'tips': 'Cargando consejos...',
      'advisor': 'Conectando con asesor...'
    };

    setLoadingText(loadingTexts[optionType] || 'Cargando...');
    setIsLoading(true);

    // Simular la carga por 4 segundos y luego volver al menú (sin navegar)
    setTimeout(() => {
      setIsLoading(false);

      const displayName = user?.first_name || user?.username || 'amigo';
      const msg = `Función "${optionType}" en desarrollo. Será implementada en la próxima versión. Usuario: ${displayName}`;
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 4000);
  };

  const handleGoToChat = () => {
    navigate('/chat');
  };

  const handleLogout = async () => {
    try {
      await logout();
      chatService.clearCurrentSessionId();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleChangePasswordSubmit = async (oldPassword, newPassword) => {
    await changePassword(oldPassword, newPassword);
    alert('Contraseña cambiada exitosamente');
  };

  return (
    <div
      className={`main-menu-container chat-main-container ${isDark ? 'dark' : 'light'}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.5s',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Theme Toggle - Pequeño y en la esquina superior derecha */}
      <div className="theme-toggle-container" style={themeToggleContainerStyle}>
        <ThemeToggle 
          onToggle={() => setIsDark(!isDark)} 
          isDark={isDark} 
          onLogout={handleLogout}
          onChangePassword={() => setShowChangePassword(true)}
        />
      </div>

      {/* Botones de navegación */}
      <div className="nav-buttons-container" style={navButtonsContainerStyle}>
        <button 
          className="nav-button"
          onClick={handleGoToChat}
          style={backButtonStyle}
        >
          ← Regresar al Chat
        </button>
      </div>

      {/* Contenedor de opciones */}
      <div className="menu-container" style={menuContainerStyle}>
        {menuOptions.map((option, index) => (
          <div
            key={option.id}
            className="menu-item"
            data-option={option.id}
            onClick={() => option.action && option.action()}
            style={{
              ...menuItemStyle,
              ...(selectedOption === option.type && selectedOptionStyle)
            }}
          >
            <span className="menu-item-icon" style={iconStyle}>{option.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="menu-item-text" style={textStyle}>{option.text}</span>
              {option.subtitle && (
                <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.55)', marginTop: '6px' }}>{option.subtitle}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Indicador inferior */}
      <div className="bottom-indicator" style={bottomIndicatorStyle}>
        <div className="indicator-bar" style={indicatorBarStyle}></div>
      </div>
      
      {/* Pantalla de carga overlay */}
      {isLoading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
          <LoadingScreen isDark={isDark} loadingText={loadingText} onToggleTheme={() => setIsDark(!isDark)} />
        </div>
      )}
      
      {/* Input oculto para subir fotos */}
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* Botón flotante para fotos */}
      <button
        onClick={handlePhotoClick}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: isDark ? '#3498db' : '#2980b9',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          transform: selectedImage ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        📸
      </button>

      {/* Preview de la imagen seleccionada */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '100px',
          height: '100px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          backgroundColor: 'white'
        }}>
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Toast no bloqueante */}
      {showToast && (
        <div style={toastStyle} role="status">
          {toastMessage}
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePasswordSubmit}
        isDark={isDark}
      />
    </div>
  );
};

// Estilos
const themeToggleContainerStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  zIndex: 1000,
  transform: 'scale(1.0)' // Tamaño normal para el toggle
};

const navButtonsContainerStyle = {
  position: 'absolute',
  top: '15px',
  left: '15px',
  display: 'flex',
  gap: '10px',
  zIndex: 1000
};

const backButtonStyle = {
  background: 'rgba(52, 152, 219, 0.2)',
  border: 'none',
  color: 'rgba(52, 152, 219, 1)',
  padding: '8px 12px',
  borderRadius: '15px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
};

const menuContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px',
  padding: '20px 0',
  paddingTop: '80px' // Espacio para los botones superiores
};

const menuItemStyle = {
  width: '90%',
  maxWidth: '350px',
  padding: '18px 20px',
  borderRadius: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  fontSize: '16px',
  fontWeight: '500',
  color: '#333',
  userSelect: 'none'
};

const selectedOptionStyle = {
  backgroundColor: 'rgba(52, 152, 219, 0.2)',
  transform: 'scale(0.98)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
  borderLeft: '4px solid #3498db'
};

const iconStyle = {
  fontSize: '20px',
  minWidth: '25px'
};

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.3',
  textAlign: 'left'
};

const bottomIndicatorStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0',
  paddingBottom: '30px'
};

const indicatorBarStyle = {
  width: '134px',
  height: '5px',
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: '3px'
};

const toastStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  background: 'rgba(0,0,0,0.85)',
  color: 'white',
  padding: '12px 16px',
  borderRadius: '8px',
  zIndex: 3000,
  maxWidth: '320px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
};

export default MainMenu;
