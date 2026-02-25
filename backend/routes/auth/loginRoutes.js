import express from "express";
import { createLogin, loginUser, getLoginEmailStatus } from "../../controllers/auth/loginController.js";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import { createRateLimiter } from "../../middleware/rateLimit.js";

const router = express.Router();
const authLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 12,
    message: "Too many authentication attempts. Please try again shortly.",
});

router.post("/login/create", authenticateToken, requireRole(["Admin"]), createLogin);
router.post("/login/email-status", authLimiter, getLoginEmailStatus);
router.post("/login", authLimiter, loginUser);

export default router;
