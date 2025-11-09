const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/captchaController');

// Rutas de CAPTCHA
router.get('/captcha', captchaController.generateCaptcha);
router.post('/verify-captcha', captchaController.verifyCaptcha);

module.exports = router;
