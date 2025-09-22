const Notification = require('../models/Notification');

// Get notifications for authenticated user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0, unreadOnly = false } = req.query;

    // Ensure limit and offset are valid numbers
    const parsedLimit = Math.max(1, Math.min(parseInt(limit) || 50, 100)); // Max 100, min 1
    const parsedOffset = Math.max(0, parseInt(offset) || 0);

    let notifications;

    if (unreadOnly === 'true') {
      // Get only unread notifications
      const allNotifications = await Notification.findByUserId(userId, parsedLimit, parsedOffset);
      notifications = allNotifications.filter(notification => !notification.isRead);
    } else {
      notifications = await Notification.findByUserId(userId, parsedLimit, parsedOffset);
    }

    // Transform notifications to match frontend format
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      timestamp: notification.createdAt.toISOString()
    }));

    res.status(200).json({
      success: true,
      data: formattedNotifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Get unread notifications count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting unread count',
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const success = await Notification.markAsRead(notificationId, userId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or already read'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const affectedRows = await Notification.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: `${affectedRows} notifications marked as read`
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Delete notification (optional - for user to dismiss)
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    // First check if notification belongs to user
    const notification = await Notification.findById(notificationId);
    if (!notification || notification.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // In a real implementation, you'd have a delete method in the model
    // For now, we'll just mark as read (soft delete)
    await Notification.markAsRead(notificationId, userId);

    res.status(200).json({
      success: true,
      message: 'Notification dismissed'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};