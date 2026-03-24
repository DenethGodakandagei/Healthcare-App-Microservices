import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: {
    type: String, // String to match the user ID from Identity Service/Gateway
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  medicalHistory: [String],
}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
