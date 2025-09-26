import React, { useState, useEffect } from 'react';
import { vendorDashboardService, type VendorDashboardData, type VendorBusinessInsights } from '../../../../services/vendorDashboardService';

export const Analytics = () => {
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);
  const [businessInsights, setBusinessInsights] = useState<VendorBusinessInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, insightsResponse] = await Promise.all([
          vendorDashboardService.getVendorDashboardData(),
          vendorDashboardService.getVendorBusinessInsights()
        ]);
        
        setDashboardData(dashboardResponse);
        setBusinessInsights(insightsResponse);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? '📈' : '📉';
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
        <div className="relative z-10 animate-fadeIn">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-8">
            📊 Business Analytics
          </h2>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/50 rounded-xl h-32"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white/50 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
        <div className="relative z-10 animate-fadeIn">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-8">
            📊 Business Analytics
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600">Error loading analytics data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>📊</div>
      <div className="absolute top-20 right-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '1.5s' }}>📈</div>
      <div className="absolute bottom-32 left-16 text-xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>💰</div>
      <div className="absolute bottom-20 right-10 text-2xl animate-bounce opacity-30" style={{ animationDelay: '2.5s' }}>🎯</div>
      
      <div className="relative z-10 animate-fadeIn">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3">
          📊 Business Analytics
        </h2>
        <p className="text-purple-700 text-lg mb-8">
          Track your business performance with detailed analytics. View booking trends,
          revenue reports, customer satisfaction metrics, and other key performance indicators.
          Make data-driven decisions to grow your business and improve your services.
        </p>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(dashboardData?.quickStats?.totalRevenue || 0)}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-blue-800">{dashboardData?.quickStats?.totalEvents || 0}</p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </div>

          {/* Average Event Value */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Avg Event Value</p>
                <p className="text-2xl font-bold text-purple-800">{formatCurrency(dashboardData?.quickStats?.averageEventValue || 0)}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-orange-800">{formatPercentage(dashboardData?.quickStats?.completionRate || 0)}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Business Growth Metrics */}
        {businessInsights?.businessGrowth && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 shadow-lg mb-8">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">📈 Business Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-indigo-600 text-sm font-medium">Revenue Growth</p>
                <p className={`text-2xl font-bold ${getGrowthColor(businessInsights.businessGrowth.revenueGrowth)}`}>
                  {getGrowthIcon(businessInsights.businessGrowth.revenueGrowth)} {formatPercentage(businessInsights.businessGrowth.revenueGrowth)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-indigo-600 text-sm font-medium">Event Growth</p>
                <p className={`text-2xl font-bold ${getGrowthColor(businessInsights.businessGrowth.eventGrowth)}`}>
                  {getGrowthIcon(businessInsights.businessGrowth.eventGrowth)} {formatPercentage(businessInsights.businessGrowth.eventGrowth)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-indigo-600 text-sm font-medium">This Month Revenue</p>
                <p className="text-2xl font-bold text-indigo-800">{formatCurrency(businessInsights.businessGrowth.currentMonthRevenue)}</p>
              </div>
              <div className="text-center">
                <p className="text-indigo-600 text-sm font-medium">This Month Events</p>
                <p className="text-2xl font-bold text-indigo-800">{businessInsights.businessGrowth.currentMonthEvents}</p>
              </div>
            </div>
          </div>
        )}

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Status */}
          <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-lg">
            <h3 className="text-lg font-bold text-purple-800 mb-4">📊 Events by Status</h3>
            <div className="space-y-4">
              {dashboardData?.eventsByStatus && Object.entries(dashboardData.eventsByStatus).map(([status, count]) => {
                const total = Object.values(dashboardData.eventsByStatus).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colorClass = status === 'confirmed' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500';
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${colorClass} mr-3`}></div>
                      <span className="text-gray-700 capitalize">{status}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium mr-2">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colorClass}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl p-6 border border-green-200 shadow-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4">💳 Payment Status</h3>
            <div className="space-y-4">
              {dashboardData?.paymentStatusBreakdown && Object.entries(dashboardData.paymentStatusBreakdown).map(([status, count]) => {
                const total = Object.values(dashboardData.paymentStatusBreakdown).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colorClass = status === 'fully_paid' ? 'bg-green-500' : status === 'advance_paid' ? 'bg-blue-500' : 'bg-red-500';
                const statusLabel = status === 'fully_paid' ? 'Fully Paid' : status === 'advance_paid' ? 'Advance Paid' : 'Pending';
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${colorClass} mr-3`}></div>
                      <span className="text-gray-700">{statusLabel}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium mr-2">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colorClass}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service Performance */}
        {businessInsights?.servicePerformance && businessInsights.servicePerformance.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-lg mb-8">
            <h3 className="text-lg font-bold text-blue-800 mb-4">🎯 Service Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-700 font-medium">Service</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Bookings</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Revenue</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Avg Value</th>
                  </tr>
                </thead>
                <tbody>
                  {businessInsights.servicePerformance.map((service) => (
                    <tr key={service.serviceId} className="border-b border-gray-100">
                      <td className="py-3 text-gray-800 font-medium">{service.serviceName}</td>
                      <td className="py-3 text-gray-600">{service.bookings}</td>
                      <td className="py-3 text-green-600 font-medium">{formatCurrency(service.revenue)}</td>
                      <td className="py-3 text-blue-600 font-medium">{formatCurrency(service.averageBookingValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Clients */}
        {dashboardData?.topClients && dashboardData.topClients.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-lg mb-8">
            <h3 className="text-lg font-bold text-purple-800 mb-4">👥 Top Clients</h3>
            <div className="space-y-3">
              {dashboardData.topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 font-medium">{client.client}</span>
                  </div>
                  <span className="text-green-600 font-bold">{formatCurrency(client.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Management Analytics */}
        {businessInsights?.teamPerformanceSummary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Team Performance Overview */}
            <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-lg">
              <h3 className="text-lg font-bold text-indigo-800 mb-4">👥 Team Performance Overview</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <p className="text-indigo-600 text-sm font-medium">Total Members</p>
                  <p className="text-2xl font-bold text-indigo-800">{businessInsights.teamPerformanceSummary.totalTeamMembers}</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-green-600 text-sm font-medium">Active Members</p>
                  <p className="text-2xl font-bold text-green-800">{businessInsights.teamPerformanceSummary.activeTeamMembers}</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <p className="text-blue-600 text-sm font-medium">Events with Team</p>
                  <p className="text-2xl font-bold text-blue-800">{businessInsights.teamPerformanceSummary.totalEventsWithTeam}</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-purple-600 text-sm font-medium">Avg Team Size</p>
                  <p className="text-2xl font-bold text-purple-800">{businessInsights.teamPerformanceSummary.averageTeamSizePerEvent}</p>
                </div>
              </div>
              
              {businessInsights.teamPerformanceSummary.topPerformingMember && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">🏆 Top Performer</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-yellow-800">{businessInsights.teamPerformanceSummary.topPerformingMember.name}</p>
                      <p className="text-sm text-yellow-600">{businessInsights.teamPerformanceSummary.topPerformingMember.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-800">{formatCurrency(businessInsights.teamPerformanceSummary.topPerformingMember.revenue)}</p>
                      <p className="text-xs text-yellow-600">{businessInsights.teamPerformanceSummary.topPerformingMember.events} events</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Team Utilization Chart */}
            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-4">📊 Team Utilization</h3>
              <div className="space-y-3">
                {businessInsights?.teamUtilization && businessInsights.teamUtilization.length > 0 ? (
                  businessInsights.teamUtilization.map((member) => {
                    const utilizationColor = member.utilizationPercentage >= 80 ? 'bg-green-500' : 
                                           member.utilizationPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
                    
                    return (
                      <div key={member.memberId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${utilizationColor} mr-3`}></div>
                          <div>
                            <span className="text-gray-800 font-medium text-sm">{member.memberName}</span>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium mr-2 text-sm">{member.utilizationPercentage.toFixed(1)}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${utilizationColor}`} 
                              style={{ width: `${Math.min(member.utilizationPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No team members found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Performance Table */}
        {businessInsights?.teamUtilization && businessInsights.teamUtilization.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-lg mb-8">
            <h3 className="text-lg font-bold text-blue-800 mb-4">🎯 Team Members Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-700 font-medium">Member</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Role</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Events</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Revenue</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Utilization</th>
                    <th className="text-left py-3 text-gray-700 font-medium">Avg Event Value</th>
                  </tr>
                </thead>
                <tbody>
                  {businessInsights.teamUtilization.map((member) => (
                    <tr key={member.memberId} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                            member.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {member.memberName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{member.memberName}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{member.eventsAssigned}</td>
                      <td className="py-3 text-green-600 font-medium">{formatCurrency(member.totalRevenue)}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                member.utilizationPercentage >= 80 ? 'bg-green-500' : 
                                member.utilizationPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${Math.min(member.utilizationPercentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{member.utilizationPercentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-blue-600 font-medium">{formatCurrency(member.averageEventValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Revenue Chart */}
        {dashboardData?.monthlyRevenue && Object.keys(dashboardData.monthlyRevenue).length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-green-200 shadow-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4">📈 Monthly Revenue Trend</h3>
            <div className="space-y-4">
              {Object.entries(dashboardData.monthlyRevenue)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, revenue]) => {
                  const maxRevenue = Math.max(...Object.values(dashboardData.monthlyRevenue));
                  const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                  const date = new Date(month + '-01');
                  const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  
                  return (
                    <div key={month} className="flex items-center">
                      <div className="w-20 text-sm text-gray-600 mr-4">{monthName}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-20 text-sm font-medium text-green-600">{formatCurrency(revenue)}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};