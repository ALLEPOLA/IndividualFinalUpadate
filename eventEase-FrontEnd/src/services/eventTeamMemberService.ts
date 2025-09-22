// Event Team Member Service API
// Handles all event team member-related API calls

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
export interface EventTeamMember {
  id: number;
  name: string;
  role: string;
}

export interface AvailableTeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  hourly_rate?: number;
  is_active: boolean;
}

export interface EventTeamMembersResponse {
  eventId: number;
  eventName: string;
  teamMembers: EventTeamMember[];
}

export interface AssignTeamMembersRequest {
  teamMemberIds: number[];
}

export interface AssignTeamMembersResponse {
  eventId: number;
  teamMembers: EventTeamMember[];
}

// API calls
export const eventTeamMemberService = {
  // Get team members assigned to an event
  getEventTeamMembers: async (eventId: number): Promise<EventTeamMembersResponse> => {
    try {
      const response = await api.get(`/event-team-members/event/${eventId}/team-members`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching event team members:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch event team members');
    }
  },

  // Get available team members for a vendor
  getAvailableTeamMembers: async (): Promise<AvailableTeamMember[]> => {
    try {
      const response = await api.get('/event-team-members/available-team-members');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching available team members:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch available team members');
    }
  },

  // Assign team members to an event
  assignTeamMembersToEvent: async (
    eventId: number, 
    teamMemberIds: number[]
  ): Promise<AssignTeamMembersResponse> => {
    try {
      const response = await api.post(
        `/event-team-members/event/${eventId}/team-members`,
        { teamMemberIds }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error assigning team members:', error);
      throw new Error(error.response?.data?.message || 'Failed to assign team members');
    }
  },

  // Remove team members from an event
  removeTeamMembersFromEvent: async (eventId: number): Promise<AssignTeamMembersResponse> => {
    try {
      const response = await api.delete(`/event-team-members/event/${eventId}/team-members`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error removing team members:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove team members');
    }
  }
};

export default eventTeamMemberService;
