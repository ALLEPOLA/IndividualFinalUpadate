import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { CreateTeamMemberData, UpdateTeamMemberData, TeamMember } from '../../../services/teamMemberService';
import { useVendor } from '../../../stores/userStore';

type TeamMemberFormData = CreateTeamMemberData | (UpdateTeamMemberData & { 
  vendor_id: number;
  name: string;
  email: string;
  role: string;
});

// Form data type for React Hook Form
interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  hourly_rate: string;
  is_active: boolean;
}

interface TeamMemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamMemberFormData) => Promise<void>;
  initialData?: TeamMember | null;
  isEdit?: boolean;
}

// Common roles for team members
const COMMON_ROLES = [
  'Manager',
  'Assistant Manager',
  'Team Lead',
  'Senior Staff',
  'Staff',
  'Junior Staff',
  'Coordinator',
  'Specialist',
  'Consultant',
  'Technician',
  'Helper',
  'Intern'
];

export const TeamMemberFormModal: React.FC<TeamMemberFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const vendor = useVendor();
  const [isLoading, setIsLoading] = useState(false);

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
      email: '',
      phone: '',
      role: '',
      hourly_rate: '',
      is_active: true,
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData && isEdit) {
        reset({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          role: initialData.role || '',
          hourly_rate: initialData.hourly_rate?.toString() || '',
          is_active: initialData.is_active ?? true,
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          role: '',
          hourly_rate: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, initialData, isEdit, reset]);

  const onFormSubmit = async (data: FormData) => {
    if (!vendor) {
      alert('Vendor information not found');
      return;
    }

    setIsLoading(true);
    
    try {
      const teamMemberData = {
        ...data,
        // Only include vendor_id for create operations
        ...(isEdit ? {} : { vendor_id: vendor.id }),
        hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : undefined,
        phone: data.phone || undefined,
        // Ensure is_active is a proper boolean
        is_active: Boolean(data.is_active),
        ...(isEdit && initialData && { id: initialData.id }),
      };

      await onSubmit(teamMemberData as TeamMemberFormData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 255,
                  message: 'Name must be less than 255 characters'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email address is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  id="email"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                maxLength: {
                  value: 20,
                  message: 'Phone number must be less than 20 characters'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  id="phone"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number (optional)"
                />
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role/Position *
            </label>
            <Controller
              name="role"
              control={control}
              rules={{
                required: 'Role is required',
                minLength: {
                  value: 2,
                  message: 'Role must be at least 2 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Role must be less than 100 characters'
                }
              }}
              render={({ field }) => (
                <div className="space-y-2">
                  <input
                    {...field}
                    type="text"
                    id="role"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter role or select from common roles"
                    list="common-roles"
                  />
                  <datalist id="common-roles">
                    {COMMON_ROLES.map(role => (
                      <option key={role} value={role} />
                    ))}
                  </datalist>
                </div>
              )}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              You can type a custom role or select from the dropdown suggestions
            </p>
          </div>

          {/* Hourly Rate */}
          <div>
            <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <Controller
              name="hourly_rate"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: 'Hourly rate cannot be negative'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="hourly_rate"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hourly_rate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter hourly rate (optional)"
                />
              )}
            />
            {errors.hourly_rate && (
              <p className="mt-1 text-sm text-red-600">{errors.hourly_rate.message}</p>
            )}
          </div>

          {/* Active Status (only show in edit mode) */}
          {isEdit && (
            <div className="flex items-center">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                )}
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Team member is active
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (isEdit ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
