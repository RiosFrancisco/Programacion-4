const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

// Importar configuraciones y utilidades
const { connectWithRetry } = require('./config/database');
const { initializeFiles } = require('./utils/fileInit');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Importar rutas
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Session para CSRF (vulnerable - sin token CSRF)
app.use(session({
  secret: 'vulnerable-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Usar todas las rutas con prefijo /api
app.use('/api', routes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Inicializar archivos de ejemplo
initializeFiles();

// Conectar a la base de datos
setTimeout(connectWithRetry, 5000); // Esperar 5 segundos antes de conectar

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
  
  console.log('\nRutas disponibles:');
  console.log('- POST /api/login');
  console.log('- POST /api/register');
  console.log('- POST /api/check-username');
  console.log('- GET  /api/products');
  console.log('- POST /api/ping');
  console.log('- POST /api/transfer');
  console.log('- GET  /api/file');
  console.log('- POST /api/upload');
  console.log('- GET  /api/captcha');
  console.log('- POST /api/verify-captcha');
  console.log('- GET  /api/health');
});

module.exports = app;
