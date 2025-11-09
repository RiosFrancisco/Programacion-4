import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import apiService from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    }
  }, []);

  const verifyToken = async (): Promise<void> => {
    try {
      const response = await apiService.verifyToken();
      if (response.valid) {
        setIsAuthenticated(true);
        setUsername(response.user.username);
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  };

  const handleLogin = (token: string, username: string): void => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación Vulnerable - Práctica de Seguridad</h1>
        {isAuthenticated && (
          <div className="user-info">
            <span>Bienvenido, {username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        )}
      </header>
      <main>
        {isAuthenticated ? (
          <Dashboard username={username} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
};

export default App;
