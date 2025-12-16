import mongoose from "mongoose";

const caseActivitySchema = new mongoose.Schema(
    {
        complaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
        },

        action: {
            type: String,
            required: true,
        },

        performedBy: {
            type: String, // email
            required: true,
        },

        role: {
            type: String,
            enum: ["User", "Investigator", "Admin"],
            required: true,
        },

        meta: {
            type: Object, // optional extra info (badge, old status, etc.)
            default: {},
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

export default mongoose.model("CaseActivity", caseActivitySchema);
