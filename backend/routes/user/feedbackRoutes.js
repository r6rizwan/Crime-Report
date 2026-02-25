import express from "express";
import { createFeedback, getAllFeedback, getFeedbackByEmail } from "../../controllers/user/feedbackController.js";
import { authenticateToken, requireRole, requireSelfEmailOrRole } from "../../middleware/auth.js";

const router = express.Router();

router.post("/feedback", authenticateToken, requireRole(["User"]), createFeedback);                 // user submits feedback
router.get("/feedback", authenticateToken, requireRole(["Admin"]), getAllFeedback);                 // admin sees all feedback
router.get("/feedback/:email", authenticateToken, requireSelfEmailOrRole(["Admin"]), getFeedbackByEmail);      // get feedback by user

export default router;
