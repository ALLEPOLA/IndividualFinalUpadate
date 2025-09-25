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
    <header className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 shadow-lg border-b border-purple-100 px-6 py-8 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-2 left-4 text-lg animate-bounce opacity-40" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-3 right-8 text-sm animate-bounce opacity-40" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-2 left-8 text-sm animate-bounce opacity-40" style={{ animationDelay: '2s' }}>💫</div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <EventEaseLogo />
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-medium text-purple-600">
              Welcome, {user.firstName}! 👋
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
