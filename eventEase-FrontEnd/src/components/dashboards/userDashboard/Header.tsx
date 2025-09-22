import { useUser } from '../../../stores/userStore';
import { logout } from '../../../services/authService';
import { EventEaseLogo } from '../../EventEaseLogo';

export const Header = () => {
  const user = useUser();

  const handleLogout = () => {
    logout(); // This clears both localStorage token and Zustand store
    window.location.href = '/';
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <EventEaseLogo />
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Welcome, {user.firstName}!
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
