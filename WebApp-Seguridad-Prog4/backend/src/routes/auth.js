const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



const {
  loginRateLimiter,
  captchaM,
  bruteForceProtection,
  trackFailedLogin
  } = require('../middleware/bruteForce.middleware');

router.post(
  '/login',
  trackFailedLogin,
  bruteForceProtection,
  captchaM,
  loginRateLimiter,
  
  authController.login);


router.post('/register', authController.register);
router.post('/auth/verify', authController.verifyToken);
router.post('/check-username', authController.checkUsername);

module.exports = router;
