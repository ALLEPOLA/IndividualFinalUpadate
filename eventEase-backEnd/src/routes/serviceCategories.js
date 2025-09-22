const express = require('express');
const router = express.Router();
const { 
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
  getCategoryByName
} = require('../controllers/serviceCategoryController');
const { authenticateToken } = require('../middleware/auth');

// Create a new service category (admin only)
router.post('/', 
  authenticateToken,
  createCategory
);

// Get all service categories
router.get('/', getAllCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Get category by name
router.get('/name/:name', getCategoryByName);

// Update service category (admin only)
router.put('/:id',
  authenticateToken,
  updateCategory
);

// Delete service category (soft delete - admin only)
router.delete('/:id',
  authenticateToken,
  deleteCategory
);

// Hard delete service category (permanently remove - admin only)
router.delete('/:id/hard',
  authenticateToken,
  hardDeleteCategory
);

module.exports = router;
