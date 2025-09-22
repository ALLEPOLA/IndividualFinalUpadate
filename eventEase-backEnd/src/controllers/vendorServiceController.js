const VendorService = require('../models/VendorService');
const fs = require('fs');
const path = require('path');

// Create a new service
const createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      image_url: req.file ? `/uploads/services/${req.file.filename}` : null
    };

    const service = await VendorService.create(serviceData);
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    if (req.file) {
      // Delete uploaded file if service creation fails
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await VendorService.findAll();
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await VendorService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Get services by vendor ID
const getServicesByVendor = async (req, res) => {
  try {
    const services = await VendorService.findByVendor(req.params.vendorId);
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor services',
      error: error.message
    });
  }
};

// Get services by user ID
const getServicesByUser = async (req, res) => {
  try {
    const services = await VendorService.findByUser(req.params.userId);
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services by user',
      error: error.message
    });
  }
};


// Update service
const updateService = async (req, res) => {
  try {
    const serviceData = { ...req.body };
      
    if (req.file) {
      // Delete old image if it exists
      const oldService = await VendorService.findById(req.params.id);
      if (oldService && oldService.image_url) {
        const oldImagePath = path.join(__dirname, '../../', oldService.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      serviceData.image_url = `/uploads/services/${req.file.filename}`;
    }

    const updatedService = await VendorService.update(req.params.id, serviceData);
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    if (req.file) {
      // Delete uploaded file if update fails
      fs.unlinkSync(req.file.path);
    }
    
    // Handle different error types
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('No valid fields')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    // Get service to find image path
    const service = await VendorService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Delete image file if it exists
    if (service.image_url) {
      const imagePath = path.join(__dirname, '../../', service.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete service from database
    await VendorService.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

// Get services by category
const getServicesByCategory = async (req, res) => {
  try {
    const services = await VendorService.findByCategory(req.params.categoryId);
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services by category',
      error: error.message
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  getServicesByVendor,
  updateService,
  deleteService,
  getServicesByCategory,
  getServicesByUser
};