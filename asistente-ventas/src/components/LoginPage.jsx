import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../estilos/index.css';
import '../estilos/LoginPage.css';

const LoginPage = () => {
  const [view, setView] = useState('welcome');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Estados para login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estados para registro
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir al chat
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    anime({
      targets: '.fade-in',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutQuad',
      delay: anime.stagger(100),
    });
  }, [view, isDark]);

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
      // El navigate se manejará automáticamente por el useEffect cuando cambie isAuthenticated
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!registerUsername || !registerEmail || !registerPassword) {
      setMessage('Por favor, completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        first_name: registerFirstName,
        last_name: registerLastName
      });
      
      setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Limpiar formulario y cambiar a vista de login
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterFirstName('');
      setRegisterLastName('');
      
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

  const bgGradient = isDark
    ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';

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
              name="username" 
              type="text" 
              placeholder="Usuario" 
              value={loginUsername} 
              onChange={(e) => setLoginUsername(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Ingresar Contraseña" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
          {message && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '16px', 
              color: message.includes('exitoso') ? '#27ae60' : '#e74c3c', 
              fontWeight: 'bold' 
            }}>
              {message}
            </div>
          )}
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
              placeholder="Usuario *" 
              value={registerUsername} 
              onChange={(e) => setRegisterUsername(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="email" 
              type="email" 
              placeholder="Correo Electrónico *" 
              value={registerEmail} 
              onChange={(e) => setRegisterEmail(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña *" 
              value={registerPassword} 
              onChange={(e) => setRegisterPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              name="first_name" 
              placeholder="Nombre" 
              value={registerFirstName} 
              onChange={(e) => setRegisterFirstName(e.target.value)} 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input 
              name="last_name" 
              placeholder="Apellido" 
              value={registerLastName} 
              onChange={(e) => setRegisterLastName(e.target.value)} 
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="secondary-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
          {message && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '16px', 
              color: message.includes('exitoso') ? '#27ae60' : '#e74c3c', 
              fontWeight: 'bold' 
            }}>
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default LoginPage;
