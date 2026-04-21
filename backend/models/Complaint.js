// import mongoose from "mongoose";

// const complaintSchema = new mongoose.Schema(
//     {
//         complaintId: { type: String, required: true, unique: true },
//         complaintType: { type: String, required: true },
//         description: { type: String },
//         dateTime: { type: Date, default: Date.now },
//         file: { type: String }, // file path or URL
//         email: { type: String, required: true }, // user who filed the complaint

//         status: {
//             type: String,
//             enum: ["Pending", "Open", "Assigned", "Closed", "Resolved"],
//             default: "Pending"
//         },

//         assignedTo: { type: String, default: null }, // Investigator email/ID
//         createdAt: { type: Date, default: Date.now },
//         solution: { type: String, default: "" } // officer's solution/remarks
//     }
// );

// export default mongoose.model("Complaint", complaintSchema);


import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            required: true,
            unique: true
        },

        complaintType: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        // Original filed time (keep for compatibility)
        dateTime: {
            type: Date,
            default: Date.now
        },

        file: {
            type: String // file path or filename
        },

        email: {
            type: String,
            required: true // user who filed the complaint
        },

        /* ---------------- STATUS ---------------- */

        status: {
            type: String,
            enum: ["Pending", "Assigned", "Open", "Resolved", "Closed"],
            default: "Pending"
        },

        /* ---------------- INVESTIGATOR ---------------- */

        assignedTo: {
            type: String,
            default: null // investigator email
        },

        assignedAt: {
            type: Date,
            default: null
        },

        /* ---------------- LIFECYCLE TIMESTAMPS ---------------- */

        openedAt: {
            type: Date,
            default: null
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        closedAt: {
            type: Date,
            default: null
        },

        /* ---------------- RESOLUTION ---------------- */

        solution: {
            type: String,
            default: ""
        },

        aiSuggestion: {
            suggestedCategory: { type: String, default: null },
            suggestedPriority: {
                type: String,
                enum: ["Low", "Medium", "High", "Critical"],
                default: null
            },
            reasoning: { type: String, default: null },
            userAccepted: { type: Boolean, default: null },
            usedAI: { type: Boolean, default: false }
        },

        investigationUpdate: {
            status: { type: String, default: null },
            note: { type: String, default: null },
            updatedAt: { type: Date, default: null }
        },

        /* ---------------- META ---------------- */

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model("Complaint", complaintSchema);
