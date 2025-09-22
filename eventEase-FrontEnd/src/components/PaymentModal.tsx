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
        <p className="text-gray-500">This event is already fully paid.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Payment Details</h3>
        <p className="text-blue-800">
          <strong>Event:</strong> {event.name}
        </p>
        <p className="text-blue-800">
          <strong>Amount:</strong> ${Number(paymentDetails.amount).toFixed(2)}
        </p>
        <p className="text-blue-800">
          <strong>Type:</strong> {paymentDetails.description}
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You will be redirected to Stripe's secure payment page to complete your payment.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePayNow}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Redirecting...' : `Pay $${Number(paymentDetails.amount).toFixed(2)}`}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
