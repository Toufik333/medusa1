const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAdminAuth } = require('../config/auth');
const { validateOrderPayload } = require('../middleware/security');

// Public Customer checkout routes
router.post('/', validateOrderPayload, orderController.createOrder);
router.get('/:id', orderController.getOrderById);

// Protected Admin routes
router.get('/admin/all', requireAdminAuth, orderController.getOrders);
router.patch('/admin/:id/status', requireAdminAuth, orderController.updateOrderStatus);

module.exports = router;
