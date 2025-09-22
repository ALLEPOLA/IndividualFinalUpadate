const { pool } = require('../config/db');

class VendorService {
  static async create(serviceData) {
    const {
      vendor_id,
      category_id,
      user_id,
      name,
      description,
      base_price,
      price_per_hour,
      capacity,
      advance_percentage,
      isActive,
      image_url
    } = serviceData;

    const query = `
      INSERT INTO vendor_services 
      (vendor_id, category_id, user_id, name, description, base_price, 
       price_per_hour, capacity, advance_percentage, isActive, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [
        vendor_id,
        category_id,
        user_id,
        name,
        description,
        base_price,
        price_per_hour,
        capacity,
        advance_percentage,
        isActive,
        image_url
      ]);

      return { id: result.insertId, ...serviceData };
    } catch (error) {
      throw new Error(`Error creating vendor service: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = `
      SELECT vs.*, sc.name as category_name 
      FROM vendor_services vs
      JOIN service_categories sc ON vs.category_id = sc.id
      WHERE vs.id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding vendor service: ${error.message}`);
    }
  }

  static async findByVendor(vendorId) {
    const query = `
      SELECT vs.*, sc.name as category_name 
      FROM vendor_services vs
      JOIN service_categories sc ON vs.category_id = sc.id
      WHERE vs.vendor_id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [vendorId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding vendor services: ${error.message}`);
    }
  }

  static async findByUser(userId) {
    const query = `
      SELECT vs.*, sc.name as category_name 
      FROM vendor_services vs
      JOIN service_categories sc ON vs.category_id = sc.id
      WHERE vs.user_id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding user services: ${error.message}`);
    }
  }

  static async update(id, serviceData) {
    // Define allowed fields for update
    const allowedFields = [
      'name', 'description', 'category_id', 'base_price', 
      'price_per_hour', 'capacity', 'advance_percentage', 
      'isActive', 'image_url'
    ];

    // Filter only allowed fields
    const updateFields = {};
    Object.keys(serviceData).forEach(key => {
      if (allowedFields.includes(key) && serviceData[key] !== undefined) {
        updateFields[key] = serviceData[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields to update');
    }

    const fields = Object.keys(updateFields)
      .map(key => `${key} = ?`)
      .join(', ');

    const query = `
      UPDATE vendor_services 
      SET ${fields}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      const values = [...Object.values(updateFields), id];
      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error('Vendor service not found');
      }

      // Return the updated service data
      const updatedService = await this.findById(id);
      return updatedService;
    } catch (error) {
      throw new Error(`Error updating vendor service: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM vendor_services WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error('Vendor service not found');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting vendor service: ${error.message}`);
    }
  }

  static async findAll() {
    const query = `
      SELECT vs.*, sc.name as category_name 
      FROM vendor_services vs
      JOIN service_categories sc ON vs.category_id = sc.id
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error finding all vendor services: ${error.message}`);
    }
  }

  static async findByCategory(categoryId) {
    const query = `
      SELECT vs.*, sc.name as category_name 
      FROM vendor_services vs
      JOIN service_categories sc ON vs.category_id = sc.id
      WHERE vs.category_id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [categoryId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding services by category: ${error.message}`);
    }
  }

  static async findByUser(userId) {
    const query = `
      SELECT vs.*, sc.name as category_name 
      FROM vendor_services vs
      JOIN service_categories sc ON vs.category_id = sc.id
      WHERE vs.user_id = ?
    `;
  
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding vendor services by user: ${error.message}`);
    }
  }
  
}

module.exports = VendorService;