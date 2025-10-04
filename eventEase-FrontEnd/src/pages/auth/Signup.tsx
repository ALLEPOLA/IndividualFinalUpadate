import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

interface SignupFormData {
  // User fields
  firstName: string;
  lastName: string;
   middleName?: string; 
  phone: string;
  role: 'user' | 'vendor';
  email: string;
  password: string;
  confirmPassword: string;
  
  // Vendor fields (optional)
  businessName?: string;
  description?: string;
  // address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  capacity?: number;
  websiteUrl?: string;
  businessRegistrationNumber?: string;
  businessLicenseNumber?: string;
}

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'user' | 'vendor'>('user');
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      role: 'user',
    },
  });

  const password = watch('password');

  // Initialize form with the selected role
  useEffect(() => {
    setValue('role', selectedRole);
  }, [selectedRole, setValue]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Remove confirmPassword from the data before sending
      const { confirmPassword, ...submitData } = data;
      
      const response = await signUp(submitData);
      
      // Check if email verification is required
      if (response.requiresEmailVerification) {
        // Store email for verification page
        localStorage.setItem('pendingVerificationEmail', submitData.email);
        // Redirect to email verification page
        navigate('/verify-email');
        return;
      }
      
      // If no verification required (fallback), proceed with normal flow
      await checkAuth();
      
      // Redirect to appropriate dashboard based on role
      if (selectedRole === 'vendor') {
        navigate('/dashboard/vendor');
      } else {
        navigate('/dashboard/user');
      }
    } catch (error: any) {
      setError(error.message || 'Signup failed. Please try again.');
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
      
      <div className="max-w-2xl w-full space-y-4 relative z-10">
        <div className="text-center">
          {/* Welcome Icon */}
          <div className="text-6xl mb-4 animate-bounce">🎊</div>
          
          <h2 className="text-center text-4xl font-extrabold text-purple-600 mb-2">
            Join EventEase!
          </h2>
          
          {/* Purple Underline */}
          <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full mb-4"></div>
          
          <p className="text-lg text-gray-600 mb-2">
            Create your account
          </p>
          <p className="text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300"
            >
              signs in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-2 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg shadow-md animate-pulse">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-medium text-purple-600 mb-4">🎯 Choose your role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  value="user"
                  checked={selectedRole === 'user'}
                  onChange={(e) => {
                    setSelectedRole(e.target.value as 'user');
                    setValue('role', 'user');
                  }}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedRole === 'user' 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <h4 className="font-medium text-gray-900">Event Creator</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Create and manage your events
                    </p>
                  </div>
                </div>
              </label>
              
              <label className="relative">
                <input
                  type="radio"
                  value="vendor"
                  checked={selectedRole === 'vendor'}
                  onChange={(e) => {
                    setSelectedRole(e.target.value as 'vendor');
                    setValue('role', 'vendor');
                  }}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedRole === 'vendor' 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏢</div>
                    <h4 className="font-medium text-gray-900">Service Vendor</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Provide services for events
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

 {/*user information  ofrm  collecting*/}


          {/* User Information */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-medium text-purple-600 mb-4">👤 Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="group">
                <label htmlFor="firstName" className="block text-sm font-medium text-purple-600 mb-2">
                  👤 First Name *
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.firstName.message}</p>
                )}
              </div>
{/* Middle Name (optional) */}
              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  {...register('middleName', {
                    required: false,
                    minLength: { value: 1, message: 'Middle name must be at least 1 character' }
                  })}
                  type="text"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.middleName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Middle name (optional)"
                />
                {errors.middleName && (
                  <p className="mt-1 text-sm text-red-600">{errors.middleName.message}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-red-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Invalid phone number format',
                    },
                  })}
                  type="tel"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            
{/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
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
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>




          {/*vendor form detail  collecting*/}

          {/* Vendor Information - Only show if vendor is selected */}
          {selectedRole === 'vendor' && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-medium text-purple-600 mb-4">🏢 Business Information</h3>
              <div className="space-y-4">
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    {...register('businessName', {
                      required: selectedRole === 'vendor' ? 'Business name is required' : false,
                    })}
                    type="text"
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                      errors.businessName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your business name"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description *
                  </label>
                  <textarea
                    {...register('description', {
                      required: selectedRole === 'vendor' ? 'Business description is required' : false,
                    })}
                    rows={3}
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your business and services"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

              

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      {...register('city', {
                        required: selectedRole === 'vendor' ? 'City is required' : false,
                      })}
                      type="text"
                      className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  {/* Province */}
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      Province *
                    </label>
                    <input
                      {...register('province', {
                        required: selectedRole === 'vendor' ? 'Province is required' : false,
                      })}
                      type="text"
                      className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                        errors.province ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Province"
                    />
                    {errors.province && (
                      <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code *
                    </label>
                    <input
                      {...register('postalCode', {
                        required: selectedRole === 'vendor' ? 'Postal code is required' : false,
                        pattern: {
                          value: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
                          message: 'Invalid postal code format (e.g., A1A 1A1)',
                        },
                      })}
                      type="text"
                      className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                        errors.postalCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="A1A 1A1"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Event Capacity *
                  </label>
                  <input
                    {...register('capacity', {
                      required: selectedRole === 'vendor' ? 'Capacity is required' : false,
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'Capacity must be at least 1',
                      },
                    })}
                    type="number"
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                      errors.capacity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Maximum number of people you can serve"
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>

                {/* Website URL (Optional) */}
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                    Website URL (Optional)
                  </label>
                  <input
                    {...register('websiteUrl', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Website URL must start with http:// or https://',
                      },
                    })}
                    type="url"
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                      errors.websiteUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://your-website.com"
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Registration Number */}
                  <div>
                    <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700">
                      Business Registration Number *
                    </label>
                    <input
                      {...register('businessRegistrationNumber', {
                        required: selectedRole === 'vendor' ? 'Business registration number is required' : false,
                      })}
                      type="text"
                      className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                        errors.businessRegistrationNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter registration number"
                    />
                    {errors.businessRegistrationNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessRegistrationNumber.message}</p>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          )}

          {/* Password Section */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-medium text-purple-600 mb-4">🔒 Account Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
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
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type="password"
                  className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 group-hover:shadow-md ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role is now properly set through setValue in the radio button handlers */}

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
                    Creating account...
                  </>
                ) : (
                  <>
                    🎉 Create account
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Enhanced Back Link */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-300 group"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">←</span>
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
