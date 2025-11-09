const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer para file upload (VULNERABLE - sin validación)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // VULNERABLE: No sanitiza el nombre del archivo
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  // VULNERABLE: Sin límites de tamaño ni validación de tipo
});

module.exports = upload;
