const Event = require('../models/Event');

// Create a new event
const createEvent = async (req, res) => {
  try {
    // Add user_id from authenticated user
    const eventData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const event = await Event.create(eventData);
    
    // Send notification to vendors and admins
    await req.notificationService.notifyEventCreated(event, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events (admin only - for all users)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get events for authenticated user
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.findByUserId(req.user.id);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user events',
      error: error.message
    });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Get events by vendor ID
const getEventsByVendor = async (req, res) => {
  try {
    const events = await Event.findByVendor(req.params.vendorId);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor events',
      error: error.message
    });
  }
};

// Get events by status
const getEventsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, cancelled'
      });
    }

    const events = await Event.findByStatus(status);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events by status',
      error: error.message
    });
  }
};

// Get events by date range
const getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }

    const events = await Event.findByDateRange(startDate, endDate);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events by date range',
      error: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    // Get the event before update to check for vendor assignment
    const eventBeforeUpdate = await Event.findById(req.params.id);
    
    const updatedEvent = await Event.update(req.params.id, req.body);
    
    // Check if vendor was assigned
    if (req.body.vendor_id && (!eventBeforeUpdate.vendor_id || eventBeforeUpdate.vendor_id !== req.body.vendor_id)) {
      await req.notificationService.notifyVendorAssigned(updatedEvent, req.body.vendor_id);
    }
    
    // Send general event update notification
    await req.notificationService.notifyEventUpdated(updatedEvent, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
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
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Update event status
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, cancelled'
      });
    }

    const updatedEvent = await Event.updateStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: 'Event status updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating event status',
      error: error.message
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status } = req.body;
    const validPaymentStatuses = ['pending', 'advance_paid', 'fully_paid'];
    
    if (!payment_status || !validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status. Must be one of: pending, advance_paid, fully_paid'
      });
    }

    const updatedEvent = await Event.updatePaymentStatus(req.params.id, payment_status);
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    await Event.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getUserEvents,
  getEventById,
  getEventsByVendor,
  getEventsByStatus,
  getEventsByDateRange,
  updateEvent,
  updateEventStatus,
  updatePaymentStatus,
  deleteEvent
};
