import React, { useState, FormEvent } from 'react';
import apiService from '../services/api';

interface LoginProps {
  onLogin: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Registrar nuevo usuario
        await apiService.register({ username, password, email });
        setError('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
        setIsRegistering(false);
      } else {
        // Login
        const response = await apiService.login({ username, password });
        onLogin(response.token, response.username);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al procesar la solicitud');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          {isRegistering ? 'Registrar' : 'Iniciar Sesión'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
        </button>
      </form>
      <div className="alert alert-info" style={{ marginTop: '20px' }}>
        <strong>Usuarios de prueba:</strong><br />
        admin / admin123<br />
        user1 / user123
      </div>
    </div>
  );
};

export default Login;
