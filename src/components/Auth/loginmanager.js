import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';

// Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, loading: false, isAuthenticated: false };
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.getUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.login({ username, password });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error(error);
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuth
  };

  if (loading) {
    return <div>A carregar...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Component
function LoginManager() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (user) {
    return (
      <div className="user-menu">
        <button
          className="user-button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="user-avatar-placeholder">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="user-name">{user.username}</span>
          <span className="user-arrow">▼</span>
        </button>

        {showDropdown && (
          <div className="user-dropdown">
            <Link to="/perfil" className="dropdown-item" onClick={() => setShowDropdown(false)}>
              <span>👤</span> Perfil
            </Link>
            <button onClick={handleLogout} className="dropdown-item dropdown-logout">
              <span>🚪</span> Sair
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="nav-auth">
      <Link to="/login" className="btn-login">Login</Link>
      <Link to="/signup" className="btn-signup">Criar Conta</Link>
    </div>
  );
}

export default LoginManager;