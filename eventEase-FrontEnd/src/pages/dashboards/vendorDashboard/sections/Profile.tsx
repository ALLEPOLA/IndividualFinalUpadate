import { useVendor, useUser } from '../../../../stores/userStore';

export const Profile = () => {
  const user = useUser();
  const vendor = useVendor();

  if (!vendor) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-6 animate-bounce">🏢</div>
          <svg className="mx-auto h-16 w-16 text-purple-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-2xl font-bold text-gray-900 mb-4">No vendor profile found</h3>
          <p className="mt-1 text-lg text-gray-500">Complete your vendor registration to access your profile.</p>
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
    <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      {/* Header */}
      <div className="mb-8 relative z-10 animate-fadeIn">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3">
            🏢 Vendor Profile
          </h2>
          <p className="text-gray-600 text-lg">
            View your business information and profile details.
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 relative z-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        {/* Business Information Section */}
        <div className="px-8 py-6 border-b border-purple-100">
          <h3 className="text-xl font-bold text-purple-700 mb-6 flex items-center">
            <span className="text-2xl mr-3">🏢</span>
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.businessName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Registration Number</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.businessRegistrationNumber}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business License Number</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.businessLicenseNumber}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.capacity} people</p>
              </div>
            </div>

            {vendor.websiteUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🌐 Website URL</label>
                <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <a 
                    href={vendor.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-purple-600 hover:text-purple-800 underline transition-colors duration-300"
                  >
                    {vendor.websiteUrl}
                  </a>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Business Description</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg min-h-[100px]">
                <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{vendor.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="px-8 py-6 border-b border-purple-100">
          <h3 className="text-xl font-bold text-purple-700 mb-6 flex items-center">
            <span className="text-2xl mr-3">📍</span>
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.address}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.city}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.province}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{vendor.postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="px-8 py-6">
          <h3 className="text-xl font-bold text-purple-700 mb-6 flex items-center">
            <span className="text-2xl mr-3">👤</span>
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder</label>
                  <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email Address</label>
                  <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📞 Phone Number</label>
                  <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Profile Created</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{formatDate(vendor.createdAt)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔄 Last Updated</label>
              <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{formatDate(vendor.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
