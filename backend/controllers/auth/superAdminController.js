import jwt from "jsonwebtoken";
import Login from "../../models/Login.js";
import Register from "../../models/Register.js";
import Profile from "../../models/Profile.js";
import Investigator from "../../models/Investigator.js";
import Complaint from "../../models/Complaint.js";
import CaseFile from "../../models/CaseFiles.js";
import CaseActivity from "../../models/CaseActivity.js";
import Otp from "../../models/Otp.js";
import Counter from "../../models/Counter.js";
import Feedback from "../../models/Feedback.js";
import fs from "fs/promises";
import path from "path";

const getEnv = (key) => process.env[key] || "";

export const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const envEmail = getEnv("SUPER_ADMIN_EMAIL");
        const envPassword = getEnv("SUPER_ADMIN_PASSWORD");
        const jwtSecret = getEnv("SUPER_ADMIN_JWT_SECRET");

        if (!envEmail || !envPassword || !jwtSecret) {
            return res.status(500).json({ error: "Super admin not configured" });
        }

        if (email !== envEmail || password !== envPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { role: "SuperAdmin", email: envEmail },
            jwtSecret,
            { expiresIn: "12h" }
        );

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const email = (req.body.email || req.body.username || "").toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const existing = await Login.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "Account already exists" });
        }

        const admin = await Login.create({
            email,
            password,
            utype: "Admin",
        });

        return res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                email: admin.email,
                utype: admin.utype,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listAdmins = async (_req, res) => {
    try {
        const admins = await Login.find({ utype: "Admin" })
            .select("_id email utype createdAt")
            .sort({ createdAt: -1 });

        return res.json(admins);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Login.findOne({ _id: id, utype: "Admin" });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        await Login.deleteOne({ _id: id });
        return res.json({ message: "Admin deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resetAdminPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || !password.trim()) {
            return res.status(400).json({ error: "Password is required" });
        }

        const admin = await Login.findOne({ _id: id, utype: "Admin" });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        admin.password = password;
        await admin.save();

        return res.json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resetSystemData = async (req, res) => {
    try {
        const { confirmText, removeUploads = true } = req.body || {};

        if (confirmText !== "ERASE ALL DATA") {
            return res.status(400).json({
                error: 'Confirmation mismatch. Type exactly "ERASE ALL DATA".',
            });
        }

        await Promise.all([
            Complaint.deleteMany({}),
            CaseFile.deleteMany({}),
            CaseActivity.deleteMany({}),
            Register.deleteMany({}),
            Profile.deleteMany({}),
            Investigator.deleteMany({}),
            Otp.deleteMany({}),
            Counter.deleteMany({}),
            Feedback.deleteMany({}),
            Login.deleteMany({ utype: { $in: ["User", "Investigator"] } }),
        ]);

        let removedUploadFiles = 0;
        if (removeUploads) {
            const uploadsDir = path.join(process.cwd(), "uploads");
            try {
                const files = await fs.readdir(uploadsDir);
                await Promise.all(
                    files
                        .filter((name) => name !== ".gitkeep")
                        .map(async (name) => {
                            const fullPath = path.join(uploadsDir, name);
                            const stat = await fs.stat(fullPath);
                            if (stat.isFile()) {
                                await fs.unlink(fullPath);
                                removedUploadFiles += 1;
                            }
                        })
                );
            } catch {
                // Ignore if uploads dir does not exist or has restricted entries.
            }
        }

        return res.json({
            message: "System data erased successfully",
            summary: {
                keptLogins: "Admin accounts and Super Admin (.env) remain intact",
                removedUploadFiles,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
