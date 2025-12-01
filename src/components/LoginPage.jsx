import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import '../estilos/index.css';
import '../estilos/LoginPage.css';

// Datos de sucursales de ejemplo
const SUCURSALES = [
  { id: 1, name: 'Cesantoni Centro', location: 'Ciudad de México, CDMX' },
  { id: 2, name: 'Cesantoni Polanco', location: 'Polanco, CDMX' },
  { id: 3, name: 'Cesantoni Santa Fe', location: 'Santa Fe, CDMX' },
  { id: 4, name: 'Cesantoni Guadalajara', location: 'Guadalajara, Jalisco' },
  { id: 5, name: 'Cesantoni Monterrey', location: 'Monterrey, Nuevo León' },
];

const LoginPage = () => {
  const [view, setView] = useState('login'); // 'login' | 'register'
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sucursal seleccionada
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estados para registro
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerCountryCode, setRegisterCountryCode] = useState('+52');
  const [registerBirthdate, setRegisterBirthdate] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  // const [acceptTerms, setAcceptTerms] = useState(false); // Ya no se usa

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    anime({
      targets: '.fade-in',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: 'easeOutQuad',
      delay: anime.stagger(80),
    });
  }, [view, isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    if (next) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const filteredBranches = SUCURSALES.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginUsername || !loginPassword) {
      setMessage('Por favor, proporciona un usuario y una contraseña');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await login(loginUsername, loginPassword);
      setMessage('¡Inicio de sesión exitoso!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!registerFirstName || !registerLastName || !registerPhone || !registerBirthdate || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setMessage('Por favor completa todos los campos obligatorios');
      return;
    }

    /*
    if (!acceptTerms) {
      setMessage('Debes aceptar los términos y condiciones');
      return;
    }
    */

    if (registerPassword.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setMessage('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validar edad (mayor de 18)
    const birthDate = new Date(registerBirthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setMessage('Debes ser mayor de 18 años para registrarte');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await register({
        username: registerEmail.split('@')[0],
        email: registerEmail,
        password: registerPassword,
        first_name: registerFirstName,
        last_name: registerLastName
      });
      
      setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Limpiar formulario
      setRegisterFirstName('');
      setRegisterLastName('');
      setRegisterPhone('');
      setRegisterBirthdate('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      // setAcceptTerms(false);
      
      setTimeout(() => {
        setView('login');
        setMessage('');
      }, 2000);
      
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = 'Error al registrar';
      
      if (errorData?.username) {
        errorMsg = errorData.username[0];
      } else if (errorData?.email) {
        errorMsg = errorData.email[0];
      } else if (errorData?.error) {
        errorMsg = errorData.error;
      }
      
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`cesantoni-container ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="cesantoni-header">
        <div className="header-logo">
          <span className="logo-text">CESANTONI</span>
        </div>
        
        {/* Theme Toggle Switch */}
        <div className="theme-toggle">
          <label className="switch" title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
            <input 
              type="checkbox" 
              checked={isDark}
              onChange={toggleTheme}
            />
            <span className="slider">
              <span className="icon sun">☀️</span>
              <span className="icon moon">🌙</span>
            </span>
          </label>
        </div>
      </header>

      {view === 'login' && (
        <section className="unified-view fade-in">
          <div className="unified-content">
            
            {/* Columna izquierda: Selección de sucursal */}
            <div className="branch-column">
              <h1 className="step-title">Selecciona tu sucursal</h1>
              <p className="step-subtitle">Elige la tienda donde trabajarás hoy</p>

              {/* Buscador */}
              <div className="search-box">
                <input 
                  type="text" 
                  className="input search-input" 
                  placeholder="Busca tu tienda por ciudad, estado o nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sucursales disponibles */}
              <div className="branch-section">
                <div className="branch-list">
                  {filteredBranches.map((branch) => (
                    <div 
                      key={branch.id}
                      className={`branch-card ${selectedBranch?.id === branch.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBranch(branch)}
                    >
                      <div className="branch-card-info">
                        <p className="branch-name">{branch.name}</p>
                        <p className="branch-location">{branch.location}</p>
                      </div>
                      <button 
                        className="btn-select-branch"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBranch(branch);
                        }}
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha: Login */}
            <div className="login-column">
              <h1 className="step-title">Iniciar sesión</h1>
              <p className="step-subtitle">Ingresa tus credenciales para continuar</p>

              {/* Mensaje de error */}
              {message && (
                <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
                  <span className="message-icon">{message.includes('exitoso') ? '✅' : '⚠️'}</span>
                  <span className="message-text">{message}</span>
                </div>
              )}

              {/* Formulario de login */}
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Usuario o correo</label>
                  <input 
                    type="text" 
                    id="username" 
                    className="input" 
                    placeholder="ingresa tu usuario@cesantoni.com"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      id="password" 
                      className="input" 
                      placeholder="Tienen que ser 8 caracteres como mínimo"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="btn-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              {/* Link a registro */}
              <div className="login-footer">
                <p>¿No tienes cuenta? <button className="link-register" onClick={() => setView('register')}>Regístrate aquí</button></p>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === 'register' && (
        <section className="register-view fade-in">
          <div className="register-content">
            <div className="register-form-wrapper">
              <h1 className="register-title">Crear cuenta</h1>
              <p className="register-subtitle">Completa tus datos para registrarte en Cesantoni</p>

              {/* Mensaje de error */}
              {message && (
                <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
                  <span className="message-icon">{message.includes('exitoso') ? '✅' : '⚠️'}</span>
                  <span className="message-text">{message}</span>
                </div>
              )}

              {/* Formulario de registro */}
              <form className="register-form" onSubmit={handleRegister}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Nombre(s) *</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="input" 
                      value={registerFirstName}
                      onChange={(e) => setRegisterFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastname" className="form-label">Apellidos *</label>
                    <input 
                      type="text" 
                      id="lastname" 
                      className="input" 
                      value={registerLastName}
                      onChange={(e) => setRegisterLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group phone-group">
                    <label htmlFor="phone" className="form-label">Teléfono *</label>
                    <div className="phone-input-wrapper">
                      <select 
                        className="input country-select"
                        value={registerCountryCode}
                        onChange={(e) => setRegisterCountryCode(e.target.value)}
                      >
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+56">🇨🇱 +56</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+57">🇨🇴 +57</option>
                        <option value="+51">🇵🇪 +51</option>
                        <option value="+34">🇪🇸 +34</option>
                      </select>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="input phone-input" 
                        placeholder="55 1234 5678"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="birthdate" className="form-label">Fecha de nacimiento *</label>
                    <input 
                      type="date" 
                      id="birthdate" 
                      className="input"
                      value={registerBirthdate}
                      onChange={(e) => setRegisterBirthdate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Correo electrónico *</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="input" 
                    placeholder="tu.correo@ejemplo.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-password" className="form-label">Contraseña *</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        id="reg-password" 
                        className="input" 
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="btn-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <small className="form-hint">Mínimo 8 caracteres</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm-password" className="form-label">Confirmar contraseña *</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-password" 
                        className="input" 
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="btn-toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Crear cuenta'}
                </button>
              </form>

              {/* Link a login */}
              <div className="register-footer">
                <p>¿Ya tienes cuenta? <button className="link-login" onClick={() => setView('login')}>Inicia sesión aquí</button></p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LoginPage;
