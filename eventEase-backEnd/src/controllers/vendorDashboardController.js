const Event = require('../models/Event');
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const TeamMember = require('../models/TeamMember');

// Get vendor dashboard analytics
const getVendorDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching vendor dashboard data for user ID:', userId);
    
    // Get vendor information
    const vendor = await Vendor.findByUserId(userId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    // Get all events for this vendor
    const events = await Event.findByVendor(vendor.id);
    console.log('Found events for vendor:', events.length);
    
    // Debug: Log sample event data
    if (events.length > 0) {
      console.log('Sample vendor event data:', {
        id: events[0].id,
        name: events[0].name,
        paid_amount: events[0].paid_amount,
        total_amount: events[0].total_amount,
        status: events[0].status
      });
    }
    
    // Calculate revenue analytics
    const totalRevenue = events.reduce((sum, event) => {
      const paidAmount = parseFloat(event.paid_amount) || 0;
      return sum + paidAmount;
    }, 0);
    
    const totalBooked = events.reduce((sum, event) => {
      const totalAmount = parseFloat(event.total_amount) || 0;
      return sum + totalAmount;
    }, 0);
    
    const pendingRevenue = totalBooked - totalRevenue;
    
    // Events by status
    const eventsByStatus = {
      pending: events.filter(e => e.status === 'pending').length,
      confirmed: events.filter(e => e.status === 'confirmed').length,
      cancelled: events.filter(e => e.status === 'cancelled').length
    };
    
    // Payment status breakdown
    const paymentStatusBreakdown = {
      pending: events.filter(e => e.payment_status === 'pending').length,
      advance_paid: events.filter(e => e.payment_status === 'advance_paid').length,
      fully_paid: events.filter(e => e.payment_status === 'fully_paid').length
    };
    
    // Events by type
    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});
    
    // Recent events (last 5)
    const recentEvents = events.slice(0, 5);
    
    // Upcoming events (next 30 days)
    const today = new Date();
    const nextMonth = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextMonth;
    }).slice(0, 5);
    
    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    events.forEach(event => {
      const paidAmount = parseFloat(event.paid_amount) || 0;
      if (paidAmount > 0) {
        const eventDate = new Date(event.date);
        if (eventDate >= sixMonthsAgo) {
          const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + paidAmount;
        }
      }
    });
    
    // Top clients by spending - get user names
    const clientSpending = {};
    const userIds = new Set();
    
    events.forEach(event => {
      const paidAmount = parseFloat(event.paid_amount) || 0;
      if (paidAmount > 0 && event.user_id) {
        userIds.add(event.user_id);
        clientSpending[event.user_id] = (clientSpending[event.user_id] || 0) + paidAmount;
      }
    });
    
    // Get user names for the clients
    const topClients = [];
    if (userIds.size > 0) {
      const userIdArray = Array.from(userIds);
      const { pool } = require('../config/db');
      
      const placeholders = userIdArray.map(() => '?').join(',');
      const userQuery = `SELECT id, firstName, lastName FROM users WHERE id IN (${placeholders})`;
      const [userRows] = await pool.execute(userQuery, userIdArray);
      
      // Create a map of user IDs to names
      const userMap = {};
      userRows.forEach(user => {
        userMap[user.id] = `${user.firstName} ${user.lastName}`;
      });
      
      // Create top clients array with names
      topClients.push(...Object.entries(clientSpending)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([userId, amount]) => ({ 
          client: userMap[userId] || `User ${userId}`, 
          amount 
        })));
    }
    
    // Quick stats
    const quickStats = {
      totalEvents: events.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalBooked: parseFloat(totalBooked.toFixed(2)),
      pendingRevenue: parseFloat(pendingRevenue.toFixed(2)),
      averageEventValue: events.length > 0 ? parseFloat((totalBooked / events.length).toFixed(2)) : 0,
      eventsThisMonth: events.filter(event => {
        const eventDate = new Date(event.date);
        const currentMonth = new Date();
        return eventDate.getMonth() === currentMonth.getMonth() && 
               eventDate.getFullYear() === currentMonth.getFullYear();
      }).length,
      completionRate: events.length > 0 ? 
        parseFloat(((eventsByStatus.confirmed / events.length) * 100).toFixed(2)) : 0
    };
    
    res.status(200).json({
      success: true,
      data: {
        vendorInfo: vendor.toJSON(),
        quickStats,
        eventsByStatus,
        paymentStatusBreakdown,
        eventsByType,
        recentEvents,
        upcomingEvents,
        monthlyRevenue,
        topClients
      }
    });
    
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor dashboard data',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get vendor business insights
const getVendorBusinessInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const vendor = await Vendor.findByUserId(userId);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    // Get vendor services
    const vendorServices = await VendorService.findByVendor(vendor.id);
    
    // Get team members
    const teamMembers = await TeamMember.findByVendor(vendor.id);
    
    // Get events for analysis
    const events = await Event.findByVendor(vendor.id);
    
    // Service performance analysis
    const servicePerformance = vendorServices.length > 0 ? vendorServices.map(service => {
      const serviceEvents = events.filter(event => {
        if (event.services && Array.isArray(event.services)) {
          return event.services.some(s => s.id === service.id);
        }
        return false;
      });
      
      const serviceRevenue = serviceEvents.reduce((sum, event) => {
        const paidAmount = parseFloat(event.paid_amount) || 0;
        return sum + paidAmount;
      }, 0);
      
      return {
        serviceId: service.id,
        serviceName: service.name,
        basePrice: service.base_price,
        bookings: serviceEvents.length,
        revenue: serviceRevenue,
        averageBookingValue: serviceEvents.length > 0 ? 
          parseFloat((serviceRevenue / serviceEvents.length).toFixed(2)) : 0
      };
    }) : [];
    
    // Enhanced team member utilization analysis
    const teamUtilization = teamMembers.length > 0 ? teamMembers.map(member => {
      // Count events where this team member is assigned
      const memberEvents = events.filter(event => {
        if (event.team_members) {
          try {
            const teamMembersData = typeof event.team_members === 'string' 
              ? JSON.parse(event.team_members) 
              : event.team_members;
            return teamMembersData.some(tm => tm.id === member.id);
          } catch (error) {
            return false;
          }
        }
        return false;
      });

      // Calculate revenue generated by this team member
      const memberRevenue = memberEvents.reduce((sum, event) => {
        const paidAmount = parseFloat(event.paid_amount) || 0;
        return sum + paidAmount;
      }, 0);

      // Calculate total potential earnings (hourly rate * estimated hours)
      const estimatedHoursPerEvent = 8; // Average event duration
      const totalPotentialEarnings = memberEvents.length * member.hourly_rate * estimatedHoursPerEvent;

      // Calculate utilization percentage (actual revenue vs potential earnings)
      const utilizationPercentage = totalPotentialEarnings > 0 
        ? (memberRevenue / totalPotentialEarnings) * 100 
        : 0;

      return {
        memberId: member.id,
        memberName: member.name,
        role: member.role,
        email: member.email,
        hourlyRate: member.hourly_rate,
        isActive: member.is_active,
        eventsAssigned: memberEvents.length,
        totalRevenue: parseFloat(memberRevenue.toFixed(2)),
        utilizationPercentage: parseFloat(utilizationPercentage.toFixed(2)),
        averageEventValue: memberEvents.length > 0 
          ? parseFloat((memberRevenue / memberEvents.length).toFixed(2)) 
          : 0
      };
    }) : [];

    // Team performance summary
    const teamPerformanceSummary = {
      totalTeamMembers: teamMembers.length,
      activeTeamMembers: teamMembers.filter(m => m.is_active).length,
      totalEventsWithTeam: events.filter(event => {
        if (event.team_members) {
          try {
            const teamMembersData = typeof event.team_members === 'string' 
              ? JSON.parse(event.team_members) 
              : event.team_members;
            return teamMembersData.length > 0;
          } catch (error) {
            return false;
          }
        }
        return false;
      }).length,
      averageTeamSizePerEvent: 0,
      topPerformingMember: null,
      totalTeamCost: 0
    };

    // Calculate average team size per event
    if (teamPerformanceSummary.totalEventsWithTeam > 0) {
      const totalTeamAssignments = events.reduce((sum, event) => {
        if (event.team_members) {
          try {
            const teamMembersData = typeof event.team_members === 'string' 
              ? JSON.parse(event.team_members) 
              : event.team_members;
            return sum + teamMembersData.length;
          } catch (error) {
            return sum;
          }
        }
        return sum;
      }, 0);
      teamPerformanceSummary.averageTeamSizePerEvent = parseFloat((totalTeamAssignments / teamPerformanceSummary.totalEventsWithTeam).toFixed(2));
    }

    // Find top performing team member
    if (teamUtilization.length > 0) {
      const topMember = teamUtilization.reduce((max, member) => 
        member.totalRevenue > max.totalRevenue ? member : max
      );
      teamPerformanceSummary.topPerformingMember = {
        name: topMember.memberName,
        role: topMember.role,
        revenue: topMember.totalRevenue,
        events: topMember.eventsAssigned
      };
    }

    // Calculate total team cost (sum of all hourly rates)
    teamPerformanceSummary.totalTeamCost = teamMembers.reduce((sum, member) => {
      return sum + (parseFloat(member.hourly_rate) || 0);
    }, 0);
    
    // Business growth metrics
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const twoMonthsAgo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 2);
    
    const currentMonthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth.getMonth() && 
             eventDate.getFullYear() === currentMonth.getFullYear();
    });
    
    const lastMonthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === lastMonth.getMonth() && 
             eventDate.getFullYear() === lastMonth.getFullYear();
    });
    
    const currentMonthRevenue = currentMonthEvents.reduce((sum, event) => {
      return sum + (parseFloat(event.paid_amount) || 0);
    }, 0);
    
    const lastMonthRevenue = lastMonthEvents.reduce((sum, event) => {
      return sum + (parseFloat(event.paid_amount) || 0);
    }, 0);
    
    const revenueGrowth = lastMonthRevenue > 0 ? 
      parseFloat(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        servicePerformance,
        teamUtilization,
        teamPerformanceSummary,
        businessGrowth: {
          currentMonthEvents: currentMonthEvents.length,
          lastMonthEvents: lastMonthEvents.length,
          currentMonthRevenue: parseFloat(currentMonthRevenue.toFixed(2)),
          lastMonthRevenue: parseFloat(lastMonthRevenue.toFixed(2)),
          revenueGrowth: revenueGrowth,
          eventGrowth: lastMonthEvents.length > 0 ? 
            parseFloat(((currentMonthEvents.length - lastMonthEvents.length) / lastMonthEvents.length * 100).toFixed(2)) : 0
        }
      }
    });
    
  } catch (error) {
    console.error('Vendor business insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor business insights',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Test endpoint for vendor dashboard
const testVendorDashboard = async (req, res) => {
  try {
    console.log('Testing vendor dashboard connection...');
    
    const userId = req.user?.id || 2; // Default to vendor user 2 for testing
    console.log('Testing with user ID:', userId);
    
    // Test vendor lookup
    const vendor = await Vendor.findByUserId(userId);
    console.log('Vendor found:', vendor ? vendor.businessName : 'Not found');
    
    if (vendor) {
      const events = await Event.findByVendor(vendor.id);
      console.log('Vendor events found:', events.length);
      
      res.status(200).json({
        success: true,
        message: 'Vendor dashboard test successful',
        data: {
          vendorId: vendor.id,
          businessName: vendor.businessName,
          totalEvents: events.length,
          sampleEvent: events[0] || null
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vendor profile not found for user'
      });
    }
    
  } catch (error) {
    console.error('Vendor dashboard test error:', error);
    res.status(500).json({
      success: false,
      message: 'Vendor dashboard test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  getVendorDashboardData,
  getVendorBusinessInsights,
  testVendorDashboard
};
