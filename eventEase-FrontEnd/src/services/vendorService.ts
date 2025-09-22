// Vendor Service API
// Handles all vendor service-related API calls

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

// Types for vendor services
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
  category_name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  vendor_id: number;
  category_id: number;
  user_id: number;
  name: string;
  description: string;
  base_price: number;
  price_per_hour: number;
  capacity: number;
  advance_percentage: number;
  isActive?: boolean;
  image?: File;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: number;
}

export interface ServiceResponse {
  success: boolean;
  message?: string;
  data?: VendorService | VendorService[];
}

// API Methods

// Create a new service
export const createService = async (serviceData: CreateServiceData): Promise<ServiceResponse> => {
  try {
    const formData = new FormData();
    
    // Append all service data to FormData
    Object.entries(serviceData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await apiClient.post('/vendor-services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Create service error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create service');
  }
};

// Get all services
export const getAllServices = async (): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.get('/vendor-services');
    return response.data;
  } catch (error: any) {
    console.error('Get all services error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
};

// Get service by ID
export const getServiceById = async (id: number): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.get(`/vendor-services/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get service by ID error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch service');
  }
};

// Get services by user ID
export const getServicesByUser = async (userId: number): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.get(`/vendor-services/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get services by user error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user services');
  }
};

// Get services by vendor ID
export const getServicesByVendor = async (vendorId: number): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.get(`/vendor-services/vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get services by vendor error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor services');
  }
};

// Get services by category
export const getServicesByCategory = async (categoryId: number): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.get(`/vendor-services/category/${categoryId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get services by category error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch services by category');
  }
};

// Update service
export const updateService = async (serviceData: UpdateServiceData): Promise<ServiceResponse> => {
  try {
    const { id, ...updateData } = serviceData;
    const formData = new FormData();
    
    // Append all service data to FormData
    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await apiClient.put(`/vendor-services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Update service error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update service');
  }
};

// Delete service
export const deleteService = async (id: number): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.delete(`/vendor-services/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete service error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete service');
  }
};

// Export all vendor service functions
export const vendorService = {
  createService,
  getAllServices,
  getServiceById,
  getServicesByUser,
  getServicesByVendor,
  getServicesByCategory,
  updateService,
  deleteService,
};
