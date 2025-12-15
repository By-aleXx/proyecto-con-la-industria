import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import ConversationList from './components/ConversationList';
import ChatRecommendations from './components/ChatRecommendations';
import MainMenu from './components/MainMenu';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Lista de conversaciones (nueva pantalla principal después de login) */}
          <Route
            path="/conversaciones"
            element={
              <ProtectedRoute>
                <ConversationList />
              </ProtectedRoute>
            }
          />
          
          {/* Chat individual */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatRecommendations />
              </ProtectedRoute>
            }
          />
          
          {/* Menú (legacy, puede removerse si ya no se usa) */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          />
          
          {/* Redirigir rutas desconocidas al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
