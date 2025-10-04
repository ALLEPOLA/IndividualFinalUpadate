const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Moderator = require('../models/Moderator');

// Generate JWT token for moderator
const generateModeratorToken = (moderator) => {
  return jwt.sign(
    {
      id: moderator.id,
      firstName: moderator.firstName,
      middleName: moderator.middleName,
      lastName: moderator.lastName,
      address: moderator.address,
      phone: moderator.phone,
      email: moderator.email,
      role: 'moderator',
      permissions: moderator.permissions
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Create Moderator
const createModerator = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      middleName,
      address, 
      phone, 
      email, 
      password,
      permissions
    } = req.body;

    // Check if moderator already exists
    const existingModerator = await Moderator.findByEmail(email);
    if (existingModerator) {
      return res.status(400).json({
        success: false,
        message: 'Moderator with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create moderator
    const moderatorData = {
      firstName,
      middleName: middleName || null,
      lastName,
      address: address || null,
      phone,
      email,
      password: hashedPassword,
      permissions: permissions || {
        canManageUsers: true,
        canManageVendors: true,
        canManageEvents: true,
        canManagePayments: true,
        canViewReports: true
      }
    };

    const newModerator = await Moderator.create(moderatorData);

    // Generate token
    const token = generateModeratorToken(newModerator);

    res.status(201).json({
      success: true,
      message: 'Moderator created successfully.',
      token,
      moderator: newModerator
    });

  } catch (error) {
    console.error('Create moderator error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Moderator Login
const loginModerator = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find moderator by email
    const moderator = await Moderator.findByEmail(email);
    if (!moderator) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, moderator.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if moderator is active
    if (!moderator.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your moderator account has been deactivated'
      });
    }

    // Generate token
    const token = generateModeratorToken(moderator);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      moderator: moderator.toJSON()
    });

  } catch (error) {
    console.error('Moderator login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current moderator profile (protected route)
const getModeratorProfile = async (req, res) => {
  try {
    const moderator = await Moderator.findById(req.user.id);
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }

    res.status(200).json({
      success: true,
      moderator: moderator.toJSON()
    });

  } catch (error) {
    console.error('Get moderator profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// Get all moderators (admin only)
const getAllModerators = async (req, res) => {
  try {
    const moderators = await Moderator.getAllActive();
    
    res.status(200).json({
      success: true,
      moderators: moderators.map(moderator => moderator.toJSON())
    });

  } catch (error) {
    console.error('Get all moderators error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update moderator permissions (admin only)
const updateModeratorPermissions = async (req, res) => {
  try {
    const { moderatorId } = req.params;
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Valid permissions object is required'
      });
    }

    const updated = await Moderator.updatePermissions(moderatorId, permissions);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Moderator permissions updated successfully'
    });

  } catch (error) {
    console.error('Update moderator permissions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Deactivate moderator (admin only)
const deactivateModerator = async (req, res) => {
  try {
    const { moderatorId } = req.params;

    const deactivated = await Moderator.deactivate(moderatorId);
    
    if (!deactivated) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Moderator deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate moderator error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createModerator,
  loginModerator,
  getModeratorProfile,
  getAllModerators,
  updateModeratorPermissions,
  deactivateModerator
};
