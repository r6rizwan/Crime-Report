import express from "express";
import {
    getRecentCaseActivity,
    getComplaintTimeline
} from "../../controllers/core/caseActivityController.js";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const router = express.Router();

// Admin dashboard
router.get("/recent", authenticateToken, requireRole(["Admin"]), getRecentCaseActivity);

// Complaint timeline
router.get("/:complaintId", authenticateToken, requireRole(["Admin"]), getComplaintTimeline);

export default router;
