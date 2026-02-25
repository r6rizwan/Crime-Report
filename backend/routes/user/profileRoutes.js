import express from "express";
import {
    createProfile,
    getProfile,
    updateProfile
} from "../../controllers/user/profileController.js";
import { authenticateToken, requireRole, requireSelfEmailOrRole } from "../../middleware/auth.js";

const router = express.Router();

// Create profile
router.post("/", authenticateToken, requireRole(["User"]), createProfile);

// Get profile
router.get("/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), getProfile);

// Update profile
router.put("/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), updateProfile);

export default router;
