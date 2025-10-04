import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminLoginFormData {
  email: string;
  password: string;
}

function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>();

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await login(data.email, data.password);
      navigate('/admin/dashboard');
      
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-start justify-center pt-8 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce opacity-60" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 right-16 text-2xl animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}>🌟</div>
      <div className="absolute bottom-32 left-16 text-2xl animate-bounce opacity-60" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-3xl animate-bounce opacity-60" style={{ animationDelay: '2.5s' }}>⭐</div>
      <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce opacity-60" style={{ animationDelay: '3s' }}>✨</div>
      <div className="absolute bottom-1/3 left-1/4 text-2xl animate-bounce opacity-60" style={{ animationDelay: '3.5s' }}>🌟</div>
      
      <div className="max-w-lg w-full space-y-4 relative z-10">
        <div className="text-center">
          {/* Welcome Icon */}
          <div className="text-5xl mb-3 animate-bounce">👑</div>
          
          <h2 className="text-center text-4xl font-extrabold text-purple-600 mb-2">
            Admin Portal
          </h2>
          
          {/* Purple Underline */}
          <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full mb-4"></div>
          
          <p className="text-lg text-gray-600 mb-2">
            Sign in to access admin dashboard
          </p>
          <p className="text-sm text-gray-600">
            Secure admin access
          </p>
        </div>
        
        <form className="mt-2 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg shadow-md animate-pulse">
              {error}
            </div>
          )}

          {/* Form Container with Enhanced Styling */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-purple-600 mb-2">
                  📧 Email address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-purple-600 mb-2">
                  🔒 Password
                </label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  autoComplete="current-password"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Submit Button */}
          <div className="relative">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    👑 Sign in
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
