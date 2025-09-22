import React from 'react';
import { type Event, type EventTeamMember } from '../../../services/eventService';

interface VendorEventCardProps {
  event: Event & { team_members?: EventTeamMember[] };
  onView: (event: Event) => void;
  onConfirm: (event: Event) => void;
  onCancel: (event: Event) => void;
  onAssignTeamMembers?: (event: Event) => void;
}

export const VendorEventCard: React.FC<VendorEventCardProps> = ({
  event,
  onView,
  onConfirm,
  onCancel,
  onAssignTeamMembers,
}) => {
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
      year: 'numeric',
      month: 'short',
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

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to confirm this event booking?')) {
      onConfirm(event);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this event booking? This action cannot be undone.')) {
      onCancel(event);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onView(event)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {event.type}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            {event.payment_status && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(event.payment_status)}`}>
                {event.payment_status === 'pending' ? 'Payment Pending' :
                 event.payment_status === 'advance_paid' ? 'Advance Paid' :
                 'Fully Paid'}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncateText(event.description)}
        </p>

        {/* Services */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Services Required:</p>
          <div className="flex flex-wrap gap-2">
            {event.services && Array.isArray(event.services) && event.services.length > 0 ? (
              <>
                {event.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {service.name}
                  </span>
                ))}
                {event.services.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{event.services.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">No services required</span>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Team Members:</p>
            {onAssignTeamMembers && (
              <button
                onClick={() => onAssignTeamMembers(event)}
                className="inline-flex items-center px-2 py-1 border border-purple-300 shadow-sm text-xs font-medium rounded text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Assign Team
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {event.team_members && event.team_members.length > 0 ? (
              event.team_members.map((member, index) => (
                <span
                  key={member.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {member.name} - {member.role}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No team members assigned</span>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        {event.total_amount && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Total:</span>
                <p className="font-medium text-gray-900">${event.total_amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Advance:</span>
                <p className="font-medium text-orange-600">${event.advance_amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Remaining:</span>
                <p className="font-medium text-blue-600">${event.remaining_amount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Special Requirements */}
        {event.special_requirements && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Special Requirements:</p>
            <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded">
              {truncateText(event.special_requirements, 80)}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(event)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          
          <div className="flex space-x-2">
            {canConfirm && (
              <button
                onClick={handleConfirm}
                className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm
              </button>
            )}
            
            {canCancel && (
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
