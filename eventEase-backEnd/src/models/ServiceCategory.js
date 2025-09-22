const { pool } = require('../config/db');

class ServiceCategory {
  constructor(categoryData) {
    this.id = categoryData.id;
    this.name = categoryData.name;
    this.description = categoryData.description;
    this.isActive = categoryData.isActive;
    this.createdAt = categoryData.createdAt;
    this.updatedAt = categoryData.updatedAt;
  }

  // Create a new service category
  static async create(categoryData) {
    try {
      const { name, description, isActive } = categoryData;

      // Validate required fields
      if (!name) {
        throw new Error('Category name is required');
      }

      // Check if category name already exists
      const existingCategory = await this.findByName(name);
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      const [result] = await pool.execute(
        'INSERT INTO service_categories (name, description, isActive) VALUES (?, ?, ?)',
        [name, description || null, isActive !== undefined ? isActive : true]
      );

      return {
        id: result.insertId,
        name,
        description,
        isActive: isActive !== undefined ? isActive : true
      };
    } catch (error) {
      console.error('Error creating service category:', error.message);
      throw error;
    }
  }

  // Find category by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM service_categories WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? new ServiceCategory(rows[0]) : null;
    } catch (error) {
      console.error('Error finding category by ID:', error.message);
      throw error;
    }
  }

  // Find category by name
  static async findByName(name) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM service_categories WHERE name = ?',
        [name]
      );
      return rows.length > 0 ? new ServiceCategory(rows[0]) : null;
    } catch (error) {
      console.error('Error finding category by name:', error.message);
      throw error;
    }
  }

  // Get all categories
  static async findAll(includeInactive = false) {
    try {
      let query = 'SELECT * FROM service_categories';
      const params = [];

      if (!includeInactive) {
        query += ' WHERE isActive = ?';
        params.push(true);
      }

      query += ' ORDER BY name ASC';

      const [rows] = await pool.execute(query, params);
      return rows.map(row => new ServiceCategory(row));
    } catch (error) {
      console.error('Error finding all categories:', error.message);
      throw error;
    }
  }

  // Update category
  static async update(id, updateData) {
    try {
      const allowedFields = ['name', 'description', 'isActive'];
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

      // Check if name already exists (excluding current category)
      if (updateData.name) {
        const existingCategory = await this.findByName(updateData.name);
        if (existingCategory && existingCategory.id !== parseInt(id)) {
          throw new Error('Category with this name already exists');
        }
      }

      updateValues.push(id);

      const [result] = await pool.execute(
        `UPDATE service_categories SET ${updateFields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating category:', error.message);
      throw error;
    }
  }

  // Delete category (soft delete by setting isActive to false)
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE service_categories SET isActive = false, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting category:', error.message);
      throw error;
    }
  }

  // Hard delete category (permanently remove from database)
  static async hardDelete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM service_categories WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error hard deleting category:', error.message);
      throw error;
    }
  }

  // Get category data as JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = ServiceCategory;
