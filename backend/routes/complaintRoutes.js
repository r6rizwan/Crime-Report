import express from "express";
import upload from "../middleware/upload.js";

import {
    createComplaint,
    getAllComplaints,
    getUserComplaints,
    getComplaintById,
    assignComplaint,
    investigatorOpenComplaint,
    investigatorResolveComplaint,
    adminCloseComplaint,
    trackComplaint,
    getComplaintsAssignedToInvestigator,
    getInvestigatorDashboardStats   // ⭐ NEW
} from "../controllers/complaintController.js";

const router = express.Router();

/* ---------------- CREATE ---------------- */

// User files complaint
router.post("/", upload.single("file"), createComplaint);

/* ---------------- READ ---------------- */

// Admin: all complaints
router.get("/all", getAllComplaints);

// User: own complaints
router.get("/user/:email", getUserComplaints);

// User-safe complaint tracking
router.get("/complaint-tracking/:id/:email", trackComplaint);

// Investigator: assigned complaints
router.get("/assigned/:email", getComplaintsAssignedToInvestigator);

// ⭐ Investigator dashboard KPIs
router.get(
    "/investigator/:email/stats",
    getInvestigatorDashboardStats
);

// Get complaint by ID (admin / investigator)
// ❗ keep this AFTER specific routes
router.get("/:id", getComplaintById);

/* ---------------- ACTIONS ---------------- */

// Admin assigns investigator
router.put("/:id/assign", assignComplaint);

// Investigator starts working
router.put("/:id/open", investigatorOpenComplaint);

// Investigator resolves complaint
router.put("/:id/resolve", investigatorResolveComplaint);

// Admin closes complaint (FINAL)
router.put("/:id/close", adminCloseComplaint);

export default router;
