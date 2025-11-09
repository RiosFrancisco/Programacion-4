import React, { useState } from 'react';
import apiService from '../../services/api';

interface FileExample {
  label: string;
  value: string;
}

const FileInclusion: React.FC = () => {
  const [filename, setFilename] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleReadFile = async (): Promise<void> => {
    setError('');
    setFileContent('');
    
    try {
      const response = await apiService.readFile(filename);
      setFileContent(response);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al leer el archivo');
    }
  };

  const examples: FileExample[] = [
    { label: 'Archivo público', value: 'public.txt' },
    { label: 'Subir un directorio', value: '../server.js' },
    { label: 'Path traversal', value: '../../package.json' },
    { label: 'Archivo del sistema', value: '../../../etc/passwd' },
    { label: 'Variables de entorno', value: '../../../proc/self/environ' }
  ];

  return (
    <div className="vulnerability-section">
      <h2>Local File Inclusion (LFI)</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> El servidor no valida correctamente las rutas de archivos, 
        permitiendo el acceso a archivos fuera del directorio permitido mediante path traversal.
      </div>

      <div className="form-group">
        <label>Nombre del archivo:</label>
        <input 
          type="text" 
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Ej: readme.txt"
        />
      </div>

      <button onClick={handleReadFile} className="btn btn-primary">
        Leer Archivo
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Ejemplos de explotación:</h3>
        {examples.map((example, index) => (
          <button 
            key={index}
            className="btn btn-danger"
            onClick={() => setFilename(example.value)}
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

      {fileContent && (
        <div style={{ marginTop: '20px' }}>
          <h3>Contenido del archivo:</h3>
          <pre style={{ maxHeight: '400px', overflowY: 'auto' }}>{fileContent}</pre>
        </div>
      )}

      <div className="alert alert-danger" style={{ marginTop: '20px' }}>
        <strong>Impacto:</strong> Un atacante puede leer archivos sensibles del servidor como 
        configuraciones, código fuente, archivos del sistema, e incluso credenciales.
      </div>
    </div>
  );
};

export default FileInclusion;
