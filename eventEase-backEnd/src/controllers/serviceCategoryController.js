const ServiceCategory = require('../models/ServiceCategory');

// Create a new service category
const createCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Service category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service category',
      error: error.message
    });
  }
};

// Get all service categories
const getAllCategories = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await ServiceCategory.findAll(includeInactive);
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service categories',
      error: error.message
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service category',
      error: error.message
    });
  }
};

// Update service category
const updateCategory = async (req, res) => {
  try {
    const updated = await ServiceCategory.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    // Fetch updated category
    const category = await ServiceCategory.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Service category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service category',
      error: error.message
    });
  }
};

// Delete service category (soft delete)
const deleteCategory = async (req, res) => {
  try {
    const deleted = await ServiceCategory.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service category',
      error: error.message
    });
  }
};

// Hard delete service category (permanently remove)
const hardDeleteCategory = async (req, res) => {
  try {
    const deleted = await ServiceCategory.hardDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service category permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting service category',
      error: error.message
    });
  }
};

// Get category by name
const getCategoryByName = async (req, res) => {
  try {
    const category = await ServiceCategory.findByName(req.params.name);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service category',
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
  getCategoryByName
};
