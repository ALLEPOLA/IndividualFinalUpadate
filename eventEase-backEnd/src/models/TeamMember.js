const { pool } = require('../config/db');

class TeamMember {
  constructor(teamMemberData) {
    this.id = teamMemberData.id;
    this.vendor_id = teamMemberData.vendor_id;
    this.name = teamMemberData.name;
    this.email = teamMemberData.email;
    this.phone = teamMemberData.phone;
    this.role = teamMemberData.role;
    this.hourly_rate = teamMemberData.hourly_rate;
    this.is_active = teamMemberData.is_active;
    this.created_at = teamMemberData.created_at;
    this.updated_at = teamMemberData.updated_at;
  }

  // Create a new team member
  static async create(teamMemberData) {
    const {
      vendor_id,
      name,
      email,
      phone,
      role,
      hourly_rate
    } = teamMemberData;

    const query = `
      INSERT INTO team_member 
      (vendor_id, name, email, phone, role, hourly_rate, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    try {
      const [result] = await pool.execute(query, [
        vendor_id,
        name,
        email,
        phone || null,
        role,
        hourly_rate || null,
        true
      ]);

      return { id: result.insertId, ...teamMemberData, is_active: true };
    } catch (error) {
      throw new Error(`Error creating team member: ${error.message}`);
    }
  }

  // Find team member by ID
  static async findById(id) {
    const query = `
      SELECT tm.*, v.businessName as vendor_business_name 
      FROM team_member tm
      LEFT JOIN vendors v ON tm.vendor_id = v.id
      WHERE tm.id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] ? new TeamMember(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding team member: ${error.message}`);
    }
  }

  // Find team members by vendor ID (includes both active and inactive)
  static async findByVendor(vendorId) {
    const query = `
      SELECT tm.*, v.businessName as vendor_business_name 
      FROM team_member tm
      LEFT JOIN vendors v ON tm.vendor_id = v.id
      WHERE tm.vendor_id = ?
      ORDER BY tm.is_active DESC, tm.created_at DESC
    `;

    try {
      const [rows] = await pool.execute(query, [vendorId]);
      return rows.map(row => new TeamMember(row));
    } catch (error) {
      throw new Error(`Error finding team members by vendor: ${error.message}`);
    }
  }

  // Find all team members with pagination and filters
  static async findAll(options = {}) {
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
      } = options;

      // Ensure page and limit are integers
      const pageInt = parseInt(page) || 1;
      const limitInt = parseInt(limit) || 10;
      const offset = (pageInt - 1) * limitInt;
      
      // Validate and sanitize sort parameters
      const allowedSortFields = ['created_at', 'updated_at', 'name', 'email', 'role', 'hourly_rate'];
      const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
      const safeSortOrder = ['ASC', 'DESC'].includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';
      
      let whereConditions = [];
      let queryParams = [];

      // Build WHERE conditions
      if (vendor_id !== undefined && vendor_id !== null) {
        whereConditions.push('tm.vendor_id = ?');
        queryParams.push(parseInt(vendor_id));
      }
      if (role && role.trim() !== '') {
        whereConditions.push('tm.role = ?');
        queryParams.push(role.trim());
      }
      if (is_active !== undefined && is_active !== null) {
        whereConditions.push('tm.is_active = ?');
        queryParams.push(is_active === true || is_active === 'true' ? 1 : 0);
      }
      if (search && search.trim() !== '') {
        whereConditions.push('(tm.name LIKE ? OR tm.email LIKE ? OR tm.role LIKE ?)');
        const searchTerm = `%${search.trim()}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM team_member tm
        LEFT JOIN vendors v ON tm.vendor_id = v.id
        ${whereClause}
      `;

      // Data query - using safe parameters
      const dataQuery = `
        SELECT tm.*, v.businessName as vendor_business_name 
        FROM team_member tm
        LEFT JOIN vendors v ON tm.vendor_id = v.id
        ${whereClause}
        ORDER BY tm.${safeSortBy} ${safeSortOrder}
        LIMIT ? OFFSET ?
      `;

      const [countResult] = await pool.execute(countQuery, queryParams);
      const [dataResult] = await pool.execute(dataQuery, [...queryParams, limitInt, offset]);

      return {
        data: dataResult.map(row => new TeamMember(row)),
        total: countResult[0].total,
        page: pageInt,
        limit: limitInt,
        totalPages: Math.ceil(countResult[0].total / limitInt)
      };
    } catch (error) {
      console.error('TeamMember.findAll error:', error);
      throw new Error(`Error finding team members: ${error.message}`);
    }
  }

  // Update team member
  static async update(id, updateData) {
    // Define allowed fields for update
    const allowedFields = [
      'name', 'email', 'phone', 'role', 'hourly_rate', 'is_active'
    ];

    // Filter only allowed fields
    const updateFields = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields[key] = updateData[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields to update');
    }

    const fields = Object.keys(updateFields)
      .map(key => `${key} = ?`)
      .join(', ');

    const query = `
      UPDATE team_member 
      SET ${fields}, updated_at = NOW()
      WHERE id = ?
    `;

    try {
      const values = [...Object.values(updateFields), id];
      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error('Team member not found');
      }

      // Return the updated team member data
      const updatedMember = await this.findById(id);
      return updatedMember;
    } catch (error) {
      throw new Error(`Error updating team member: ${error.message}`);
    }
  }

  // Delete team member
  static async delete(id) {
    const query = 'DELETE FROM team_member WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('Team member not found');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting team member: ${error.message}`);
    }
  }

  // Check if email exists for vendor
  static async emailExistsForVendor(email, vendorId, excludeId = null) {
    let query = 'SELECT id FROM team_member WHERE email = ? AND vendor_id = ? AND is_active = true';
    let params = [email, vendorId];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    try {
      const [rows] = await pool.execute(query, params);
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking email existence: ${error.message}`);
    }
  }

  // Get team member data as JSON
  toJSON() {
    return {
      id: this.id,
      vendor_id: this.vendor_id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      hourly_rate: this.hourly_rate,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      vendor_business_name: this.vendor_business_name
    };
  }
}

module.exports = TeamMember;
