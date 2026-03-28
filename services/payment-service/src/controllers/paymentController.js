import Payment from '../models/Payment.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// @desc    Create a payment intent (Stripe integration)
// @route   POST /api/payments/intent
// @access  Private (Patient)
export const createPaymentIntent = async (req, res) => {
  try {
    const patientId = req.headers['x-user-id'];
    if (!patientId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { appointmentId, amount } = req.body;
    
    // Create new payment record
    const payment = await Payment.create({
      patientId,
      appointmentId,
      amount,
      currency: 'lkr',
      status: 'pending'
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: 'lkr',
      metadata: {
        appointmentId,
        patientId,
        paymentId: payment._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, transactionId, status } = req.body;
    let payment = await Payment.findById(paymentId);
    
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (status === 'completed') payment.paymentMethod = 'stripe';
    
    await payment.save();
    
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient payments
// @route   GET /api/payments/patient
// @access  Private (Patient)
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
// @route   GET /api/payments
// @access  Private (Admin)
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
