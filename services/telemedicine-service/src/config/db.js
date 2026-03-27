import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/telemedicine_db';
    const conn = await mongoose.connect(uri);
    console.log(`Telemedicine Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Telemedicine Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
