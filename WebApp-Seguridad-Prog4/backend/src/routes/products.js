const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta de productos (vulnerable a SQL injection)
router.get('/products', productController.getProducts);

module.exports = router;
