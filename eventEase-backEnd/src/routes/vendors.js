const express = require('express');
const router = express.Router();
const { 
  getAllVendors,
  getVendorById,
  getVendorByUserId,
  getVendorsByCity,
  getVendorsByProvince,
  getVendorsByCapacity,
  searchVendorsByName,
  searchVendors,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendorController');
const { authenticateToken } = require('../middleware/auth');
const { validateVendorCreate, validateVendorUpdate } = require('../middleware/validation');

// Public routes (no authentication required)

// Get all vendors
router.get('/', getAllVendors);

// Advanced search with multiple filters
// GET /vendors/search?city=Toronto&minCapacity=100&name=Event
router.get('/search', searchVendors);

// Get vendors by city
// GET /vendors/city/Toronto
router.get('/city/:city', getVendorsByCity);

// Get vendors by province
// GET /vendors/province/Ontario
router.get('/province/:province', getVendorsByProvince);

// Get vendors by minimum capacity
// GET /vendors/capacity/100
router.get('/capacity/:capacity', getVendorsByCapacity);

// Search vendors by business name
// GET /vendors/name/Elite
router.get('/name/:name', searchVendorsByName);

// Get vendor by ID
router.get('/:id', getVendorById);

// Protected routes (authentication required)

// Get vendor by user ID
router.get('/user/:userId', authenticateToken, getVendorByUserId);

// Create a new vendor
router.post('/', 
  authenticateToken,
  validateVendorCreate,
  createVendor
);

// Update vendor
router.put('/:id',
  authenticateToken,
  validateVendorUpdate,
  updateVendor
);

// Delete vendor
router.delete('/:id',
  authenticateToken,
  deleteVendor
);

module.exports = router;
