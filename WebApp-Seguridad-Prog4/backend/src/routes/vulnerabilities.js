const express = require('express');
const router = express.Router();
const vulnerabilityController = require('../controllers/vulnerabilityController');
const { uploadMiddleware, uploadFile } = require('../controllers/uploadController');

const csrf = require('csurf');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// CSRF middleware global
const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: 'Strict',
    secure: false,   // en test debe ser false
    path: '/'
  }
});

const allowedOrigins = ['http://localhost:3000'];

// Middleware para validar origen, se ejecuta DESPUÉS de csurf
const validateOrigin = (req, res, next) => {
  const origin = req.get('origin');
  const referer = req.get('referer');

  // Si NO hay Origin NI Referer → NO asumimos ataque → permitimos continuar
  if (!origin && !referer) {
    return next();
  }

  const valid =
    (origin && allowedOrigins.includes(origin)) ||
    (referer && allowedOrigins.some(o => referer.startsWith(o)));

  if (!valid) {
    return res.status(403).json({ error: 'Invalid Origin' });
  }

  next();
};


router.get('/csrf-token', csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});


router.post('/transfer',validateOrigin ,  csrfProtection,vulnerabilityController.transfer);



// Command Injection
router.post('/ping', vulnerabilityController.ping);

// Local File Inclusion
router.get('/file', vulnerabilityController.readFile);

// File Upload
router.post('/upload', uploadMiddleware, uploadFile);



router.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF token invalid' });
  }
  next(err);
});

module.exports = router;
