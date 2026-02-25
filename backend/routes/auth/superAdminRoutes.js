import express from "express";
import {
    superAdminLogin,
    createAdmin,
    listAdmins,
    deleteAdmin,
    resetAdminPassword,
    resetSystemData,
} from "../../controllers/auth/superAdminController.js";
import { verifySuperAdminToken } from "../../middleware/superAdminAuth.js";

const router = express.Router();

router.post("/super-admin/login", superAdminLogin);

router.post("/super-admin/create-admin", verifySuperAdminToken, createAdmin);
router.get("/super-admin/admins", verifySuperAdminToken, listAdmins);
router.delete("/super-admin/admin/:id", verifySuperAdminToken, deleteAdmin);
router.post(
    "/super-admin/admin/:id/reset-password",
    verifySuperAdminToken,
    resetAdminPassword
);
router.post(
    "/super-admin/reset-system",
    verifySuperAdminToken,
    resetSystemData
);

export default router;
