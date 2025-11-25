//instancia de NodeCache que usas para registrar los intentos de login
const NodeCache = require('node-cache');
const loginAttempts = new NodeCache({ stdTTL: 900, checkperiod: 120 });

//pausar la ejecución
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* -----------------------------------------------
   1. Rate limit
------------------------------------------------*/
const loginRateLimiter = (req, res, next) => {
  const ip = req.ip;
  const key = `rate_${ip}`;
  const count = (loginAttempts.get(key) || 0) + 1;

  if (count > 5) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  loginAttempts.set(key, count, 900);
  next();
};

/* -----------------------------------------------
   2. Delay progresivo
------------------------------------------------*/
const bruteForceProtection = async (req, res, next) => {
  const ip = req.ip;
  const attempts = loginAttempts.get(`failed_${ip}`) || 0;

  const delay = 200 * Math.pow(2, attempts);  
  await sleep(delay);

  next();
};

/* -----------------------------------------------
   3. CAPTCHA
------------------------------------------------*/
const captchaM = (req, res, next) => {
  const ip = req.ip;
  const attempts = loginAttempts.get(`failed_${ip}`) || 0;

  if (attempts >= 3) {
    if (!req.body.captcha) {
      return res.status(400).json({ error: 'captcha required' });
    }
    if (req.body.captcha !== 'VALID') {
      return res.status(400).json({ error: 'invalid captcha' });
    }
    loginAttempts.del(`failed_${ip}`);
  }

  next();
};

/* -----------------------------------------------
   4. Registrar fallos
------------------------------------------------*/
const trackFailedLogin = (req, res, next) => {
  const ip = req.ip;
  const key = `failed_${ip}`;

  const originalJson = res.json.bind(res);

  res.json = function (data) {
    if (res.statusCode === 401 || (data && data.error === 'Credenciales inválidas')) {
      const current = loginAttempts.get(key) || 0;
      loginAttempts.set(key, current + 1, 900);
      console.log(`Fallos del IP ${ip}: intento , ${current + 1}`);
    }
    return originalJson(data);
  };

  next();
};

/* -----------------------------------------------
   5. RESET para testing — NECESARIO PARA JEST
------------------------------------------------*/
const resetBruteForce = () => {
  loginAttempts.flushAll();
};

/* -----------------------------------------------
   EXPORTS
------------------------------------------------*/
module.exports = {
  loginRateLimiter,
  bruteForceProtection,
  captchaM,
  trackFailedLogin,
  resetBruteForce   // <<--- AHORA SÍ EXISTE
};
