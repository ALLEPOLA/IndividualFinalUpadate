import React from 'react';
import { type Event } from '../../../services/eventService';

interface VendorEventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (event: Event) => void;
  onCancel?: (event: Event) => void;
}

export const VendorEventDetailModal: React.FC<VendorEventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !event) return null;

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (paymentStatus: Event['payment_status']) => {
    switch (paymentStatus) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'advance_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'fully_paid':
        return 'bg-green-100 text-green-800';
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

  const canConfirm = event.status === 'pending';
  const canCancel = event.status !== 'cancelled';

  const handleConfirm = () => {
    if (window.confirm('Are you sure you want to confirm this event booking? This will notify the client.')) {
      onConfirm?.(event);
      onClose();
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this event booking? This action cannot be undone.')) {
      onCancel?.(event);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/50 to-purple-800/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4 animate-fadeIn">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>🎉</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>📅</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💰</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>✨</div>
      <div className="absolute top-1/2 left-8 text-lg animate-bounce opacity-20" style={{ animationDelay: '3s' }}>🎭</div>
      <div className="absolute top-1/3 right-8 text-lg animate-bounce opacity-20" style={{ animationDelay: '3.5s' }}>🎊</div>
      
      <div className="relative top-5 mx-auto p-4 border border-purple-200/50 w-11/12 max-w-4xl shadow-2xl rounded-2xl bg-white/95 backdrop-blur-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-slideInUp hover:shadow-3xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-purple-800 mb-1">{event.name}</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border shadow-sm ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              {event.payment_status && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getPaymentStatusColor(event.payment_status)}`}>
                  {event.payment_status === 'pending' ? 'Payment Pending' :
                   event.payment_status === 'advance_paid' ? 'Advance Paid' :
                   'Fully Paid'}
                </span>
              )}
              <span className="text-sm text-purple-600 font-medium">
                Created: {new Date(event.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-600 focus:outline-none transition-all duration-300 transform hover:scale-110 hover:rotate-90 p-2 rounded-full hover:bg-purple-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Event Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 shadow-sm">
              <h3 className="text-base font-semibold text-purple-800 mb-3">Event Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-purple-700">Type:</span>
                  <p className="text-purple-800 font-medium">{event.type}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-purple-700">Date:</span>
                  <p className="text-purple-800 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.date)}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-purple-700">Time:</span>
                  <p className="text-purple-800 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 shadow-sm">
              <h3 className="text-base font-semibold text-purple-800 mb-3">Description</h3>
              <p className="text-purple-700 text-sm leading-relaxed">{event.description}</p>
            </div>

            {/* Special Requirements */}
            {event.special_requirements && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 shadow-sm">
                <h3 className="text-base font-semibold text-yellow-800 mb-3">Special Requirements</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">{event.special_requirements}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Services Required */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 shadow-sm">
              <h3 className="text-base font-semibold text-blue-800 mb-3">Services Required</h3>
              
              <div className="space-y-3">
                {event.services && Array.isArray(event.services) && event.services.length > 0 ? (
                  event.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full p-1.5 mr-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 text-sm">{service.name}</h4>
                        <p className="text-xs text-blue-600">Service ID: {service.id}</p>
                        {service.advance_percentage && (
                          <p className="text-xs text-blue-500">Advance: {service.advance_percentage}%</p>
                        )}
                      </div>
                    </div>
                    {service.base_price && (
                      <div className="text-right">
                        <p className="font-medium text-blue-800 text-sm">${service.base_price}</p>
                        {service.advance_percentage && (
                          <p className="text-xs text-blue-600 font-semibold">
                            ${((Number(service.base_price) * Number(service.advance_percentage)) / 100).toFixed(2)} advance
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  ))
                ) : (
                  <div className="text-center py-2">
                    <p className="text-blue-500 font-medium text-sm">No services required for this event.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Summary */}
            {event.total_amount && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 shadow-sm">
                <h3 className="text-base font-semibold text-green-800 mb-3">Revenue Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-green-200 shadow-sm">
                    <span className="font-medium text-green-700 text-sm">Total Revenue:</span>
                    <span className="text-lg font-bold text-green-800">${event.total_amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-orange-200 shadow-sm">
                    <div>
                      <span className="font-medium text-orange-700 text-sm">Advance Expected:</span>
                      <p className="text-xs text-orange-600">({Number(event.advance_percentage || 0).toFixed(1)}% of total)</p>
                    </div>
                    <span className="text-lg font-bold text-orange-600">${event.advance_amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-blue-200 shadow-sm">
                    <span className="font-medium text-blue-700 text-sm">Balance Due:</span>
                    <span className="text-lg font-bold text-blue-600">${event.remaining_amount}</span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex justify-between items-center p-3 bg-white rounded-md border border-purple-200 shadow-sm">
                    <span className="font-medium text-purple-700 text-sm">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getPaymentStatusColor(event.payment_status)}`}>
                      {event.payment_status === 'pending' ? 'Payment Pending' :
                       event.payment_status === 'advance_paid' ? 'Advance Paid' :
                       'Fully Paid'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 shadow-sm">
              <h3 className="text-base font-semibold text-purple-800 mb-3">Booking Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-700">Current Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-700">Last Updated:</span>
                  <span className="text-xs text-purple-800 font-medium">
                    {new Date(event.updatedAt!).toLocaleDateString()}
                  </span>
                </div>

                {event.status === 'pending' && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-md shadow-sm">
                    <p className="text-xs text-yellow-800 flex items-center font-medium">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      This booking is awaiting your confirmation.
                    </p>
                  </div>
                )}

                {event.status === 'confirmed' && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-md shadow-sm">
                    <p className="text-xs text-green-800 flex items-center font-medium">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      This booking has been confirmed.
                    </p>
                  </div>
                )}

                {event.status === 'cancelled' && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 rounded-md shadow-sm">
                    <p className="text-xs text-red-800 flex items-center font-medium">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      This booking has been cancelled.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-sm"
          >
            Close
          </button>
          
          <div className="flex space-x-2">
            {canConfirm && onConfirm && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 border border-transparent rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm
              </button>
            )}
            
            {canCancel && onCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 border border-transparent rounded-lg hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
