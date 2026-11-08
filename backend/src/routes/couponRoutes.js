const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { requireAdminAuth } = require('../config/auth');

// Public storefront routes
router.get('/active', couponController.getActiveCoupons);
router.post('/validate', couponController.validateCoupon);

// Protected Admin routes
router.get('/', requireAdminAuth, couponController.getCoupons);
router.post('/admin', requireAdminAuth, couponController.createCoupon);
router.patch('/admin/:id/toggle', requireAdminAuth, couponController.toggleCouponActive);
router.delete('/admin/:id', requireAdminAuth, couponController.deleteCoupon);

module.exports = router;
