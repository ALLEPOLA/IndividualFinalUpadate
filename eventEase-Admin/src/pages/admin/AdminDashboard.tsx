import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { adminService } from '../../services/adminService';
import type { Moderator } from '../../stores/adminStore';
import ModeratorCard from '../../components/ModeratorCard';
import CreateModeratorModal from '../../components/CreateModeratorModal';
import VendorTable from '../../components/VendorTable';
import VendorDetailsModal from '../../components/VendorDetailsModal';
import UserTable from '../../components/UserTable';
import UserDetailsModal from '../../components/UserDetailsModal';
import EventTable from '../../components/EventTable';
import EventDetailsModal from '../../components/EventDetailsModal';
import PaymentTable from '../../components/PaymentTable';
import DashboardOverview from '../../components/DashboardOverview';

interface AdminDashboardProps {}

function AdminDashboard({}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();
  const { moderator, logout } = useAdminAuth();
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingModerators, setIsLoadingModerators] = useState(false);
  const [isCreatingModerator, setIsCreatingModerator] = useState(false);
  
  // Vendor management state
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [isVendorDetailsOpen, setIsVendorDetailsOpen] = useState(false);

  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  // Event management state
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  // Payment management state
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Dashboard analytics state
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Load moderators when system admin section is active and user is authenticated
  useEffect(() => {
    if (activeSection === 'system' && moderator) {
      loadModerators();
    }
  }, [activeSection, moderator]);

  // Load vendors when vendor management section is active and user is authenticated
  useEffect(() => {
    if (activeSection === 'vendors' && moderator) {
      loadVendors();
    }
  }, [activeSection, moderator]);

  // Load users when user management section is active and user is authenticated
  useEffect(() => {
    if (activeSection === 'users' && moderator) {
      loadUsers();
    }
  }, [activeSection, moderator]);

  // Load events when event management section is active and user is authenticated
  useEffect(() => {
    if (activeSection === 'events' && moderator) {
      loadEvents();
    }
  }, [activeSection, moderator]);

  // Load payments when financial management section is active and user is authenticated
  useEffect(() => {
    if (activeSection === 'financial' && moderator) {
      loadPayments();
    }
  }, [activeSection, moderator]);

  // Load dashboard stats when overview section is active and user is authenticated
  useEffect(() => {
    if (activeSection === 'overview' && moderator) {
      loadDashboardStats();
    }
  }, [activeSection, moderator]);

  const loadModerators = async () => {
    try {
      setIsLoadingModerators(true);
      const response = await adminService.getAllModerators();
      setModerators(response.moderators || []);
    } catch (error) {
      console.error('Failed to load moderators:', error);
    } finally {
      setIsLoadingModerators(false);
    }
  };

  const handleCreateModerator = async (data: any) => {
    try {
      setIsCreatingModerator(true);
      await adminService.createModerator(data);
      await loadModerators(); // Refresh the list
    } catch (error) {
      throw error; // Let the modal handle the error display
    } finally {
      setIsCreatingModerator(false);
    }
  };

  const handleDeactivateModerator = async (moderatorToDeactivate: Moderator) => {
    if (window.confirm(`Are you sure you want to deactivate ${moderatorToDeactivate.firstName} ${moderatorToDeactivate.lastName}?`)) {
      try {
        await adminService.deactivateModerator(moderatorToDeactivate.id);
        await loadModerators(); // Refresh the list
      } catch (error) {
        console.error('Failed to deactivate moderator:', error);
        alert('Failed to deactivate moderator');
      }
    }
  };

  // Vendor management functions
  const loadVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await adminService.getAllVendors();
      setVendors(response.data || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const handleViewVendor = async (vendor: any) => {
    try {
      const response = await adminService.getVendorById(vendor.id);
      setSelectedVendor(response.data);
      setIsVendorDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load vendor details:', error);
      alert('Failed to load vendor details');
    }
  };

  const handleDeleteVendor = async (vendor: any) => {
    if (window.confirm(`Are you sure you want to delete ${vendor.businessName}? This action cannot be undone.`)) {
      try {
        await adminService.deleteVendor(vendor.id);
        await loadVendors(); // Refresh the list
        alert('Vendor deleted successfully');
      } catch (error) {
        console.error('Failed to delete vendor:', error);
        alert('Failed to delete vendor');
      }
    }
  };

  // User management functions
  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleViewUser = async (user: any) => {
    try {
      const response = await adminService.getUserById(user.id);
      setSelectedUser(response.data);
      setIsUserDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
      alert('Failed to load user details');
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(user.id);
        await loadUsers(); // Refresh the list
        alert('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  // Event management functions
  const loadEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const response = await adminService.getAllEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleViewEvent = async (event: any) => {
    try {
      const response = await adminService.getEventById(event.id);
      setSelectedEvent(response.data);
      setIsEventDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load event details:', error);
      alert('Failed to load event details');
    }
  };

  const handleDeleteEvent = async (event: any) => {
    if (window.confirm(`Are you sure you want to delete "${event.name}"? This action cannot be undone.`)) {
      try {
        await adminService.deleteEvent(event.id);
        await loadEvents(); // Refresh the list
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event');
      }
    }
  };

  // Payment management functions
  const loadPayments = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await adminService.getPayments();
      setPayments(response.data || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  // Dashboard analytics functions
  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await adminService.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const menuItems = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      icon: '📊',
      description: 'System statistics and key metrics'
    },
    {
      id: 'vendors',
      title: 'Vendor Management',
      icon: '🏢',
      description: 'Manage vendors and their services'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: '👥',
      description: 'Manage user accounts and permissions'
    },
    {
      id: 'events',
      title: 'Event Management',
      icon: '🎉',
      description: 'Monitor and manage events'
    },
    {
      id: 'financial',
      title: 'Financial Management',
      icon: '💰',
      description: 'Payment tracking and financial reports'
    },
    {
      id: 'system',
      title: 'System Administration',
      icon: '⚙️',
      description: 'System settings and configurations'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <DashboardOverview
              stats={dashboardStats}
              isLoading={isLoadingStats}
            />
          </div>
        );
      case 'vendors':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p>Please log in to access vendor management.</p>
                  </div>
                ) : (
                  <VendorTable
                    vendors={vendors}
                    onView={handleViewVendor}
                    onDelete={handleDeleteVendor}
                    canManageVendors={moderator.permissions?.canManageVendors || false}
                    isLoading={isLoadingVendors}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {users.length} regular user{users.length !== 1 ? 's' : ''} found
                        </span>
                      </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p>Please log in to access user management.</p>
                  </div>
                ) : (
                  <UserTable
                    users={users}
                    onView={handleViewUser}
                    onDelete={handleDeleteUser}
                    canManageUsers={moderator.permissions?.canManageUsers || false}
                    isLoading={isLoadingUsers}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {events.length} event{events.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p>Please log in to access event management.</p>
                  </div>
                ) : (
                  <EventTable
                    events={events}
                    onView={handleViewEvent}
                    onDelete={handleDeleteEvent}
                    canManageEvents={moderator.permissions?.canManageEvents || false}
                    isLoading={isLoadingEvents}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {payments.length} payment{payments.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p>Please log in to access financial management.</p>
                  </div>
                ) : (
                  <PaymentTable
                    payments={payments}
                    isLoading={isLoadingPayments}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">System Administration</h2>
              {moderator && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Moderator
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderator Management</h3>
              
              {!moderator ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p>Please log in to access moderator management.</p>
                </div>
              ) : isLoadingModerators ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">Loading moderators...</span>
                </div>
              ) : moderators.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p>No moderators found. Create your first moderator to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moderators.map((mod) => (
                    <ModeratorCard
                      key={mod.id}
                      moderator={mod}
                      onDeactivate={handleDeactivateModerator}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">EventEase Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {moderator?.firstName || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Create Moderator Modal */}
      <CreateModeratorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateModerator}
        isLoading={isCreatingModerator}
      />

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={isVendorDetailsOpen}
        onClose={() => {
          setIsVendorDetailsOpen(false);
          setSelectedVendor(null);
        }}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isUserDetailsOpen}
        onClose={() => {
          setIsUserDetailsOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventDetailsOpen}
        onClose={() => {
          setIsEventDetailsOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}

export default AdminDashboard;
