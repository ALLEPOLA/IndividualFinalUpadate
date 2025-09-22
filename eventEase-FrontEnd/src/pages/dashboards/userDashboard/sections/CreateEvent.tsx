import { useState, useEffect } from 'react';
import { eventService, type Event, type Vendor, type VendorService, type EventServiceItem } from '../../../../services/eventService';

interface EventFormData {
  name: string;
  description: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  special_requirements: string;
  vendor_id: number | null;
  vendor_name: string;
  services: EventServiceItem[];
}

export const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorServices, setVendorServices] = useState<VendorService[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<number | ''>('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedServices, setSelectedServices] = useState<EventServiceItem[]>([]);
  
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    type: '',
    date: '',
    start_time: '',
    end_time: '',
    special_requirements: '',
    vendor_id: null,
    vendor_name: '',
    services: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      loadVendorServices(selectedVendor.id);
    }
  }, [selectedVendor]);

  const loadVendors = async () => {
    try {
      const response = await eventService.getAllVendors();
      if (response.success && response.data && Array.isArray(response.data)) {
        setVendors(response.data);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

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

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedVendor) newErrors.vendor = 'Please select a vendor';
    if (selectedServices.length === 0) newErrors.services = 'Please select at least one service';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setFormData(prev => ({
          ...prev,
          vendor_id: selectedVendor!.id,
          vendor_name: selectedVendor!.businessName,
          services: selectedServices
        }));
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSelectedServices([]);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        special_requirements: formData.special_requirements,
        vendor_id: formData.vendor_id!,
        vendor_name: formData.vendor_name,
        services: formData.services,
        status: 'pending'
      };

      const response = await eventService.createEvent(eventData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create event');
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: '',
        date: '',
        start_time: '',
        end_time: '',
        special_requirements: '',
        vendor_id: null,
        vendor_name: '',
        services: []
      });
      setSelectedVendor(null);
      setSelectedServices([]);
      setCurrentStep(1);
      
      alert('Event created successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const cityMatch = !cityFilter || vendor.city.toLowerCase().includes(cityFilter.toLowerCase());
    return cityMatch;
  });

  const filteredServices = vendorServices.filter(service => {
    const capacityMatch = !capacityFilter || service.capacity >= capacityFilter;
    return capacityMatch && service.isActive;
  });

  const eventTypes = [
    'Wedding', 'Birthday', 'Corporate', 'Conference', 'Party', 'Charity', 'Sports', 'Cultural', 'Other'
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Event</h1>
        
        {/* Stepper */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Event Details</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Select Vendor</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
              currentStep >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Review & Submit</span>
          </div>
        </div>

        {/* Step Content will be rendered here based on currentStep */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special requirements or notes"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Vendor */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Select Vendor & Services</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by City
                </label>
                <input
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Capacity
                </label>
                <input
                  type="number"
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter minimum capacity"
                />
              </div>
            </div>

            {/* Vendor Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Select Vendor *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {filteredVendors.map(vendor => (
                  <div
                    key={vendor.id}
                    onClick={() => handleVendorSelect(vendor)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedVendor?.id === vendor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{vendor.businessName}</h4>
                    <p className="text-sm text-gray-600">{vendor.city}, {vendor.province}</p>
                    <p className="text-sm text-gray-500">Capacity: {vendor.capacity}</p>
                  </div>
                ))}
              </div>
              {errors.vendor && <p className="text-red-500 text-sm mt-2">{errors.vendor}</p>}
            </div>

            {/* Services Selection */}
            {selectedVendor && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Select Services *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {filteredServices.map(service => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedServices.some(s => s.id === service.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.category_name}</p>
                      <p className="text-sm text-gray-500">Capacity: {service.capacity}</p>
                      <p className="text-sm text-gray-500">Base Price: ${service.base_price}</p>
                    </div>
                  ))}
                </div>
                {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Review Event Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Event Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Event Name:</span>
                    <p className="text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p className="text-gray-900">{formData.type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-900">{formData.date}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <p className="text-gray-900">{formData.start_time} - {formData.end_time}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-900">{formData.description}</p>
                </div>
                
                {formData.special_requirements && (
                  <div>
                    <span className="font-medium text-gray-700">Special Requirements:</span>
                    <p className="text-gray-900">{formData.special_requirements}</p>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700">Vendor:</span>
                  <p className="text-gray-900">{selectedVendor?.businessName}</p>
                </div>
              </div>

              {/* Right Column - Services & Pricing */}
              <div className="space-y-6">
                {/* Selected Services */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Selected Services</h3>
                  <div className="space-y-3">
                    {selectedServices.map(service => (
                      <div key={service.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-green-200">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600">Advance: {service.advance_percentage}%</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${service.base_price || 0}</p>
                          <p className="text-sm text-green-600">
                            +${(((service.base_price || 0) * (service.advance_percentage || 0)) / 100).toFixed(2)} advance
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                {selectedServices.length > 0 && (() => {
                  const pricing = calculatePricing();
                  return (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Pricing Summary</h3>
                      <div className="space-y-2">
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
              <p className="text-yellow-800 font-medium">
                ⚠️ You cannot edit event details once confirmed
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
