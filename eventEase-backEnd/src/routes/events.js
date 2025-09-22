const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');
const { validateEventCreate, validateEventUpdate } = require('../middleware/validation');

// Create a new event
router.post('/', 
  authenticateToken,
  validateEventCreate,
  createEvent
);

// Get all events (admin only)
router.get('/', getAllEvents);

// Get events for authenticated user
router.get('/user/events', 
  authenticateToken,
  getUserEvents
);

// Get events by date range (query parameters: startDate, endDate)
router.get('/date-range', getEventsByDateRange);

// Get events by status
router.get('/status/:status', getEventsByStatus);

// Get event by ID
router.get('/:id', getEventById);

// Get events by vendor ID
router.get('/vendor/:vendorId', getEventsByVendor);

// Update event
router.put('/:id',
  authenticateToken,
  validateEventUpdate,
  updateEvent
);

// Update event status only
router.patch('/:id/status',
  authenticateToken,
  updateEventStatus
);

// Update payment status only
router.patch('/:id/payment-status',
  authenticateToken,
  updatePaymentStatus
);

// Delete event
router.delete('/:id',
  authenticateToken,
  deleteEvent
);

module.exports = router;
