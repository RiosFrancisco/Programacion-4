const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth');
const productRoutes = require('./products');
const vulnerabilityRoutes = require('./vulnerabilities');
const captchaRoutes = require('./captcha');

// Usar las rutas
router.use('/', authRoutes);
router.use('/', productRoutes);
router.use('/', vulnerabilityRoutes);
router.use('/', captchaRoutes);

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

module.exports = router;
