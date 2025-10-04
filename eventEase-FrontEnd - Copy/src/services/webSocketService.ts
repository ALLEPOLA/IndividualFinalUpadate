// WebSocket Service
// Handles real-time notifications using Socket.IO

import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Chat callback functions
  private onNewMessageCallbacks: ((message: any) => void)[] = [];
  private onUserTypingCallbacks: ((data: any) => void)[] = [];

  // Notification callback functions
  private onNotificationCallbacks: ((notification: any) => void)[] = [];
  private onConnectCallbacks: (() => void)[] = [];
  private onDisconnectCallbacks: (() => void)[] = [];

  connect(): void {
    const token = localStorage.getItem('authToken');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    if (!token) {
      console.warn('No auth token found, cannot connect to WebSocket');
      return;
    }

    // Get base URL without /api path for Socket.IO connection
    const baseUrl = API_BASE_URL.replace('/api', '');

    // Remove protocol from URL for socket.io
    const socketUrl = baseUrl.replace(/^https?:\/\//, '');

    this.socket = io(`ws://${socketUrl}`, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
      this.onConnectCallbacks.forEach(callback => callback());
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      this.onDisconnectCallbacks.forEach(callback => callback());

      // Attempt to reconnect if not manually disconnected
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    });

    // Listen for notifications
    this.socket.on('notification', (notification) => {
      console.log('🔔 Received notification via WebSocket:', notification);
      this.onNotificationCallbacks.forEach(callback => callback(notification));
    });

    // Listen for chat events
    this.socket.on('new_message', (messageData) => {
      console.log('Received new message:', messageData);
      this.onNewMessageCallbacks.forEach(callback => callback(messageData));
    });

    this.socket.on('user_typing', (typingData) => {
      console.log('User typing:', typingData);
      this.onUserTypingCallbacks.forEach(callback => callback(typingData));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    // Reset reconnect attempts when manually disconnecting
    this.reconnectAttempts = 0;
  }

  private attemptReconnect(): void {
    // Check if token still exists before attempting reconnect
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found, stopping reconnection attempts');
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Join additional rooms if needed
  joinRoom(room: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join', room);
    }
  }

  // Chat methods
  joinChat(chatId: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_chat', chatId);
    }
  }

  leaveChat(chatId: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave_chat', chatId);
    }
  }

  startTyping(chatId: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_start', { chatId });
    }
  }

  stopTyping(chatId: number): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_stop', { chatId });
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listeners
  onNotification(callback: (notification: any) => void): void {
    this.onNotificationCallbacks.push(callback);
  }

  onConnect(callback: () => void): void {
    this.onConnectCallbacks.push(callback);
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallbacks.push(callback);
  }

  // Chat event listeners
  onNewMessage(callback: (message: any) => void): void {
    this.onNewMessageCallbacks.push(callback);
  }

  onUserTyping(callback: (data: any) => void): void {
    this.onUserTypingCallbacks.push(callback);
  }

  // Remove event listeners
  offNotification(callback: (notification: any) => void): void {
    this.onNotificationCallbacks = this.onNotificationCallbacks.filter(cb => cb !== callback);
  }

  offConnect(callback: () => void): void {
    this.onConnectCallbacks = this.onConnectCallbacks.filter(cb => cb !== callback);
  }

  offDisconnect(callback: () => void): void {
    this.onDisconnectCallbacks = this.onDisconnectCallbacks.filter(cb => cb !== callback);
  }

  offNewMessage(callback: (message: any) => void): void {
    this.onNewMessageCallbacks = this.onNewMessageCallbacks.filter(cb => cb !== callback);
  }

  offUserTyping(callback: (data: any) => void): void {
    this.onUserTypingCallbacks = this.onUserTypingCallbacks.filter(cb => cb !== callback);
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;