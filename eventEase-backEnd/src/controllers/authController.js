const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { generateOTP, sendOTPEmail, sendEmailVerification: sendVerificationEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// User Sign Up
const signUp = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      role, 
      email, 
      password,
      // Vendor-specific fields
      businessName,
      description,
      address,
      city,
      province,
      postalCode,
      capacity,
      websiteUrl,
      businessRegistrationNumber,
      businessLicenseNumber
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      firstName,
      lastName,
      phone,
      role,
      email,
      password: hashedPassword,
      emailVerified: false
    };

    const newUser = await User.create(userData);

    // Generate email verification OTP
    const verificationOTP = User.generateVerificationOTP();
    await User.setEmailOTP(newUser.email, verificationOTP);

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationOTP);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    // If role is vendor, create vendor record
    let vendorData = null;
    if (role === 'vendor') {
      const vendorInfo = {
        userId: newUser.id,
        businessName,
        description,
        address,
        city,
        province,
        postalCode,
        capacity: parseInt(capacity),
        websiteUrl,
        businessRegistrationNumber,
        businessLicenseNumber
      };

      vendorData = await Vendor.create(vendorInfo);
    }

    // Generate token
    const token = generateToken(newUser);

    // Prepare response data
    const responseData = {
      success: true,
      message: role === 'vendor' 
        ? 'Vendor account created successfully. Please check your email to verify your account.' 
        : 'User created successfully. Please check your email to verify your account.',
      token,
      user: newUser,
      requiresEmailVerification: true
    };

    // Include vendor data if it's a vendor account
    if (vendorData) {
      responseData.vendor = vendorData;
    }

    res.status(201).json(responseData);

  } catch (error) {
    console.error('Sign up error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresEmailVerification: true
      });
    }

    // Generate token
    const token = generateToken(user);

    // Send login notification
    try {
      console.log('📢 Sending login notification for user:', user.id, user.firstName);
      await req.notificationService.notifyUserLogin(user);
      console.log('✅ Login notification sent successfully');
    } catch (notificationError) {
      console.error('❌ Error sending login notification:', notificationError);
      // Don't fail login if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile (protected route)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const responseData = {
      success: true,
      user: user.toJSON()
    };

    // If user is a vendor, include vendor information
    if (user.role === 'vendor') {
      const vendor = await Vendor.findByUserId(user.id);
      if (vendor) {
        responseData.vendor = vendor.toJSON();
      }
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send OTP to email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      otp: otp, 
      email: email
    });

  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

// Send email verification OTP
const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification OTP
    const verificationOTP = User.generateVerificationOTP();
    await User.setEmailOTP(email, verificationOTP);

    // Send verification email
    await sendVerificationEmail(email, verificationOTP);

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent successfully'
    });

  } catch (error) {
    console.error('Send email verification error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send verification OTP'
    });
  }
};

// Verify email with OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify the OTP
    const isVerified = await User.verifyEmailWithOTP(email, otp);

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify email'
    });
  }
};

module.exports = {
  signUp,
  login,
  getProfile,
  sendOTP,
  sendEmailVerification,
  verifyEmail
};
