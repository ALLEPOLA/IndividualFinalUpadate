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

interface VendorTableProps {
  vendors: Vendor[];
  onView: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  canManageVendors: boolean;
  isLoading?: boolean;
}

const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  onView,
  onDelete,
  canManageVendors,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-4">🏢</div>
        <p>No vendors found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <span className="mr-2">🏢</span>
                Business Name
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <span className="mr-2">📍</span>
                Location
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <span className="mr-2">👥</span>
                Capacity
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <span className="mr-2">📅</span>
                Created
              </span>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center justify-end">
                <span className="mr-2">⚙️</span>
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {vendor.businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {vendor.businessName}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {vendor.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {vendor.city}, {vendor.province}
                </div>
                <div className="text-sm text-gray-500">
                  {vendor.postalCode}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vendor.capacity.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(vendor.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onView(vendor)}
                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-md transition-all duration-200 hover:scale-105"
                    title="View Details"
                  >
                    <span className="text-lg">👁️</span>
                  </button>
                  {canManageVendors && (
                    <button
                      onClick={() => onDelete(vendor)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-md transition-all duration-200 hover:scale-105"
                      title="Delete Vendor"
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;
