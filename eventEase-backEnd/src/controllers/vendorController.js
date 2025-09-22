const Vendor = require('../models/Vendor');

// Get all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.status(200).json({
      success: true,
      data: vendors.map(vendor => vendor.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: error.message
    });
  }
};

// Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    res.status(200).json({
      success: true,
      data: vendor.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor',
      error: error.message
    });
  }
};

// Get vendor by user ID
const getVendorByUserId = async (req, res) => {
  try {
    const vendor = await Vendor.findByUserId(req.params.userId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found for this user'
      });
    }
    res.status(200).json({
      success: true,
      data: vendor.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor by user ID',
      error: error.message
    });
  }
};

// Get vendors by city
const getVendorsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const vendors = await Vendor.findByCity(city);
    res.status(200).json({
      success: true,
      data: vendors.map(vendor => vendor.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors by city',
      error: error.message
    });
  }
};

// Get vendors by province
const getVendorsByProvince = async (req, res) => {
  try {
    const { province } = req.params;
    const vendors = await Vendor.findByProvince(province);
    res.status(200).json({
      success: true,
      data: vendors.map(vendor => vendor.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors by province',
      error: error.message
    });
  }
};

// Get vendors by minimum capacity
const getVendorsByCapacity = async (req, res) => {
  try {
    const { capacity } = req.params;
    const minCapacity = parseInt(capacity);
    
    if (isNaN(minCapacity) || minCapacity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid capacity value. Must be a positive number.'
      });
    }

    const vendors = await Vendor.findByMinCapacity(minCapacity);
    res.status(200).json({
      success: true,
      data: vendors.map(vendor => vendor.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors by capacity',
      error: error.message
    });
  }
};

// Search vendors by business name
const searchVendorsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const vendors = await Vendor.searchByName(name);
    res.status(200).json({
      success: true,
      data: vendors.map(vendor => vendor.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching vendors by name',
      error: error.message
    });
  }
};

// Advanced search with multiple filters
const searchVendors = async (req, res) => {
  try {
    const { city, province, minCapacity, name } = req.query;
    let vendors;

    // Start with all vendors and apply filters
    if (city) {
      vendors = await Vendor.findByCity(city);
    } else if (province) {
      vendors = await Vendor.findByProvince(province);
    } else if (name) {
      vendors = await Vendor.searchByName(name);
    } else {
      vendors = await Vendor.findAll();
    }

    // Apply additional filters
    if (minCapacity) {
      const minCap = parseInt(minCapacity);
      if (!isNaN(minCap) && minCap > 0) {
        vendors = vendors.filter(vendor => vendor.capacity >= minCap);
      }
    }

    // If multiple location filters are provided, apply them
    if (city && province) {
      vendors = vendors.filter(vendor => 
        vendor.city.toLowerCase().includes(city.toLowerCase()) &&
        vendor.province.toLowerCase().includes(province.toLowerCase())
      );
    }

    // If name filter is provided along with location, apply it
    if (name && (city || province)) {
      vendors = vendors.filter(vendor =>
        vendor.businessName.toLowerCase().includes(name.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      data: vendors.map(vendor => vendor.toJSON()),
      count: vendors.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching vendors',
      error: error.message
    });
  }
};

// Create vendor (usually done during user registration)
const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating vendor',
      error: error.message
    });
  }
};

// Update vendor
const updateVendor = async (req, res) => {
  try {
    const updated = await Vendor.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Fetch the updated vendor data
    const vendor = await Vendor.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor.toJSON()
    });
  } catch (error) {
    // Handle different error types
    if (error.message.includes('No valid fields')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating vendor',
      error: error.message
    });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const deleted = await Vendor.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting vendor',
      error: error.message
    });
  }
};

module.exports = {
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
};
