const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Reserved bKash routes
router.post('/bkash/create', paymentController.createBkashPayment);
router.get('/bkash/callback', paymentController.bkashCallback);
router.post('/bkash/callback', paymentController.bkashCallback);
router.get('/bkash/status/:orderId', paymentController.getPaymentStatus);

module.exports = router;

