// Team Member Service API
// Handles all team member-related API calls

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

// Types for team members
export interface TeamMember {
  id: number;
  vendor_id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  hourly_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vendor_business_name?: string;
}

export interface CreateTeamMemberData {
  vendor_id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  hourly_rate?: number;
}

export interface UpdateTeamMemberData extends Partial<CreateTeamMemberData> {
  id: number;
  is_active?: boolean;
}

export interface TeamMemberResponse {
  success: boolean;
  message?: string;
  data?: TeamMember | TeamMember[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeamMemberQueryOptions {
  page?: number;
  limit?: number;
  vendor_id?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

// API Methods

// Create a new team member
export const createTeamMember = async (teamMemberData: CreateTeamMemberData): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.post('/team-members', teamMemberData);
    return response.data;
  } catch (error: any) {
    console.error('Create team member error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create team member');
  }
};

// Get all team members with pagination and filters
export const getAllTeamMembers = async (options?: TeamMemberQueryOptions): Promise<TeamMemberResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/team-members?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Get all team members error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch team members');
  }
};

// Get team member by ID
export const getTeamMemberById = async (id: number): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.get(`/team-members/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get team member by ID error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch team member');
  }
};

// Get team members by vendor ID
export const getTeamMembersByVendor = async (vendorId: number): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.get(`/team-members/vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get team members by vendor error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vendor team members');
  }
};

// Update team member
export const updateTeamMember = async (teamMemberData: UpdateTeamMemberData): Promise<TeamMemberResponse> => {
  try {
    const { id, ...updateData } = teamMemberData;
    const response = await apiClient.put(`/team-members/${id}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Update team member error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update team member');
  }
};

// Delete team member
export const deleteTeamMember = async (id: number): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.delete(`/team-members/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete team member error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete team member');
  }
};

// Toggle team member status (active/inactive)
export const toggleTeamMemberStatus = async (id: number): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.patch(`/team-members/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    console.error('Toggle team member status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle team member status');
  }
};

// Export all team member functions
export const teamMemberService = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  getTeamMembersByVendor,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
};
