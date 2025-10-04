const { pool } = require('../config/db');

class Message {
  static async create(messageData) {
    const { chat_id, sender_id, sender_type, message } = messageData;
    
    try {
      const query = `
        INSERT INTO messages (conversation_id, sender_id, sender_type, content)
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [chat_id, sender_id, sender_type, message]);
      
      return {
        id: result.insertId,
        chat_id,
        sender_id,
        sender_type,
        content: message,
        status: 'sent',
        created_at: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error creating message: ${error.message}`);
    }
  }

  static async findByChatId(chatId, limit = 50, offset = 0) {
    const query = `
      SELECT m.*, 
             u.firstName as sender_first_name,
             u.lastName as sender_last_name,
             v.businessName as sender_business_name
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN vendors v ON m.sender_id = v.userId AND m.sender_type = 'vendor'
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `;
    
    try {
      const [rows] = await pool.execute(query, [chatId]);
      // Apply limit and offset in JavaScript instead of SQL
      return rows.slice(offset, offset + limit);
    } catch (error) {
      throw new Error(`Error finding messages by chat ID: ${error.message}`);
    }
  }

  static async findById(messageId) {
    const query = `
      SELECT m.*, 
             u.firstName as sender_first_name,
             u.lastName as sender_last_name,
             v.businessName as sender_business_name
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN vendors v ON m.sender_id = v.userId AND m.sender_type = 'vendor'
      WHERE m.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [messageId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding message by ID: ${error.message}`);
    }
  }

  static async updateStatus(messageId, status) {
    const query = `
      UPDATE messages 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      await pool.execute(query, [status, messageId]);
    } catch (error) {
      throw new Error(`Error updating message status: ${error.message}`);
    }
  }

  static async markAsRead(chatId, userId, userType) {
    const query = `
      UPDATE messages 
      SET is_read = 1, updated_at = CURRENT_TIMESTAMP
      WHERE conversation_id = ? AND sender_id != ? AND sender_type != ?
    `;
    
    try {
      await pool.execute(query, [chatId, userId, userType]);
    } catch (error) {
      throw new Error(`Error marking messages as read: ${error.message}`);
    }
  }

  static async getUnreadCount(chatId, userId, userType) {
    const query = `
      SELECT COUNT(*) as unread_count
      FROM messages 
      WHERE conversation_id = ? AND sender_id != ? AND sender_type != ? AND is_read = 0
    `;
    
    try {
      const [rows] = await pool.execute(query, [chatId, userId, userType]);
      return rows[0].unread_count;
    } catch (error) {
      throw new Error(`Error getting unread count: ${error.message}`);
    }
  }
}

module.exports = Message;
