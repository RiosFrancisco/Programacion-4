const request = require('supertest');
const express = require('express');
const session = require('express-session');
const vulnerabilityRoutes = require('../../src/routes/vulnerabilities');

describe('Seguridad: CSRF (Cross-Site Request Forgery)', () => {
  let app;
  let agent;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true
    }));
    
    // Middleware para simular usuario autenticado
    app.use((req, res, next) => {
      req.session.userId = 1;
      next();
    });
    
    app.use('/api', vulnerabilityRoutes);
    agent = request.agent(app);
  });

  test('❌ DEBE FALLAR: Las transferencias deben requerir token CSRF', async () => {
    // Intento de transferencia sin token CSRF
    const response = await agent
      .post('/api/transfer')
      .send({
        fromAccount: '1234567890',
        toAccount: '0987654321',
        amount: '1000'
      });

    // Debe rechazar la solicitud sin token CSRF válido
    expect(response.status).toBe(403);
    expect(response.body.error).toContain('CSRF');
  });

  test('❌ DEBE FALLAR: Debe validar el header Origin/Referer', async () => {
    // Simular request desde origen malicioso
    const response = await agent
      .post('/api/transfer')
      .set('Origin', 'http://evil-site.com')
      .send({
        fromAccount: '1234567890',
        toAccount: '0987654321',
        amount: '1000'
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('Origin');
  });

  test('❌ DEBE FALLAR: Los tokens CSRF deben ser únicos por sesión', async () => {
    // Obtener token CSRF
    const tokenResponse = await agent.get('/api/csrf-token');
    expect(tokenResponse.status).toBe(200);
    expect(tokenResponse.body.csrfToken).toBeDefined();

    // El token debe ser único y no predecible
    const token1 = tokenResponse.body.csrfToken;
    
    // Obtener otro token en una nueva sesión
    const agent2 = request.agent(app);
    const tokenResponse2 = await agent2.get('/api/csrf-token');
    const token2 = tokenResponse2.body.csrfToken;

    expect(token1).not.toBe(token2);
    expect(token1.length).toBeGreaterThan(20); // Token suficientemente largo
  });

  test('❌ DEBE FALLAR: Debe usar cookies con SameSite', async () => {
    // Las cookies de sesión deben tener SameSite configurado
    const response = await agent
      .get('/api/csrf-token')
      .expect('set-cookie', /SameSite=Strict/i);
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR CSRF', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Instalar y configurar csurf:
       const csrf = require('csurf');
       const csrfProtection = csrf({ cookie: true });
    
    2. Agregar endpoint para obtener token CSRF:
       app.get('/api/csrf-token', (req, res) => {
         res.json({ csrfToken: req.csrfToken() });
       });
    
    3. Proteger endpoints sensibles:
       app.post('/api/transfer', csrfProtection, (req, res) => {
         // Lógica de transferencia
       });
    
    4. Configurar cookies con SameSite:
       app.use(session({
         cookie: {
           sameSite: 'strict',
           httpOnly: true,
           secure: true // en producción
         }
       }));
    
    5. Validar Origin/Referer headers:
       const allowedOrigins = ['http://localhost:3000'];
       if (!allowedOrigins.includes(req.get('origin'))) {
         return res.status(403).json({ error: 'Invalid origin' });
       }
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
