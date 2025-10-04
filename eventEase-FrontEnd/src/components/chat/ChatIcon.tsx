// ChatIcon Component
// Fixed position chat icon in bottom right corner

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import chatService from '../../services/chatService';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface ChatIconProps {
  onOpenChat: () => void;
}

export const ChatIcon: React.FC<ChatIconProps> = ({ onOpenChat }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isConnected, notifications } = useWebSocket();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await chatService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Refresh unread count when notifications occur
  useEffect(() => {
    console.log('🔄 ChatIcon: notifications changed, count:', notifications.length);
    console.log('🔄 ChatIcon: notifications array:', notifications);
    if (notifications.length > 0) {
      console.log('🔄 Notification received, refreshing chat unread count...');
      const fetchUnreadCount = async () => {
        try {
          const count = await chatService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };
      fetchUnreadCount();
    }
  }, [notifications]);

  // Listen for custom notification events
  useEffect(() => {
    const handleNotificationEvent = (event: CustomEvent) => {
      console.log('🔄 ChatIcon: Custom notification event received:', event.detail);
      const fetchUnreadCount = async () => {
        try {
          const count = await chatService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };
      fetchUnreadCount();
    };

    window.addEventListener('notificationReceived', handleNotificationEvent as EventListener);
    
    return () => {
      window.removeEventListener('notificationReceived', handleNotificationEvent as EventListener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onOpenChat}
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
        title="Open Chat"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isConnected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
        )}
      </button>
    </div>
  );
};
