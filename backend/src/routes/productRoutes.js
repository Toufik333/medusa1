const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public storefront routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/admin', productController.createProduct);
router.put('/admin/:id', productController.updateProduct);
router.patch('/admin/:id/featured', productController.toggleFeatured);
router.delete('/admin/:id', productController.deleteProduct);

module.exports = router;
