const upload = require('../config/multer');

// VULNERABLE: File Upload sin validación
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  
  // VULNERABLE: No valida tipo de archivo ni contenido
  res.json({ 
    message: 'Archivo subido con éxito',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
};

module.exports = {
  uploadFile,
  uploadMiddleware: upload.single('file')
};
