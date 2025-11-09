import React, { useState } from 'react';
import apiService from '../../services/api';

interface InjectionExample {
  label: string;
  value: string;
}

const CommandInjection: React.FC = () => {
  const [host, setHost] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePing = async (): Promise<void> => {
    setError('');
    setOutput('');
    
    try {
      const response = await apiService.ping(host);
      setOutput(response.output);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al ejecutar ping');
    }
  };

  const examples: InjectionExample[] = [
    { label: 'Ping normal', value: '8.8.8.8' },
    { label: 'Listar archivos', value: '8.8.8.8; ls -la' },
    { label: 'Ver archivo passwd', value: '8.8.8.8; cat /etc/passwd' },
    { label: 'Comando con pipe', value: '8.8.8.8 | whoami' },
    { label: 'Múltiples comandos', value: '8.8.8.8 && uname -a' }
  ];

  return (
    <div className="vulnerability-section">
      <h2>Command Injection</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> El servidor ejecuta el comando ping directamente 
        sin sanitizar la entrada del usuario, permitiendo la inyección de comandos del sistema.
      </div>

      <div className="form-group">
        <label>Host/IP para hacer ping:</label>
        <input 
          type="text" 
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Ej: 8.8.8.8"
        />
      </div>

      <button onClick={handlePing} className="btn btn-primary">
        Ejecutar Ping
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Ejemplos de inyección:</h3>
        {examples.map((example, index) => (
          <button 
            key={index}
            className="btn btn-danger"
            onClick={() => setHost(example.value)}
            style={{ margin: '5px' }}
          >
            {example.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginTop: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <div style={{ marginTop: '20px' }}>
          <h3>Salida del comando:</h3>
          <pre>{output}</pre>
        </div>
      )}

      <div className="alert alert-danger" style={{ marginTop: '20px' }}>
        <strong>Impacto:</strong> Un atacante puede ejecutar cualquier comando en el servidor, 
        comprometiendo completamente el sistema.
      </div>
    </div>
  );
};

export default CommandInjection;
