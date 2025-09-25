import { useState, useEffect } from 'react';
import { eventService, type Event } from '../../../../services/eventService';
import { EventCard } from '../../../../components/dashboards/userDashboard/EventCard';
import { EventDetailModal } from '../../../../components/dashboards/userDashboard/EventDetailModal';
import { EventFormModal } from '../../../../components/dashboards/userDashboard/EventFormModal';
import { PaymentModal } from '../../../../components/PaymentModal';

export const AllEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentEvent, setPaymentEvent] = useState<Event | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<Event['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, statusFilter, typeFilter, searchQuery]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getUserEvents();
      if (response.success && response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events');
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

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.vendor_name.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await eventService.deleteEvent(eventId);
      if (response.success) {
        await loadEvents(); // Reload events after deletion
        alert('Event deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete event');
    }
  };

  const handleEditSuccess = () => {
    loadEvents(); // Reload events after update
  };

  const handlePay = (event: Event) => {
    setPaymentEvent(event);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    loadEvents(); // Reload events after payment
    setIsPaymentModalOpen(false);
    setPaymentEvent(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentEvent(null);
  };

  const getUniqueTypes = () => {
    const types = events.map(event => event.type);
    return Array.from(new Set(types));
  };

  const getEventStats = () => {
    const total = events.length;
    const pending = events.filter(e => e.status === 'pending').length;
    const confirmed = events.filter(e => e.status === 'confirmed').length;
    const cancelled = events.filter(e => e.status === 'cancelled').length;
    
    return { total, pending, confirmed, cancelled };
  };

  const stats = getEventStats();
  const uniqueTypes = getUniqueTypes();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Minimal Floating Decorative Elements */}
      <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          📅 All Events
        </h1>
        <p className="text-gray-600">
          Manage and track all your events in one place
        </p>
        {/* Light Purple Underline */}
        <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl text-blue-600">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-xl text-yellow-600">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm font-medium text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl text-green-600">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-xl text-red-600">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 relative z-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-lg mr-2">🔍</span>
          Filters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              placeholder="Search events..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Event['status'] | 'all')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center relative z-10">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {events.length === 0 
              ? "You haven't created any events yet. Create your first event to get started!"
              : "No events match your current filters. Try adjusting your search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPay={handlePay}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EventFormModal
        event={selectedEvent}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <PaymentModal
        event={paymentEvent}
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
