/**
 * =========================================================================
 * RESERVED BKASH PAYMENT CONTROLLER (FUTURE ACTIVATION READY)
 * =========================================================================
 * This module is reserved for bKash Tokenized Checkout API integration.
 * Currently, Cash on Delivery (COD) is active on the storefront.
 * The database schema (orders table) already includes:
 *   - bkash_payment_id VARCHAR(120)
 *   - bkash_trx_id VARCHAR(120)
 *   - payment_status ('UNPAID_COD', 'PAID_BKASH', etc.)
 *
 * To activate later:
 * 1. Set BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, BKASH_PASSWORD in .env
 * 2. Complete createPayment & executePayment with bKash API endpoints.
 * =========================================================================
 */

const db = require('../config/db');

// POST /api/payments/bkash/create
exports.createBkashPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  // Placeholder check: verify order exists
  return res.status(501).json({
    status: 'reserved',
    message: 'bKash digital payment gateway slot is reserved in the backend. Currently, this store processes orders exclusively via Cash on Delivery (COD).',
    orderId,
    amount,
    instructions: 'To enable live bKash payments, configure your bKash merchant credentials in backend .env and hook into /tokenized/checkout/create.'
  });
};

// POST /api/payments/bkash/callback
exports.bkashCallback = async (req, res) => {
  const { paymentID, status } = req.query;

  return res.status(501).json({
    status: 'reserved',
    message: 'bKash webhook callback route is reserved.',
    paymentID,
    callbackStatus: status
  });
};

// GET /api/payments/bkash/status/:orderId
exports.getPaymentStatus = async (req, res) => {
  const { orderId } = req.params;

  return res.json({
    orderId,
    activeMethod: 'COD',
    bkashReady: true,
    message: 'Cash on Delivery is active. bKash slot is ready for merchant credentials.'
  });
};
