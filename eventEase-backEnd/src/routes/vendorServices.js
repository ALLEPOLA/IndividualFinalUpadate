const express = require('express');
const router = express.Router();
const { 
  createService,
  getAllServices,
  getServiceById,
  getServicesByVendor,
  updateService,
  deleteService,
  getServicesByCategory,
  getServicesByUser
} = require('../controllers/vendorServiceController');
const upload = require('../middleware/uploadMiddleware');
const { authenticateToken } = require('../middleware/auth');
const { validateVendorService } = require('../middleware/validation');

// Create a new service
router.post('/', 
  authenticateToken,
  upload.single('image'),
  validateVendorService,
  createService
);

// Get all services
router.get('/', getAllServices);

// Get service by ID
router.get('/:id', getServiceById);

// Get services by vendor ID
router.get('/vendor/:vendorId', getServicesByVendor);

// Get services by user ID
router.get('/user/:userId', authenticateToken, getServicesByUser);

// Get services by category
router.get('/category/:categoryId', getServicesByCategory);

// Update service
router.put('/:id',
  authenticateToken,
  upload.single('image'),
  validateVendorService,
  updateService
);

// Delete service
router.delete('/:id',
  authenticateToken,
  deleteService
);

module.exports = router;