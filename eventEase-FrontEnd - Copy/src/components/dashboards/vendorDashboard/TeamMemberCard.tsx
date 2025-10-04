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
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 group"
    >
      {/* Member Avatar/Header */}
      <div className="relative p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          {/* Avatar */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
            {getInitials(teamMember.name)}
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors">
              {teamMember.name}
            </h3>
            <p className="text-purple-100 text-sm font-medium">
              {teamMember.role}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-2 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm border ${
              teamMember.is_active
                ? 'bg-green-100/90 text-green-800 border-green-200'
                : 'bg-red-100/90 text-red-800 border-red-200'
            }`}
          >
            {teamMember.is_active ? '✓ Active' : '✗ Inactive'}
          </span>
        </div>
      </div>

      {/* Member Details */}
      <div className="p-6">
        {/* Contact Information */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate font-medium">{teamMember.email}</span>
          </div>
          
          {teamMember.phone && (
            <div className="flex items-center text-sm text-gray-600 bg-pink-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 mr-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">{teamMember.phone}</span>
            </div>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Hourly Rate:
            </span>
            <span className="text-xl font-bold text-purple-700">
              {formatHourlyRate(teamMember.hourly_rate)}
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-semibold flex items-center">
              <svg className="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member Since:
            </span>
            <span className="text-gray-900 font-bold">
              {new Date(teamMember.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-purple-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(teamMember);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 border border-purple-200"
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
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300 transform hover:scale-105 border border-red-200"
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
