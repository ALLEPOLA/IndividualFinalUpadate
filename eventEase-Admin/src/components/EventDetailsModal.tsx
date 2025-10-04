import React from 'react';

interface Event {
  id: number;
  name: string;
  description: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  special_requirements?: string;
  vendor_id?: number;
  vendor_name?: string;
  user_id: number;
  status: string;
  payment_status: string;
  total_amount: number;
  advance_amount: number;
  remaining_amount: number;
  paid_amount: number;
  createdAt: string;
  updatedAt: string;
  services: any[];
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  if (!isOpen || !event) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fully_paid':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-lg">
                  {event.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
                <p className="text-gray-600">Event Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                    <p className="text-sm text-gray-900">{event.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Type</label>
                    <p className="text-sm text-gray-900">{event.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{event.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event ID</label>
                    <p className="text-sm text-gray-900 font-mono">{event.id}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Date</label>
                    <p className="text-sm text-gray-900">{formatDate(event.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <p className="text-sm text-gray-900">{formatTime(event.start_time)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <p className="text-sm text-gray-900">{formatTime(event.end_time)}</p>
                  </div>
                  {event.special_requirements && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
                      <p className="text-sm text-gray-900">{event.special_requirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {event.user ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <p className="text-sm text-gray-900">{event.user.firstName} {event.user.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{event.user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{event.user.phone}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Customer information not available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor & Status Information */}
            <div className="space-y-6">
              {/* Vendor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor</label>
                    <p className="text-sm text-gray-900">
                      {event.vendor_name || 'Not Assigned'}
                    </p>
                  </div>
                  {event.vendor_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
                      <p className="text-sm text-gray-900 font-mono">{event.vendor_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(event.payment_status)}`}>
                      {event.payment_status.replace('_', ' ').charAt(0).toUpperCase() + event.payment_status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-sm text-gray-900 font-semibold">{formatCurrency(event.total_amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Advance Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(event.advance_amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(event.paid_amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(event.remaining_amount)}</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {event.services && event.services.length > 0 ? (
                    <div className="space-y-2">
                      {event.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.description}</p>
                          </div>
                          <p className="text-sm text-gray-900">{formatCurrency(service.base_price || 0)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No services assigned</p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {new Date(event.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
