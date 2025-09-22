import React from 'react';
import { type TeamMember } from '../../../services/teamMemberService';

interface TeamMemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMember: TeamMember | null;
}

export const TeamMemberDetailModal: React.FC<TeamMemberDetailModalProps> = ({
  isOpen,
  onClose,
  teamMember,
}) => {
  if (!isOpen || !teamMember) return null;

  const formatHourlyRate = (rate?: number) => {
    if (!rate) return 'Not set';
    return `$${rate.toFixed(2)}/hr`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {getInitials(teamMember.name)}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white">
                {teamMember.name}
              </h2>
              <p className="text-blue-100">
                {teamMember.role}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                teamMember.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {teamMember.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Email */}
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Address</p>
                  <p className="text-sm text-gray-900">{teamMember.email}</p>
                  <a
                    href={`mailto:${teamMember.email}`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Send Email
                  </a>
                </div>
              </div>

              {/* Phone */}
              {teamMember.phone && (
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <p className="text-sm text-gray-900">{teamMember.phone}</p>
                    <a
                      href={`tel:${teamMember.phone}`}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Employment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div>
                <p className="text-sm font-medium text-gray-700">Role/Position</p>
                <p className="text-lg text-gray-900">{teamMember.role}</p>
              </div>

              {/* Hourly Rate */}
              <div>
                <p className="text-sm font-medium text-gray-700">Hourly Rate</p>
                <p className="text-lg text-gray-900 font-semibold">
                  {formatHourlyRate(teamMember.hourly_rate)}
                </p>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          {teamMember.vendor_business_name && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Vendor Information
              </h3>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Business Name</p>
                <p className="text-lg text-gray-900">{teamMember.vendor_business_name}</p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Important Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Joined Date</p>
                <p className="text-sm text-gray-900">{formatDate(teamMember.created_at)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-sm text-gray-900">{formatDate(teamMember.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
