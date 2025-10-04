import { useState, useEffect } from 'react';
import { eventService, type Event } from '../../../../services/eventService';

export const Payments = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'advance_paid' | 'fully_paid'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getUserEvents();
      if (response.success && response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load payment data');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredEvents = () => {
    // Only show events with confirmed status
    const confirmedEvents = events.filter(event => event.status === 'confirmed');
    
    if (filter === 'all') {
      return confirmedEvents;
    }
    return confirmedEvents.filter(event => event.payment_status === filter);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'advance_paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Advance Paid</span>;
      case 'fully_paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Fully Paid</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'confirmed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getAmountToPay = (event: Event) => {
    if (event.payment_status === 'pending') {
      return Number(event.advance_amount || 0);
    } else if (event.payment_status === 'advance_paid') {
      return Number(event.remaining_amount || 0);
    }
    return 0;
  };

  const getPaymentType = (event: Event) => {
    if (event.payment_status === 'pending') {
      return 'Advance Payment';
    } else if (event.payment_status === 'advance_paid') {
      return 'Remaining Payment';
    }
    return 'No Payment Required';
  };

  if (isLoading) {
    return (
      <div className="p-6 relative overflow-hidden">
        {/* Minimal Floating Decorative Elements */}
        <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            💳 Payments
          </h1>
          <p className="text-gray-600 mb-8">Manage your event payments and transactions</p>
          {/* Light Purple Underline */}
          <div className="w-20 h-0.5 bg-purple-300 rounded-full mb-8"></div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading payment data...</span>
          </div>
        </div>
      </div>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Minimal Floating Decorative Elements */}
      <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-700 mb-2">
              💳 Payments
            </h1>
            <p className="text-gray-600">Manage your event payments and transactions</p>
            {/* Light Purple Underline */}
            <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
          </div>
          <button
            onClick={loadEvents}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-300"
          >
            🔄 Refresh
          </button>
        </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Payments' },
              { key: 'advance_paid', label: 'Advance Paid' },
              { key: 'fully_paid', label: 'Fully Paid' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  filter === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Payment Cards */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? 'You don\'t have any events yet.' : `No ${filter.replace('_', ' ')} payments found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.type} • {event.date} at {event.start_time}</p>
                </div>
                <div className="flex space-x-2">
                  {getEventStatusBadge(event.status)}
                  {getPaymentStatusBadge(event.payment_status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Amount */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <span className="mr-1">💰</span>
                    Total Amount
                  </p>
                  <p className="text-lg font-semibold text-gray-900">${Number(event.total_amount || 0).toFixed(2)}</p>
                </div>

                {/* Advance Amount */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm font-medium text-blue-600 flex items-center">
                    <span className="mr-1">📋</span>
                    Advance Amount
                  </p>
                  <p className="text-lg font-semibold text-blue-900">${Number(event.advance_amount || 0).toFixed(2)}</p>
                </div>

                {/* Paid Amount */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-sm font-medium text-green-600 flex items-center">
                    <span className="mr-1">✅</span>
                    Paid Amount
                  </p>
                  <p className="text-lg font-semibold text-green-900">${Number(event.paid_amount || 0).toFixed(2)}</p>
                </div>

                {/* Amount to Pay */}
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <p className="text-sm font-medium text-yellow-600 flex items-center">
                    <span className="mr-1">⏳</span>
                    Amount to Pay
                  </p>
                  <p className="text-lg font-semibold text-yellow-900">${getAmountToPay(event).toFixed(2)}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment Type:</span> {getPaymentType(event)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Vendor:</span> {event.vendor_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Advance %:</span> {Number(event.advance_percentage || 0).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Created:</span> {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
