const express = require('express');
const router = express.Router();
const { 
  getVendorDashboardData,
  getVendorBusinessInsights,
  testVendorDashboard
} = require('../controllers/vendorDashboardController');
const { authenticateToken } = require('../middleware/auth');

// Get vendor dashboard analytics
router.get('/vendor/dashboard', 
  authenticateToken,
  getVendorDashboardData
);

// Get vendor business insights
router.get('/vendor/business-insights', 
  authenticateToken,
  getVendorBusinessInsights
);

// Test vendor dashboard endpoint
router.get('/vendor/test', 
  authenticateToken,
  testVendorDashboard
);

module.exports = router;
