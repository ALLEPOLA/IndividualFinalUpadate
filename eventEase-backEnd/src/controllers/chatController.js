const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { pool } = require('../config/db');

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.role;
    
    let chats;
    if (userType === 'user') {
      console.log('Calling Chat.findByUserId for user:', userId);
      chats = await Chat.findByUserId(userId);
      console.log('Found chats for user:', chats);
    } else if (userType === 'vendor') {
      // Get vendor ID from user ID
      const vendorQuery = 'SELECT id FROM vendors WHERE userId = ?';
      const [vendorRows] = await pool.execute(vendorQuery, [userId]);
      
      if (vendorRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }
      
      chats = await Chat.findByVendorId(vendorRows[0].id);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message
    });
  }
};

// Get or create a chat between user and vendor for an event
const getOrCreateChat = async (req, res) => {
  try {
    const { vendor_id, event_id } = req.body;
    const userId = req.user.id;
    const userType = req.user.role;
    
    console.log('Creating/getting chat for:', { vendor_id, event_id, userId, userType });
    
    // Validate that the user has an event with this vendor
    const eventQuery = `
      SELECT e.*, v.userId as vendor_user_id
      FROM events e
      JOIN vendors v ON e.vendor_id = v.id
      WHERE e.id = ? AND e.vendor_id = ? AND e.user_id = ?
    `;
    
    console.log('Executing event query with params:', [event_id, vendor_id, userId]);
    const [eventRows] = await pool.execute(eventQuery, [event_id, vendor_id, userId]);
    console.log('Event query result:', eventRows);
    
    if (eventRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or access denied'
      });
    }
    
    // Find existing chat or create new one
    console.log('Looking for existing chat...');
    let chat = await Chat.findByUserAndVendor(userId, vendor_id, event_id);
    console.log('Existing chat found:', chat);
    
    if (!chat) {
      console.log('Creating new chat...');
      chat = await Chat.create({
        user_id: userId,
        vendor_id: vendor_id,
        event_id: event_id
      });
      console.log('New chat created:', chat);
    }
    
    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error getting or creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting or creating chat',
      error: error.message
    });
  }
};

// Get messages for a chat
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;
    const userType = req.user.role;
    
    // Verify user has access to this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check access permissions
    if (userType === 'user' && chat.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (userType === 'vendor') {
      const vendorQuery = 'SELECT id FROM vendors WHERE userId = ?';
      const [vendorRows] = await pool.execute(vendorQuery, [userId]);
      
      if (vendorRows.length === 0 || chat.vendor_id !== vendorRows[0].id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }
    
    const messages = await Message.findByChatId(chatId, parseInt(limit), parseInt(offset));
    
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;
    const userType = req.user.role;
    
    console.log('Sending message to chat:', chatId, 'message:', message, 'user:', userId, 'type:', userType);
    
    // Verify user has access to this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check access permissions
    if (userType === 'user' && chat.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (userType === 'vendor') {
      const vendorQuery = 'SELECT id FROM vendors WHERE userId = ?';
      const [vendorRows] = await pool.execute(vendorQuery, [userId]);
      
      if (vendorRows.length === 0 || chat.vendor_id !== vendorRows[0].id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }
    
    // Create message
    const messageData = {
      chat_id: chatId,
      sender_id: userId,
      sender_type: userType,
      message: message
    };
    
    const newMessage = await Message.create(messageData);
    
    // Update chat's last message
    await Chat.updateLastMessage(chatId, newMessage.id);
    
    // Increment unread count for the recipient
    const recipientType = userType === 'user' ? 'vendor' : 'user';
    await Chat.incrementUnreadCount(chatId, recipientType);
    
    // Emit message via WebSocket to chat room
    const io = req.app.get('io');
    
    io.to(`chat_${chatId}`).emit('new_message', {
      chatId: chatId,
      message: newMessage,
      sender: {
        id: userId,
        type: userType,
        name: userType === 'user' ? 
          `${req.user.firstName} ${req.user.lastName}` : 
          chat.vendor_name
      }
    });
    
    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const userType = req.user.role;
    
    // Verify user has access to this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check access permissions
    if (userType === 'user' && chat.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (userType === 'vendor') {
      const vendorQuery = 'SELECT id FROM vendors WHERE userId = ?';
      const [vendorRows] = await pool.execute(vendorQuery, [userId]);
      
      if (vendorRows.length === 0 || chat.vendor_id !== vendorRows[0].id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }
    
    // Mark messages as read
    await Message.markAsRead(chatId, userId, userType);
    
    // Reset unread count
    await Chat.resetUnreadCount(chatId, userType);
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

// Get total unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.role;
    
    console.log('Getting unread count for user:', userId, 'type:', userType);
    
    let totalUnread = 0;
    
    if (userType === 'vendor') {
      const vendorQuery = 'SELECT id FROM vendors WHERE userId = ?';
      const [vendorRows] = await pool.execute(vendorQuery, [userId]);
      
      console.log('Vendor rows:', vendorRows);
      
      if (vendorRows.length > 0) {
        totalUnread = await Chat.getTotalUnreadCount(vendorRows[0].id, 'vendor');
      }
    } else {
      totalUnread = await Chat.getTotalUnreadCount(userId, 'user');
    }
    
    console.log('Total unread count:', totalUnread);
    
    res.status(200).json({
      success: true,
      data: { unreadCount: totalUnread }
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

module.exports = {
  getUserChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
};
