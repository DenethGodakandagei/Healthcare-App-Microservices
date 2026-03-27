import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true // e.g., '08:00'
  },
  endTime: {
    type: String,
    required: true // e.g., '10:00'
  },
  maxAppointments: {
    type: Number,
    default: 20
  },
  currentAppointmentsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, { timestamps: true });

const AppointmentSession = mongoose.model('AppointmentSession', sessionSchema);
export default AppointmentSession;
