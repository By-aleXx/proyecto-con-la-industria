import React, { useState } from 'react';
import anime from 'animejs';
import ThemeToggle from './ThemeToggle';
import MainMenu from './MainMenu';
import ErrorScreen from './ErrorScreen';
import ClientTypeSelection from './ClientTypeSelection';
import AreaSelection from './AreaSelection';
import SearchSelection from './SearchSelection';
import LoadingRecommendations from './LoadingRecommendations';
import ChatRecommendations from './ChatRecommendations';
import '../estilos/index.css';
import '../estilos/LoginPage.css';

const initialForm = {
  username: '',
  password: '',
  phone: '',
  email: '',
  birthdate: '',
  branch: '',
};

const postLoginQuestions = [
  {
    id: 'clientType',
    text: '¿Qué tipo de cliente eres? (Particular, Empresa, etc.)'
  },
  {
    id: 'area',
    text: '¿En qué área necesitas instalar el piso?'
  },
  {
    id: 'search',
    text: '¿Qué tipo de piso buscas? (Laminado, Vinílico, etc.)'
  }
];

const LoginPage = () => {
  const [view, setView] = useState('welcome');
  const [isDark, setIsDark] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientType, setClientType] = useState(null);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaSelection, setShowAreaSelection] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [showSearchSelection, setShowSearchSelection] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    anime({
      targets: '.fade-in',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutQuad',
      delay: anime.stagger(100),
    });
  }, [view, isDark]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setMessage('Por favor, proporciona un correo y una contraseña');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      console.log('Intentando conectar al servidor...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

  const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
        signal: controller.signal
      });
      const data = await res.json();
      if (data.success) {
        setMessage('¡Inicio de sesión exitoso!');
        setLoading(false);
        // El backend devuelve { success: true, user }
        // El nombre está en data.user.name (según userModel)
        setUserName(data.user?.name || form.email || '');
        setIsLoggedIn(true);
        setShowChat(true);
        // Enviar preguntas al chat
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('postLoginQuestions', { detail: postLoginQuestions }));
        }, 500);
        setForm(initialForm);
      } else {
        setMessage(data.error || 'Credenciales incorrectas');
        setLoading(false);
      }
    }
    catch (err) {
      setMessage('Error de conexión');
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();

    // Validar campos requeridos
    if (!form.username || !form.email || !form.password || !form.phone) {
      setMessage('Por favor, completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
  const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setIsRegister(false);
        setLoading(false);
      } else {
        setMessage(data.error || 'Error al registrar');
        setLoading(false);
      }
    } catch (err) {
      setMessage('Error de conexión');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setView('welcome');
    setForm(initialForm);
    setShowError(false);
    setErrorMessage('');
    setClientType(null);
    setShowClientSelection(false);
    setSelectedArea(null);
    setShowAreaSelection(false);
    setSelectedSearch(null);
    setShowSearchSelection(false);
    setIsLoadingRecommendations(false);
    setShowChat(false);
  };

  const handleRetryFromError = () => {
    setShowError(false);
    setErrorMessage('');
    setView('login');
  };

  // Funciones de navegación hacia atrás
  const handleBackFromAreaSelection = () => {
    setShowAreaSelection(false);
    setShowClientSelection(true);
    setSelectedArea(null);
  };

  const handleBackFromSearchSelection = () => {
    setShowSearchSelection(false);
    setShowAreaSelection(true);
    setSelectedSearch(null);
  };

  const handleClientTypeSelected = (type) => {
    setClientType(type);
    setShowClientSelection(false);
    setShowAreaSelection(true);
  };

  const handleAreaSelected = (area) => {
    setSelectedArea(area);
    setShowAreaSelection(false);
    setShowSearchSelection(true);
  };

  const handleSearchSelected = (search) => {
    setSelectedSearch(search);
    setShowSearchSelection(false);
    setIsLoadingRecommendations(true);
    
    // Simular carga de recomendaciones
    setTimeout(() => {
      setIsLoadingRecommendations(false);
      setShowChat(true);
    }, 3000); // 3 segundos de carga
  };

  const handleGoToMenu = () => {
    setShowChat(false);
    // Solo cambiamos showChat a false, manteniendo los valores actuales de clientType, selectedArea y selectedSearch
  };

  const handleGoToChat = () => {
    setShowChat(true);
    // Regresa al chat desde el menú principal y muestra las opciones
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('postLoginQuestions', { 
        detail: [
          {
            id: 'clientType',
            text: '¿Qué tipo de cliente eres?'
          },
          {
            id: 'area',
            text: '¿En qué área necesitas instalar el piso?'
          },
          {
            id: 'search',
            text: '¿Qué tipo de piso buscas?'
          }
        ]
      }));
    }, 500);
  };

  const bgGradient = isDark
    ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';

  // Si el usuario está en el chat de recomendaciones
  if (isLoggedIn && showChat) {
    return <ChatRecommendations userName={userName} clientType={clientType} selectedArea={selectedArea} selectedSearch={selectedSearch} onLogout={handleLogout} onGoToMenu={handleGoToMenu} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />;
  }

  // Si está cargando recomendaciones
  if (isLoggedIn && isLoadingRecommendations) {
    return <LoadingRecommendations isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />;
  }

  // Si el usuario está logueado y no está en el chat, mostrar el menú principal
  if (isLoggedIn && !showChat && !isLoadingRecommendations) {
    return <MainMenu userName={userName} onGoToChat={handleGoToChat} onLogout={handleLogout} isDark={isDark} clientType={clientType} selectedArea={selectedArea} selectedSearch={selectedSearch} onToggleTheme={() => setIsDark(!isDark)} />;
  }

  // Si el usuario está logueado, ha seleccionado tipo de cliente y área pero no búsqueda, mostrar selección de búsqueda
  if (isLoggedIn && clientType && selectedArea && showSearchSelection) {
    return <SearchSelection userName={userName} clientType={clientType} selectedArea={selectedArea} onSearchSelected={handleSearchSelected} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onBack={handleBackFromSearchSelection} onLogout={handleLogout} />;
  }

  // Si el usuario está logueado, ha seleccionado tipo de cliente pero no área, mostrar selección de área
  if (isLoggedIn && clientType && showAreaSelection) {
    return <AreaSelection userName={userName} clientType={clientType} onAreaSelected={handleAreaSelected} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onBack={handleBackFromAreaSelection} onLogout={handleLogout} />;
  }

  // Si el usuario está logueado pero no ha seleccionado tipo de cliente, mostrar selección
  if (isLoggedIn && showClientSelection) {
    return <ClientTypeSelection userName={userName} onClientTypeSelected={handleClientTypeSelected} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />;
  }

  // Si hay un error, mostrar la pantalla de error
  if (showError) {
    return <ErrorScreen errorMessage={errorMessage} onRetry={handleRetryFromError} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />;
  }

  return (
    <div
      className={`login-main-container ${isDark ? 'dark' : 'light'}`}
      style={{
        background: bgGradient,
        transition: 'background 0.5s',
      }}
    >
      <div className="theme-toggle-container">
        <ThemeToggle onToggle={() => setIsDark(!isDark)} isDark={isDark} showGear={false} />
      </div>
      
      {view === 'welcome' && (
        <div className="welcome-screen fade-in">
          <h1 className="welcome-title" style={{ color: isDark ? '#fff' : '#333' }}>
            Bienvenido a<br />tu asistente<br />en ventas
          </h1>
          <div className="welcome-buttons">
            <button
              className="primary-button fade-in"
              onClick={() => setView('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className="secondary-button fade-in"
              onClick={() => setView('register')}
            >
              Registro
            </button>
          </div>
        </div>
      )}
      
      {view === 'login' && (
        <form className="form-container fade-in" onSubmit={handleLogin}>
          <div className="regresar-container">
            <button type="button" className="regresar-btn" onClick={() => setView('welcome')}>
              ⏪ Regresar
            </button>
          </div>
          <h2 className="login-title" style={{ color: isDark ? '#fff' : '#333' }}>
            Inicio de sesión
          </h2>
          <div className="form-group">
            <input 
              name="email" 
              type="email" 
              placeholder="Correo Electrónico" 
              value={form.email} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Ingresar Contraseña" 
              value={form.password} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <button type="button" className="olvidar-btn">
              OLVIDE LA CONTRASEÑA
            </button>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
          {message && <div style={{ textAlign: 'center', marginTop: '16px', color: '#9d7be7', fontWeight: 'bold' }}>{message}</div>}
        </form>
      )}
      
      {view === 'register' && (
        <form className="form-container fade-in" onSubmit={handleRegister}>
          <button type="button" className="back-button" onClick={() => setView('welcome')}>
            ⏪ Regresar
          </button>
          <h2 className="form-title" style={{ color: isDark ? '#fff' : '#333' }}>
            Formulario de registro
          </h2>
          <div className="form-group">
            <input 
              name="username" 
              placeholder="Ingresar Usuario" 
              value={form.username} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="phone" 
              placeholder="Teléfono/WhatsApp" 
              value={form.phone} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="email" 
              type="email" 
              placeholder="Correo Electrónico" 
              value={form.email} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="birthdate" 
              type="date" 
              placeholder="Fecha de nacimiento" 
              value={form.birthdate} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="branch" 
              placeholder="Sucursal actual" 
              value={form.branch} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              value={form.password} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="secondary-button">
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
          {message && <div style={{ textAlign: 'center', marginTop: '16px', color: '#9d7be7', fontWeight: 'bold' }}>{message}</div>}
        </form>
      )}
    </div>
  );
};

export default LoginPage;
