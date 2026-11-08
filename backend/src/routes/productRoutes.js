const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAdminAuth } = require('../config/auth');
const { validateProductPayload } = require('../middleware/security');

// Public storefront routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected Admin routes
router.post('/admin', requireAdminAuth, validateProductPayload, productController.createProduct);
router.put('/admin/:id', requireAdminAuth, validateProductPayload, productController.updateProduct);
router.patch('/admin/:id/featured', requireAdminAuth, productController.toggleFeatured);
router.delete('/admin/:id', requireAdminAuth, productController.deleteProduct);

module.exports = router;
