// Notification Service
// Handles WebSocket notifications for the application

const Notification = require('../models/Notification');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  // Save notification to database
  async saveNotification(userId, type, title, message, data = null) {
    try {
      const notificationId = await Notification.create({
        userId,
        type,
        title,
        message,
        data
      });
      return notificationId;
    } catch (error) {
      console.error('Error saving notification:', error);
      throw error;
    }
  }

  // Send notification to specific user (both real-time and stored)
  async sendToUser(userId, event, data) {
    // Send real-time notification if user is connected
    this.io.to(`user_${userId}`).emit(event, data);

    // Save to database for offline users
    if (event === 'notification') {
      await this.saveNotification(userId, data.type, data.title, data.message, data.data);
    }
  }

  // Send notification to all users with specific role (both real-time and stored)
  async sendToRole(role, event, data) {
    // Send real-time notification
    this.io.to(`role_${role}`).emit(event, data);

    // For stored notifications, we need to get all users with this role
    // This is handled by individual sendToUser calls in the notification methods
  }

  // Send notification to all connected users
  sendToAll(event, data) {
    this.io.emit(event, data);
  }

  // Send notification to multiple users
  async sendToUsers(userIds, event, data) {
    for (const userId of userIds) {
      await this.sendToUser(userId, event, data);
    }
  }

  // Predefined notification types
  async notifyEventCreated(eventData, creatorId) {
    const notification = {
      type: 'EVENT_CREATED',
      title: 'New Event Created',
      message: `Event "${eventData.name || eventData.title}" has been created`,
      data: eventData,
      timestamp: new Date().toISOString()
    };

    // Notify all vendors and admins
    await this.sendToRole('vendor', 'notification', notification);
    await this.sendToRole('admin', 'notification', notification);

    // Also save to database for vendors and admins
    // Note: In a real implementation, you'd get all vendor/admin user IDs from database
    // For now, we'll rely on real-time notifications and the role-based rooms
  }

  async notifyEventUpdated(eventData, updaterId) {
    const notification = {
      type: 'EVENT_UPDATED',
      title: 'Event Updated',
      message: `Event "${eventData.name || eventData.title}" has been updated`,
      data: eventData,
      timestamp: new Date().toISOString()
    };

    // Notify event creator and assigned vendor
    await this.sendToUser(eventData.user_id || eventData.userId, 'notification', notification);
    if (eventData.vendor_id || eventData.vendorId) {
      await this.sendToUser(eventData.vendor_id || eventData.vendorId, 'notification', notification);
    }
  }

  async notifyPaymentReceived(paymentData, userId) {
    const notification = {
      type: 'PAYMENT_RECEIVED',
      title: 'Payment Received',
      message: `Payment of $${paymentData.amount} has been received`,
      data: paymentData,
      timestamp: new Date().toISOString()
    };

    await this.sendToUser(userId, 'notification', notification);
  }

  async notifyVendorAssigned(eventData, vendorId) {
    const notification = {
      type: 'VENDOR_ASSIGNED',
      title: 'Vendor Assigned',
      message: `You have been assigned to event "${eventData.name || eventData.title}"`,
      data: eventData,
      timestamp: new Date().toISOString()
    };

    await this.sendToUser(vendorId, 'notification', notification);
  }

  async notifyTeamMemberAdded(eventData, teamMemberData) {
    const notification = {
      type: 'TEAM_MEMBER_ADDED',
      title: 'Team Member Added',
      message: `${teamMemberData.name} has been added to event "${eventData.name || eventData.title}"`,
      data: { event: eventData, teamMember: teamMemberData },
      timestamp: new Date().toISOString()
    };

    // Notify event creator
    await this.sendToUser(eventData.user_id || eventData.userId, 'notification', notification);
  }

  async notifyServiceBooked(bookingData, userId, vendorId) {
    const notification = {
      type: 'SERVICE_BOOKED',
      title: 'Service Booked',
      message: `New service booking received`,
      data: bookingData,
      timestamp: new Date().toISOString()
    };

    // Notify vendor
    await this.sendToUser(vendorId, 'notification', notification);
  }

  async notifyUserLogin(userData) {
    console.log('🔔 Creating login notification for user:', userData.id, userData.firstName);
    const notification = {
      type: 'USER_LOGIN',
      title: 'Welcome back!',
      message: `Hello ${userData.firstName}, you have successfully logged in.`,
      data: {
        userId: userData.id,
        loginTime: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    await this.sendToUser(userData.id, 'notification', notification);
    console.log('✅ Login notification sent to user:', userData.id);
  }
}

module.exports = NotificationService;