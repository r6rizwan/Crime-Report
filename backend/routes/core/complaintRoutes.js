import express from "express";
import upload from "../../middleware/upload.js";
import { authenticateToken, requireRole, requireSelfEmailOrRole } from "../../middleware/auth.js";

import {
    createComplaint,
    triageComplaint,
    updateAIFeedback,
    getAllComplaints,
    getUserComplaints,
    getComplaintById,
    assignComplaint,
    investigatorOpenComplaint,
    investigatorResolveComplaint,
    adminCloseComplaint,
    trackComplaint,
    getComplaintsAssignedToInvestigator,
    getInvestigatorDashboardStats,
    getComplaintReporterDetails,
} from "../../controllers/core/complaintController.js";

const router = express.Router();

/* ---------------- CREATE ---------------- */

router.post("/triage", authenticateToken, requireRole(["User"]), triageComplaint);

// User files complaint
router.post("/", authenticateToken, requireRole(["User"]), upload.single("file"), createComplaint);

/* ---------------- READ ---------------- */

// Admin: all complaints
router.get("/all", authenticateToken, requireRole(["Admin"]), getAllComplaints);

// User: own complaints
router.get("/user/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), getUserComplaints);

// User-safe complaint tracking
router.get("/complaint-tracking/:id/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), trackComplaint);

// Investigator: assigned complaints
router.get("/assigned/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), getComplaintsAssignedToInvestigator);

// ⭐ Investigator dashboard KPIs
router.get(
    "/investigator/:email/stats",
    authenticateToken,
    requireSelfEmailOrRole(["Admin"]),
    getInvestigatorDashboardStats
);

// Reporter details (Admin full, assigned Investigator limited)
router.get(
    "/:id/reporter",
    authenticateToken,
    requireRole(["Admin", "Investigator"]),
    getComplaintReporterDetails
);

// Get complaint by ID (admin / investigator)
// ❗ keep this AFTER specific routes
router.get("/:id", authenticateToken, requireRole(["Admin", "Investigator", "User"]), getComplaintById);

/* ---------------- ACTIONS ---------------- */

// Admin assigns investigator
router.put("/:id/assign", authenticateToken, requireRole(["Admin"]), assignComplaint);

// Investigator starts working
router.put("/:id/open", authenticateToken, requireRole(["Investigator"]), investigatorOpenComplaint);

// Investigator resolves complaint
router.put("/:id/resolve", authenticateToken, requireRole(["Investigator"]), investigatorResolveComplaint);

// Admin closes complaint (FINAL)
router.put("/:id/close", authenticateToken, requireRole(["Admin"]), adminCloseComplaint);

// User records whether AI suggestion was accepted
router.patch("/:id/ai-feedback", authenticateToken, requireRole(["User"]), updateAIFeedback);

export default router;
