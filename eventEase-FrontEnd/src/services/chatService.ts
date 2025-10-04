// Chat Service
// Handles chat-related API calls

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Token management
const TOKEN_KEY = 'authToken';

// Helper function for token management
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
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

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const apiClient = createAxiosInstance();

export interface Chat {
  id: number;
  user_id: number;
  vendor_id: number;
  event_id: number;
  vendor_name: string;
  user_first_name: string;
  user_last_name: string;
  event_name: string;
  last_message?: string;
  last_message_at?: string;
  user_unread_count: number;
  vendor_unread_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_type: 'user' | 'vendor';
  content: string;
  status: 'sent' | 'delivered' | 'read';
  sender_first_name?: string;
  sender_last_name?: string;
  sender_business_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChatData {
  vendor_id: number;
  event_id: number;
}

export interface SendMessageData {
  chatId: number;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  data?: Chat | Chat[] | Message[] | { unreadCount: number };
}

// Get all chats for the authenticated user
export const getUserChats = async (): Promise<Chat[]> => {
  try {
    const response = await apiClient.get('/chats');
    const data: ChatResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch chats');
    }
    
    return data.data as Chat[];
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch chats');
  }
};

// Get or create a chat between user and vendor for an event
export const getOrCreateChat = async (chatData: CreateChatData): Promise<Chat> => {
  try {
    const response = await apiClient.post('/chats', chatData);
    const data: ChatResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get or create chat');
    }
    
    return data.data as Chat;
  } catch (error: any) {
    console.error('Error getting or creating chat:', error);
    throw new Error(error.response?.data?.message || 'Failed to get or create chat');
  }
};

// Get messages for a specific chat
export const getChatMessages = async (
  chatId: number, 
  limit: number = 50, 
  offset: number = 0
): Promise<Message[]> => {
  try {
    const response = await apiClient.get(`/chats/${chatId}/messages`, {
      params: { limit, offset }
    });
    const data: ChatResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch messages');
    }
    
    return data.data as Message[];
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

// Send a message in a chat
export const sendMessage = async (messageData: SendMessageData): Promise<Message> => {
  try {
    const response = await apiClient.post(`/chats/${messageData.chatId}/messages`, {
      message: messageData.message
    });
    const data: ChatResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to send message');
    }
    
    return (data.data as any) as Message;
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

// Mark messages as read in a chat
export const markAsRead = async (chatId: number): Promise<void> => {
  try {
    const response = await apiClient.put(`/chats/${chatId}/read`);
    const data: ChatResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to mark messages as read');
    }
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark messages as read');
  }
};

// Get total unread message count
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get('/chats/unread-count');
    const data: ChatResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get unread count');
    }
    
    return (data.data as { unreadCount: number }).unreadCount;
  } catch (error: any) {
    console.error('Error getting unread count:', error);
    throw new Error(error.response?.data?.message || 'Failed to get unread count');
  }
};

export default {
  getUserChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
};
