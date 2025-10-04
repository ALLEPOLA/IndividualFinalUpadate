import { useState, useEffect } from 'react';
import { ServiceCard } from '../../../../components/dashboards/vendorDashboard/ServiceCard';
import { ServiceFormModal } from '../../../../components/dashboards/vendorDashboard/ServiceFormModal';
import { ServiceDetailModal } from '../../../../components/dashboards/vendorDashboard/ServiceDetailModal';
import { useUser, useVendor } from '../../../../stores/userStore';
import {
  type VendorService,
  type CreateServiceData,
  type UpdateServiceData,
  getServicesByVendor,
  createService,
  updateService,
  deleteService,
} from '../../../../services/vendorService';

export const MyServices = () => {
  const user = useUser();
  const vendor = useVendor();
  const [services, setServices] = useState<VendorService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<VendorService | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch vendor services
  const fetchServices = async () => {
    if (!vendor?.id) return;

    try {
      setIsLoading(true);
      setError('');
      const response = await getServicesByVendor(vendor.id);
      
      if (response.success && Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, [vendor?.id]);

  // Handle create or update service
  const handleSubmitService = async (serviceData: any) => {
    try {
      let response;
      if (serviceData.id) {
        // It's an update
        response = await updateService(serviceData as UpdateServiceData);
      } else {
        // It's a create
        response = await createService(serviceData as CreateServiceData);
      }
      
      if (response.success) {
        await fetchServices(); // Refresh the services list
        alert(serviceData.id ? 'Service updated successfully!' : 'Service created successfully!');
      }
    } catch (err: any) {
      console.error('Error submitting service:', err);
      alert(err.message || 'Failed to submit service');
      throw err;
    }
  };

  // Handle delete service
  const handleDeleteService = async (service: VendorService) => {
    try {
      const response = await deleteService(service.id);
      if (response.success) {
        await fetchServices(); // Refresh the services list
        alert('Service deleted successfully!');
      }
    } catch (err: any) {
      console.error('Error deleting service:', err);
      alert(err.message || 'Failed to delete service');
    }
  };

  // Handle view service details
  const handleViewService = (service: VendorService) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: VendorService) => {
    setSelectedService(service);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  // Handle create new service
  const handleCreateNew = () => {
    setSelectedService(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  // Close modals
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedService(null);
    setIsEditMode(false);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedService(null);
  };

  if (!user || !vendor) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Please log in as a vendor to manage your services.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="animate-fadeIn">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
            My Services
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your service offerings and track your business growth.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg animate-fadeIn"
          style={{ animationDelay: '0.2s' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16 relative z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <div className="text-center">
              <span className="text-lg text-gray-600 font-medium">Loading services...</span>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your services</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 relative z-10 animate-fadeIn">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-red-800">Error loading services</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button
                onClick={fetchServices}
                className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !error && (
        <>
          {services.length === 0 ? (
            <div className="text-center py-16 relative z-10 animate-fadeIn">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-purple-200/50 max-w-md mx-auto">
                <div className="text-6xl mb-6 animate-bounce">🎉</div>
                <svg className="mx-auto h-16 w-16 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services yet</h3>
                <p className="text-gray-600 mb-8">Get started by creating your first service and begin your journey!</p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Service
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ServiceCard
                    service={service}
                    onView={handleViewService}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleSubmitService}
        initialData={selectedService}
        isEdit={isEditMode}
      />

      <ServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        service={selectedService}
      />
    </div>
  );
};