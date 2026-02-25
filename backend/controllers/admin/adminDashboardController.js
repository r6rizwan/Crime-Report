import Complaint from "../../models/Complaint.js";

export const getAdminDashboardStats = async (req, res) => {
    try {
        const [
            total,
            pending,
            assigned,
            open,
            resolved,
            closed
        ] = await Promise.all([
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: "Pending" }),
            Complaint.countDocuments({ status: "Assigned" }),
            Complaint.countDocuments({ status: "Open" }),
            Complaint.countDocuments({ status: "Resolved" }),
            Complaint.countDocuments({ status: "Closed" }),
        ]);

        res.json({
            total,
            pending,
            assigned,
            open,
            resolved,
            closed,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
