const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Public storefront routes
router.get('/active', couponController.getActiveCoupons);
router.post('/validate', couponController.validateCoupon);

// Admin routes
router.get('/', couponController.getCoupons);
router.post('/admin', couponController.createCoupon);
router.patch('/admin/:id/toggle', couponController.toggleCouponActive);
router.delete('/admin/:id', couponController.deleteCoupon);

module.exports = router;
