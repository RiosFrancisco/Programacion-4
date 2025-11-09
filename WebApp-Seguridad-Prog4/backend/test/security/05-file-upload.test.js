const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const vulnerabilityRoutes = require('../../src/routes/vulnerabilities');

describe('Seguridad: File Upload', () => {
  let app;
  const uploadDir = path.join(__dirname, '../../uploads');

  beforeEach(() => {
    app = express();
    app.use('/api', vulnerabilityRoutes);
    
    // Crear directorio de uploads si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Limpiar archivos de prueba
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }
  });

  test('❌ DEBE FALLAR: No debe aceptar archivos ejecutables', async () => {
    const dangerousFiles = [
      { name: 'shell.php', content: '<?php system($_GET["cmd"]); ?>' },
      { name: 'script.exe', content: Buffer.from('MZ') }, // PE header
      { name: 'hack.jsp', content: '<%@ page import="java.io.*" %>' },
      { name: 'backdoor.asp', content: '<%eval request("cmd")%>' }
    ];

    for (const file of dangerousFiles) {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from(file.content), file.name);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('File type not allowed');
    }
  });

  test('❌ DEBE FALLAR: Debe validar el tipo MIME real del archivo', async () => {
    // Archivo PHP disfrazado como imagen
    const maliciousContent = '<?php phpinfo(); ?>';
    
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from(maliciousContent), 'image.jpg')
      .set('Content-Type', 'multipart/form-data');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid file content');
  });

  test('❌ DEBE FALLAR: Debe tener límite de tamaño', async () => {
    // Crear archivo grande (10MB)
    const largeFile = Buffer.alloc(10 * 1024 * 1024);
    
    const response = await request(app)
      .post('/api/upload')
      .attach('file', largeFile, 'large.txt');

    expect(response.status).toBe(413);
    expect(response.body.error).toContain('File too large');
  });

  test('❌ DEBE FALLAR: Debe renombrar archivos para evitar colisiones', async () => {
    const content = 'test content';
    
    // Subir el mismo archivo dos veces
    const response1 = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from(content), 'test.txt');

    const response2 = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from(content), 'test.txt');

    if (response1.status === 200 && response2.status === 200) {
      // Los nombres de archivo deben ser diferentes
      expect(response1.body.filename).not.toBe(response2.body.filename);
    }
  });

  test('❌ DEBE FALLAR: No debe permitir caracteres peligrosos en nombres', async () => {
    const dangerousNames = [
      '../../../etc/passwd',
      'file.php\x00.txt',
      'file.asp;.jpg',
      'file.jsp%00.png'
    ];

    for (const name of dangerousNames) {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('content'), name);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid filename');
    }
  });

  test('❌ DEBE FALLAR: Los archivos no deben ser ejecutables desde el servidor', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('test'), 'test.txt');

    if (response.status === 200) {
      const filePath = path.join(uploadDir, response.body.filename);
      
      // Verificar permisos del archivo
      const stats = fs.statSync(filePath);
      const isExecutable = (stats.mode & 0o111) !== 0;
      
      expect(isExecutable).toBe(false);
    }
  });
});

describe('📝 INSTRUCCIONES PARA CORREGIR FILE UPLOAD', () => {
  test('Implementar las siguientes medidas de seguridad:', () => {
    const instrucciones = `
    1. Validar extensiones con lista blanca:
       const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
       const ext = path.extname(file.originalname).toLowerCase();
       if (!allowedExtensions.includes(ext)) {
         return res.status(400).json({ error: 'File type not allowed' });
       }
    
    2. Verificar tipo MIME real:
       const fileType = require('file-type');
       const buffer = fs.readFileSync(file.path);
       const type = await fileType.fromBuffer(buffer);
       
       const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
       if (!allowedMimes.includes(type.mime)) {
         fs.unlinkSync(file.path);
         return res.status(400).json({ error: 'Invalid file content' });
       }
    
    3. Configurar límite de tamaño:
       const upload = multer({
         limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
         storage: storage
       });
    
    4. Generar nombres únicos:
       const crypto = require('crypto');
       filename: (req, file, cb) => {
         const uniqueName = crypto.randomBytes(16).toString('hex');
         const ext = path.extname(file.originalname);
         cb(null, uniqueName + ext);
       }
    
    5. Almacenar fuera del webroot:
       - Guardar en directorio no accesible por web
       - Servir archivos mediante endpoint controlado
       
    6. Sanitizar nombres de archivo:
       const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '');
       
    7. Configurar permisos:
       fs.chmodSync(filePath, 0o644); // Solo lectura
    `;
    
    console.log(instrucciones);
    expect(true).toBe(true);
  });
});
