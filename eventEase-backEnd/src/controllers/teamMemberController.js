const TeamMember = require('../models/TeamMember');
const Vendor = require('../models/Vendor');

const teamMemberController = {
  // Create a new team member
  createTeamMember: async (req, res) => {
    try {
      const {
        vendor_id,
        name,
        email,
        phone,
        role,
        hourly_rate
      } = req.body;

      // Check if vendor exists
      const vendor = await Vendor.findById(vendor_id);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      // Check if email already exists for this vendor
      const emailExists = await TeamMember.emailExistsForVendor(email, vendor_id);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Team member with this email already exists for this vendor'
        });
      }

      const teamMember = await TeamMember.create({
        vendor_id,
        name,
        email,
        phone,
        role,
        hourly_rate
      });

      // Fetch the created team member
      const createdMember = await TeamMember.findById(teamMember.id);

      res.status(201).json({
        success: true,
        message: 'Team member created successfully',
        data: createdMember
      });
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create team member',
        error: error.message
      });
    }
  },

  // Get all team members with pagination and filters
  getAllTeamMembers: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        vendor_id,
        search,
        role,
        is_active,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        vendor_id,
        search,
        role,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
        sort_by,
        sort_order
      };

      const result = await TeamMember.findAll(options);

      res.json({
        success: true,
        message: 'Team members retrieved successfully',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch team members',
        error: error.message
      });
    }
  },

  // Get team members by vendor
  getTeamMembersByVendor: async (req, res) => {
    try {
      const { vendorId } = req.params;

      const members = await TeamMember.findByVendor(vendorId);

      res.json({
        success: true,
        message: 'Vendor team members retrieved successfully',
        data: members
      });
    } catch (error) {
      console.error('Error fetching vendor team members:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch vendor team members',
        error: error.message
      });
    }
  },

  // Get single team member by ID
  getTeamMemberById: async (req, res) => {
    try {
      const { id } = req.params;

      const teamMember = await TeamMember.findById(id);

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      res.json({
        success: true,
        message: 'Team member retrieved successfully',
        data: teamMember
      });
    } catch (error) {
      console.error('Error fetching team member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch team member',
        error: error.message
      });
    }
  },

  // Update team member
  updateTeamMember: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        role,
        hourly_rate,
        is_active
      } = req.body;

      const teamMember = await TeamMember.findById(id);
      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      // Check if email already exists for this vendor (excluding current member)
      if (email && email !== teamMember.email) {
        const emailExists = await TeamMember.emailExistsForVendor(email, teamMember.vendor_id, id);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Team member with this email already exists for this vendor'
          });
        }
      }

      // Update team member
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (role !== undefined) updateData.role = role;
      if (hourly_rate !== undefined) updateData.hourly_rate = hourly_rate;
      if (is_active !== undefined) updateData.is_active = is_active;

      const updatedMember = await TeamMember.update(id, updateData);

      res.json({
        success: true,
        message: 'Team member updated successfully',
        data: updatedMember
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update team member',
        error: error.message
      });
    }
  },

  // Delete team member
  deleteTeamMember: async (req, res) => {
    try {
      const { id } = req.params;

      const teamMember = await TeamMember.findById(id);
      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      await TeamMember.delete(id);

      res.json({
        success: true,
        message: 'Team member deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete team member',
        error: error.message
      });
    }
  },

  // Toggle team member status (active/inactive)
  toggleTeamMemberStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const teamMember = await TeamMember.findById(id);
      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      const newStatus = !teamMember.is_active;
      await TeamMember.update(id, { is_active: newStatus });

      res.json({
        success: true,
        message: `Team member ${newStatus ? 'activated' : 'deactivated'} successfully`,
        data: { is_active: newStatus }
      });
    } catch (error) {
      console.error('Error toggling team member status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle team member status',
        error: error.message
      });
    }
  }
};

module.exports = teamMemberController;
