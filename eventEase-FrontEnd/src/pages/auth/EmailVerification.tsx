import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { verifyEmail, resendEmailVerification } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

function EmailVerification() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Get email from localStorage
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (!pendingEmail) {
      // No pending verification, redirect to signup
      navigate('/signup');
      return;
    }
    setEmail(pendingEmail);
  }, [navigate]);

  useEffect(() => {
    // Countdown timer for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await verifyEmail(email, otp.trim());

      // Clear pending verification email
      localStorage.removeItem('pendingVerificationEmail');

      // Refresh auth state
      await checkAuth();

      // Show success message and redirect
      setSuccess('Email verified successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard/user'); // Default to user dashboard, auth context will handle proper redirect
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      setIsResending(true);
      setError(null);

      await resendEmailVerification(email);
      setSuccess('Verification code sent successfully! Please check your email.');
      setResendCooldown(60); // 60 second cooldown

    } catch (error: any) {
      setError(error.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signup');
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
          {/* Email Verification Icon */}
          <div className="text-5xl mb-3 animate-bounce">📧</div>
          
          <h2 className="text-center text-4xl font-extrabold text-purple-600 mb-2">
            Verify your email
          </h2>
          
          {/* Purple Underline */}
          <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full mb-4"></div>
          
          <p className="text-lg text-gray-600 mb-2">
            We've sent a verification code to
          </p>
          <p className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full inline-block">
            {email}
          </p>
        </div>
        
        <form className="mt-2 space-y-4" onSubmit={handleVerify}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg shadow-md animate-pulse">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-lg shadow-md animate-pulse">
              {success}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="font-medium text-purple-600 hover:text-purple-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isResending
                  ? 'Sending...'
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend code'
                }
              </button>
            </p>

            <p className="text-sm text-gray-600">
              Wrong email?{' '}
              <button
                type="button"
                onClick={handleChangeEmail}
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300"
              >
                Change email
              </button>
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-purple-500 transition-colors duration-300 flex items-center justify-center"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailVerification;