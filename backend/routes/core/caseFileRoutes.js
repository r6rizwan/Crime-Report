import express from "express";
import upload from "../../middleware/upload.js";
import {
    createOrUpdateCaseFile,
    getCaseFilesByComplaint
} from "../../controllers/core/caseFileController.js";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const router = express.Router();

// Investigator uploads files + notes
router.post(
    "/:complaintId",
    authenticateToken,
    requireRole(["Investigator"]),
    upload.array("files", 5),
    createOrUpdateCaseFile
);

// Admin & Investigator view case files
router.get(
    "/:complaintId",
    authenticateToken,
    requireRole(["Admin", "Investigator"]),
    getCaseFilesByComplaint
);

export default router;
