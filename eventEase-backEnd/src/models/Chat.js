const { pool } = require('../config/db');

class Chat {
  static async create(chatData) {
    const { user_id, vendor_id, event_id } = chatData;
    
    try {
      const query = `
        INSERT INTO chats (user_id, vendor_id, event_id)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
      `;
      
      const [result] = await pool.execute(query, [user_id, vendor_id, event_id]);
      
      return {
        id: result.insertId || result.affectedRows,
        ...chatData,
        is_active: true
      };
    } catch (error) {
      throw new Error(`Error creating chat: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT c.*, 
             v.businessName as vendor_name,
             u.firstName as user_first_name,
             u.lastName as user_last_name,
             e.name as event_name,
             m.content as last_message,
             m.created_at as last_message_at
      FROM chats c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN events e ON c.event_id = e.id
      LEFT JOIN messages m ON c.last_message_id = m.id
      WHERE c.user_id = ? AND c.is_active = TRUE
      ORDER BY c.last_message_at DESC, c.updated_at DESC
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding chats by user ID: ${error.message}`);
    }
  }

  static async findByVendorId(vendorId) {
    const query = `
      SELECT c.*, 
             v.businessName as vendor_name,
             u.firstName as user_first_name,
             u.lastName as user_last_name,
             e.name as event_name,
             m.content as last_message,
             m.created_at as last_message_at
      FROM chats c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN events e ON c.event_id = e.id
      LEFT JOIN messages m ON c.last_message_id = m.id
      WHERE c.vendor_id = ? AND c.is_active = TRUE
      ORDER BY c.last_message_at DESC, c.updated_at DESC
    `;
    
    try {
      const [rows] = await pool.execute(query, [vendorId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding chats by vendor ID: ${error.message}`);
    }
  }

  static async findById(chatId) {
    const query = `
      SELECT c.*, 
             v.businessName as vendor_name,
             u.firstName as user_first_name,
             u.lastName as user_last_name,
             e.name as event_name
      FROM chats c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN events e ON c.event_id = e.id
      WHERE c.id = ? AND c.is_active = TRUE
    `;
    
    try {
      const [rows] = await pool.execute(query, [chatId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding chat by ID: ${error.message}`);
    }
  }

  static async findByUserAndVendor(userId, vendorId, eventId) {
    const query = `
      SELECT c.*, 
             v.businessName as vendor_name,
             u.firstName as user_first_name,
             u.lastName as user_last_name,
             e.name as event_name
      FROM chats c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN events e ON c.event_id = e.id
      WHERE c.user_id = ? AND c.vendor_id = ? AND c.event_id = ? AND c.is_active = TRUE
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId, vendorId, eventId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding chat by user and vendor: ${error.message}`);
    }
  }

  static async updateLastMessage(chatId, messageId) {
    const query = `
      UPDATE chats 
      SET last_message_id = ?, 
          last_message_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      await pool.execute(query, [messageId, chatId]);
    } catch (error) {
      throw new Error(`Error updating last message: ${error.message}`);
    }
  }

  static async incrementUnreadCount(chatId, userType) {
    const field = userType === 'user' ? 'user_unread_count' : 'vendor_unread_count';
    const query = `
      UPDATE chats 
      SET ${field} = ${field} + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      await pool.execute(query, [chatId]);
    } catch (error) {
      throw new Error(`Error incrementing unread count: ${error.message}`);
    }
  }

  static async resetUnreadCount(chatId, userType) {
    const field = userType === 'user' ? 'user_unread_count' : 'vendor_unread_count';
    const query = `
      UPDATE chats 
      SET ${field} = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      await pool.execute(query, [chatId]);
    } catch (error) {
      throw new Error(`Error resetting unread count: ${error.message}`);
    }
  }

  static async getTotalUnreadCount(userId, userType) {
    const field = userType === 'user' ? 'user_unread_count' : 'vendor_unread_count';
    const idField = userType === 'user' ? 'user_id' : 'vendor_id';
    
    const query = `
      SELECT COALESCE(SUM(${field}), 0) as total_unread
      FROM chats 
      WHERE ${idField} = ? AND is_active = TRUE
    `;
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows[0].total_unread;
    } catch (error) {
      throw new Error(`Error getting total unread count: ${error.message}`);
    }
  }
}

module.exports = Chat;
