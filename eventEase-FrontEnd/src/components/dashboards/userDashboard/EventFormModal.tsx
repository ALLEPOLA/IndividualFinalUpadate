import { useState, useEffect } from 'react';
import { eventService, type Event, type VendorService, type EventServiceItem } from '../../../services/eventService';

interface EventFormModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EventFormModal = ({ event, isOpen, onClose, onSuccess }: EventFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [vendorServices, setVendorServices] = useState<VendorService[]>([]);
  const [capacityFilter, setCapacityFilter] = useState<number | ''>('');
  const [selectedServices, setSelectedServices] = useState<EventServiceItem[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    date: '',
    start_time: '',
    end_time: '',
    special_requirements: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event && isOpen) {
      setFormData({
        name: event.name,
        description: event.description,
        type: event.type,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        special_requirements: event.special_requirements || ''
      });
      setSelectedServices(event.services);
      loadVendorServices(event.vendor_id);
    }
  }, [event, isOpen]);

  const loadVendorServices = async (vendorId: number) => {
    try {
      const response = await eventService.getVendorServices(vendorId);
      if (response.success && response.data && Array.isArray(response.data)) {
        setVendorServices(response.data);
      }
    } catch (error) {
      console.error('Error loading vendor services:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (service: VendorService) => {
    const serviceData: EventServiceItem = {
      id: service.id,
      name: service.name,
      base_price: service.base_price,
      advance_percentage: service.advance_percentage
    };

    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, serviceData];
      }
    });
  };

  // Calculate pricing for selected services
  const calculatePricing = () => {
    let totalAmount = 0;
    let totalAdvanceAmount = 0;

    selectedServices.forEach(service => {
      const basePrice = parseFloat(String(service.base_price || 0));
      const advancePercentage = parseFloat(String(service.advance_percentage || 0));
      
      if (!isNaN(basePrice) && !isNaN(advancePercentage)) {
        totalAmount += basePrice;
        totalAdvanceAmount += (basePrice * advancePercentage / 100);
      }
    });

    const remainingAmount = totalAmount - totalAdvanceAmount;
    const overallAdvancePercentage = totalAmount > 0 ? (totalAdvanceAmount / totalAmount * 100) : 0;

    return {
      total_amount: parseFloat(totalAmount.toFixed(2)),
      advance_amount: parseFloat(totalAdvanceAmount.toFixed(2)),
      remaining_amount: parseFloat(remainingAmount.toFixed(2)),
      advance_percentage: parseFloat(overallAdvancePercentage.toFixed(2))
    };
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type.trim()) newErrors.type = 'Event type is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';

    // Validate date is not in the past
    if (formData.date) {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    // Validate time
    if (formData.start_time && formData.end_time) {
      const startTime = new Date(`2000-01-01 ${formData.start_time}`);
      const endTime = new Date(`2000-01-01 ${formData.end_time}`);
      if (startTime >= endTime) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    if (selectedServices.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !event) return;

    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
        services: selectedServices
      };

      const response = await eventService.updateEvent(event.id!, updateData);
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = vendorServices.filter(service => {
    const capacityMatch = !capacityFilter || service.capacity >= capacityFilter;
    return capacityMatch && service.isActive;
  });

  const eventTypes = [
    'Wedding', 'Birthday', 'Corporate', 'Conference', 'Party', 'Charity', 'Sports', 'Cultural', 'Other'
  ];

  if (!isOpen || !event) return null;

  const isConfirmed = event.status === 'confirmed';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isConfirmed ? 'View Event Details' : 'Edit Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning for confirmed events */}
        {isConfirmed && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-800">
                This event is confirmed and cannot be edited. You can only view the details.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isConfirmed}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter event name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  disabled={isConfirmed}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isConfirmed}
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Describe your event"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={isConfirmed}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    disabled={isConfirmed}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                  {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    disabled={isConfirmed}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                  {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={formData.special_requirements}
                  onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                  disabled={isConfirmed}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isConfirmed ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Any special requirements or notes"
                />
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{event.vendor_name}</h4>
                <p className="text-sm text-gray-600">Vendor cannot be changed when editing</p>
              </div>
            </div>
          </div>

          {/* Services Selection */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Services *</h3>
              {!isConfirmed && (
                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Capacity Filter
                  </label>
                  <input
                    type="number"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Filter by capacity"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
              {(isConfirmed ? vendorServices : filteredServices).map(service => (
                <div
                  key={service.id}
                  onClick={isConfirmed ? undefined : () => handleServiceToggle(service)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    selectedServices.some(s => s.id === service.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  } ${isConfirmed ? 'cursor-default' : 'cursor-pointer hover:border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.category_name}</p>
                      <p className="text-sm text-gray-500">Capacity: {service.capacity}</p>
                      <p className="text-sm text-gray-500">Base Price: ${service.base_price}</p>
                      <p className="text-sm text-gray-500">Advance: {service.advance_percentage}%</p>
                    </div>
                    {selectedServices.some(s => s.id === service.id) && (
                      <div className="ml-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
            
            {/* Pricing Summary */}
            {!isConfirmed && selectedServices.length > 0 && (() => {
              const pricing = calculatePricing();
              return (
                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Pricing Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-gray-900">${pricing.total_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Advance Payment ({pricing.advance_percentage.toFixed(1)}%):</span>
                      <span className="font-medium text-orange-600">${pricing.advance_amount}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2">
                      <span className="text-gray-600">Remaining Amount:</span>
                      <span className="font-medium text-blue-600">${pricing.remaining_amount}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isConfirmed ? 'Close' : 'Cancel'}
          </button>
          
          {!isConfirmed && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
