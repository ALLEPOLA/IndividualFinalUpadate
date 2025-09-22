const stripe = require('../config/stripe');
const Event = require('../models/Event');

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Determine payment amount based on current payment status
    let amount;
    let paymentType;
    let description;
    
    if (event.payment_status === 'pending') {
      // First payment - advance amount
      amount = event.advance_amount;
      paymentType = 'advance';
      description = `Advance Payment for ${event.name}`;
    } else if (event.payment_status === 'advance_paid') {
      // Second payment - remaining amount
      amount = event.remaining_amount;
      paymentType = 'remaining';
      description = `Remaining Payment for ${event.name}`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Event is already fully paid'
      });
    }

    // Create checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
              description: `Event: ${event.name} - ${event.type}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/payment-success?session_id={CHECKOUT_SESSION_ID}&event_id=${eventId}&payment_type=${paymentType}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/payment-cancelled?event_id=${eventId}`,
      metadata: {
        eventId: eventId,
        paymentType: paymentType
      }
    });

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
        amount: amount,
        paymentType: paymentType
      }
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// Confirm payment and update event status
const confirmPayment = async (req, res) => {
  try {
    const { eventId, paymentType } = req.body;
    
    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    let newPaymentStatus;
    let newPaidAmount;

    if (paymentType === 'advance') {
      newPaymentStatus = 'advance_paid';
      newPaidAmount = event.advance_amount;
    } else if (paymentType === 'remaining') {
      newPaymentStatus = 'fully_paid';
      newPaidAmount = event.total_amount;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type'
      });
    }

    // Update event payment status
    await Event.updatePaymentStatus(eventId, newPaymentStatus, newPaidAmount);

    // Send payment notification
    await req.notificationService.notifyPaymentReceived({
      eventId,
      amount: newPaidAmount,
      paymentType,
      eventName: event.name
    }, event.user_id);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentStatus: newPaymentStatus,
        paidAmount: newPaidAmount
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
};

// Webhook handler for Stripe events
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { eventId, paymentType } = session.metadata;

    try {
      let newPaymentStatus;
      let newPaidAmount;

      // Get event details
      const event = await Event.findById(eventId);
      if (!event) {
        console.error('Event not found for payment confirmation:', eventId);
        return res.status(404).json({ error: 'Event not found' });
      }

      if (paymentType === 'advance') {
        newPaymentStatus = 'advance_paid';
        newPaidAmount = event.advance_amount;
      } else if (paymentType === 'remaining') {
        newPaymentStatus = 'fully_paid';
        newPaidAmount = event.total_amount;
      }

      // Update event payment status
      await Event.updatePaymentStatus(eventId, newPaymentStatus, newPaidAmount);
      
      console.log(`Payment confirmed for event ${eventId}: ${paymentType}`);
    } catch (error) {
      console.error('Error processing payment webhook:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  confirmPayment,
  handleWebhook
};
