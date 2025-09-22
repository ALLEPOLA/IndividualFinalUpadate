import { useVendor, useUser } from '../../../../stores/userStore';

export const Profile = () => {
  const user = useUser();
  const vendor = useVendor();

  if (!vendor) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vendor profile found</h3>
          <p className="mt-1 text-sm text-gray-500">Complete your vendor registration to access your profile.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Profile</h2>
          <p className="text-gray-600 mt-1">
            View your business information and profile details.
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Business Information Section */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.businessName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Registration Number</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.businessRegistrationNumber}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business License Number</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.businessLicenseNumber}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.capacity} people</p>
              </div>
            </div>

            {vendor.websiteUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                  <a 
                    href={vendor.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {vendor.websiteUrl}
                  </a>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Business Description</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md min-h-[100px]">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{vendor.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.address}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.city}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.province}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{vendor.postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Holder</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                    <p className="text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                    <p className="text-sm text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </>
            )}


            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Created</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{formatDate(vendor.createdAt)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{formatDate(vendor.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
