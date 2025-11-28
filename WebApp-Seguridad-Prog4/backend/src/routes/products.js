const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const productController = require('../controllers/productController');

const validateProductFilters = [
  query('category').optional().trim().isLength({ max: 100 }).escape(),
  query('search').optional().trim().isLength({ max: 100 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Ruta de productos con validación básica y consultas parametrizadas
router.get('/products', validateProductFilters, productController.getProducts);

module.exports=router;  