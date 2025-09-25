import { useEffect, useState } from 'react';
import { useWebSocket } from '../../../../contexts/WebSocketContext';

interface NotificationItem {
  id?: number;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead?: boolean;
  timestamp: string;
}

export const Notifications = () => {
  const { notifications, markAsRead, loadStoredNotifications } = useWebSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await loadStoredNotifications();
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [loadStoredNotifications]);

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
      case 'USER_LOGIN':
        return '👋';
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
      case 'USER_LOGIN':
        return 'bg-indigo-100 border-indigo-500 text-indigo-800';
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

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (notification.id && !notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="p-6 relative overflow-hidden">
        {/* Minimal Floating Decorative Elements */}
        <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            🔔 Notifications
          </h1>
          <p className="text-gray-600 mb-8">Stay updated with your event notifications and important updates</p>
          {/* Light Purple Underline */}
          <div className="w-20 h-0.5 bg-purple-300 rounded-full mb-8"></div>
          
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading notifications...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Minimal Floating Decorative Elements */}
      <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          🔔 Notifications
        </h1>
        <p className="text-gray-600 mb-8">Stay updated with your event notifications and important updates</p>
        {/* Light Purple Underline */}
        <div className="w-20 h-0.5 bg-purple-300 rounded-full mb-8"></div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-600">
            You'll see notifications here when you receive updates about your events, payments, and more.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={notification.id || index}
              className={`p-4 border-l-4 rounded-r-lg shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md ${
                notification.isRead
                  ? 'bg-gray-50 border-gray-300 opacity-75'
                  : 'bg-white border-purple-300 hover:bg-purple-50'
              }`}
              onClick={() => handleNotificationClick(notification)}
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
                  {!notification.isRead && (
                    <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
