import { useState, useEffect } from 'react';
import { eventService, type Event, type EventTeamMember } from '../../../../services/eventService';
import { eventTeamMemberService } from '../../../../services/eventTeamMemberService';
import { VendorEventCard } from '../../../../components/dashboards/vendorDashboard/VendorEventCard';
import { VendorEventDetailModal } from '../../../../components/dashboards/vendorDashboard/VendorEventDetailModal';
import { TeamMemberModal } from '../../../../components/dashboards/vendorDashboard/TeamMemberModal';
import { useUserStore } from '../../../../stores/userStore';

type EventWithTeamMembers = Event & { team_members?: EventTeamMember[] };

export const Bookings = () => {
  const [events, setEvents] = useState<EventWithTeamMembers[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithTeamMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventWithTeamMembers | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Team Member Modal
  const [selectedEventForTeam, setSelectedEventForTeam] = useState<EventWithTeamMembers | null>(null);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<Event['status'] | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<Event['payment_status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { vendor } = useUserStore();

  useEffect(() => {
    if (vendor?.id) {
      loadVendorEvents();
    }
  }, [vendor]);

  useEffect(() => {
    applyFilters();
  }, [events, statusFilter, paymentFilter, searchQuery]);

  const loadVendorEvents = async () => {
    if (!vendor?.id) return;
    
    try {
      setIsLoading(true);
      const response = await eventService.getEventsByVendor(vendor.id);
      if (response.success && response.data && Array.isArray(response.data)) {
        // Load team members for each event
        const eventsWithTeamMembers = await Promise.all(
          response.data.map(async (event) => {
            try {
              if (event.team_members) {
                // Parse team_members if it's a string
                const teamMembers = typeof event.team_members === 'string' 
                  ? JSON.parse(event.team_members) 
                  : event.team_members;
                return { ...event, team_members: teamMembers };
              }
              return { ...event, team_members: [] };
            } catch (error) {
              console.error('Error parsing team members for event:', event.id, error);
              return { ...event, team_members: [] };
            }
          })
        );
        setEvents(eventsWithTeamMembers);
      }
    } catch (error) {
      console.error('Error loading vendor events:', error);
      alert('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(event => event.payment_status === paymentFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleViewDetails = (event: EventWithTeamMembers) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleAssignTeamMembers = (event: EventWithTeamMembers) => {
    setSelectedEventForTeam(event);
    setIsTeamMemberModalOpen(true);
  };

  const handleTeamMembersUpdated = (teamMembers: EventTeamMember[]) => {
    // Update the event in the local state
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === selectedEventForTeam?.id 
          ? { ...event, team_members: teamMembers }
          : event
      )
    );
    
    // Close the modal
    setIsTeamMemberModalOpen(false);
    setSelectedEventForTeam(null);
  };

  const handleConfirmEvent = async (event: Event) => {
    try {
      const response = await eventService.updateEventStatus(event.id!, 'confirmed');
      if (response.success) {
        await loadVendorEvents(); // Reload events after update
        alert('Event confirmed successfully!');
      } else {
        throw new Error(response.message || 'Failed to confirm event');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to confirm event');
    }
  };

  const handleCancelEvent = async (event: Event) => {
    try {
      const response = await eventService.updateEventStatus(event.id!, 'cancelled');
      if (response.success) {
        await loadVendorEvents(); // Reload events after update
        alert('Event cancelled successfully');
      } else {
        throw new Error(response.message || 'Failed to cancel event');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to cancel event');
    }
  };

  const getBookingStats = () => {
    const total = events.length;
    const pending = events.filter(e => e.status === 'pending').length;
    const confirmed = events.filter(e => e.status === 'confirmed').length;
    const cancelled = events.filter(e => e.status === 'cancelled').length;
    
    const totalRevenue = events
      .filter(e => e.status !== 'cancelled')
      .reduce((sum, e) => sum + (Number(e.total_amount) || 0), 0);
      
    const advanceReceived = events
      .filter(e => e.payment_status === 'advance_paid' || e.payment_status === 'fully_paid')
      .reduce((sum, e) => sum + (Number(e.advance_amount) || 0), 0);
    
    return { total, pending, confirmed, cancelled, totalRevenue, advanceReceived };
  };

  const stats = getBookingStats();

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <div className="text-center">
              <span className="text-lg text-gray-600 font-medium">Loading bookings...</span>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your bookings</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <div className="mb-8 relative z-10 animate-fadeIn">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3">
          Bookings Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage all your event bookings and track revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 font-medium">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-yellow-100/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-sm text-gray-600 font-medium">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-red-100/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-sm text-gray-600 font-medium">Cancelled</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-700">${stats.advanceReceived.toFixed(0)}</p>
              <p className="text-sm text-gray-600 font-medium">Advance Received</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-purple-100/50 relative z-10 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
        <h2 className="text-xl font-bold text-purple-700 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filter Bookings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300"
              placeholder="Search bookings..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Event['status'] | 'all')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as Event['payment_status'] | 'all')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300"
            >
              <option value="all">All Payments</option>
              <option value="pending">Payment Pending</option>
              <option value="advance_paid">Advance Paid</option>
              <option value="fully_paid">Fully Paid</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setPaymentFilter('all');
                setSearchQuery('');
              }}
              className="w-full px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-purple-100/50 relative z-10 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-xl font-bold text-purple-700 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setStatusFilter('pending')}
            className="inline-flex items-center px-6 py-3 border border-yellow-300 shadow-lg text-sm font-semibold rounded-xl text-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Pending ({stats.pending})
          </button>
          
          <button
            onClick={() => setPaymentFilter('pending')}
            className="inline-flex items-center px-6 py-3 border border-red-300 shadow-lg text-sm font-semibold rounded-xl text-red-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Payment Pending
          </button>

          <button
            onClick={loadVendorEvents}
            className="inline-flex items-center px-6 py-3 border border-purple-300 shadow-lg text-sm font-semibold rounded-xl text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center border border-purple-200/50 relative z-10 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
          <div className="text-6xl mb-6 animate-bounce">📅</div>
          <svg className="mx-auto h-16 w-16 text-purple-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No bookings found</h3>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            {events.length === 0 
              ? "You don't have any event bookings yet. Bookings will appear here when clients book your services."
              : "No bookings match your current filters. Try adjusting your search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <VendorEventCard
                event={event}
                onView={() => handleViewDetails(event)}
                onConfirm={() => handleConfirmEvent(event)}
                onCancel={() => handleCancelEvent(event)}
                onAssignTeamMembers={() => handleAssignTeamMembers(event)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <VendorEventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleConfirmEvent}
        onCancel={handleCancelEvent}
      />

      {/* Team Member Assignment Modal */}
      {selectedEventForTeam && (
        <TeamMemberModal
          isOpen={isTeamMemberModalOpen}
          onClose={() => {
            setIsTeamMemberModalOpen(false);
            setSelectedEventForTeam(null);
          }}
          eventId={selectedEventForTeam.id!}
          eventName={selectedEventForTeam.name}
          currentTeamMembers={selectedEventForTeam.team_members || []}
          onTeamMembersUpdated={handleTeamMembersUpdated}
        />
      )}
    </div>
  );
};