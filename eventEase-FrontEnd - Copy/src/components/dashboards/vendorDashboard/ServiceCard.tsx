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
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-purple-100/50 transform hover:scale-105 hover:-translate-y-2 group"
    >
      {/* Service Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
        {service.image_url ? (
          <img
            src={`http://localhost:5000${service.image_url}`}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-purple-300">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${
              service.isActive
                ? 'bg-green-100/90 text-green-800 border border-green-200'
                : 'bg-red-100/90 text-red-800 border border-red-200'
            }`}
          >
            {service.isActive ? '✓ Active' : '✗ Inactive'}
          </span>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-6">
        {/* Service Name and Category */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
            {service.name}
          </h3>
          {service.category_name && (
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full border border-purple-200">
              {service.category_name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncateText(service.description)}
        </p>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600 font-medium">Base Price:</span>
            <span className="font-bold text-purple-700">${service.base_price}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Per Hour:</span>
            <span className="font-bold text-purple-700">${service.price_per_hour}</span>
          </div>
        </div>

        {/* Capacity */}
        <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Capacity:</span>
            <span className="font-bold text-pink-700">{service.capacity} people</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-purple-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(service);
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
