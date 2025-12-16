import express from "express";
import upload from "../middleware/upload.js";
import {
    createOrUpdateCaseFile,
    getCaseFilesByComplaint
} from "../controllers/caseFileController.js";

const router = express.Router();

// Investigator uploads files + notes
router.post(
    "/:complaintId",
    upload.array("files", 5),
    createOrUpdateCaseFile
);

// Admin & Investigator view case files
router.get(
    "/:complaintId",
    getCaseFilesByComplaint
);

export default router;
