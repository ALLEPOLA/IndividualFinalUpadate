const Event = require('../models/Event');
const TeamMember = require('../models/TeamMember');
const Vendor = require('../models/Vendor');

// Get team members assigned to an event
const getEventTeamMembers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Verify vendor owns this event
    const vendor = await Vendor.findByUserId(userId);
    if (!vendor || event.vendor_id !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access this event'
      });
    }

    // Parse team members from event
    let teamMembers = [];
    if (event.team_members) {
      try {
        teamMembers = typeof event.team_members === 'string' 
          ? JSON.parse(event.team_members) 
          : event.team_members;
      } catch (error) {
        console.error('Error parsing team members:', error);
        teamMembers = [];
      }
    }

    res.status(200).json({
      success: true,
      data: {
        eventId: event.id,
        eventName: event.name,
        teamMembers: teamMembers
      }
    });

  } catch (error) {
    console.error('Error getting event team members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event team members',
      error: error.message
    });
  }
};

// Get available team members for a vendor
const getAvailableTeamMembers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get vendor information
    const vendor = await Vendor.findByUserId(userId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Get all team members for this vendor
    const teamMembers = await TeamMember.findByVendor(vendor.id);

    // Format team members for selection
    const availableMembers = teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      hourly_rate: member.hourly_rate,
      is_active: member.is_active
    }));

    res.status(200).json({
      success: true,
      data: availableMembers
    });

  } catch (error) {
    console.error('Error getting available team members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available team members',
      error: error.message
    });
  }
};

// Assign team members to an event
const assignTeamMembersToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { teamMemberIds } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!Array.isArray(teamMemberIds)) {
      return res.status(400).json({
        success: false,
        message: 'Team member IDs must be an array'
      });
    }

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Verify vendor owns this event
    const vendor = await Vendor.findByUserId(userId);
    if (!vendor || event.vendor_id !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this event'
      });
    }

    // Get team member details for the selected IDs
    const teamMembersData = [];
    if (teamMemberIds.length > 0) {
      for (const memberId of teamMemberIds) {
        const member = await TeamMember.findById(memberId);
        if (member && member.vendor_id === vendor.id) {
          teamMembersData.push({
            id: member.id,
            name: member.name,
            role: member.role
          });
        }
      }
    }

    // Update event with team members
    const teamMembersJson = JSON.stringify(teamMembersData);
    await Event.updateTeamMembers(eventId, teamMembersJson);

    res.status(200).json({
      success: true,
      message: 'Team members assigned successfully',
      data: {
        eventId: eventId,
        teamMembers: teamMembersData
      }
    });

  } catch (error) {
    console.error('Error assigning team members:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning team members to event',
      error: error.message
    });
  }
};

// Remove team members from an event
const removeTeamMembersFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Verify vendor owns this event
    const vendor = await Vendor.findByUserId(userId);
    if (!vendor || event.vendor_id !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this event'
      });
    }

    // Remove team members from event
    await Event.updateTeamMembers(eventId, JSON.stringify([]));

    res.status(200).json({
      success: true,
      message: 'Team members removed successfully',
      data: {
        eventId: eventId,
        teamMembers: []
      }
    });

  } catch (error) {
    console.error('Error removing team members:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing team members from event',
      error: error.message
    });
  }
};

module.exports = {
  getEventTeamMembers,
  getAvailableTeamMembers,
  assignTeamMembersToEvent,
  removeTeamMembersFromEvent
};
