import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/identity_db';
    const conn = await mongoose.connect(uri);
    console.log(`Identity Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Identity Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
