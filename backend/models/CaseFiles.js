// models/CaseFiles.js
import mongoose from "mongoose";

const caseFilesSchema = new mongoose.Schema(
    {
        complaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true
        },

        investigatorEmail: {
            type: String,
            required: true
        },

        notes: {
            type: String,
            default: ""
        },

        files: [
            {
                filename: String,
                uploadedAt: { type: Date, default: Date.now }
            }
        ],

        visibility: {
            type: String,
            enum: ["AdminOnly"],
            default: "AdminOnly"
        }
    },
    { timestamps: true }
);

export default mongoose.model("CaseFiles", caseFilesSchema);
