const express = require('express');
const router = express.Router();
const { authenticateToken, userAndAbove } = require('../middleware/auth');
const {
  getUserChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
} = require('../controllers/chatController');

// All routes require authentication
router.use(authenticateToken);
router.use(userAndAbove);

// Get all chats for the authenticated user
router.get('/', getUserChats);

// Get or create a chat between user and vendor for an event
router.post('/', getOrCreateChat);

// Get messages for a specific chat
router.get('/:chatId/messages', getChatMessages);

// Send a message in a chat
router.post('/:chatId/messages', sendMessage);

// Mark messages as read in a chat
router.put('/:chatId/read', markAsRead);

// Get total unread message count
router.get('/unread-count', getUnreadCount);

module.exports = router;
