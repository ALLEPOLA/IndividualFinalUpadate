import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../stores/userStore';

export const PaymentCancelled: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser();

  const eventId = searchParams.get('event_id');

  const handleTryAgain = () => {
    // Redirect to appropriate dashboard where they can try payment again
    if (user?.role === 'vendor') {
      navigate('/dashboard/vendor');
    } else {
      navigate('/dashboard/user');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <div className="text-center">
          {/* Cancelled Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Cancelled Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          {/* Event Details */}
          {eventId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Event ID:</strong> {eventId}</p>
                <p className="mt-1">You can try to make the payment again from your dashboard.</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Go to Homepage
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 mt-4">
            If you continue to have issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
