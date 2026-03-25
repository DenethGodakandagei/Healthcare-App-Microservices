import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/appointment_db';
    const conn = await mongoose.connect(uri);
    console.log(`Appointment Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Appointment Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
