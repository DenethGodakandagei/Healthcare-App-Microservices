import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: false
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["EMAIL", "SMS", "BOTH"],
            default: "BOTH"
        },
        status: {
            type: String,
            enum: ["PENDING", "SENT", "FAILED"],
            default: "PENDING"
        },
        error: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);