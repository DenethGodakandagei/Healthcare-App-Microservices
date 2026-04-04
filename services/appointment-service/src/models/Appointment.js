import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  appointmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  tokenNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  patientName: {
    type: String,
    required: true
  },
  patientNIC: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  reasonForVisit: {
    type: String
  },
  notes: {
    type: String
  },
  appointmentType: {
    type: String,
    enum: ['physical', 'online'],
    default: 'physical'
  },
  onlineStatus: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'approved' // Set to approved by default as per user request
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
