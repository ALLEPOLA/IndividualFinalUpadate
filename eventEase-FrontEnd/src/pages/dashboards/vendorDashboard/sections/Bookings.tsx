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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
        <p className="text-gray-600">
          Manage all your event bookings and track revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-xs text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">${stats.advanceReceived.toFixed(0)}</p>
              <p className="text-xs text-gray-600">Advance Received</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Bookings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search bookings..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Event['status'] | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as Event['payment_status'] | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter('pending')}
            className="inline-flex items-center px-4 py-2 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Pending ({stats.pending})
          </button>
          
          <button
            onClick={() => setPaymentFilter('pending')}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Payment Pending
          </button>

          <button
            onClick={loadVendorEvents}
            className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
      <p className="text-gray-600">
            {events.length === 0 
              ? "You don't have any event bookings yet. Bookings will appear here when clients book your services."
              : "No bookings match your current filters. Try adjusting your search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <VendorEventCard
              key={event.id}
              event={event}
              onView={() => handleViewDetails(event)}
              onConfirm={() => handleConfirmEvent(event)}
              onCancel={() => handleCancelEvent(event)}
              onAssignTeamMembers={() => handleAssignTeamMembers(event)}
            />
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