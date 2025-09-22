// Event Service API
// Handles all event-related API calls

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

// Create axios instance without auth for public endpoints
const createPublicAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

// Create axios instances
const apiClient = createAxiosInstance();
const publicApiClient = createPublicAxiosInstance();

// Types for events
export interface EventServiceItem {
  id: number;
  name: string;
  base_price?: number;
  advance_percentage?: number;
}

export interface EventTeamMember {
  id: number;
  name: string;
  role: string;
}

export interface Event {
  id?: number;
  name: string;
  description: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  special_requirements?: string;
  vendor_id: number;
  vendor_name: string;
  services: EventServiceItem[];
  total_amount?: number;
  advance_amount?: number;
  remaining_amount?: number;
  advance_percentage?: number;
  paid_amount?: number;
  payment_status?: 'pending' | 'advance_paid' | 'fully_paid';
  status: 'pending' | 'confirmed' | 'cancelled';
  team_members?: EventTeamMember[] | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  special_requirements?: string;
  vendor_id: number;
  vendor_name: string;
  services: EventServiceItem[];
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number;
}

export interface EventResponse {
  success: boolean;
  message?: string;
  data?: Event | Event[];
}

export interface Vendor {
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

export interface VendorService {
  id: number;
  vendor_id: number;
  category_id: number;
  user_id: number;
  name: string;
  description: string;
  base_price: number;
  price_per_hour: number;
  capacity: number;
  advance_percentage: number;
  isActive: boolean;
  image_url?: string;
  category_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorResponse {
  success: boolean;
  message?: string;
  data?: Vendor | Vendor[];
}

export interface VendorServiceResponse {
  success: boolean;
  message?: string;
  data?: VendorService | VendorService[];
}

// API Methods

// Create a new event
export const createEvent = async (eventData: CreateEventData): Promise<EventResponse> => {
  try {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  } catch (error: any) {
    console.error('Create event error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

// Get all events (admin only)
export const getAllEvents = async (): Promise<EventResponse> => {
  try {
    const response = await publicApiClient.get('/events');
    return response.data;
  } catch (error: any) {
    console.error('Get all events error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch events');
  }
};

// Get events for authenticated user
export const getUserEvents = async (): Promise<EventResponse> => {
  try {
    const response = await apiClient.get('/events/user/events');
    return response.data;
  } catch (error: any) {
    console.error('Get user events error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user events');
  }
};

// Get event by ID
export const getEventById = async (id: number): Promise<EventResponse> => {
  try {
    const response = await publicApiClient.get(`/events/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get event by ID error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch event');
  }
};

// Get events by vendor
export const getEventsByVendor = async (vendorId: number): Promise<EventResponse> => {
  try {
    const response = await publicApiClient.get(`/events/vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get events by vendor error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor events');
  }
};

// Get events by status
export const getEventsByStatus = async (status: Event['status']): Promise<EventResponse> => {
  try {
    const response = await publicApiClient.get(`/events/status/${status}`);
    return response.data;
  } catch (error: any) {
    console.error('Get events by status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch events by status');
  }
};

// Get events by date range
export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<EventResponse> => {
  try {
    const response = await publicApiClient.get(`/events/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error: any) {
    console.error('Get events by date range error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch events by date range');
  }
};

// Update event
export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<EventResponse> => {
  try {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error: any) {
    console.error('Update event error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

// Update event status
export const updateEventStatus = async (id: number, status: Event['status']): Promise<EventResponse> => {
  try {
    const response = await apiClient.patch(`/events/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Update event status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update event status');
  }
};

// Update payment status
export const updatePaymentStatus = async (id: number, payment_status: Event['payment_status']): Promise<EventResponse> => {
  try {
    const response = await apiClient.patch(`/events/${id}/payment-status`, { payment_status });
    return response.data;
  } catch (error: any) {
    console.error('Update payment status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update payment status');
  }
};

// Delete event
export const deleteEvent = async (id: number): Promise<EventResponse> => {
  try {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete event error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};

// Get all vendors
export const getAllVendors = async (): Promise<VendorResponse> => {
  try {
    const response = await publicApiClient.get('/vendors');
    return response.data;
  } catch (error: any) {
    console.error('Get all vendors error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
  }
};

// Get vendors by city
export const getVendorsByCity = async (city: string): Promise<VendorResponse> => {
  try {
    const vendors = await getAllVendors();
    if (vendors.data && Array.isArray(vendors.data)) {
      const filteredVendors = vendors.data.filter(vendor => 
        vendor.city.toLowerCase().includes(city.toLowerCase())
      );
      return {
        success: true,
        data: filteredVendors
      };
    }
    return vendors;
  } catch (error: any) {
    console.error('Get vendors by city error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendors by city');
  }
};

// Get vendor services
export const getVendorServices = async (vendorId: number): Promise<VendorServiceResponse> => {
  try {
    const response = await publicApiClient.get(`/vendor-services/vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get vendor services error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor services');
  }
};

// Get vendor services by capacity
export const getVendorServicesByCapacity = async (vendorId: number, minCapacity: number): Promise<VendorServiceResponse> => {
  try {
    const services = await getVendorServices(vendorId);
    if (services.data && Array.isArray(services.data)) {
      const filteredServices = services.data.filter(service => service.capacity >= minCapacity);
      return {
        success: true,
        data: filteredServices
      };
    }
    return services;
  } catch (error: any) {
    console.error('Get vendor services by capacity error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor services by capacity');
  }
};

// Export all event service functions
export const eventService = {
  createEvent,
  getAllEvents,
  getUserEvents,
  getEventById,
  getEventsByVendor,
  getEventsByStatus,
  getEventsByDateRange,
  updateEvent,
  updateEventStatus,
  updatePaymentStatus,
  deleteEvent,
  getAllVendors,
  getVendorsByCity,
  getVendorServices,
  getVendorServicesByCapacity,
};