// ChatWindow Component
// Main chat interface with message list and input

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ChevronDown, MessageCircle } from 'lucide-react';
import chatService, { type Chat, type Message } from '../../services/chatService';
import webSocketService from '../../services/webSocketService';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [showChatList, setShowChatList] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isConnected, notifications } = useWebSocket();

  // Load chats on component mount
  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  // Refresh chat when notifications occur
  useEffect(() => {
    console.log('🔄 ChatWindow: notifications changed, count:', notifications.length);
    console.log('🔄 ChatWindow: notifications array:', notifications);
    if (notifications.length > 0) {
      console.log('🔄 Notification received, refreshing chat data...');
      // Refresh chats and messages
      loadChats();
      if (selectedChat) {
        loadMessages();
      }
    }
  }, [notifications]);

  // Listen for custom notification events
  useEffect(() => {
    const handleNotificationEvent = (event: CustomEvent) => {
      console.log('🔄 ChatWindow: Custom notification event received:', event.detail);
      // Refresh chats and messages
      loadChats();
      if (selectedChat) {
        loadMessages();
      }
    };

    window.addEventListener('notificationReceived', handleNotificationEvent as EventListener);
    
    return () => {
      window.removeEventListener('notificationReceived', handleNotificationEvent as EventListener);
    };
  }, [selectedChat]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      console.log('Chat selected, loading messages for chat ID:', selectedChat.id);
      loadMessages();
      joinChatRoom();
      markAsRead();
    }
    
    return () => {
      if (selectedChat) {
        leaveChatRoom();
      }
    };
  }, [selectedChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chats on component mount
  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  // Listen for custom events to open specific chats
  useEffect(() => {
    const handleOpenChat = async (event: CustomEvent) => {
      const { chatId, vendorName } = event.detail;
      
      console.log('Received openChat event:', { chatId, vendorName });
      
      // First, try to find the chat in the current chats list
      let chat = chats.find(c => c.id === chatId);
      
      if (chat) {
        console.log('Found existing chat:', chat);
        setSelectedChat(chat);
        setShowChatList(false);
      } else {
        console.log('Chat not found in list, reloading chats...');
        // If chat not found, reload chats and try again
        try {
          const updatedChats = await loadChats();
          // After reloading, find the chat in the updated chats
          chat = updatedChats.find(c => c.id === chatId);
          if (chat) {
            console.log('Found chat after reload:', chat);
            setSelectedChat(chat);
            setShowChatList(false);
          } else {
            console.log('Chat still not found after reload');
            // Show a message that the chat couldn't be found
            alert('Chat not found. Please try again.');
          }
        } catch (error) {
          console.error('Error reloading chats:', error);
          alert('Error loading chats. Please try again.');
        }
      }
    };

    window.addEventListener('openChat', handleOpenChat as EventListener);
    
    return () => {
      window.removeEventListener('openChat', handleOpenChat as EventListener);
    };
  }, [chats]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    const handleNewMessage = (messageData: any) => {
      if (messageData.chatId === selectedChat?.id) {
        setMessages(prev => [...prev, messageData.message]);
      }
      
      // Update chat list with new message
      setChats(prev => prev.map(chat => 
        chat.id === messageData.chatId 
          ? { ...chat, last_message: messageData.message.content, last_message_at: messageData.message.created_at }
          : chat
      ));
    };

    const handleUserTyping = (typingData: any) => {
      if (typingData.chatId === selectedChat?.id) {
        if (typingData.isTyping) {
          setTypingUsers(prev => new Set([...prev, typingData.userId]));
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(typingData.userId);
            return newSet;
          });
        }
      }
    };

    webSocketService.onNewMessage(handleNewMessage);
    webSocketService.onUserTyping(handleUserTyping);

    return () => {
      webSocketService.offNewMessage(handleNewMessage);
      webSocketService.offUserTyping(handleUserTyping);
    };
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const chatList = await chatService.getUserChats();
      setChats(chatList);
      return chatList; // Return the chat list for use in other functions
    } catch (error) {
      console.error('Error loading chats:', error);
      return []; // Return empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;
    
    try {
      setIsLoading(true);
      console.log('Loading messages for chat:', selectedChat.id);
      const messageList = await chatService.getChatMessages(selectedChat.id);
      console.log('Loaded messages:', messageList);
      setMessages(messageList);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinChatRoom = () => {
    if (selectedChat) {
      webSocketService.joinChat(selectedChat.id);
    }
  };

  const leaveChatRoom = () => {
    if (selectedChat) {
      webSocketService.leaveChat(selectedChat.id);
    }
  };

  const markAsRead = async () => {
    if (!selectedChat) return;
    
    try {
      await chatService.markAsRead(selectedChat.id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      setIsLoading(true);
      const message = await chatService.sendMessage({
        chatId: selectedChat.id,
        message: newMessage.trim()
      });
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Stop typing indicator
      webSocketService.stopTyping(selectedChat.id);
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!selectedChat) return;
    
    if (!isTyping) {
      setIsTyping(true);
      webSocketService.startTyping(selectedChat.id);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      webSocketService.stopTyping(selectedChat.id);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSenderName = (message: Message) => {
    if (message.sender_type === 'vendor') {
      return message.sender_business_name || 'Vendor';
    }
    // Add fallback for undefined names
    const firstName = message.sender_first_name || 'User';
    const lastName = message.sender_last_name || '';
    return `${firstName} ${lastName}`.trim();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Chat</h3>
          {!isConnected && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          )}
        </div>
        <button
          onClick={onClose}
          className="hover:bg-blue-700 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        {showChatList && (
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h4 className="font-medium text-sm text-gray-700">Conversations</h4>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : chats.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <div className="mb-2">No conversations yet</div>
                  <div className="text-xs text-gray-400">
                    Click the "Chat" button on any event card to start a conversation with the vendor.
                  </div>
                </div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      console.log('Chat clicked:', chat.id, chat.vendor_name, chat.event_name);
                      setSelectedChat(chat);
                    }}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-sm truncate">
                      {chat.vendor_name || `${chat.user_first_name} ${chat.user_last_name}`}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {chat.event_name}
                    </div>
                    {chat.last_message && (
                      <div className="text-xs text-gray-600 truncate mt-1">
                        {chat.last_message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {selectedChat.vendor_name || `${selectedChat.user_first_name} ${selectedChat.user_last_name}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedChat.event_name}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChatList(!showChatList)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronDown size={16} className={showChatList ? 'rotate-180' : ''} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.sender_type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="font-medium text-xs mb-1">
                        {getSenderName(message)}
                      </div>
                      <div>{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-600 p-3 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
