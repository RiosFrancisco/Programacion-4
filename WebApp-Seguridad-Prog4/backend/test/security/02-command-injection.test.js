const request = require('supertest');
const express = require('express');
const session = require('express-session');
const vulnerabilityRoutes = require('../../src/routes/vulnerabilities');

describe('Seguridad: Command Injection', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true
    }));
    app.use('/api', vulnerabilityRoutes);
  });

  test('❌ DEBE FALLAR: No debe permitir ejecutar comandos arbitrarios', async () => {
    const maliciousInputs = [
      '8.8.8.8; ls -la',
      '8.8.8.8 && cat /etc/passwd',
      '8.8.8.8 | whoami',
      '8.8.8.8`id`',
      '$(cat /etc/passwd)'
    ];

    for (const input of maliciousInputs) {
      const response = await request(app)
        .post('/api/ping')
        .send({ host: input });

      // No debe contener output de comandos del sistema
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.text).not.toMatch(/root:|bin:|etc/);
    }
  });

  test('❌ DEBE FALLAR: Solo debe aceptar IPs o hostnames válidos', async () => {
    const response = await request(app)
      .post('/api/ping')
      .send({ host: 'google.com; echo "hacked"' });

    // Debe validar el input
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid host');
  });

  test('❌ DEBE FALLAR: Debe usar una lista blanca de comandos permitidos', async () => {
    const response = await request(app)
      .post('/api/ping')
      .send({ host: '8.8.8.8' });

    // Si es exitoso, debe ser solo el resultado del ping
    if (response.status === 200) {
      expect(response.body.output).toMatch(/PING 8.8.8.8/);
      expect(response.body.output).not.toContain(';');
      expect(response.body.output).not.toContain('&&');
    }
  });

  test('❌ DEBE FALLAR: No debe exponer errores del sistema', async () => {
    const response = await request(app)
      .post('/api/ping')
      .send({ host: '--invalid-option' });

    // No debe mostrar errores internos del comando
    expect(response.body.error).not.toContain('ping: ');
    expect(response.body.error).not.toContain('command not found');
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR COMMAND INJECTION', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Validar entrada con regex estricto:
       - Solo permitir IPs válidas: /^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/
       - O hostnames válidos: /^[a-zA-Z0-9.-]+$/
    
    2. Usar child_process.spawn en lugar de exec:
       const { spawn } = require('child_process');
       const ping = spawn('ping', ['-c', '1', host]);
    
    3. Implementar lista blanca de hosts permitidos:
       const allowedHosts = ['8.8.8.8', '1.1.1.1', 'google.com'];
    
    4. Nunca concatenar strings para formar comandos:
       - Usar arrays de argumentos
       - No permitir caracteres especiales del shell
    
    5. Sanitizar mensajes de error:
       - No exponer errores del sistema
       - Devolver mensajes genéricos
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
