const request = require('supertest');
const express = require('express');
const captchaRoutes = require('../../src/routes/captcha');

describe('Seguridad: Insecure CAPTCHA', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', captchaRoutes);
  });

  test('❌ DEBE FALLAR: El CAPTCHA debe expirar después de un tiempo', async () => {
    // Obtener CAPTCHA
    const captchaResponse = await request(app)
      .get('/api/captcha');
    
    const { captchaId } = captchaResponse.body;
    
    // Simular que pasó tiempo (en producción sería real)
    // Esperar 5 minutos simulados
    const futureTime = Date.now() + 5 * 60 * 1000;
    
    // Intentar usar el CAPTCHA expirado
    const verifyResponse = await request(app)
      .post('/api/verify-captcha')
      .send({
        captchaId: captchaId,
        captchaText: '1234'
      });
    
    // Debería fallar por expiración
    expect(verifyResponse.body.valid).toBe(false);
    expect(verifyResponse.body.error).toContain('expired');
  });

  test('❌ DEBE FALLAR: Un CAPTCHA solo debe poder usarse una vez', async () => {
    // Obtener CAPTCHA
    const captchaResponse = await request(app)
      .get('/api/captcha');
    
    const { captchaId, debug } = captchaResponse.body;
    
    // Si está en modo debug, usar la respuesta correcta
    const correctAnswer = debug || '1234';
    
    // Primera verificación (debería funcionar)
    const firstVerify = await request(app)
      .post('/api/verify-captcha')
      .send({
        captchaId: captchaId,
        captchaText: correctAnswer
      });
    
    // Segunda verificación con el mismo CAPTCHA
    const secondVerify = await request(app)
      .post('/api/verify-captcha')
      .send({
        captchaId: captchaId,
        captchaText: correctAnswer
      });
    
    // La segunda debe fallar
    expect(secondVerify.body.valid).toBe(false);
    expect(secondVerify.body.error).toContain('already used');
  });

  test('❌ DEBE FALLAR: El ID del CAPTCHA no debe ser predecible', async () => {
    const responses = [];
    
    // Obtener varios CAPTCHAs
    for (let i = 0; i < 5; i++) {
      const response = await request(app).get('/api/captcha');
      responses.push(response.body.captchaId);
    }
    
    // Los IDs no deben ser secuenciales ni predecibles
    for (let i = 1; i < responses.length; i++) {
      const diff = parseInt(responses[i]) - parseInt(responses[i-1]);
      expect(isNaN(diff) || Math.abs(diff) > 1).toBe(true);
    }
    
    // Deben ser suficientemente aleatorios
    const uniqueIds = new Set(responses);
    expect(uniqueIds.size).toBe(responses.length);
  });

  test('❌ DEBE FALLAR: No debe enviar la respuesta en modo debug', async () => {
    // Cambiar temporalmente a producción
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const response = await request(app)
      .get('/api/captcha');
    
    // No debe incluir la respuesta
    expect(response.body.debug).toBeUndefined();
    
    // Restaurar entorno
    process.env.NODE_ENV = originalEnv;
  });

  test('❌ DEBE FALLAR: Debe tener límite de intentos', async () => {
    const captchaResponse = await request(app)
      .get('/api/captcha');
    
    const { captchaId } = captchaResponse.body;
    const maxAttempts = 3;
    
    // Hacer múltiples intentos fallidos
    for (let i = 0; i < maxAttempts + 1; i++) {
      await request(app)
        .post('/api/verify-captcha')
        .send({
          captchaId: captchaId,
          captchaText: 'wrong'
        });
    }
    
    // El CAPTCHA debe estar bloqueado después de max intentos
    const finalAttempt = await request(app)
      .post('/api/verify-captcha')
      .send({
        captchaId: captchaId,
        captchaText: '1234'
      });
    
    expect(finalAttempt.body.valid).toBe(false);
    expect(finalAttempt.body.error).toContain('Too many attempts');
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR INSECURE CAPTCHA', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Generar IDs únicos no predecibles:
       const crypto = require('crypto');
       const captchaId = crypto.randomBytes(16).toString('hex');
    
    2. Implementar expiración:
       captchaStore[captchaId] = {
         text: captcha.text,
         createdAt: Date.now(),
         attempts: 0,
         used: false
       };
       
       // Al verificar
       if (Date.now() - captcha.createdAt > 5 * 60 * 1000) {
         return res.json({ valid: false, error: 'CAPTCHA expired' });
       }
    
    3. Marcar como usado después de verificación exitosa:
       if (captcha.used) {
         return res.json({ valid: false, error: 'CAPTCHA already used' });
       }
       captcha.used = true;
    
    4. Limitar intentos:
       captcha.attempts++;
       if (captcha.attempts > 3) {
         delete captchaStore[captchaId];
         return res.json({ valid: false, error: 'Too many attempts' });
       }
    
    5. Nunca enviar respuestas en producción:
       res.json({
         captchaId,
         captcha: captcha.data
         // NO incluir debug
       });
    
    6. Limpiar CAPTCHAs expirados periódicamente:
       setInterval(() => {
         const now = Date.now();
         Object.keys(captchaStore).forEach(id => {
           if (now - captchaStore[id].createdAt > 10 * 60 * 1000) {
             delete captchaStore[id];
           }
         });
       }, 60000);
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
