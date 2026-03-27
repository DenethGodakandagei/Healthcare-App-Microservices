import mongoose from 'mongoose';

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
  }
}, { timestamps: true });

const TelemedicineSession = mongoose.model('TelemedicineSession', telemedicineSessionSchema);
export default TelemedicineSession;
