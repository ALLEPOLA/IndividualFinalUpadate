import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ImageUploader } from '../../ImageUploader';
import type { CreateServiceData, UpdateServiceData, VendorService } from '../../../services/vendorService';
import { useUser, useVendor } from '../../../stores/userStore';
import { getAllCategories, type ServiceCategory } from '../../../services/serviceCategoryService';

type ServiceFormData = CreateServiceData | (UpdateServiceData & { 
  vendor_id: number;
  category_id: number; 
  user_id: number;
  name: string;
  description: string;
  base_price: number;
  price_per_hour: number;
  capacity: number;
  advance_percentage: number;
});

// Form data type for React Hook Form
interface FormData {
  name: string;
  description: string;
  category_id: string;
  base_price: string;
  price_per_hour: string;
  capacity: string;
  advance_percentage: string;
  isActive: boolean;
}

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  initialData?: VendorService | null;
  isEdit?: boolean;
}

// Service categories will be fetched from API

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const user = useUser();
  const vendor = useVendor();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      base_price: '',
      price_per_hour: '',
      capacity: '',
      advance_percentage: '',
      isActive: true,
    },
  });

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen && categories.length === 0) {
        setCategoriesLoading(true);
        try {
          const response = await getAllCategories();
          console.log('Categories response:', response);
          if (response.success && response.data) {
            setCategories(response.data as ServiceCategory[]);
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          // Fallback to empty array - categories dropdown will be empty
          setCategories([]);
        } finally {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();
  }, [isOpen, categories.length]);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData && isEdit) {
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
          category_id: initialData.category_id?.toString() || '',
          base_price: initialData.base_price?.toString() || '',
          price_per_hour: initialData.price_per_hour?.toString() || '',
          capacity: initialData.capacity?.toString() || '',
          advance_percentage: initialData.advance_percentage?.toString() || '',
          isActive: initialData.isActive ?? true,
        });
      } else {
        reset({
          name: '',
          description: '',
          category_id: '',
          base_price: '',
          price_per_hour: '',
          capacity: '',
          advance_percentage: '',
          isActive: true,
        });
      }
      setSelectedImage(null);
    }
  }, [isOpen, initialData, isEdit, reset]);

  const onFormSubmit = async (data: FormData) => {
    if (!user || !vendor) {
      alert('User or vendor information not found');
      return;
    }

    setIsLoading(true);
    
    try {
      const serviceData = {
        ...data,
        vendor_id: vendor.id,
        user_id: user.id,
        category_id: parseInt(data.category_id),
        base_price: parseFloat(data.base_price),
        price_per_hour: parseFloat(data.price_per_hour),
        capacity: parseInt(data.capacity),
        advance_percentage: parseInt(data.advance_percentage),
        ...(selectedImage && { image: selectedImage }),
        ...(isEdit && initialData && { id: initialData.id }),
      };

      await onSubmit(serviceData as ServiceFormData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/50 to-purple-800/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-40" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-2xl animate-bounce opacity-40" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-2xl animate-bounce opacity-40" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-3xl animate-bounce opacity-40" style={{ animationDelay: '2.5s' }}>⭐</div>
      <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce opacity-40" style={{ animationDelay: '3s' }}>✨</div>
      <div className="absolute bottom-1/3 left-1/4 text-2xl animate-bounce opacity-40" style={{ animationDelay: '3.5s' }}>🌟</div>
      
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-200/50 transform transition-all duration-300 animate-slideInUp hover:shadow-3xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-xl font-semibold text-purple-700 animate-pulse">
            {isEdit ? 'Edit Service' : 'Create New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-600 transition-all duration-300 transform hover:scale-110 hover:rotate-90 p-2 rounded-full hover:bg-purple-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {/* Service Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Service name is required',
                minLength: {
                  value: 3,
                  message: 'Service name must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Service name must be less than 100 characters'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter service name"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters long'
                }
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your service (minimum 10 characters)"
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <Controller
              name="category_id"
              control={control}
              rules={{
                required: 'Please select a category'
              }}
              render={({ field }) => (
                <select
                  {...field}
                  id="category_id"
                  disabled={categoriesLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
            )}
            {categories.length === 0 && !categoriesLoading && (
              <p className="text-sm text-gray-500 mt-1">
                No categories available. Please try again later.
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($) *
              </label>
              <Controller
                name="base_price"
                control={control}
                rules={{
                  required: 'Base price is required',
                  min: {
                    value: 0,
                    message: 'Base price cannot be negative'
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="base_price"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm ${
                      errors.base_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.base_price && (
                <p className="mt-1 text-sm text-red-600">{errors.base_price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Hour ($) *
              </label>
              <Controller
                name="price_per_hour"
                control={control}
                rules={{
                  required: 'Price per hour is required',
                  min: {
                    value: 0,
                    message: 'Price per hour cannot be negative'
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="price_per_hour"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm ${
                      errors.price_per_hour ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.price_per_hour && (
                <p className="mt-1 text-sm text-red-600">{errors.price_per_hour.message}</p>
              )}
            </div>
          </div>

          {/* Capacity and Advance Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <Controller
                name="capacity"
                control={control}
                rules={{
                  required: 'Capacity is required',
                  min: {
                    value: 1,
                    message: 'Capacity must be at least 1'
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="capacity"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1"
                  />
                )}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="advance_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                Advance Percentage (%) *
              </label>
              <Controller
                name="advance_percentage"
                control={control}
                rules={{
                  required: 'Advance percentage is required',
                  min: {
                    value: 0,
                    message: 'Advance percentage must be at least 0'
                  },
                  max: {
                    value: 100,
                    message: 'Advance percentage must be at most 100'
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="advance_percentage"
                    min="0"
                    max="100"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 hover:shadow-sm ${
                      errors.advance_percentage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                )}
              />
              {errors.advance_percentage && (
                <p className="mt-1 text-sm text-red-600">{errors.advance_percentage.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            <ImageUploader
              onImageSelect={setSelectedImage}
              currentImage={isEdit && initialData?.image_url ? `http://localhost:5000${initialData.image_url}` : undefined}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="isActive"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-300 hover:scale-110"
                />
              )}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Service is active
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {isLoading ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
