import express from "express";
import { getAdminDashboardStats } from "../../controllers/admin/adminDashboardController.js";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const router = express.Router();

// Admin Dashboard KPIs
router.get("/admin/dashboard", authenticateToken, requireRole(["Admin"]), getAdminDashboardStats);

export default router;
