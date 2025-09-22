const { pool } = require('../config/db');

class Notification {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.data = data.data;
    this.isRead = data.is_read;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new notification
  static async create(notificationData) {
    const { userId, type, title, message, data } = notificationData;

    try {
      const dataJson = data ? JSON.stringify(data) : null;

      const query = `
        INSERT INTO notifications (user_id, type, title, message, data)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [userId, type, title, message, dataJson]);

      return result.insertId;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notifications for a user
  static async findByUserId(userId, limit = 50, offset = 0) {
    try {
      // Ensure limit and offset are safe integers
      const safeLimit = Math.max(1, Math.min(parseInt(limit) || 50, 1000));
      const safeOffset = Math.max(0, parseInt(offset) || 0);
      
      // Fetch all notifications for the user (without LIMIT/OFFSET to avoid prepared statement issues)
      const query = `
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;

      const [rows] = await pool.execute(query, [userId]);
      
      // Apply pagination in JavaScript
      const paginatedRows = rows.slice(safeOffset, safeOffset + safeLimit);

      return paginatedRows.map(row => new Notification(row));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread notifications count for a user
  static async getUnreadCount(userId) {
    try {
      const query = `
        SELECT COUNT(*) as count FROM notifications
        WHERE user_id = ? AND is_read = FALSE
      `;

      const [rows] = await pool.execute(query, [userId]);

      return rows[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `;

      const [result] = await pool.execute(query, [notificationId, userId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND is_read = FALSE
      `;

      const [result] = await pool.execute(query, [userId]);

      return result.affectedRows;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete old read notifications (cleanup)
  static async deleteOldReadNotifications(daysOld = 30) {
    try {
      const query = `
        DELETE FROM notifications
        WHERE is_read = TRUE AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
      `;

      const [result] = await pool.execute(query, [daysOld]);

      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      throw error;
    }
  }

  // Get notification by ID
  static async findById(notificationId) {
    try {
      const query = `SELECT * FROM notifications WHERE id = ?`;

      const [rows] = await pool.execute(query, [notificationId]);

      return rows.length > 0 ? new Notification(rows[0]) : null;
    } catch (error) {
      console.error('Error finding notification:', error);
      throw error;
    }
  }
}

module.exports = Notification;