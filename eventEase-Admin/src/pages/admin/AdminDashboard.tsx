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
import { EventEaseLogo } from '../../components/EventEaseLogo';

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
          <div className="p-6 space-y-6 relative overflow-hidden">
            {/* Minimal Floating Decorative Elements */}
            <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
            <div className="absolute top-8 right-8 text-sm animate-bounce opacity-20" style={{ animationDelay: '1.5s' }}>🏢</div>
            
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-purple-700">
                  🏢 Vendor Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and monitor vendor accounts</p>
                {/* Light Purple Underline */}
                <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
              </div>
              <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🔒</div>
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
          <div className="p-6 space-y-6 relative overflow-hidden">
            {/* Minimal Floating Decorative Elements */}
            <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
            <div className="absolute top-8 right-8 text-sm animate-bounce opacity-20" style={{ animationDelay: '1.5s' }}>👥</div>
            
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-purple-700">
                  👥 User Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
                {/* Light Purple Underline */}
                <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
              </div>
              <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                {users.length} regular user{users.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🔒</div>
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
          <div className="p-6 space-y-6 relative overflow-hidden">
            {/* Minimal Floating Decorative Elements */}
            <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
            <div className="absolute top-8 right-8 text-sm animate-bounce opacity-20" style={{ animationDelay: '1.5s' }}>📅</div>
            
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-purple-700">
                  📅 Event Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and monitor all events</p>
                {/* Light Purple Underline */}
                <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
              </div>
              <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                {events.length} event{events.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🔒</div>
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
          <div className="p-6 space-y-6 relative overflow-hidden">
            {/* Minimal Floating Decorative Elements */}
            <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
            <div className="absolute top-8 right-8 text-sm animate-bounce opacity-20" style={{ animationDelay: '1.5s' }}>💰</div>
            
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-purple-700">
                  💰 Financial Management
                </h1>
                <p className="text-gray-600 mt-1">Monitor payments and financial transactions</p>
                {/* Light Purple Underline */}
                <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
              </div>
              <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                {payments.length} payment{payments.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
              <div className="p-6">
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🔒</div>
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
          <div className="p-6 space-y-6 relative overflow-hidden">
            {/* Minimal Floating Decorative Elements */}
            <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
            <div className="absolute top-8 right-8 text-sm animate-bounce opacity-20" style={{ animationDelay: '1.5s' }}>⚙️</div>
            
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-purple-700">
                  ⚙️ System Administration
                </h1>
                <p className="text-gray-600 mt-1">Manage moderators and system settings</p>
                {/* Light Purple Underline */}
                <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
              </div>
              {moderator && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 border-2 border-purple-400 hover:scale-105 flex items-center space-x-2"
                >
                  <span className="text-lg">➕</span>
                  <span>Create Moderator</span>
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                  <span className="mr-2">👥</span>
                  Moderator Management
                </h3>
                
                {!moderator ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🔒</div>
                    <p>Please log in to access moderator management.</p>
                  </div>
                ) : isLoadingModerators ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Loading moderators...</span>
                  </div>
                ) : moderators.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">👥</div>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 backdrop-blur-sm shadow-lg border-b-2 border-purple-400 px-6 py-4 relative overflow-hidden">
        {/* Very Colorful Floating Elements */}
        <div className="absolute top-2 left-12 text-xl animate-bounce opacity-70" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-3 right-20 text-xl animate-bounce opacity-70" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute top-4 left-40 text-lg animate-bounce opacity-60" style={{ animationDelay: '3s' }}>💫</div>
        <div className="absolute bottom-2 right-12 text-lg animate-bounce opacity-60" style={{ animationDelay: '4s' }}>⭐</div>
        <div className="absolute bottom-3 left-24 text-sm animate-bounce opacity-50" style={{ animationDelay: '5s' }}>👑</div>
        <div className="absolute top-5 right-40 text-sm animate-bounce opacity-50" style={{ animationDelay: '6s' }}>🎊</div>
        
        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <div className="flex items-center">
            <EventEaseLogo />
            <span className="ml-4 text-lg font-semibold text-purple-700">Admin Portal</span>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-6">
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent animate-pulse">
                Welcome, {moderator?.firstName || 'Admin'}! 👋
              </p>
              <p className="text-xs text-purple-700 font-semibold">{moderator?.email || 'admin@eventease.com'}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 border-2 border-red-400 hover:scale-110 hover:rotate-1"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </span>
            </button>
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
