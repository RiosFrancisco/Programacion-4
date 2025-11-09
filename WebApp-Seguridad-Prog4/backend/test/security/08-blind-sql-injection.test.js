const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth');

describe('Seguridad: Blind SQL Injection', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', authRoutes);
  });

  test('❌ DEBE FALLAR: No debe permitir inyección SQL booleana', async () => {
    // Intentos de blind SQL injection
    const injections = [
      "admin' AND '1'='1",
      "admin' AND '1'='2",
      "admin' AND SLEEP(5) --",
      "admin' AND (SELECT COUNT(*) FROM users) > 0 --",
      "admin' AND SUBSTRING(password, 1, 1) = 'a' --"
    ];

    const responses = [];
    for (const injection of injections) {
      const response = await request(app)
        .post('/api/check-username')
        .send({ username: injection });
      
      responses.push(response.body.exists);
    }

    // Todas las respuestas deben ser iguales (no revelar información)
    const allSame = responses.every(r => r === responses[0]);
    expect(allSame).toBe(true);
  });

  test('❌ DEBE FALLAR: No debe ser vulnerable a time-based blind SQL', async () => {
    const startTime = Date.now();
    
    // Intento con SLEEP
    await request(app)
      .post('/api/check-username')
      .send({ username: "admin' AND SLEEP(3) --" });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // No debe tardar más de 1 segundo (no ejecutar SLEEP)
    expect(duration).toBeLessThan(1000);
  });

  test('❌ DEBE FALLAR: No debe revelar errores de SQL', async () => {
    const response = await request(app)
      .post('/api/check-username')
      .send({ username: "admin'" });

    // No debe mostrar errores de SQL
    expect(response.status).toBe(200);
    expect(response.body.error).toBeUndefined();
    expect(JSON.stringify(response.body)).not.toContain('SQL');
    expect(JSON.stringify(response.body)).not.toContain('syntax');
  });

  test('❌ DEBE FALLAR: No debe permitir extracción de datos carácter por carácter', async () => {
    const attempts = [];
    
    // Simular extracción de contraseña
    const charset = 'abcdef0123456789';
    for (const char of charset) {
      const response = await request(app)
        .post('/api/check-username')
        .send({ 
          username: `admin' AND SUBSTRING((SELECT password FROM users LIMIT 1), 1, 1) = '${char}' --`
        });
      
      attempts.push({ char, exists: response.body.exists });
    }
    
    // No debe haber diferencias que permitan inferir el carácter correcto
    const trueCount = attempts.filter(a => a.exists === true).length;
    expect(trueCount).toBe(0); // Ninguno debe ser true por la inyección
  });

  test('❌ DEBE FALLAR: Debe limitar intentos de verificación', async () => {
    const ip = '127.0.0.1';
    
    // Hacer múltiples intentos rápidos
    const attempts = [];
    for (let i = 0; i < 20; i++) {
      attempts.push(
        request(app)
          .post('/api/check-username')
          .set('X-Forwarded-For', ip)
          .send({ username: `user${i}` })
      );
    }
    
    const responses = await Promise.all(attempts);
    
    // Algunos deben ser rechazados por rate limiting
    const rateLimited = responses.some(r => r.status === 429);
    expect(rateLimited).toBe(true);
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR BLIND SQL INJECTION', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Usar consultas parametrizadas:
       const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
       db.query(query, [username], (err, results) => {
         // Manejar resultado
       });
    
    2. Implementar rate limiting específico:
       const checkUsernameLimit = rateLimit({
         windowMs: 1 * 60 * 1000, // 1 minuto
         max: 5, // máximo 5 intentos
         message: 'Too many attempts'
       });
       
       router.post('/check-username', checkUsernameLimit, controller);
    
    3. Respuestas genéricas sin revelar información:
       // No indicar si el error es por SQL o por usuario no encontrado
       try {
         // consulta
       } catch (error) {
         console.error(error); // Log interno
         return res.json({ exists: false }); // Respuesta genérica
       }
    
    4. Agregar delay aleatorio:
       // Evitar timing attacks
       const delay = Math.random() * 100 + 50; // 50-150ms
       setTimeout(() => {
         res.json({ exists: result });
       }, delay);
    
    5. Validación estricta de entrada:
       const username = req.body.username;
       if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
         return res.status(400).json({ error: 'Invalid username format' });
       }
    
    6. Logging y monitoreo:
       // Detectar patrones sospechosos
       if (username.includes("'") || username.includes("--")) {
         console.warn('Posible intento de SQL injection:', {
           ip: req.ip,
           username: username,
           timestamp: new Date()
         });
       }
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
