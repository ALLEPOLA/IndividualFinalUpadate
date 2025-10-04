import { useUser } from '../../../../stores/userStore';

export const Profile = () => {
  const user = useUser();

  if (!user) {
    return (
      <div className="p-6 relative overflow-hidden">
        {/* Minimal Floating Decorative Elements */}
        <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            👤 Profile
          </h1>
          <p className="text-gray-600 mb-8">Manage your personal information and account settings</p>
          {/* Light Purple Underline */}
          <div className="w-20 h-0.5 bg-purple-300 rounded-full mb-8"></div>
          
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No user profile found</h3>
            <p className="mt-1 text-sm text-gray-500">Please log in to view your profile.</p>
          </div>
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
    <div className="p-6 relative overflow-hidden">
      {/* Minimal Floating Decorative Elements */}
      <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-purple-700 mb-2">
                👤 User Profile
              </h1>
              <p className="text-gray-600 mb-4">Manage your personal information and account settings</p>
              {/* Light Purple Underline */}
              <div className="w-20 h-0.5 bg-purple-300 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Future: Edit button will be added here */}
              {/* <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-300">
                Edit Profile
              </button> */}
            </div>
          </div>
        </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Personal Information Section */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">👤</span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{user.firstName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{user.lastName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Information Section */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">📞</span>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">⚙️</span>
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">#{user.id}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};
