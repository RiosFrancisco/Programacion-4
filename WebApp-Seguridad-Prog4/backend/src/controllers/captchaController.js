const svgCaptcha = require('svg-captcha');

// Store para captchas (VULNERABLE: almacenamiento inseguro)
let captchaStore = {};

const generateCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 1,
    color: true
  });
  
  // VULNERABLE: CAPTCHA predecible y almacenado de forma insegura
  const captchaId = Date.now().toString();
  captchaStore[captchaId] = captcha.text.toLowerCase();
  
  res.json({
    captchaId,
    captcha: captcha.data,
    // VULNERABLE: Envía la respuesta en modo debug
    debug: process.env.NODE_ENV === 'development' ? captcha.text : undefined
  });
};

const verifyCaptcha = (req, res) => {
  const { captchaId, captchaText } = req.body;
  
  // VULNERABLE: No expira el CAPTCHA y permite múltiples intentos
  if (captchaStore[captchaId] && captchaStore[captchaId] === captchaText.toLowerCase()) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
};

module.exports = {
  generateCaptcha,
  verifyCaptcha,
  captchaStore
};
