import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../stores/userStore';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  brandName?: string;
  tagline?: string;
  showAuthButtons?: boolean;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  isAuthenticated?: boolean;
  user?: {
    firstName?: string;
    role?: 'user' | 'vendor' | 'admin';
    emailVerified?: boolean;
  };
  onLogout?: () => void;
  customNavLinks?: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }>;
}

const Header: React.FC<HeaderProps> = ({
  brandName = "EventEase",
  tagline = "Event Planning Made Easy",
  showAuthButtons = true,
  onSignInClick,
  onSignUpClick,
  isAuthenticated = false,
  user,
  onLogout,
  customNavLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ]
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, handleLogout } = useAuth();
  const currentUser = useUser();

  // Use auth context data if not provided as props
  const isUserAuthenticated = isAuthenticated || isLoggedIn;
  const currentUserData = user || currentUser;

  const handleNavClick = (link: any) => {
    if (link.onClick) {
      link.onClick();
    } else if (link.href.startsWith('/')) {
      // Handle React Router navigation
      navigate(link.href);
    } else {
      // Handle anchor links for smooth scrolling
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      navigate('/login');
    }
  };

  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      navigate('/signup');
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      handleLogout();
    }
  };

  const handleDashboardClick = () => {
    if (currentUserData?.role === 'vendor') {
      navigate('/dashboard/vendor');
    } else {
      navigate('/dashboard/user');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 backdrop-blur-sm shadow-lg border-b-2 border-purple-400 relative overflow-hidden">
      {/* Very Colorful Floating Elements */}
      <div className="absolute top-2 left-12 text-xl animate-bounce opacity-70" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-3 right-20 text-xl animate-bounce opacity-70" style={{ animationDelay: '2s' }}>🌟</div>
      <div className="absolute top-4 left-40 text-lg animate-bounce opacity-60" style={{ animationDelay: '3s' }}>💫</div>
      <div className="absolute bottom-2 right-12 text-lg animate-bounce opacity-60" style={{ animationDelay: '4s' }}>⭐</div>
      <div className="absolute bottom-3 left-24 text-sm animate-bounce opacity-50" style={{ animationDelay: '5s' }}>🎉</div>
      <div className="absolute top-5 right-40 text-sm animate-bounce opacity-50" style={{ animationDelay: '6s' }}>🎊</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 relative z-10">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-5 cursor-pointer group transition-all duration-300"
            onClick={() => navigate('/')}
          >
            {/* Animated logo with floating sparkles */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-3xl group-hover:animate-bounce">{brandName.charAt(0)}</span>
              </div>
              
              {/* Floating sparkles around logo */}
              <div className="absolute -top-1 -right-1 animate-ping">
                <span className="text-xs">✨</span>
              </div>
              <div className="absolute -bottom-1 -left-1 animate-bounce delay-300">
                <span className="text-xs">⭐</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              {/* Animated brand name */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent group-hover:animate-pulse animate-pulse">
                {brandName}
              </h1>
              <div className="flex items-center space-x-1">
                <p className="text-base text-purple-700 font-semibold -mt-1 group-hover:text-purple-800 transition-colors duration-300">{tagline}</p>
                <span className="text-lg animate-bounce delay-500">🎉</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {customNavLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(link)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border shadow-sm hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 ${
                  location.pathname === link.href
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300'
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-700 hover:text-purple-700 border-purple-200 hover:border-purple-300'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          {showAuthButtons && (
            <div className="flex items-center space-x-4">
              {isUserAuthenticated && currentUserData ? (
                <div className="flex items-center space-x-4">
                  <NotificationBell />
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{currentUserData?.firstName?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-purple-700 text-sm font-bold">
                        Welcome, {currentUserData?.firstName || 'User'}! 👋
                      </span>
                      {!currentUserData?.emailVerified && (
                        <span className="text-amber-600 text-xs font-semibold">
                          Email not verified
                        </span>
                      )}
                    </div>
                  </div>
                  {currentUserData?.role === 'user' && (
                    <button 
                      onClick={handleDashboardClick}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 border border-emerald-400 hover:scale-105"
                    >
                      <span className="flex items-center space-x-1.5">
                        <span>👤</span>
                        <span>Dashboard</span>
                      </span>
                    </button>
                  )}
                  {currentUserData?.role === 'vendor' && (
                    <button 
                      onClick={handleDashboardClick}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 border border-purple-500/30 hover:scale-105"
                    >
                      <span className="flex items-center space-x-1.5">
                        <span>🏢</span>
                        <span>Vendor Dashboard</span>
                      </span>
                    </button>
                  )}
                  <button 
                    onClick={handleLogoutClick}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 border border-red-400 hover:scale-105"
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>🚪</span>
                      <span>Logout</span>
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSignInClick}
                    className="text-purple-600 hover:text-purple-800 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-purple-50 hover:shadow-sm border border-purple-200 hover:border-purple-300"
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>🔑</span>
                      <span>Sign In</span>
                    </span>
                  </button>
                  <button 
                    onClick={handleSignUpClick}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 border border-purple-500/30 hover:scale-105"
                  >
                    <span className="flex items-center space-x-2">
                      <span>🚀</span>
                      <span>Sign Up</span>
                    </span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-purple-700 hover:text-purple-800 p-2 rounded-lg transition-all duration-300 hover:bg-purple-50 hover:shadow-sm border border-purple-200 hover:border-purple-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-sm border-t border-gray-100">
              {customNavLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(link)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.href
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {showAuthButtons && !isUserAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <button 
                    onClick={handleSignInClick}
                    className="text-purple-600 hover:text-purple-800 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-purple-50 border border-purple-200 hover:border-purple-300"
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>🔑</span>
                      <span>Sign In</span>
                    </span>
                  </button>
                  <button 
                    onClick={handleSignUpClick}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2.5 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 border border-purple-500/30 hover:scale-105"
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>🚀</span>
                      <span>Sign Up</span>
                    </span>
                  </button>
                </div>
              )}
              {showAuthButtons && isUserAuthenticated && currentUserData && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-sm text-gray-600">
                      Welcome, {currentUserData.firstName}!
                    </div>
                    <NotificationBell />
                  </div>
                  <button 
                    onClick={handleDashboardClick}
                    className="text-left px-3 py-2.5 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-all duration-300 hover:bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300"
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>📊</span>
                      <span>Dashboard</span>
                    </span>
                  </button>
                  <button 
                    onClick={handleLogoutClick}
                    className="text-left px-3 py-2.5 text-sm font-semibold text-red-600 hover:text-red-800 transition-all duration-300 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300"
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>🚪</span>
                      <span>Logout</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
