import React from 'react';

interface Vendor {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  capacity: number;
  websiteUrl?: string;
  businessRegistrationNumber: string;
  businessLicenseNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface VendorDetailsModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
}

const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({
  vendor,
  isOpen,
  onClose
}) => {
  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-lg">
                  {vendor.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-700 flex items-center">
                  <span className="mr-2">🏢</span>
                  {vendor.businessName}
                </h2>
                <p className="text-gray-600">Vendor Details</p>
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
            {/* Business Information */}
            <div className="space-y-6">
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3 border border-blue-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <p className="text-sm text-gray-900">{vendor.businessName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{vendor.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <p className="text-sm text-gray-900">{vendor.capacity.toLocaleString()} people</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 space-y-3 border border-green-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                    <p className="text-sm text-gray-900">
                      {vendor.user ? `${vendor.user.firstName} ${vendor.user.lastName}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{vendor.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{vendor.user?.phone || 'N/A'}</p>
                  </div>
                  {vendor.websiteUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <a 
                        href={vendor.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {vendor.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Legal Information */}
            <div className="space-y-6">
              {/* Location */}
              <div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 space-y-3 border border-orange-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{vendor.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <p className="text-sm text-gray-900">{vendor.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Province</label>
                    <p className="text-sm text-gray-900">{vendor.province}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <p className="text-sm text-gray-900">{vendor.postalCode}</p>
                  </div>
                </div>
              </div>

              {/* Legal Information */}
              <div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 space-y-3 border border-red-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Registration Number</label>
                    <p className="text-sm text-gray-900 font-mono">{vendor.businessRegistrationNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business License Number</label>
                    <p className="text-sm text-gray-900 font-mono">{vendor.businessLicenseNumber}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 space-y-3 border border-purple-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">
                      {new Date(vendor.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {new Date(vendor.updatedAt).toLocaleString()}
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

export default VendorDetailsModal;
