import React, { useState } from 'react';
import { createCheckoutSession } from '../services/paymentService';
import type { Event } from '../services/eventService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onPaymentSuccess: () => void;
}

// Payment redirect component
const PaymentRedirect: React.FC<{
  event: Event;
  onPaymentSuccess: () => void;
  onClose: () => void;
}> = ({ event, onPaymentSuccess, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Determine payment details
  const getPaymentDetails = () => {
    if (event.payment_status === 'pending') {
      return {
        amount: Number(event.advance_amount) || 0,
        type: 'advance' as const,
        description: 'Advance Payment'
      };
    } else if (event.payment_status === 'advance_paid') {
      return {
        amount: Number(event.remaining_amount) || 0,
        type: 'remaining' as const,
        description: 'Remaining Payment'
      };
    }
    return null;
  };

  const paymentDetails = getPaymentDetails();

  const handlePayNow = async () => {
    if (!paymentDetails) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await createCheckoutSession(event.id!);
      
      if (response.success && response.data?.url) {
        // Redirect to Stripe hosted payment page
        window.location.href = response.data.url;
      } else {
        setError(response.message || 'Failed to create payment session');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create payment session');
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentDetails) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-gray-600 text-lg font-medium mb-6">This event is already fully paid.</p>
        <button
          onClick={onClose}
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
        <div className="flex items-center mb-4">
          <div className="text-2xl mr-3">💳</div>
          <h3 className="font-bold text-purple-800 text-lg">Payment Details</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-purple-200">
            <span className="font-medium text-purple-700">Event:</span>
            <span className="text-purple-900 font-semibold">{event.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-purple-200">
            <span className="font-medium text-purple-700">Amount:</span>
            <span className="text-purple-900 font-bold text-lg">${Number(paymentDetails.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-purple-700">Type:</span>
            <span className="text-purple-900 font-semibold">{paymentDetails.description}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="text-2xl">⚠️</div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-800 font-medium">
              You will be redirected to Stripe's secure payment page to complete your payment.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-pulse">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-300 hover:scale-105"
        >
          Cancel
        </button>
        <button
          onClick={handlePayNow}
          disabled={isLoading}
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Redirecting...
            </div>
          ) : (
            `Pay $${Number(paymentDetails.amount).toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

// Main payment modal component
export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  event,
  onPaymentSuccess,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="text-2xl mr-3">💳</div>
            <h2 className="text-2xl font-bold text-purple-600">Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-600 transition-colors duration-300 p-2 rounded-full hover:bg-purple-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <PaymentRedirect
            event={event}
            onPaymentSuccess={onPaymentSuccess}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
