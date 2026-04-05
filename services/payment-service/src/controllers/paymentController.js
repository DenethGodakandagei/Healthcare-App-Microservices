import Payment from '../models/Payment.js';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51MockedStripeSecretKey123', {
  apiVersion: '2023-10-16',
});
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:4002/api/appointments';

// @desc    Get Stripe client secret for checkout
// @route   POST /api/payments/intent
// @access  Private (Patient)
export const createPaymentIntent = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'] || 'mock-user-id';

    const { appointmentId, amount, patientName, patientEmail, patientPhone } = req.body;
    
    // Create new payment record
    const payment = await Payment.create({
      patientId,
      appointmentId,
      amount,
      currency: 'LKR',
      status: 'pending'
    });

    const orderId = payment._id.toString();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in the smallest currency unit (cents)
      currency: 'lkr',
      metadata: {
        orderId,
        appointmentId,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        order_id: orderId,
        amount: amount,
      }
    });
  } catch (error) {
    if (error.message && error.message.includes('Invalid API Key provided')) {
      return res.status(500).json({ success: false, message: 'You must provide a valid STRIPE_SECRET_KEY in the backend .env file to use Stripe.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stripe Webhook (Equivalent to IPN)
// @route   POST /api/payments/notify
// @access  Public
export const handlePayHereNotify = async (req, res) => {
  // Stripe webhook handling should typically verify signatures here
  try {
    const event = req.body;
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      
      let payment = await Payment.findById(orderId);
      if (payment) {
        payment.status = 'completed';
        payment.paymentMethod = 'stripe';
        await payment.save();

        if (payment.appointmentId && payment.appointmentId !== 'PENDING') {
            try {
                await axios.put(`${APPOINTMENT_SERVICE_URL}/${payment.appointmentId}/payment`, {
                    paymentStatus: 'paid',
                    paymentId: payment._id
                });
            } catch (err) {}
        }
      }
    }

    res.status(200).send('Webhook handled');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, status, appointmentId, cardLast4 } = req.body;
    let payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (appointmentId) {
       payment.appointmentId = appointmentId;
    }

    if (status === 'completed') {
      payment.status = 'completed';
      payment.paymentMethod = cardLast4 ? `card-${cardLast4}` : 'card';
      await payment.save();

      // Notify appointment service
      try {
        if (payment.appointmentId && payment.appointmentId !== 'PENDING') {
          await axios.put(`${APPOINTMENT_SERVICE_URL}/${payment.appointmentId}/payment`, {
            paymentStatus: 'paid',
            paymentId: payment._id
          });
        }
      } catch (err) {
        console.error("Failed to notify appointment service:", err.message);
      }
    }
    
    res.status(200).json({ success: true, message: 'Payment confirmed manually' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient payments
export const getPatientPayments = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    if (!patientId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const payments = await Payment.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const role = req.headers['x-user-role'];
    if (role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
    
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
