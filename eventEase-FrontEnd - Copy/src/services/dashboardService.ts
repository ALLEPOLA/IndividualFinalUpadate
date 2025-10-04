// Dashboard Service API
// Handles all dashboard-related API calls

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
export interface QuickStats {
  totalEvents: number;
  totalSpent: number;
  totalBudget: number;
  remainingBudget: number;
  averageEventCost: number;
  eventsThisMonth: number;
}

export interface EventsByStatus {
  pending: number;
  confirmed: number;
  cancelled: number;
}

export interface PaymentStatusBreakdown {
  pending: number;
  advance_paid: number;
  fully_paid: number;
}

export interface EventsByType {
  [key: string]: number;
}

export interface RecentEvent {
  id: number;
  name: string;
  type: string;
  date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  paid_amount: number;
}

export interface UpcomingEvent {
  id: number;
  name: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  vendor_name: string;
}

export interface MonthlySpending {
  [key: string]: number;
}

export interface TopVendor {
  vendor: string;
  amount: number;
}

export interface DashboardData {
  quickStats: QuickStats;
  eventsByStatus: EventsByStatus;
  paymentStatusBreakdown: PaymentStatusBreakdown;
  eventsByType: EventsByType;
  recentEvents: RecentEvent[];
  upcomingEvents: UpcomingEvent[];
  monthlySpending: MonthlySpending;
  topVendors: TopVendor[];
}

export interface SpendingByCategory {
  [key: string]: number;
}

export interface PaymentTimelineItem {
  date: string;
  amount: number;
  eventName: string;
  paymentStatus: string;
}

export interface BudgetAnalysisItem {
  eventName: string;
  budget: number;
  spent: number;
  remaining: number;
  completionPercentage: number;
}

export interface SpendingInsights {
  spendingByCategory: SpendingByCategory;
  paymentTimeline: PaymentTimelineItem[];
  budgetAnalysis: BudgetAnalysisItem[];
}

// API calls
export const dashboardService = {
  // Get user dashboard data
  getUserDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await api.get('/dashboard/user/dashboard');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  // Get user spending insights
  getUserSpendingInsights: async (): Promise<SpendingInsights> => {
    try {
      const response = await api.get('/dashboard/user/spending-insights');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching spending insights:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch spending insights');
    }
  }
};

export default dashboardService;
