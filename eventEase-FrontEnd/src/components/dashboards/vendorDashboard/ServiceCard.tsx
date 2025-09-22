import React from 'react';
import { type VendorService } from '../../../services/vendorService';

interface ServiceCardProps {
  service: VendorService;
  onView: (service: VendorService) => void;
  onEdit: (service: VendorService) => void;
  onDelete: (service: VendorService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onView,
  onEdit,
  onDelete,
}) => {
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this service?')) {
      onDelete(service);
    }
  };

  return (
    <div
      onClick={() => onView(service)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Service Image */}
      <div className="relative h-48 bg-gray-200">
        {service.image_url ? (
          <img
            src={`http://localhost:5000${service.image_url}`}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              service.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Service Name and Category */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {service.name}
          </h3>
          {service.category_name && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {service.category_name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3">
          {truncateText(service.description)}
        </p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Base Price:</span>
            <span className="font-medium text-gray-900">${service.base_price}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Per Hour:</span>
            <span className="font-medium text-gray-900">${service.price_per_hour}</span>
          </div>
        </div>

        {/* Capacity */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Capacity:</span>
            <span className="font-medium text-gray-900">{service.capacity} people</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(service);
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
