const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/doctor_db';
    const conn = await mongoose.connect(uri);
    console.log(`Doctor Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Doctor Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
