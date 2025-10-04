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

  async deleteEvent(id: number) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete event');
    }

    return response.json();
  }

  async updateEventStatus(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update event status');
    }

    return response.json();
  }

  async updateEventPaymentStatus(id: number, paymentStatus: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}/payment-status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ payment_status: paymentStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update payment status');
    }

    return response.json();
  }

  // Financial Management - Get payment data from events
  async getPayments() {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get payments');
    }

    const result = await response.json();
    
    // Transform events data to payment data format
    const payments = result.data.map((event: any) => ({
      id: event.id,
      event_id: event.id,
      event_name: event.name,
      event_type: event.type,
      event_date: event.date,
      event_description: event.description,
      customer_name: `${event.customer_firstName} ${event.customer_lastName}`,
      customer_email: event.customer_email,
      customer_phone: event.customer_phone,
      vendor_name: event.vendor_name,
      vendor_id: event.vendor_id,
      total_amount: event.total_amount,
      advance_amount: event.advance_amount,
      paid_amount: event.paid_amount,
      remaining_amount: event.remaining_amount,
      payment_status: event.payment_status,
      advance_percentage: event.advance_percentage,
      services: event.services || [],
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    return { success: true, data: payments };
  }

  async getPaymentById(id: number) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get payment details');
    }

    const result = await response.json();
    const event = result.data;
    
    // Transform event data to payment data format
    const payment = {
      id: event.id,
      event_id: event.id,
      event_name: event.name,
      event_type: event.type,
      event_date: event.date,
      event_description: event.description,
      customer_name: `${event.customer_firstName} ${event.customer_lastName}`,
      customer_email: event.customer_email,
      customer_phone: event.customer_phone,
      vendor_name: event.vendor_name,
      vendor_id: event.vendor_id,
      total_amount: event.total_amount,
      advance_amount: event.advance_amount,
      paid_amount: event.paid_amount,
      remaining_amount: event.remaining_amount,
      payment_status: event.payment_status,
      advance_percentage: event.advance_percentage,
      services: event.services || [],
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };

    return { success: true, data: payment };
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

  // Dashboard Analytics
  async getDashboardStats() {
    try {
      // Fetch all data in parallel
      const [eventsResponse, usersResponse, vendorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/events`, { headers: this.getAuthHeaders() }),
        fetch(`${API_BASE_URL}/users`, { headers: this.getAuthHeaders() }),
        fetch(`${API_BASE_URL}/vendors`, { headers: this.getAuthHeaders() })
      ]);

      if (!eventsResponse.ok || !usersResponse.ok || !vendorsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [eventsData, usersData, vendorsData] = await Promise.all([
        eventsResponse.json(),
        usersResponse.json(),
        vendorsResponse.json()
      ]);

      const events = eventsData.data || [];
      const users = usersData.data || [];
      const vendors = vendorsData.data || [];

      // Calculate analytics
      const totalEvents = events.length;
      const totalUsers = users.length;
      const totalVendors = vendors.length;

      // Event status breakdown
      const pendingEvents = events.filter((e: any) => e.status === 'pending').length;
      const confirmedEvents = events.filter((e: any) => e.status === 'confirmed').length;
      const cancelledEvents = events.filter((e: any) => e.status === 'cancelled').length;

      // Payment status breakdown
      const pendingPayments = events.filter((e: any) => e.payment_status === 'pending').length;
      const paidPayments = events.filter((e: any) => e.payment_status === 'fully_paid' || e.payment_status === 'advance_paid').length;

      // Recent events (last 10, sorted by date)
      const recentEvents = events
        .sort((a: any, b: any) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
        .slice(0, 10);

      const stats = {
        totalEvents,
        totalUsers,
        totalVendors,
        pendingEvents,
        confirmedEvents,
        cancelledEvents,
        pendingPayments,
        paidPayments,
        recentEvents
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard analytics');
    }
  }
}

export const adminService = new AdminService();
