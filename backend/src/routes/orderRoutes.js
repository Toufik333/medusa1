const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Customer checkout route
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

// Admin routes
router.get('/admin/all', orderController.getOrders);
router.patch('/admin/:id/status', orderController.updateOrderStatus);

module.exports = router;
