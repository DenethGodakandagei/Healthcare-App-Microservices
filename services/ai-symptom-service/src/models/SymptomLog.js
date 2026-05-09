import mongoose from "mongoose";

const symptomLogSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        symptoms: {
            type: String,
            required: true,
        },
        aiResponse: {
            type: Object,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SymptomLog", symptomLogSchema);