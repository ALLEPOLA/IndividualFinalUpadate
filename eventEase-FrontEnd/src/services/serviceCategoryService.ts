// Service Category API
// Handles all service category-related API calls

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance without authentication (as requested)
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create axios instance
const apiClient = createAxiosInstance();

// Types for service categories
export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data?: ServiceCategory | ServiceCategory[];
}

// API Methods

// Get all service categories
export const getAllCategories = async (includeInactive: boolean = false): Promise<CategoryResponse> => {
  try {
    const params = includeInactive ? { includeInactive: 'true' } : {};
    const response = await apiClient.get('/service-categories', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get all categories error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch service categories');
  }
};

// Get category by ID
export const getCategoryById = async (id: number): Promise<CategoryResponse> => {
  try {
    const response = await apiClient.get(`/service-categories/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get category by ID error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch service category');
  }
};

// Get category by name
export const getCategoryByName = async (name: string): Promise<CategoryResponse> => {
  try {
    const response = await apiClient.get(`/service-categories/name/${encodeURIComponent(name)}`);
    return response.data;
  } catch (error: any) {
    console.error('Get category by name error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch service category');
  }
};

// Export all service category functions
export const serviceCategoryService = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
};
