const express = require('express');
const router = express.Router();
const { 
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin/moderator only)
router.get('/', getAllUsers);

// Get user by ID (admin/moderator only)
router.get('/:id', getUserById);

// Delete user (admin/moderator only)
router.delete('/:id', deleteUser);

// Update user role (admin/moderator only)
router.put('/:id/role', updateUserRole);

module.exports = router;
