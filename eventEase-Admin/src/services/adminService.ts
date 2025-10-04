const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminService {
  private getAuthHeaders() {
    // Get token from Zustand store instead of localStorage directly
    const adminStore = localStorage.getItem('admin-store');
    let token = null;
    
    if (adminStore) {
      try {
        const parsed = JSON.parse(adminStore);
        token = parsed.state?.token;
      } catch (error) {
        console.error('Error parsing admin store:', error);
      }
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Moderator/Admin Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/moderators/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/moderators/profile`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get profile');
    }

    return response.json();
  }

  // Vendor Management
  async getAllVendors() {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get vendors');
    }

    return response.json();
  }

  async getVendorById(id: number) {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get vendor');
    }

    return response.json();
  }

  // Event Management
  async getAllEvents() {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get events');
    }

    return response.json();
  }

  async getEventById(id: number) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get event');
    }

    return response.json();
  }

  // Financial Management
  async getPayments() {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get payments');
    }

    return response.json();
  }

  async getFinancialReports() {
    const response = await fetch(`${API_BASE_URL}/admin/financial-reports`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get financial reports');
    }

    return response.json();
  }

  // Moderator Management
  async getAllModerators() {
    const response = await fetch(`${API_BASE_URL}/moderators/all`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get moderators');
    }

    return response.json();
  }

  async createModerator(moderatorData: any) {
    const response = await fetch(`${API_BASE_URL}/moderators/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(moderatorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create moderator');
    }

    return response.json();
  }

  async updateModeratorPermissions(moderatorId: number, permissions: any) {
    const response = await fetch(`${API_BASE_URL}/moderators/${moderatorId}/permissions`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update moderator permissions');
    }

    return response.json();
  }

  async deactivateModerator(moderatorId: number) {
    const response = await fetch(`${API_BASE_URL}/moderators/${moderatorId}/deactivate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to deactivate moderator');
    }

    return response.json();
  }

  // Additional Vendor Management Methods
  async deleteVendor(id: number) {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete vendor');
    }

    return response.json();
  }

  async updateVendorStatus(id: number, isActive: boolean) {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update vendor status');
    }

    return response.json();
  }

  // User Management
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get users');
    }

    return response.json();
  }

  async getUserById(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get user');
    }

    return response.json();
  }

  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    return response.json();
  }

  async updateUserRole(id: number, role: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user role');
    }

    return response.json();
  }
}

export const adminService = new AdminService();
