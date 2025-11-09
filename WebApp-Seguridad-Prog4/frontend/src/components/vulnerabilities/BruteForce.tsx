import React, { useState } from 'react';
import apiService from '../../services/api';
import { BruteForceAttempt } from '../../types';

const BruteForce: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [results, setResults] = useState<BruteForceAttempt[]>([]);

  const handleLogin = async (): Promise<void> => {
    const newAttempt = attempts + 1;
    setAttempts(newAttempt);
    
    try {
      const response = await apiService.login({ username, password });
      
      setResults([...results, {
        attempt: newAttempt,
        username,
        password,
        success: true,
        message: 'Login exitoso'
      }]);
    } catch (error: any) {
      setResults([...results, {
        attempt: newAttempt,
        username,
        password,
        success: false,
        message: error.response?.data?.error || 'Error'
      }]);
    }
  };

  const bruteForceAttack = async (): Promise<void> => {
    const passwords = ['admin', '123456', 'password', 'admin123', 'test123'];
    const testUsername = 'admin';
    let currentAttempt = attempts;
    
    for (let i = 0; i < passwords.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      currentAttempt++;
      
      try {
        await apiService.login({ username: testUsername, password: passwords[i] });
        
        setResults(prev => [...prev, {
          attempt: currentAttempt,
          username: testUsername,
          password: passwords[i],
          success: true,
          message: '¡Contraseña encontrada!'
        }]);
        break;
      } catch (error) {
        setResults(prev => [...prev, {
          attempt: currentAttempt,
          username: testUsername,
          password: passwords[i],
          success: false,
          message: 'Intento fallido'
        }]);
      }
    }
    
    setAttempts(currentAttempt);
  };

  return (
    <div className="vulnerability-section">
      <h2>Brute Force - Sin Limitación de Intentos</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> El endpoint de login no tiene protección contra 
        ataques de fuerza bruta. No hay límite de intentos, captcha, o retrasos entre intentos.
      </div>

      <div className="form-group">
        <label>Usuario:</label>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingrese usuario"
        />
      </div>

      <div className="form-group">
        <label>Contraseña:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese contraseña"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleLogin} className="btn btn-primary">
          Intentar Login
        </button>
        <button onClick={bruteForceAttack} className="btn btn-danger">
          Simular Ataque de Fuerza Bruta
        </button>
      </div>

      <div>
        <strong>Intentos totales: {attempts}</strong>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Historial de intentos:</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}
                style={{ marginBottom: '5px', padding: '5px 10px' }}
              >
                Intento #{result.attempt}: {result.username} / {result.password} - {result.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BruteForce;
