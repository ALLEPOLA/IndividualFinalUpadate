const express = require('express');
const router = express.Router();
const teamMemberController = require('../controllers/teamMemberController');
const { authenticateToken } = require('../middleware/auth');
const { validateTeamMemberCreate, validateTeamMemberUpdate } = require('../middleware/validation');

// Public routes
router.get('/', teamMemberController.getAllTeamMembers);
router.get('/:id', teamMemberController.getTeamMemberById);
router.get('/vendor/:vendorId', teamMemberController.getTeamMembersByVendor);

// Protected routes (require authentication)
router.post('/', 
  authenticateToken, 
  validateTeamMemberCreate, 
  teamMemberController.createTeamMember
);

router.put('/:id', 
  authenticateToken, 
  validateTeamMemberUpdate, 
  teamMemberController.updateTeamMember
);

router.delete('/:id', 
  authenticateToken, 
  teamMemberController.deleteTeamMember
);

router.patch('/:id/toggle-status', 
  authenticateToken, 
  teamMemberController.toggleTeamMemberStatus
);

module.exports = router;
