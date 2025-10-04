const express = require('express');
const router = express.Router();
const { 
  createModerator, 
  loginModerator, 
  getModeratorProfile, 
  getAllModerators,
  updateModeratorPermissions,
  deactivateModerator
} = require('../controllers/moderatorController');
const { authenticateToken } = require('../middleware/auth');
const { validateModeratorCreate, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/create', validateModeratorCreate, createModerator);
router.post('/login', validateLogin, loginModerator);

// Protected routes
router.get('/profile', authenticateToken, getModeratorProfile);

// Admin routes (require admin role)
router.get('/all', authenticateToken, getAllModerators);
router.put('/:moderatorId/permissions', authenticateToken, updateModeratorPermissions);
router.put('/:moderatorId/deactivate', authenticateToken, deactivateModerator);

module.exports = router;
