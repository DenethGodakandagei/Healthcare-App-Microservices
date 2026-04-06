import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: String, // String to support non-ObjectId IDs from identity-service
            ref: "User",
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
        readBy: [
            {
                type: String, // String to support non-ObjectId IDs
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;