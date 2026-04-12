import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        senderId: String,
        receiverId: String,
        role: {
            type: String,
            enum: ["patient", "doctor"]
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["chat", "email", "sms", "security"],
            default: "chat"
        },
        status: {
            type: String,
            enum: ["PENDING", "SENT", "FAILED", "SEEN"],
            default: "PENDING"
        },
        error: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);