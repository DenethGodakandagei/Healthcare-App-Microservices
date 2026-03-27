import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String, // from identity-service via x-user-id header
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availability: [{
    day: { type: String }, // e.g., 'Monday'
    startTime: { type: String }, // e.g., '09:00'
    endTime: { type: String } // e.g., '17:00'
  }]
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
