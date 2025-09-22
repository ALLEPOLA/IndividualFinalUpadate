const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmPayment, handleWebhook } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Create checkout session
router.post('/create-session', authenticateToken, createCheckoutSession);

// Confirm payment (manual confirmation if needed)
router.post('/confirm', authenticateToken, confirmPayment);

// Stripe webhook endpoint (no authentication needed for webhooks)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
