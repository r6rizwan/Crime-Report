import express from "express";
import {
    createPassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
    changePassword,
} from "../../controllers/auth/passwordController.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = express.Router();
const otpRequestLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many OTP requests. Please wait before trying again.",
});
const otpVerifyLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many OTP verification attempts. Please try again later.",
});
const passwordResetLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 8,
    message: "Too many password reset attempts. Please try again later.",
});

router.post("/create-password", createPassword);
router.post("/forgotpassword", otpRequestLimiter, forgotPassword);
router.post("/verifyotp", otpVerifyLimiter, verifyOtp);
router.post("/resetpassword", passwordResetLimiter, resetPassword);
router.post("/change-password", passwordResetLimiter, authenticateToken, changePassword);

export default router;
