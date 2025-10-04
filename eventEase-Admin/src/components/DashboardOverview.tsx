import React from 'react';

interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalVendors: number;
  pendingEvents: number;
  confirmedEvents: number;
  cancelledEvents: number;
  pendingPayments: number;
  paidPayments: number;
  recentEvents: any[];
}

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <p>No analytics data available.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fully_paid':
        return 'text-green-600 bg-green-100';
      case 'advance_paid':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6 relative overflow-hidden">
      {/* Minimal Floating Decorative Elements */}
      <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-8 right-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
      <div className="absolute top-8 right-8 text-sm animate-bounce opacity-20" style={{ animationDelay: '1.5s' }}>👑</div>
      
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            📊 Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Overview of platform analytics and management</p>
          {/* Light Purple Underline */}
          <div className="w-20 h-0.5 bg-purple-300 rounded-full mt-2"></div>
        </div>
        <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Total Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl text-blue-600">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl text-green-600">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Total Vendors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl text-purple-600">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVendors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Event Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">📊</span>
            Event Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Confirmed</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.confirmedEvents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.pendingEvents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.cancelledEvents}</span>
            </div>
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">💳</span>
            Payment Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Fully Paid</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.paidPayments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Advance Paid</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.paidPayments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.pendingPayments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-lg mr-2">📅</span>
            Recent Events
          </h3>
        </div>
        <div className="p-6">
          {stats.recentEvents && stats.recentEvents.length > 0 ? (
            <div className="space-y-4">
              {stats.recentEvents.slice(0, 5).map((event, index) => (
                <div key={event.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">
                        {event.name ? event.name.charAt(0).toUpperCase() : 'E'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.name || 'Unnamed Event'}</p>
                      <p className="text-xs text-gray-500">{event.type || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(event.total_amount || 0)}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.date || event.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status || 'pending'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(event.payment_status)}`}>
                        {event.payment_status ? event.payment_status.replace('_', ' ') : 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📅</div>
              <p>No recent events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
