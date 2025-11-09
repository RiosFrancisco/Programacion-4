const request = require('supertest');
const express = require('express');
const vulnerabilityRoutes = require('../../src/routes/vulnerabilities');
const path = require('path');
const fs = require('fs');

describe('Seguridad: Local File Inclusion (LFI)', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', vulnerabilityRoutes);
    
    // Crear directorio de prueba
    const filesDir = path.join(__dirname, '../../files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
      fs.writeFileSync(path.join(filesDir, 'allowed.txt'), 'This is allowed content');
    }
  });

  test('❌ DEBE FALLAR: No debe permitir path traversal', async () => {
    const maliciousInputs = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',
      '../server.js',
      '....//....//....//etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
    ];

    for (const input of maliciousInputs) {
      const response = await request(app)
        .get('/api/file')
        .query({ filename: input });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid file path');
    }
  });

  test('❌ DEBE FALLAR: Solo debe servir archivos de un directorio específico', async () => {
    const response = await request(app)
      .get('/api/file')
      .query({ filename: '../package.json' });

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('Access denied');
  });

  test('❌ DEBE FALLAR: Debe validar la extensión del archivo', async () => {
    const response = await request(app)
      .get('/api/file')
      .query({ filename: 'script.js' });

    // Solo debe permitir extensiones seguras como .txt, .pdf, etc.
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('File type not allowed');
  });

  test('❌ DEBE FALLAR: Debe usar una lista blanca de archivos permitidos', async () => {
    const response = await request(app)
      .get('/api/file')
      .query({ filename: 'allowed.txt' });

    if (response.status === 200) {
      // Si permite el archivo, debe ser solo de la lista blanca
      expect(response.text).toBe('This is allowed content');
    } else {
      // O debe implementar lista blanca
      expect(response.status).toBe(404);
    }
  });

  test('❌ DEBE FALLAR: No debe revelar la estructura del sistema de archivos', async () => {
    const response = await request(app)
      .get('/api/file')
      .query({ filename: 'nonexistent.txt' });

    // No debe revelar rutas del sistema
    expect(response.body.error).not.toContain('/home');
    expect(response.body.error).not.toContain('/var');
    expect(response.body.error).not.toContain('\\Users\\');
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR FILE INCLUSION', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Validar y sanitizar rutas:
       const sanitizedPath = path.normalize(filename).replace(/^(\\.\\.[\\/\\\\])+/, '');
       if (sanitizedPath.includes('..')) {
         return res.status(400).json({ error: 'Invalid file path' });
       }
    
    2. Usar path.join con directorio base:
       const basePath = path.join(__dirname, '../files');
       const filePath = path.join(basePath, sanitizedPath);
       
       // Verificar que esté dentro del directorio permitido
       if (!filePath.startsWith(basePath)) {
         return res.status(403).json({ error: 'Access denied' });
       }
    
    3. Implementar lista blanca de archivos:
       const allowedFiles = ['readme.txt', 'help.txt', 'public.txt'];
       if (!allowedFiles.includes(filename)) {
         return res.status(404).json({ error: 'File not found' });
       }
    
    4. Validar extensiones permitidas:
       const allowedExtensions = ['.txt', '.pdf', '.md'];
       const ext = path.extname(filename);
       if (!allowedExtensions.includes(ext)) {
         return res.status(400).json({ error: 'File type not allowed' });
       }
    
    5. No revelar información del sistema:
       - Usar mensajes de error genéricos
       - No mostrar rutas absolutas
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
