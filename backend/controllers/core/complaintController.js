import Complaint from "../../models/Complaint.js";
import CaseActivity from "../../models/CaseActivity.js";
import Counter from "../../models/Counter.js";
import Register from "../../models/Register.js";
import Profile from "../../models/Profile.js";

/* ----------------------------------------------------
   CREATE COMPLAINT (USER)
---------------------------------------------------- */
export const createComplaint = async (req, res) => {
    try {
        const { complaintType, description, email } = req.body;

        if (req.user?.role === "User") {
            const userEmail = (req.user.email || "").toLowerCase();
            const bodyEmail = (email || "").toLowerCase();
            if (!userEmail || userEmail !== bodyEmail) {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

        const year = new Date().getFullYear();

        // 🔐 Atomic counter per year
        const counter = await Counter.findOneAndUpdate(
            { year },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // 🔢 Zero-padded sequence
        const paddedSeq = String(counter.seq).padStart(2, "0");

        // ✅ FINAL FORMAT
        const complaintId = `CMP-${paddedSeq}/${year}`;

        let fileName = "";
        if (req.file) {
            fileName = req.file.filename || "";
        }

        const complaint = await Complaint.create({
            complaintId,
            complaintType,
            description,
            email,
            file: fileName,
            status: "Pending",
        });

        // 🔹 ACTIVITY LOG
        await CaseActivity.create({
            complaintId: complaint._id,
            action: "Complaint Filed",
            performedBy: email,
            role: "User",
            meta: {
                referenceId: complaintId,
            },
        });

        res.status(201).json({
            message: "Complaint filed successfully",
            complaint,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/* ----------------------------------------------------
   ADMIN
---------------------------------------------------- */

// Get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign / Reassign investigator
export const assignComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        if (!assignedTo) {
            return res.status(400).json({ error: "Investigator is required" });
        }

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (complaint.status === "Closed") {
            return res.status(400).json({
                error: "Closed complaints cannot be reassigned"
            });
        }

        const previousStatus = complaint.status;

        complaint.assignedTo = assignedTo;
        complaint.status = "Assigned";
        complaint.assignedAt = new Date();

        // Reset lifecycle if reassigned
        complaint.openedAt = null;
        complaint.resolvedAt = null;
        complaint.closedAt = null;
        complaint.solution = "";

        await complaint.save();

        // 🔹 ACTIVITY LOG
        await CaseActivity.create({
            complaintId: complaint._id,
            action: "Investigator Assigned",
            performedBy: "Admin",
            role: "Admin",
            meta: {
                assignedTo,
                fromStatus: previousStatus,
                toStatus: "Assigned",
            },
        });

        res.json({
            message: "Investigator assigned successfully",
            complaint
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Close complaint (FINAL)
export const adminCloseComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (complaint.status !== "Resolved") {
            return res.status(400).json({
                error: "Only resolved complaints can be closed"
            });
        }

        complaint.status = "Closed";
        complaint.closedAt = new Date();
        await complaint.save();

        // 🔹 ACTIVITY LOG
        await CaseActivity.create({
            complaintId: complaint._id,
            action: "Case Closed",
            performedBy: "Admin",
            role: "Admin",
            meta: {
                toStatus: "Closed",
            },
        });

        res.json({
            message: "Complaint closed successfully",
            complaint
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ----------------------------------------------------
   INVESTIGATOR
---------------------------------------------------- */

// Investigator opens complaint
export const investigatorOpenComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (req.user?.role === "Investigator") {
            if (complaint.assignedTo !== req.user.email) {
                return res.status(403).json({ error: "Not authorized for this case" });
            }
        }

        if (complaint.status !== "Assigned") {
            return res.status(400).json({
                error: "Only assigned complaints can be opened"
            });
        }

        complaint.status = "Open";
        complaint.openedAt = new Date();
        await complaint.save();

        // 🔹 ACTIVITY LOG
        await CaseActivity.create({
            complaintId: complaint._id,
            action: "Case Opened",
            performedBy: complaint.assignedTo,
            role: "Investigator",
            meta: {
                toStatus: "Open",
            },
        });

        res.json({
            message: "Complaint opened for investigation",
            complaint
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Investigator resolves complaint
export const investigatorResolveComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { solution } = req.body;

        if (!solution || !solution.trim()) {
            return res.status(400).json({
                error: "Solution is required to resolve complaint"
            });
        }

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (req.user?.role === "Investigator") {
            if (complaint.assignedTo !== req.user.email) {
                return res.status(403).json({ error: "Not authorized for this case" });
            }
        }

        if (complaint.status !== "Open") {
            return res.status(400).json({
                error: "Only open complaints can be resolved"
            });
        }

        complaint.solution = solution;
        complaint.status = "Resolved";
        complaint.resolvedAt = new Date();
        await complaint.save();

        // 🔹 ACTIVITY LOG
        await CaseActivity.create({
            complaintId: complaint._id,
            action: "Case Resolved",
            performedBy: complaint.assignedTo,
            role: "Investigator",
            meta: {
                toStatus: "Resolved",
            },
        });

        res.json({
            message: "Complaint resolved successfully",
            complaint
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ----------------------------------------------------
   INVESTIGATOR DASHBOARD KPIs (ADDED)
---------------------------------------------------- */

export const getInvestigatorDashboardStats = async (req, res) => {
    try {
        const { email } = req.params;

        const [assigned, open, resolved, closed, total] = await Promise.all([
            Complaint.countDocuments({ assignedTo: email, status: "Assigned" }),
            Complaint.countDocuments({ assignedTo: email, status: "Open" }),
            Complaint.countDocuments({ assignedTo: email, status: "Resolved" }),
            Complaint.countDocuments({ assignedTo: email, status: "Closed" }),
            Complaint.countDocuments({ assignedTo: email }),
        ]);

        res.json({
            total,
            assigned,
            open,
            resolved,
            closed,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ----------------------------------------------------
   USER
---------------------------------------------------- */

export const getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ email: req.params.email });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (req.user?.role === "User") {
            if (complaint.email !== req.user.email) {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

        if (req.user?.role === "Investigator") {
            if (complaint.assignedTo !== req.user.email) {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

        res.json(complaint);
    } catch {
        res.status(404).json({ error: "Complaint not found" });
    }
};

export const trackComplaint = async (req, res) => {
    try {
        const { id, email } = req.params;

        const complaint = await Complaint.findOne({
            $or: [{ complaintId: id }]
        });

        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (complaint.email !== email) {
            return res.status(403).json({
                error: "No complaint matching the given ID"
            });
        }

        res.json(complaint);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

export const getComplaintsAssignedToInvestigator = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            assignedTo: req.params.email
        });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getComplaintReporterDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (req.user?.role === "Investigator" && complaint.assignedTo !== req.user.email) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const email = (complaint.email || "").toLowerCase();
        const [reg, profile] = await Promise.all([
            Register.findOne({ email }).lean(),
            Profile.findOne({ email }).lean(),
        ]);

        const reporter = {
            fullName: profile?.fullName || reg?.fullName || "Not available",
            email: complaint.email,
            mobileNo: reg?.mobileNo || profile?.phone || "Not available",
            city: profile?.city || reg?.city || "Not available",
            address: profile?.address || reg?.address || "Not available",
            pincode: profile?.pincode || reg?.pincode || "Not available",
        };

        if (req.user?.role === "Admin") {
            return res.json(reporter);
        }

        return res.json({
            fullName: reporter.fullName,
            email: reporter.email,
            mobileNo: reporter.mobileNo,
            city: reporter.city,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
