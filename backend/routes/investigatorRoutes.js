import express from "express";
import {
    createInvestigator,
    getInvestigators,
    getInvestigatorById,
    updateInvestigator,
    deleteInvestigator,
    getInvestigatorByEmail,
    sendOtp,
    verifyOtp,
} from "../controllers/investigatorController.js";

const router = express.Router();

// CREATE investigator (Admin)
router.post("/", createInvestigator);

// OTP AUTH (Investigator)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// READ
router.get("/", getInvestigators);
router.get("/by-email/:email", getInvestigatorByEmail);
router.get("/:id", getInvestigatorById);

// UPDATE
router.put("/:id", updateInvestigator);

// DELETE
router.delete("/:id", deleteInvestigator);

export default router;
