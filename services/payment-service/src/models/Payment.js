import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  appointmentId: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'lkr'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  paymentMethod: {
    type: String
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
