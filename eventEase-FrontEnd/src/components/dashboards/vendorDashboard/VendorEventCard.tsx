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
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 group"
      onClick={() => onView(event)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">{event.name}</h3>
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
              <span className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
              <span className="flex items-center bg-pink-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-semibold text-purple-700">{event.type}</span>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border shadow-lg backdrop-blur-sm ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            {event.payment_status && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm ${getPaymentStatusColor(event.payment_status)}`}>
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
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Services Required:
          </p>
          <div className="flex flex-wrap gap-2">
            {event.services && Array.isArray(event.services) && event.services.length > 0 ? (
              <>
                {event.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                  >
                    {service.name}
                  </span>
                ))}
                {event.services.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300">
                    +{event.services.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">No services required</span>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team Members:
            </p>
            {onAssignTeamMembers && (
              <button
                onClick={() => onAssignTeamMembers(event)}
                className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-lg text-xs font-semibold rounded-lg text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Assign Team
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {event.team_members && event.team_members.length > 0 ? (
              event.team_members.map((member, index) => (
                <span
                  key={member.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                >
                  {member.name} - {member.role}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">No team members assigned</span>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        {event.total_amount && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <span className="text-gray-600 font-medium">Total:</span>
                <p className="font-bold text-purple-700 text-lg">${event.total_amount}</p>
              </div>
              <div className="text-center">
                <span className="text-gray-600 font-medium">Advance:</span>
                <p className="font-bold text-pink-600 text-lg">${event.advance_amount}</p>
              </div>
              <div className="text-center">
                <span className="text-gray-600 font-medium">Remaining:</span>
                <p className="font-bold text-purple-600 text-lg">${event.remaining_amount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Special Requirements */}
        {event.special_requirements && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Special Requirements:
            </p>
            <p className="text-sm text-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
              {truncateText(event.special_requirements, 80)}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-purple-100">
          <button
            onClick={() => onView(event)}
            className="text-purple-600 hover:text-purple-800 text-sm font-semibold transition-colors duration-300"
          >
            View Details
          </button>
          
          <div className="flex space-x-3">
            {canConfirm && (
              <button
                onClick={handleConfirm}
                className="inline-flex items-center px-4 py-2 border border-green-300 shadow-lg text-xs font-semibold rounded-lg text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
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
                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-lg text-xs font-semibold rounded-lg text-red-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
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
