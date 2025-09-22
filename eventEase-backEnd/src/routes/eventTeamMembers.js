const express = require('express');
const router = express.Router();
const { 
  getEventTeamMembers,
  getAvailableTeamMembers,
  assignTeamMembersToEvent,
  removeTeamMembersFromEvent
} = require('../controllers/eventTeamMemberController');
const { authenticateToken } = require('../middleware/auth');

// Get team members assigned to an event
router.get('/event/:eventId/team-members', 
  authenticateToken,
  getEventTeamMembers
);

// Get available team members for a vendor
router.get('/available-team-members', 
  authenticateToken,
  getAvailableTeamMembers
);

// Assign team members to an event
router.post('/event/:eventId/team-members', 
  authenticateToken,
  assignTeamMembersToEvent
);

// Remove team members from an event
router.delete('/event/:eventId/team-members', 
  authenticateToken,
  removeTeamMembersFromEvent
);

module.exports = router;
