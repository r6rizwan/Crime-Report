import CaseActivity from "../../models/CaseActivity.js";

/* ----------------------------------------------------
   ADMIN / SYSTEM
---------------------------------------------------- */

// Recent activity (dashboard)
export const getRecentCaseActivity = async (req, res) => {
    try {
        const activities = await CaseActivity
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ----------------------------------------------------
   COMPLAINT TIMELINE
---------------------------------------------------- */

export const getComplaintTimeline = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const activities = await CaseActivity
            .find({ complaintId })
            .sort({ createdAt: 1 })
            .lean();

        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
