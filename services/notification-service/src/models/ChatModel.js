import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
        },

        isGroupChat: {
            type: Boolean,
            default: false,
        },

        chatType: {
            type: String,
            enum: ["doctor-patient"],
            default: "doctor-patient",
        },

        // Use String refs to support non-ObjectId IDs from identity-service
        users: [
            {
                type: String,
                ref: "User",
            },
        ],

        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        groupAdmin: {
            type: String,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;