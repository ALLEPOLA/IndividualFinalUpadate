import { useUser } from '../../../stores/userStore';
import { logout } from '../../../services/authService';
import { EventEaseLogo } from '../../EventEaseLogo';

export const Header = () => {
  const user = useUser();

  const handleLogout = () => {
    logout(); 
    window.location.href = '/';
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 backdrop-blur-sm shadow-lg border-b-2 border-purple-400 px-6 py-4 relative overflow-hidden">
      {/* Very Colorful Floating Elements */}
      <div className="absolute top-2 left-12 text-xl animate-bounce opacity-70" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-3 right-20 text-xl animate-bounce opacity-70" style={{ animationDelay: '2s' }}>🌟</div>
      <div className="absolute top-4 left-40 text-lg animate-bounce opacity-60" style={{ animationDelay: '3s' }}>💫</div>
      <div className="absolute bottom-2 right-12 text-lg animate-bounce opacity-60" style={{ animationDelay: '4s' }}>⭐</div>
      <div className="absolute bottom-3 left-24 text-sm animate-bounce opacity-50" style={{ animationDelay: '5s' }}>🎉</div>
      <div className="absolute top-5 right-40 text-sm animate-bounce opacity-50" style={{ animationDelay: '6s' }}>🎊</div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <EventEaseLogo />
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center space-x-6">
          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent animate-pulse">
              Welcome, {user.firstName}! 👋
            </p>
            <p className="text-xs text-purple-700 font-semibold">{user.email}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 border-2 border-red-400 hover:scale-110 hover:rotate-1"
          >
            <span className="flex items-center space-x-2">
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
