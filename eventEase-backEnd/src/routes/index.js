const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const vendorRoutes = require('./vendors');
const vendorServiceRoutes = require('./vendorServices');
const serviceCategoryRoutes = require('./serviceCategories');
const teamMemberRoutes = require('./teamMembers');
const eventRoutes = require('./events');
const paymentRoutes = require('./payments');
const dashboardRoutes = require('./dashboard');
const vendorDashboardRoutes = require('./vendorDashboard');
const eventTeamMemberRoutes = require('./eventTeamMembers');
const notificationRoutes = require('./notifications');
const chatRoutes = require('./chats');
const moderatorRoutes = require('./moderators');
const userRoutes = require('./users');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/vendor-services', vendorServiceRoutes);
router.use('/service-categories', serviceCategoryRoutes);
router.use('/team-members', teamMemberRoutes);
router.use('/events', eventRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/dashboard', vendorDashboardRoutes);
router.use('/event-team-members', eventTeamMemberRoutes);
router.use('/notifications', notificationRoutes);
router.use('/chats', chatRoutes);
router.use('/moderators', moderatorRoutes);

module.exports = router;
