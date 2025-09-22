import { useUser } from '../../../../stores/userStore';

export const Profile = () => {
  const user = useUser();

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No user profile found</h3>
          <p className="mt-1 text-sm text-gray-500">Please log in to view your profile.</p>
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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            <p className="text-gray-600 mt-1">
              View your personal information and account details.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Future: Edit button will be added here */}
            {/* <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
              Edit Profile
            </button> */}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Personal Information Section */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{user.firstName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{user.lastName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Information Section */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>

        {/* Account Information Section */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">#{user.id}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
