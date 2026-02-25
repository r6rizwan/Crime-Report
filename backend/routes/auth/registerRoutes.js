import express from "express";
import { registerUser, verifyOtp, resendRegisterOtp } from "../../controllers/auth/registerController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendRegisterOtp);

export default router;
