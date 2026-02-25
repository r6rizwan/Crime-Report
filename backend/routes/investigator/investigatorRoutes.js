import express from "express";
import {
    createInvestigator,
    getInvestigators,
    getInvestigatorById,
    updateInvestigator,
    deleteInvestigator,
    getInvestigatorByEmail,
    getInvestigatorPasswordStatus,
    requestInvestigatorEmailVerificationOtp,
    verifyInvestigatorEmailOtp,
    setInvestigatorPassword,
    transferCasesAndApplyAction,
} from "../../controllers/investigator/investigatorController.js";
import { authenticateToken, requireRole, requireSelfEmailOrRole, requireSelfIdOrRole } from "../../middleware/auth.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";

const router = express.Router();
const investigatorLookupLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 12,
    message: "Too many attempts. Please try again shortly.",
});
const investigatorOtpLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many OTP requests. Please wait before trying again.",
});
const investigatorOtpVerifyLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many OTP verification attempts. Please try again later.",
});

// CREATE investigator (Admin)
router.post("/", authenticateToken, requireRole(["Admin"]), createInvestigator);

// First-time setup status check
router.post("/password-status", investigatorLookupLimiter, getInvestigatorPasswordStatus);
router.post("/verify-email/request-otp", investigatorOtpLimiter, requestInvestigatorEmailVerificationOtp);
router.post("/verify-email/confirm-otp", investigatorOtpVerifyLimiter, verifyInvestigatorEmailOtp);
router.post("/set-password", investigatorOtpVerifyLimiter, setInvestigatorPassword);

// READ
router.get("/", authenticateToken, requireRole(["Admin"]), getInvestigators);
router.get("/by-email/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), getInvestigatorByEmail);
router.get("/:id", authenticateToken, requireSelfIdOrRole(["Admin"]), getInvestigatorById);

// UPDATE
router.put("/:id", authenticateToken, requireSelfIdOrRole(["Admin"]), updateInvestigator);
router.post("/:id/transfer-cases", authenticateToken, requireRole(["Admin"]), transferCasesAndApplyAction);

// DELETE
router.delete("/:id", authenticateToken, requireRole(["Admin"]), deleteInvestigator);

export default router;
