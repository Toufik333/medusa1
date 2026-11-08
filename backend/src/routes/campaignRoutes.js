const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { requireAdminAuth } = require('../config/auth');

// Public storefront
router.get('/', campaignController.getCampaign);

// Protected Admin routes
router.put('/admin', requireAdminAuth, campaignController.updateCampaign);
router.patch('/admin/toggle', requireAdminAuth, campaignController.toggleCampaign);

module.exports = router;
