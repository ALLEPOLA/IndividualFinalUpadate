import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../stores/userStore';
import { confirmPayment } from '../../services/paymentService';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');
  const eventId = searchParams.get('event_id');
  const paymentType = searchParams.get('payment_type');

  useEffect(() => {
    // Confirm payment on backend and fetch event details
    const confirmPaymentAndFetchDetails = async () => {
      try {
        // Confirm payment on backend if we have the required data
        if (eventId && paymentType) {
          console.log('Confirming payment for event:', eventId, 'payment type:', paymentType);
          const result = await confirmPayment({
            eventId: parseInt(eventId),
            paymentType: paymentType as 'advance' | 'remaining'
          });
          console.log('Payment confirmation result:', result);
        }
        
        // Simulate a brief delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEventDetails({ id: eventId, paymentType });
      } catch (error) {
        console.error('Error confirming payment or fetching event details:', error);
        // Still show success page even if confirmation fails
        setEventDetails({ id: eventId, paymentType });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && eventId && paymentType) {
      confirmPaymentAndFetchDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId, eventId, paymentType]);

  const handleContinue = () => {
    // Redirect to appropriate dashboard
    if (user?.role === 'vendor') {
      navigate('/dashboard/vendor');
    } else {
      navigate('/dashboard/user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your {paymentType === 'advance' ? 'advance' : 'remaining'} payment has been processed successfully.
          </p>

          {/* Payment Details
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Session ID:</strong> {sessionId}</p>
              <p><strong>Event ID:</strong> {eventId}</p>
              <p><strong>Payment Type:</strong> {paymentType === 'advance' ? 'Advance Payment' : 'Remaining Payment'}</p>
            </div>
          </div> */}

          {/* Action Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Continue to Dashboard
          </button>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 mt-4">
            Your payment has been processed successfully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
