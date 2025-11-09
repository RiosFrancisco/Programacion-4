// Middleware para manejo de errores global
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // VULNERABLE: Expone detalles del error en producción
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      // VULNERABLE: Expone el stack trace
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      details: err
    }
  });
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`No encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
