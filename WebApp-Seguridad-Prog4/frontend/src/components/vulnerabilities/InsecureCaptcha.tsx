import React, { useState, useEffect, FormEvent } from 'react';
import apiService from '../../services/api';
import { CaptchaData } from '../../types';

interface VerificationResult {
  success: boolean;
  message: string;
}

const InsecureCaptcha: React.FC = () => {
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async (): Promise<void> => {
    try {
      const response = await apiService.getCaptcha();
      setCaptchaData(response);
      setCaptchaInput('');
    } catch (error) {
      console.error('Error cargando captcha:', error);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!captchaData) return;

    try {
      const verifyResponse = await apiService.verifyCaptcha(
        captchaData.captchaId, 
        captchaInput
      );

      if (verifyResponse.valid) {
        setResult({
          success: true,
          message: 'CAPTCHA correcto! Proceso de login simulado exitoso.'
        });
      } else {
        setResult({
          success: false,
          message: 'CAPTCHA incorrecto'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Error al verificar CAPTCHA'
      });
    }
  };

  const attemptBruteForceCaptcha = async (): Promise<void> => {
    if (!captchaData) return;

    const attempts = ['1234', '5678', '0000', '1111', '2222', '3333', 
                     '4444', '5555', '6666', '7777', '8888', '9999'];
    
    for (const attempt of attempts) {
      try {
        const response = await apiService.verifyCaptcha(
          captchaData.captchaId, 
          attempt
        );
        
        if (response.valid) {
          setResult({
            success: true,
            message: `CAPTCHA crackeado! La respuesta era: ${attempt}`
          });
          setCaptchaInput(attempt);
          break;
        }
      } catch (error) {
        console.error('Error en intento:', error);
      }
    }
  };

  return (
    <div className="vulnerability-section">
      <h2>Insecure CAPTCHA Implementation</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidades detectadas:</strong>
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          <li>CAPTCHA no expira</li>
          <li>Se puede reutilizar múltiples veces</li>
          <li>ID predecible (timestamp)</li>
          <li>En modo debug, la respuesta se envía al cliente</li>
          <li>No hay límite de intentos</li>
        </ul>
      </div>

      {captchaData && (
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>CAPTCHA:</label>
            <div className="captcha-container">
              <div 
                className="captcha-image"
                dangerouslySetInnerHTML={{ __html: captchaData.captcha }}
              />
              <button 
                type="button" 
                onClick={loadCaptcha} 
                className="btn btn-secondary"
              >
                Recargar
              </button>
            </div>
            {captchaData.debug && (
              <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                <strong>DEBUG MODE:</strong> Respuesta del CAPTCHA: {captchaData.debug}
              </div>
            )}
          </div>

          <div className="form-group">
            <input 
              type="text" 
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Ingrese el texto del CAPTCHA"
              style={{ marginTop: '10px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Verificar y Login
          </button>

          <button 
            type="button" 
            onClick={attemptBruteForceCaptcha} 
            className="btn btn-danger"
            style={{ marginLeft: '10px' }}
          >
            Intentar Fuerza Bruta en CAPTCHA
          </button>
        </form>
      )}

      {result && (
        <div 
          className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`} 
          style={{ marginTop: '20px' }}
        >
          {result.message}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Información técnica:</h3>
        <pre>
{`CAPTCHA ID: ${captchaData?.captchaId || 'N/A'}
Tipo ID: Timestamp (predecible)
Expiración: Nunca
Intentos permitidos: Ilimitados`}
        </pre>
      </div>
    </div>
  );
};

export default InsecureCaptcha;
