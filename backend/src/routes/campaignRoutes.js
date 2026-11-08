const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// Public storefront
router.get('/', campaignController.getCampaign);

// Admin routes
router.put('/admin', campaignController.updateCampaign);
router.patch('/admin/toggle', campaignController.toggleCampaign);

module.exports = router;
