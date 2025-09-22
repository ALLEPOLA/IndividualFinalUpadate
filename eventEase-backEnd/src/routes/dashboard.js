const express = require('express');
const router = express.Router();
const { 
  getUserDashboardData,
  getUserSpendingInsights,
  testDashboard
} = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Get user dashboard analytics
router.get('/user/dashboard', 
  authenticateToken,
  getUserDashboardData
);

// Get user spending insights
router.get('/user/spending-insights', 
  authenticateToken,
  getUserSpendingInsights
);

// Test dashboard endpoint
router.get('/test', 
  authenticateToken,
  testDashboard
);

module.exports = router;
