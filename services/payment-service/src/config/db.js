import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/payment_db';
    const conn = await mongoose.connect(uri);
    console.log(`Payment Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Payment Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
