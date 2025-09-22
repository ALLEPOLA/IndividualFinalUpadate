const { pool } = require('../config/db');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.phone = userData.phone;
    this.role = userData.role;
    this.email = userData.email;
    this.password = userData.password;
    this.emailVerified = userData.emailVerified || userData.email_verified;
    this.emailOtp = userData.emailOtp || userData.email_otp;
    this.emailOtpExpires = userData.emailOtpExpires || userData.email_otp_expires;
  }


  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { firstName, lastName, phone, role, email, password, emailVerified = false } = userData;
      
      // Validate required fields
      if (!firstName || !lastName || !phone || !role || !email || !password) {
        throw new Error('All fields are required');
      }

      // Validate role
      if (!['user', 'vendor', 'admin'].includes(role)) {
        throw new Error('Invalid role. Must be user, vendor, or admin');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      const [result] = await pool.execute(
        'INSERT INTO users (firstName, lastName, phone, role, email, password, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, phone, role, email, password, emailVerified]
      );

      return {
        id: result.insertId,
        firstName,
        lastName,
        phone,
        role,
        email,
        emailVerified
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  // Get user data without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // Generate email verification OTP
  static generateVerificationOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Find user by email OTP
  static async findByEmailOTP(email, otp) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ? AND email_otp = ? AND email_otp_expires > NOW()',
        [email, otp]
      );
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by email OTP:', error.message);
      throw error;
    }
  }

  // Verify email with OTP
  static async verifyEmailWithOTP(email, otp) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET email_verified = TRUE, email_otp = NULL, email_otp_expires = NULL WHERE email = ? AND email_otp = ? AND email_otp_expires > NOW()',
        [email, otp]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error verifying email with OTP:', error.message);
      throw error;
    }
  }

  // Set email verification OTP
  static async setEmailOTP(email, otp, expiresInMinutes = 10) {
    try {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

      const [result] = await pool.execute(
        'UPDATE users SET email_otp = ?, email_otp_expires = ? WHERE email = ?',
        [otp, expiresAt, email]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error setting email OTP:', error.message);
      throw error;
    }
  }
}

module.exports = User;
