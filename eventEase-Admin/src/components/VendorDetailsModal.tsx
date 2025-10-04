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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-lg">
                  {vendor.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h2>
                <p className="text-gray-600">Vendor Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
