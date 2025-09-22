import type { Event } from '../../../services/eventService';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: number) => void;
}

export const EventDetailModal = ({ event, isOpen, onClose, onEdit, onDelete }: EventDetailModalProps) => {
  if (!isOpen || !event) return null;

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canEdit = event.status !== 'confirmed';
  const canDelete = event.status === 'pending';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <span className="text-sm text-gray-600">
                Created: {new Date(event.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <p className="text-gray-900">{event.type}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <p className="text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.date)}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Time:</span>
                  <p className="text-gray-900 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Special Requirements */}
            {event.special_requirements && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requirements</h3>
                <p className="text-gray-700 leading-relaxed">{event.special_requirements}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Vendor Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
              
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{event.vendor_name}</h4>
                  <p className="text-sm text-gray-600">Event Vendor</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Services</h3>
              
              <div className="space-y-3">
                {event.services && Array.isArray(event.services) && event.services.length > 0 ? (
                  event.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-green-200">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">Service ID: {service.id}</p>
                        {service.advance_percentage && (
                          <p className="text-sm text-gray-500">Advance: {service.advance_percentage}%</p>
                        )}
                      </div>
                    </div>
                    {service.base_price && (
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${service.base_price}</p>
                        {service.advance_percentage && (
                          <p className="text-sm text-green-600">
                            ${((Number(service.base_price) * Number(service.advance_percentage)) / 100).toFixed(2)} advance
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No services selected for this event.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Summary */}
            {event.total_amount && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-blue-200">
                    <span className="font-medium text-gray-700">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900">${event.total_amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-orange-200">
                    <div>
                      <span className="font-medium text-gray-700">Advance Payment:</span>
                      <p className="text-sm text-gray-600">({Number(event.advance_percentage || 0).toFixed(1)}% of total)</p>
                    </div>
                    <span className="text-xl font-bold text-orange-600">${event.advance_amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-blue-200">
                    <span className="font-medium text-gray-700">Remaining Amount:</span>
                    <span className="text-xl font-bold text-blue-600">${event.remaining_amount}</span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200">
                    <span className="font-medium text-gray-700">Payment Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.payment_status === 'pending' ? 'bg-red-100 text-red-800' :
                      event.payment_status === 'advance_paid' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.payment_status === 'pending' ? 'Payment Pending' :
                       event.payment_status === 'advance_paid' ? 'Advance Paid' :
                       'Fully Paid'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(event.updatedAt!).toLocaleDateString()}
                  </span>
                </div>

                {event.status === 'confirmed' && (
                  <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
                    <p className="text-sm text-yellow-800 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      This event is confirmed and cannot be edited.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          
          <div className="flex space-x-3">
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Event
              </button>
            )}
            
            {canDelete && onDelete && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                    onDelete(event.id!);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
