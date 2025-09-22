// WebSocket Context
// Provides WebSocket connection management throughout the app

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import webSocketService from '../services/webSocketService';
import notificationService from '../services/notificationService';

interface Notification {
  id?: number; // Stored notifications have IDs, real-time don't
  type: string;
  title: string;
  message: string;
  data: any;
  isRead?: boolean; // Stored notifications have read status
  timestamp: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  connect: () => void;
  disconnect: () => void;
  clearNotifications: () => void;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadStoredNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load stored notifications on mount
  const loadStoredNotifications = async () => {
    try {
      const storedNotifications = await notificationService.getUserNotifications();
      // Convert stored notifications to match the Notification interface
      const formattedNotifications: Notification[] = storedNotifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        isRead: n.isRead,
        timestamp: n.timestamp
      }));
      setNotifications(prev => {
        // Merge stored notifications with real-time ones, avoiding duplicates
        const existingIds = new Set(prev.filter(n => n.id).map(n => n.id));
        const newStored = formattedNotifications.filter(n => !existingIds.has(n.id));
        return [...newStored, ...prev];
      });
    } catch (error) {
      console.error('Error loading stored notifications:', error);
    }
  };

  // Refresh unread count
  const refreshUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      await refreshUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    // Load stored notifications when component mounts
    loadStoredNotifications();
    refreshUnreadCount();

    // Connect to WebSocket if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      webSocketService.connect();
    }

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        if (e.newValue) {
          // Token was set (login)
          webSocketService.connect();
          loadStoredNotifications();
          refreshUnreadCount();
        } else {
          // Token was removed (logout)
          webSocketService.disconnect();
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up event listeners
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      // Refresh unread count when new notification arrives
      refreshUnreadCount();
    };

    webSocketService.onConnect(handleConnect);
    webSocketService.onDisconnect(handleDisconnect);
    webSocketService.onNotification(handleNotification);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      webSocketService.offConnect(handleConnect);
      webSocketService.offDisconnect(handleDisconnect);
      webSocketService.offNotification(handleNotification);
      webSocketService.disconnect();
    };
  }, []);

  const connect = () => {
    webSocketService.connect();
  };

  const disconnect = () => {
    webSocketService.disconnect();
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: WebSocketContextType = {
    isConnected,
    notifications,
    unreadCount,
    connect,
    disconnect,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    loadStoredNotifications,
    refreshUnreadCount
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};