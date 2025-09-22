// Vendor Dashboard Service API
// Handles all vendor dashboard-related API calls

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

const api = createAxiosInstance();

// Types
export interface VendorInfo {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  capacity: number;
  websiteUrl?: string;
  businessRegistrationNumber: string;
  businessLicenseNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorQuickStats {
  totalEvents: number;
  totalRevenue: number;
  totalBooked: number;
  pendingRevenue: number;
  averageEventValue: number;
  eventsThisMonth: number;
  completionRate: number;
}

export interface VendorEventsByStatus {
  pending: number;
  confirmed: number;
  cancelled: number;
}

export interface VendorPaymentStatusBreakdown {
  pending: number;
  advance_paid: number;
  fully_paid: number;
}

export interface VendorEventsByType {
  [key: string]: number;
}

export interface VendorRecentEvent {
  id: number;
  name: string;
  type: string;
  date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  paid_amount: number;
  user_id: number;
}

export interface VendorUpcomingEvent {
  id: number;
  name: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  user_id: number;
}

export interface VendorMonthlyRevenue {
  [key: string]: number;
}

export interface VendorTopClient {
  client: string;
  amount: number;
}

export interface VendorDashboardData {
  vendorInfo: VendorInfo;
  quickStats: VendorQuickStats;
  eventsByStatus: VendorEventsByStatus;
  paymentStatusBreakdown: VendorPaymentStatusBreakdown;
  eventsByType: VendorEventsByType;
  recentEvents: VendorRecentEvent[];
  upcomingEvents: VendorUpcomingEvent[];
  monthlyRevenue: VendorMonthlyRevenue;
  topClients: VendorTopClient[];
}

export interface ServicePerformance {
  serviceId: number;
  serviceName: string;
  basePrice: number;
  bookings: number;
  revenue: number;
  averageBookingValue: number;
}

export interface TeamUtilization {
  memberId: number;
  memberName: string;
  role: string;
  hourlyRate: number;
  isActive: boolean;
  eventsAssigned: number;
}

export interface BusinessGrowth {
  currentMonthEvents: number;
  lastMonthEvents: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  revenueGrowth: number;
  eventGrowth: number;
}

export interface VendorBusinessInsights {
  servicePerformance: ServicePerformance[];
  teamUtilization: TeamUtilization[];
  businessGrowth: BusinessGrowth;
}

// API calls
export const vendorDashboardService = {
  // Get vendor dashboard data
  getVendorDashboardData: async (): Promise<VendorDashboardData> => {
    try {
      const response = await api.get('/dashboard/vendor/dashboard');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching vendor dashboard data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor dashboard data');
    }
  },

  // Get vendor business insights
  getVendorBusinessInsights: async (): Promise<VendorBusinessInsights> => {
    try {
      const response = await api.get('/dashboard/vendor/business-insights');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching vendor business insights:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor business insights');
    }
  },

  // Test vendor dashboard endpoint
  testVendorDashboard: async (): Promise<any> => {
    try {
      const response = await api.get('/dashboard/vendor/test');
      return response.data;
    } catch (error: any) {
      console.error('Error testing vendor dashboard:', error);
      throw new Error(error.response?.data?.message || 'Failed to test vendor dashboard');
    }
  }
};

export default vendorDashboardService;
