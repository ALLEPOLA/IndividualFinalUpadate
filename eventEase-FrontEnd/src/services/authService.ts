// Authentication Service
// Handles all authentication-related API calls

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useUserStore, type User, type Vendor } from '../stores/userStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Token management
const TOKEN_KEY = 'authToken';

// Helper functions for token management
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
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
        removeToken();
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

// Types for authentication (imported from userStore)
export type { User, Vendor } from '../stores/userStore';

export interface SignupData {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  role: 'user' | 'vendor' | 'admin';
  email: string;
  password: string;
  // Vendor-specific fields (optional)
  businessName?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  capacity?: number;
  websiteUrl?: string;
  businessRegistrationNumber?: string;
  businessLicenseNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user?: User;
  vendor?: Vendor;
  requiresEmailVerification?: boolean;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
  vendor?: Vendor;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  otp: string;
  email: string;
}


// User Sign Up
export const signUp = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    console.log('Signing up user:', userData);
    const response = await apiClient.post('/auth/signup', userData);
    const data = response.data;

    // Store token if signup is successful
    if (data.token) {
      setToken(data.token);
    }

    // Update Zustand store with user data
    if (data.user) {
      const { login } = useUserStore.getState();
      login(data.user, data.vendor || undefined);
    }

    return data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.response?.data?.message || 'Sign up failed');
  }
};

// User Login
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', loginData);
    const data = response.data;

    // Store token if login is successful
    if (data.token) {
      setToken(data.token);
    }

    // Update Zustand store with user data
    if (data.user) {
      const { login: loginAction } = useUserStore.getState();
      loginAction(data.user, data.vendor || undefined);
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Get User Profile
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get('/auth/profile');
    const data = response.data;

    // Update Zustand store with profile data
    if (data.success && data.user) {
      const { login } = useUserStore.getState();
      login(data.user, data.vendor || undefined);
    }

    return data;
  } catch (error: any) {
    console.error('Get profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

// Send OTP to Email
export const sendOTP = async (email: string): Promise<OTPResponse> => {
  try {
    const response = await apiClient.post('/auth/send-otp', { email });
    return response.data;
  } catch (error: any) {
    console.error('Send OTP error:', error);
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

// Verify email with OTP
export const verifyEmail = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/auth/verify-email', { email, otp });
    return response.data;
  } catch (error: any) {
    console.error('Email verification error:', error);
    throw new Error(error.response?.data?.message || 'Email verification failed');
  }
};

// Resend email verification OTP
export const resendEmailVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/auth/send-email-verification', { email });
    return response.data;
  } catch (error: any) {
    console.error('Resend verification error:', error);
    throw new Error(error.response?.data?.message || 'Failed to resend verification email');
  }
};

// Logout (remove token from localStorage and clear user store)
export const logout = (): void => {
  removeToken();
  const { logout: logoutAction } = useUserStore.getState();
  logoutAction();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Get current user token
export const getCurrentToken = (): string | null => {
  return getToken();
};

// Verify token validity (optional - you can call getProfile to verify)
export const verifyToken = async (): Promise<boolean> => {
  try {
    await getProfile();
    return true;
  } catch (error) {
    // If profile fetch fails, token is invalid
    removeToken();
    const { logout } = useUserStore.getState();
    logout();
    return false;
  }
};

// Export all auth-related functions
export const authService = {
  signUp,
  login,
  getProfile,
  sendOTP,
  verifyEmail,
  resendEmailVerification,
  logout,
  isAuthenticated,
  getCurrentToken,
  verifyToken,
};
