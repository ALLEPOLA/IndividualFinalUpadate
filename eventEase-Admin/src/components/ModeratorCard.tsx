import React from 'react';
import type { Moderator } from '../stores/adminStore';

interface ModeratorCardProps {
  moderator: Moderator;
  onEdit?: (moderator: Moderator) => void;
  onDeactivate?: (moderator: Moderator) => void;
}

const ModeratorCard: React.FC<ModeratorCardProps> = ({ 
  moderator, 
  onEdit, 
  onDeactivate 
}) => {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getPermissionBadges = (permissions: Moderator['permissions']) => {
    const permissionLabels = {
      canManageUsers: 'Users',
      canManageVendors: 'Vendors',
      canManageEvents: 'Events',
      canManagePayments: 'Payments',
      canViewReports: 'Reports'
    };

    return Object.entries(permissions)
      .filter(([_, hasPermission]) => hasPermission)
      .map(([key, _]) => (
        <span
          key={key}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1"
        >
          {permissionLabels[key as keyof typeof permissionLabels]}
        </span>
      ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-semibold text-lg">
              {moderator.firstName.charAt(0)}{moderator.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {moderator.firstName} {moderator.lastName}
            </h3>
            <p className="text-sm text-gray-600">{moderator.email}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(moderator.isActive)}`}>
          {moderator.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {moderator.phone}
        </div>
        {moderator.address && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {moderator.address}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
        <div className="flex flex-wrap">
          {getPermissionBadges(moderator.permissions)}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Created: {new Date(moderator.createdAt).toLocaleDateString()}</span>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(moderator)}
              className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              Edit
            </button>
          )}
          {onDeactivate && moderator.isActive && (
            <button
              onClick={() => onDeactivate(moderator)}
              className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Deactivate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorCard;
