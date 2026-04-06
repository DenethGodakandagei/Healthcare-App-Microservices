import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        _id: { type: String }, // Use String to match identity-service IDs (non-ObjectId)
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    },
    { timestamps: true, _id: false } // _id: false prevents auto-generation so our String _id is used
);

const User = mongoose.model("User", userSchema);

export default User;
