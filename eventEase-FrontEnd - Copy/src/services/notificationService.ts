// Notification API Service
// Handles API calls for stored notifications

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Token management
const TOKEN_KEY = 'authToken';

// Helper function for token management
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Create axios instance with authentication
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add token
  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired or invalid
        localStorage.removeItem(TOKEN_KEY);
        // Only redirect if not on a public route
        const publicRoutes = ['/', '/about', '/contact', '/login', '/signup', '/verify-email'];
        if (!publicRoutes.includes(window.location.pathname)) {
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create axios instance
const apiClient = createAxiosInstance();

export interface StoredNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  timestamp: string;
}

export interface NotificationResponse {
  success: boolean;
  data: StoredNotification[];
}

export interface UnreadCountResponse {
  success: boolean;
  data: { unreadCount: number };
}

class NotificationService {
  // Get user's stored notifications
  async getUserNotifications(limit = 50, offset = 0, unreadOnly = false): Promise<StoredNotification[]> {
    try {
      // Check if user is authenticated before making the request
      const token = getToken();
      if (!token) {
        console.warn('No auth token found, skipping notification fetch');
        return [];
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        unreadOnly: unreadOnly.toString()
      });

      const response = await apiClient.get<NotificationResponse>(`/notifications?${params}`);
      return response.data.data;
    } catch (error: any) {
      // If it's a 401 error, don't log it as an error since it's expected when not authenticated
      if (error.response?.status === 401) {
        console.warn('User not authenticated, skipping notification fetch');
        return [];
      }
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    try {
      // Check if user is authenticated before making the request
      const token = getToken();
      if (!token) {
        console.warn('No auth token found, skipping unread count fetch');
        return 0;
      }

      const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
      return response.data.data.unreadCount;
    } catch (error: any) {
      // If it's a 401 error, don't log it as an error since it's expected when not authenticated
      if (error.response?.status === 401) {
        console.warn('User not authenticated, skipping unread count fetch');
        return 0;
      }
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.put('/notifications/read-all');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete/dismiss notification
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;