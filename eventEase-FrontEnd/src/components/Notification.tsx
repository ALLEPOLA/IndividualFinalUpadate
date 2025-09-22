// Notification Component
// Displays real-time notifications to users

import React from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface NotificationItem {
  id?: number;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead?: boolean;
  timestamp: string;
}

interface NotificationProps {
  onNotificationClick?: (notification: NotificationItem) => void;
}

const Notification: React.FC<NotificationProps> = ({ onNotificationClick }) => {
  const { notifications, clearNotifications } = useWebSocket();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EVENT_CREATED':
        return '📅';
      case 'EVENT_UPDATED':
        return '✏️';
      case 'PAYMENT_RECEIVED':
        return '💰';
      case 'VENDOR_ASSIGNED':
        return '👥';
      case 'TEAM_MEMBER_ADDED':
        return '👤';
      case 'SERVICE_BOOKED':
        return '🛍️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'EVENT_CREATED':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'VENDOR_ASSIGNED':
        return 'bg-purple-100 border-purple-500 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-2">🔔</div>
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button
          onClick={clearNotifications}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification: NotificationItem, index: number) => (
          <div
            key={index}
            className={`p-4 border-l-4 rounded-r-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
              notification.isRead
                ? 'bg-gray-50 border-gray-300 opacity-75'
                : getNotificationColor(notification.type)
            }`}
            onClick={() => onNotificationClick?.(notification)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium truncate">
                    {notification.title}
                  </h4>
                  <span className="text-xs opacity-75 ml-2 flex-shrink-0">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-90">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;