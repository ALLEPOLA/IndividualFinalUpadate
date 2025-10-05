import React from 'react';

interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  if (!isOpen || !user) return null;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'vendor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmailVerificationColor = (verified: boolean) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-lg">
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-700 flex items-center">
                  <span className="mr-2">👤</span>
                  {user.firstName} {user.middleName && `${user.middleName} `}{user.lastName}
                </h2>
                <p className="text-gray-600">Regular User Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3 border border-blue-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-sm text-gray-900">
                      {user.firstName} {user.middleName && `${user.middleName} `}{user.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-sm text-gray-900 font-mono">{user.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  {user.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{user.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 space-y-3 border border-green-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900">{user.email}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEmailVerificationColor(user.emailVerified)}`}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="text-sm text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information & Timestamps */}
            <div className="space-y-6">
              {/* Account Status */}
              <div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 space-y-3 border border-orange-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Verification</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmailVerificationColor(user.emailVerified)}`}>
                      {user.emailVerified ? 'Email Verified' : 'Email Pending Verification'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 space-y-3 border border-red-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Created</label>
                    <p className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {new Date(user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Information */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 space-y-3 border border-purple-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Role</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role Description</label>
                    <p className="text-sm text-gray-600">
                      {user.role === 'admin' && 'Administrator with full system access'}
                      {user.role === 'vendor' && 'Vendor with business management capabilities'}
                      {user.role === 'user' && 'Regular user with event booking capabilities'}
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
              className="px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
                <span className="mr-2">✕</span>
                Close
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
