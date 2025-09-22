const Event = require('../models/Event');

// Get user dashboard analytics
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching dashboard data for user ID:', userId);
    
    // Get all user events
    const events = await Event.findByUserId(userId);
    console.log('Found events:', events.length);
    
    // Debug: Log sample event data
    if (events.length > 0) {
      console.log('Sample event data:', {
        id: events[0].id,
        name: events[0].name,
        paid_amount: events[0].paid_amount,
        total_amount: events[0].total_amount,
        paid_amount_type: typeof events[0].paid_amount,
        total_amount_type: typeof events[0].total_amount
      });
    }
    
    // Calculate analytics
    const totalEvents = events.length;
    const totalSpent = events.reduce((sum, event) => {
      const paidAmount = parseFloat(event.paid_amount) || 0;
      return sum + paidAmount;
    }, 0);
    const totalBudget = events.reduce((sum, event) => {
      const totalAmount = parseFloat(event.total_amount) || 0;
      return sum + totalAmount;
    }, 0);
    
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
    
    // Monthly spending trend (last 6 months)
    const monthlySpending = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    events.forEach(event => {
      const paidAmount = parseFloat(event.paid_amount) || 0;
      if (paidAmount > 0) {
        const eventDate = new Date(event.date);
        if (eventDate >= sixMonthsAgo) {
          const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
          monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + paidAmount;
        }
      }
    });
    
    // Top vendors by spending
    const vendorSpending = {};
    events.forEach(event => {
      const paidAmount = parseFloat(event.paid_amount) || 0;
      if (paidAmount > 0 && event.vendor_name) {
        vendorSpending[event.vendor_name] = (vendorSpending[event.vendor_name] || 0) + paidAmount;
      }
    });
    
    const topVendors = Object.entries(vendorSpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([vendor, amount]) => ({ vendor, amount }));
    
    // Quick stats - ensure all values are numbers
    const quickStats = {
      totalEvents,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      totalBudget: parseFloat(totalBudget.toFixed(2)),
      remainingBudget: parseFloat((totalBudget - totalSpent).toFixed(2)),
      averageEventCost: totalEvents > 0 ? parseFloat((totalBudget / totalEvents).toFixed(2)) : 0,
      eventsThisMonth: events.filter(event => {
        const eventDate = new Date(event.date);
        const currentMonth = new Date();
        return eventDate.getMonth() === currentMonth.getMonth() && 
               eventDate.getFullYear() === currentMonth.getFullYear();
      }).length
    };
    
    res.status(200).json({
      success: true,
      data: {
        quickStats,
        eventsByStatus,
        paymentStatusBreakdown,
        eventsByType,
        recentEvents,
        upcomingEvents,
        monthlySpending,
        topVendors
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get user spending insights
const getUserSpendingInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.findByUserId(userId);
    
    // Spending by category (based on event types)
    const spendingByCategory = events.reduce((acc, event) => {
      const amount = parseFloat(event.paid_amount) || 0;
      acc[event.type] = (acc[event.type] || 0) + amount;
      return acc;
    }, {});
    
    // Payment timeline (when payments were made)
    const paymentTimeline = events
      .filter(event => (parseFloat(event.paid_amount) || 0) > 0)
      .map(event => ({
        date: event.updatedAt || event.createdAt,
        amount: parseFloat(event.paid_amount) || 0,
        eventName: event.name,
        paymentStatus: event.payment_status
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    // Budget vs actual spending
    const budgetAnalysis = events.map(event => {
      const budget = parseFloat(event.total_amount) || 0;
      const spent = parseFloat(event.paid_amount) || 0;
      return {
        eventName: event.name,
        budget: budget,
        spent: spent,
        remaining: budget - spent,
        completionPercentage: budget > 0 ? (spent / budget * 100) : 0
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
        spendingByCategory,
        paymentTimeline,
        budgetAnalysis
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching spending insights',
      error: error.message
    });
  }
};

// Test endpoint to check database connection and events table
const testDashboard = async (req, res) => {
  try {
    console.log('Testing dashboard connection...');
    
    // Test basic database connection
    const allEvents = await Event.findAll();
    console.log('Total events in database:', allEvents.length);
    
    // Test user-specific query
    const userId = req.user?.id || 3; // Default to user 3 for testing
    console.log('Testing with user ID:', userId);
    
    const userEvents = await Event.findByUserId(userId);
    console.log('User events found:', userEvents.length);
    
    res.status(200).json({
      success: true,
      message: 'Dashboard test successful',
      data: {
        totalEvents: allEvents.length,
        userEvents: userEvents.length,
        userId: userId,
        sampleEvent: userEvents[0] || null
      }
    });
    
  } catch (error) {
    console.error('Dashboard test error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  getUserDashboardData,
  getUserSpendingInsights,
  testDashboard
};
