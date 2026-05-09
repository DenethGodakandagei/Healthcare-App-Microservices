import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`AI Symptom Service MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("AI Symptom Service Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;