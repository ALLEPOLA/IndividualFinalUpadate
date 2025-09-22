const express = require('express');
const router = express.Router();
const { signUp, login, getProfile, sendOTP, sendEmailVerification, verifyEmail } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/signup', validateSignup, signUp);
router.post('/login', validateLogin, login);
router.post('/send-otp', sendOTP);
router.post('/send-email-verification', sendEmailVerification);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
