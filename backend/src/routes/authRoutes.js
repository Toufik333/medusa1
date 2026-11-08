const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAdminAuth } = require('../config/auth');

router.post('/login', authController.login);
router.get('/me', requireAdminAuth, authController.getMe);

module.exports = router;

