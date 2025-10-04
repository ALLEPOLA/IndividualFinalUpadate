import React from 'react';

interface Payment {
  id: number;
  event_id: number;
  event_name: string;
  event_type: string;
  event_date: string;
  event_description: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vendor_name: string;
  vendor_id: number;
  total_amount: number;
  advance_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: string;
  advance_percentage: number;
  services: any[];
  createdAt: string;
  updatedAt: string;
}

interface PaymentDetailsModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  if (!isOpen || !payment) return null;

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fully_paid':
        return 'bg-green-100 text-green-800';
      case 'advance_paid':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getPaymentProgress = (paidAmount: number, totalAmount: number) => {
    if (totalAmount === 0) return 0;
    return Math.round((paidAmount / totalAmount) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-lg">
                  {payment.event_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <p className="text-gray-600">{payment.event_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                    <p className="text-sm text-gray-900">{payment.event_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Type</label>
                    <p className="text-sm text-gray-900">{payment.event_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Date</label>
                    <p className="text-sm text-gray-900">{formatDate(payment.event_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event ID</label>
                    <p className="text-sm text-gray-900 font-mono">{payment.event_id}</p>
                  </div>
                  {payment.event_description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{payment.event_description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="text-sm text-gray-900">{payment.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{payment.customer_email}</p>
                  </div>
                  {payment.customer_phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{payment.customer_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                    <p className="text-sm text-gray-900">{payment.vendor_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
                    <p className="text-sm text-gray-900 font-mono">{payment.vendor_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              {/* Payment Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.payment_status)}`}>
                      {payment.payment_status.replace('_', ' ').charAt(0).toUpperCase() + payment.payment_status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Progress</label>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getPaymentProgress(payment.paid_amount, payment.total_amount)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {getPaymentProgress(payment.paid_amount, payment.total_amount)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Total Amount</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(payment.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Advance Amount</span>
                    <span className="text-sm text-gray-900">{formatCurrency(payment.advance_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Paid Amount</span>
                    <span className="text-sm text-green-600 font-semibold">{formatCurrency(payment.paid_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">Remaining Amount</span>
                    <span className="text-sm text-red-600 font-semibold">{formatCurrency(payment.remaining_amount)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Advance Percentage</span>
                      <span className="text-sm text-gray-900">{payment.advance_percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {payment.services && payment.services.length > 0 ? (
                    <div className="space-y-2">
                      {payment.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.description}</p>
                          </div>
                          <p className="text-sm text-gray-900">{formatCurrency(service.base_price || 0)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No services assigned</p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {new Date(payment.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
