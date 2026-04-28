import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log(`Connecting to Identity MongoDB...`);
    const conn = await mongoose.connect(uri);
    console.log(`Identity Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Identity Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
