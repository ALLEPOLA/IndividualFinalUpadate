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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
          <p className="text-gray-600 mt-1">
            Manage your service offerings and track your business growth.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading services...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Error loading services</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchServices}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !error && (
        <>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first service.</p>
              <div className="mt-6">
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Service
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onView={handleViewService}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
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