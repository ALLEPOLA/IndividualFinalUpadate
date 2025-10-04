const { pool } = require('../config/db');

class Moderator {
  constructor(moderatorData) {
    this.id = moderatorData.id;
    this.firstName = moderatorData.firstName;
    this.middleName = moderatorData.middleName;
    this.lastName = moderatorData.lastName;
    this.address = moderatorData.address;
    this.phone = moderatorData.phone;
    this.email = moderatorData.email;
    this.password = moderatorData.password;
    this.isActive = moderatorData.isActive || moderatorData.is_active;
    this.permissions = moderatorData.permissions ? 
      (typeof moderatorData.permissions === 'string' ? 
        (() => {
          try {
            return JSON.parse(moderatorData.permissions);
          } catch (e) {
            console.error('Error parsing permissions JSON:', e.message);
            return null;
          }
        })() 
        : moderatorData.permissions) 
      : null;
    this.createdAt = moderatorData.createdAt || moderatorData.created_at;
    this.updatedAt = moderatorData.updatedAt || moderatorData.updated_at;
  }

  // Find moderator by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM moderators WHERE email = ? AND isActive = TRUE',
        [email]
      );
      return rows.length > 0 ? new Moderator(rows[0]) : null;
    } catch (error) {
      console.error('Error finding moderator by email:', error.message);
      throw error;
    }
  }

  // Find moderator by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM moderators WHERE id = ? AND isActive = TRUE',
        [id]
      );
      return rows.length > 0 ? new Moderator(rows[0]) : null;
    } catch (error) {
      console.error('Error finding moderator by ID:', error.message);
      throw error;
    }
  }

  // Create new moderator
  static async create(moderatorData) {
    try {
      const { 
        firstName, 
        lastName, 
        middleName, 
        address, 
        phone, 
        email, 
        password, 
        permissions = null
      } = moderatorData;
      
      // Validate required fields
      if (!firstName || !lastName || !phone || !email || !password) {
        throw new Error('All required fields must be provided');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        throw new Error('Invalid phone number format');
      }

      const [result] = await pool.execute(
        'INSERT INTO moderators (firstName, middleName, lastName, address, phone, email, password, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          firstName, 
          middleName || null, 
          lastName, 
          address || null, 
          phone, 
          email, 
          password, 
          permissions ? JSON.stringify(permissions) : null
        ]
      );

      return {
        id: result.insertId,
        firstName,
        middleName,
        lastName,
        address,
        phone,
        email,
        permissions,
        isActive: true
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      console.error('Error creating moderator:', error.message);
      throw error;
    }
  }

  // Get moderator data without password
  toJSON() {
    const { password, ...moderatorWithoutPassword } = this;
    return moderatorWithoutPassword;
  }

  // Update moderator permissions
  static async updatePermissions(id, permissions) {
    try {
      const [result] = await pool.execute(
        'UPDATE moderators SET permissions = ? WHERE id = ?',
        [JSON.stringify(permissions), id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating moderator permissions:', error.message);
      throw error;
    }
  }

  // Deactivate moderator
  static async deactivate(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE moderators SET isActive = FALSE WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deactivating moderator:', error.message);
      throw error;
    }
  }

  // Get all active moderators
  static async getAllActive() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, firstName, middleName, lastName, email, phone, address, permissions, created_at FROM moderators WHERE isActive = TRUE ORDER BY created_at DESC'
      );
      return rows.map(row => new Moderator(row));
    } catch (error) {
      console.error('Error getting all active moderators:', error.message);
      throw error;
    }
  }
}

module.exports = Moderator;
