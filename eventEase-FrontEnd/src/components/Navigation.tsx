import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../stores/userStore'
import NotificationBell from './NotificationBell'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, handleLogout, isLoading } = useAuth()
  const user = useUser()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleDashboardClick = () => {
    if (user?.role === 'vendor') {
      navigate('/dashboard/vendor')
    } else {
      navigate('/dashboard/user')
    }
  }

  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                EventEase
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-gray-500">Loading...</div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EventEase
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                isActive('/about') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                isActive('/contact') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              Contact
            </Link>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <NotificationBell />
                  <span className="text-sm text-gray-600">Welcome!</span>
                  <button
                    onClick={handleDashboardClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                      isActive('/login')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                      isActive('/signup')
                        ? 'bg-blue-700 text-white'
                        : 'text-white bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
