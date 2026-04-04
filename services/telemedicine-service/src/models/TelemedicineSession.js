import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'doctor' or 'patient'
  senderId: { type: String, required: true },
  senderName: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const telemedicineSessionSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true
  },
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  patientName: {
    type: String
  },
  doctorName: {
    type: String
  },
  channelName: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['waiting', 'ongoing', 'completed', 'cancelled'],
    default: 'waiting'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  notes: {
    type: String
  },
  chatMessages: [chatMessageSchema]
}, { timestamps: true });

const TelemedicineSession = mongoose.model('TelemedicineSession', telemedicineSessionSchema);
export default TelemedicineSession;
