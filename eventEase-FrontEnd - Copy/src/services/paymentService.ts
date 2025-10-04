// Payment Service API
// Handles all payment-related API calls

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
        // Redirect to home page
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create axios instance
const apiClient = createAxiosInstance();

// Types for payment
export interface CheckoutSessionData {
  sessionId: string;
  url: string;
  amount: number;
  paymentType: 'advance' | 'remaining';
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: CheckoutSessionData;
}

export interface ConfirmPaymentData {
  eventId: number;
  paymentType: 'advance' | 'remaining';
}

// API Methods

// Create checkout session
export const createCheckoutSession = async (eventId: number): Promise<PaymentResponse> => {
  try {
    const response = await apiClient.post('/payments/create-session', {
      eventId
    });
    return response.data;
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create checkout session');
  }
};

// Confirm payment
export const confirmPayment = async (data: ConfirmPaymentData): Promise<PaymentResponse> => {
  try {
    const response = await apiClient.post('/payments/confirm', data);
    return response.data;
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    throw new Error(error.response?.data?.message || 'Failed to confirm payment');
  }
};

// Export all payment functions
export const paymentService = {
  createCheckoutSession,
  confirmPayment,
};
