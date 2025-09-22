import React from 'react';
import { type TeamMember } from '../../../services/teamMemberService';

interface TeamMemberCardProps {
  teamMember: TeamMember;
  onView: (teamMember: TeamMember) => void;
  onEdit: (teamMember: TeamMember) => void;
  onDelete: (teamMember: TeamMember) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  teamMember,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${teamMember.name}?`)) {
      onDelete(teamMember);
    }
  };


  const formatHourlyRate = (rate?: number) => {
    if (!rate) return 'Not set';
    return `$${rate}/hr`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div
      onClick={() => onView(teamMember)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Member Avatar/Header */}
      <div className="relative p-6 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {getInitials(teamMember.name)}
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">
              {teamMember.name}
            </h3>
            <p className="text-blue-100 text-sm">
              {teamMember.role}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              teamMember.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {teamMember.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Member Details */}
      <div className="p-6">
        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{teamMember.email}</span>
          </div>
          
          {teamMember.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{teamMember.phone}</span>
            </div>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Hourly Rate:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatHourlyRate(teamMember.hourly_rate)}
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Member Since:</span>
            <span className="text-gray-900">
              {new Date(teamMember.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(teamMember);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
