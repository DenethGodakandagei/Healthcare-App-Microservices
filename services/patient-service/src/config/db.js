const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Falls back to docker service hostname 'mongodb' if .env MONGO_URI is missing
    const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/patient_db';
    const conn = await mongoose.connect(uri);
    console.log(`Patient Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Patient Service MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
