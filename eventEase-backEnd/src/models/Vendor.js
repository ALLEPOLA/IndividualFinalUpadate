const { pool } = require('../config/db');

class Vendor {
  constructor(vendorData) {
    this.id = vendorData.id;
    this.userId = vendorData.userId;
    this.businessName = vendorData.businessName;
    this.description = vendorData.description;
    this.address = vendorData.address;
    this.city = vendorData.city;
    this.province = vendorData.province;
    this.postalCode = vendorData.postalCode;
    this.capacity = vendorData.capacity;
    this.websiteUrl = vendorData.websiteUrl;
    this.businessRegistrationNumber = vendorData.businessRegistrationNumber;
    this.businessLicenseNumber = vendorData.businessLicenseNumber;
    this.createdAt = vendorData.createdAt;
    this.updatedAt = vendorData.updatedAt;
    
    // User information (if available from JOIN query)
    this.user = vendorData.firstName ? {
      firstName: vendorData.firstName,
      lastName: vendorData.lastName,
      email: vendorData.email,
      phone: vendorData.phone
    } : null;
  }

  // Create vendor by user ID
  static async create(vendorData) {
    try {
      const {
        userId,
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
      } = vendorData;

      // Validate required fields
      if (!userId || !businessName || !description || !address || !city || 
          !province || !postalCode || !capacity || !businessRegistrationNumber || 
          !businessLicenseNumber) {
        throw new Error('All required vendor fields must be provided');
      }

      // Validate capacity is a number
      if (isNaN(capacity) || capacity <= 0) {
        throw new Error('Capacity must be a positive number');
      }

      // Validate postal code format (basic validation)
      const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
      if (!postalCodeRegex.test(postalCode)) {
        throw new Error('Invalid postal code format');
      }

      const [result] = await pool.execute(
        `INSERT INTO vendors (
          userId, businessName, description, address, city, province, 
          postalCode, capacity, websiteUrl, businessRegistrationNumber, 
          businessLicenseNumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          businessName,
          description,
          address,
          city,
          province,
          postalCode,
          capacity,
          websiteUrl || null,
          businessRegistrationNumber,
          businessLicenseNumber
        ]
      );

      return {
        id: result.insertId,
        userId,
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
      };
    } catch (error) {
      console.error('Error creating vendor:', error.message);
      throw error;
    }
  }

  // Find vendor by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM vendors WHERE userId = ?',
        [userId]
      );
      return rows.length > 0 ? new Vendor(rows[0]) : null;
    } catch (error) {
      console.error('Error finding vendor by user ID:', error.message);
      throw error;
    }
  }

  // Find vendor by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          v.*,
          u.firstName,
          u.lastName,
          u.email,
          u.phone
        FROM vendors v
        LEFT JOIN users u ON v.userId = u.id
        WHERE v.id = ?
      `, [id]);
      return rows.length > 0 ? new Vendor(rows[0]) : null;
    } catch (error) {
      console.error('Error finding vendor by ID:', error.message);
      throw error;
    }
  }

  // Update vendor information
  static async update(id, updateData) {
    try {
      const allowedFields = [
        'businessName', 'description', 'address', 'city', 'province',
        'postalCode', 'capacity', 'websiteUrl', 'businessRegistrationNumber',
        'businessLicenseNumber'
      ];

      const updateFields = [];
      const updateValues = [];

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(updateData[key]);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateValues.push(id);

      const [result] = await pool.execute(
        `UPDATE vendors SET ${updateFields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating vendor:', error.message);
      throw error;
    }
  }

  // Find all vendors
  static async findAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          v.*,
          u.firstName,
          u.lastName,
          u.email,
          u.phone
        FROM vendors v
        LEFT JOIN users u ON v.userId = u.id
        ORDER BY v.businessName ASC
      `);
      return rows.map(row => new Vendor(row));
    } catch (error) {
      console.error('Error finding all vendors:', error.message);
      throw error;
    }
  }

  // Find vendors by city
  static async findByCity(city) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM vendors WHERE LOWER(city) LIKE LOWER(?) ORDER BY businessName ASC',
        [`%${city}%`]
      );
      return rows.map(row => new Vendor(row));
    } catch (error) {
      console.error('Error finding vendors by city:', error.message);
      throw error;
    }
  }

  // Find vendors by province
  static async findByProvince(province) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM vendors WHERE LOWER(province) LIKE LOWER(?) ORDER BY businessName ASC',
        [`%${province}%`]
      );
      return rows.map(row => new Vendor(row));
    } catch (error) {
      console.error('Error finding vendors by province:', error.message);
      throw error;
    }
  }

  // Find vendors by minimum capacity
  static async findByMinCapacity(minCapacity) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM vendors WHERE capacity >= ? ORDER BY capacity ASC',
        [minCapacity]
      );
      return rows.map(row => new Vendor(row));
    } catch (error) {
      console.error('Error finding vendors by capacity:', error.message);
      throw error;
    }
  }

  // Search vendors by business name
  static async searchByName(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM vendors WHERE LOWER(businessName) LIKE LOWER(?) ORDER BY businessName ASC',
        [`%${searchTerm}%`]
      );
      return rows.map(row => new Vendor(row));
    } catch (error) {
      console.error('Error searching vendors by name:', error.message);
      throw error;
    }
  }

  // Delete vendor
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM vendors WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting vendor:', error.message);
      throw error;
    }
  }

  // Get vendor data as JSON
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      businessName: this.businessName,
      description: this.description,
      address: this.address,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
      capacity: this.capacity,
      websiteUrl: this.websiteUrl,
      businessRegistrationNumber: this.businessRegistrationNumber,
      businessLicenseNumber: this.businessLicenseNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Vendor;
