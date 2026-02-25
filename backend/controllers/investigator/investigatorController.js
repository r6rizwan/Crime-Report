import Investigator from "../../models/Investigator.js";
import Login from "../../models/Login.js";
import Register from "../../models/Register.js";
import Complaint from "../../models/Complaint.js";
import CaseActivity from "../../models/CaseActivity.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";

const generateInvestigatorId = async () => {
    const lastInvestigator = await Investigator
        .findOne({})
        .sort({ dateJoined: -1 });

    if (!lastInvestigator || !lastInvestigator.investigatorId) {
        return "INV-01";
    }

    const lastNumber = parseInt(
        lastInvestigator.investigatorId.split("-")[1]
    );

    const nextNumber = String(lastNumber + 1).padStart(2, "0");
    return `INV-${nextNumber}`;
};

// Create Investigator
export const createInvestigator = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const email = (req.body?.email || "").trim().toLowerCase();

        // check duplicate
        const existing = await Investigator.findOne({
            $or: [{ email }, { phone }]
        });

        if (existing) {
            return res.status(400).json({
                error: "Investigator already exists"
            });
        }

        const existingLogin = await Login.findOne({ email });
        if (existingLogin) {
            return res.status(409).json({
                error: "Email already used by another account"
            });
        }

        const existingRegisteredUser = await Register.findOne({ email });
        if (existingRegisteredUser) {
            return res.status(409).json({
                error: "Email already used by another account"
            });
        }

        const investigatorId = await generateInvestigatorId();

        const investigator = await Investigator.create({
            investigatorId,
            name,
            email,
            phone,
            address,
        });

        // Notify investigator to set first password using Forgot Password flow
        const subject = "Welcome to Crime Report Portal";
        const text = `Welcome ${name}. Your investigator profile has been created. Visit the login page with your registered email (${email}) to verify your email and set your password.`;
        const html = `
            <p>Welcome <strong>${name}</strong>,</p>
            <p>Your investigator profile has been created.</p>
            <p>Go to the login screen with this email: <strong>${email}</strong>.</p>
            <p>Complete email verification using OTP, then create your password.</p>
        `;

        let mailWarning = "";
        try {
            await sendEmail({ to: email, subject, text, html });
        } catch {
            mailWarning = "Investigator created, but welcome email could not be delivered.";
        }

        res.status(201).json({
            message: "Investigator created successfully",
            investigator,
            warning: mailWarning || undefined,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getInvestigatorPasswordStatus = async (req, res) => {
    try {
        const email = (req.body?.email || "").trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const investigator = await Investigator.findOne({ email });
        if (!investigator) {
            return res.json({
                exists: false,
                isEmailVerified: false,
                hasPassword: false,
                email,
            });
        }

        const login = await Login.findOne({ email, utype: "Investigator" });

        return res.json({
            exists: true,
            isEmailVerified: Boolean(investigator.isEmailVerified),
            hasPassword: Boolean(login),
            email,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const requestInvestigatorEmailVerificationOtp = async (req, res) => {
    try {
        const email = (req.body?.email || "").trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const investigator = await Investigator.findOne({ email });
        const existingLogin = await Login.findOne({ email, utype: "Investigator" });

        if (investigator && !existingLogin) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            investigator.otp = otp;
            investigator.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await investigator.save();

            const subject = "Verify Your Investigator Email";
            const text = `Your email verification OTP is ${otp}. It expires in 10 minutes.`;
            const html = `<p>Your email verification OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;

            try {
                await sendEmail({ to: investigator.email, subject, text, html });
            } catch (mailError) {
                console.error("Failed to send investigator verification email", mailError);
            }
        }

        return res.json({
            message: "If the account is eligible, a verification OTP has been sent.",
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const verifyInvestigatorEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const investigator = await Investigator.findOne({ email });
        if (!investigator) {
            return res.status(404).json({ error: "Investigator not found" });
        }

        if (!investigator.otp || investigator.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        if (!investigator.otpExpiresAt || investigator.otpExpiresAt < new Date()) {
            return res.status(400).json({ error: "OTP expired" });
        }

        investigator.isEmailVerified = true;
        investigator.otp = null;
        investigator.otpExpiresAt = null;
        await investigator.save();

        const setupToken = jwt.sign(
            { email: investigator.email, role: "Investigator", purpose: "set-password" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ message: "Email verified successfully", setupToken });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const setInvestigatorPassword = async (req, res) => {
    try {
        const { setupToken, newPassword } = req.body;

        if (!setupToken || !newPassword) {
            return res.status(400).json({ error: "Setup token and password are required" });
        }

        if (String(newPassword).length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        let decoded;
        try {
            decoded = jwt.verify(setupToken, process.env.JWT_SECRET);
        } catch {
            return res.status(400).json({ error: "Invalid or expired setup token" });
        }

        if (decoded.purpose !== "set-password" || decoded.role !== "Investigator") {
            return res.status(400).json({ error: "Invalid setup token" });
        }

        const email = (decoded.email || "").toLowerCase();
        const investigator = await Investigator.findOne({ email });
        if (!investigator) {
            return res.status(404).json({ error: "Investigator not found" });
        }
        if (investigator.status === "Inactive") {
            return res.status(403).json({ error: "Investigator account is disabled. Please contact admin." });
        }
        if (!investigator.isEmailVerified) {
            return res.status(403).json({ error: "Email is not verified" });
        }

        const existingLogin = await Login.findOne({ email, utype: "Investigator" });
        if (existingLogin) {
            return res.status(409).json({ error: "Password already set. Please log in." });
        }

        await Login.create({
            email,
            password: newPassword,
            utype: "Investigator",
        });

        return res.json({ message: "Password created successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Send OTP to investigator (email-based)
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const investigator = await Investigator.findOne({ email });

        if (!investigator) {
            return res.status(404).json({
                error: "Email not registered"
            });
        }

        if (!investigator.isEmailVerified) {
            return res.status(403).json({ error: "Email not verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        investigator.otp = otp;
        investigator.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await investigator.save();

        const subject = "Your Investigator OTP";
        const text = `Your OTP is ${otp}. It expires in 5 minutes.`;
        const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`;

        await sendEmail({ to: investigator.email, subject, text, html });

        res.json({
            message: "OTP sent to email",
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const investigator = await Investigator.findOne({ email });

        if (!investigator || investigator.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }

        if (investigator.otpExpiresAt < new Date()) {
            return res.status(401).json({ error: "OTP expired" });
        }

        // Clear OTP
        investigator.otp = null;
        investigator.otpExpiresAt = null;
        await investigator.save();

        const token = jwt.sign(
            {
                id: investigator._id,
                role: "Investigator",
                email: investigator.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            investigator
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all investigators
export const getInvestigators = async (req, res) => {
    try {
        const investigators = await Investigator.find();
        res.json(investigators);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single investigator
export const getInvestigatorById = async (req, res) => {
    try {
        const investigator = await Investigator.findById(req.params.id);
        res.json(investigator);
    } catch (error) {
        res.status(404).json({ error: "Investigator not found" });
    }
};

// Update investigator
export const updateInvestigator = async (req, res) => {
    try {
        const existing = await Investigator.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: "Investigator not found" });
        }

        const updates = { ...req.body };
        const becameInactive = existing.status !== "Inactive" && updates.status === "Inactive";
        if (updates.email && updates.email !== existing.email) {
            updates.isEmailVerified = false;
            updates.otp = null;
            updates.otpExpiresAt = null;
        }

        const updated = await Investigator.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (becameInactive) {
            try {
                await sendEmail({
                    to: updated.email,
                    subject: "Investigator Account Disabled",
                    text: "Your investigator account has been disabled. Please contact the admin for access.",
                    html: "<p>Your investigator account has been <strong>disabled</strong>. Please contact the admin for access.</p>",
                });
            } catch (mailError) {
                console.error("Failed to send disabled-account email", mailError);
            }
        }

        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete investigator
export const deleteInvestigator = async (req, res) => {
    try {
        const investigator = await Investigator.findById(req.params.id);
        if (!investigator) {
            return res.status(404).json({ error: "Investigator not found" });
        }

        const pendingCount = await Complaint.countDocuments({
            assignedTo: investigator.email,
            status: { $ne: "Closed" },
        });

        if (pendingCount > 0) {
            return res.status(400).json({
                error: "Transfer pending cases before deleting this investigator",
                pendingCount,
            });
        }

        await Login.deleteOne({ email: investigator.email, utype: "Investigator" });
        await Investigator.findByIdAndDelete(req.params.id);
        res.json({ message: "Investigator removed" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const transferCasesAndApplyAction = async (req, res) => {
    try {
        const { id } = req.params;
        const { toInvestigatorId, action } = req.body; // action: disable | delete

        if (!["disable", "delete"].includes(action)) {
            return res.status(400).json({ error: "Invalid action" });
        }

        const fromInvestigator = await Investigator.findById(id);
        if (!fromInvestigator) {
            return res.status(404).json({ error: "Investigator not found" });
        }

        const target = await Investigator.findById(toInvestigatorId);
        if (!target) {
            return res.status(404).json({ error: "Target investigator not found" });
        }

        if (String(target._id) === String(fromInvestigator._id)) {
            return res.status(400).json({ error: "Cannot transfer to the same investigator" });
        }

        const cases = await Complaint.find({
            assignedTo: fromInvestigator.email,
            status: { $ne: "Closed" },
        });

        for (const complaint of cases) {
            complaint.assignedTo = target.email;
            complaint.status = "Assigned";
            complaint.assignedAt = new Date();
            complaint.openedAt = null;
            complaint.resolvedAt = null;
            complaint.closedAt = null;
            complaint.solution = "";
            await complaint.save();

            await CaseActivity.create({
                complaintId: complaint._id,
                action: "Investigator Reassigned",
                performedBy: "Admin",
                role: "Admin",
                meta: {
                    from: fromInvestigator.email,
                    to: target.email,
                    toStatus: "Assigned",
                },
            });
        }

        if (action === "disable") {
            fromInvestigator.status = "Inactive";
            await fromInvestigator.save();
            try {
                await sendEmail({
                    to: fromInvestigator.email,
                    subject: "Investigator Account Disabled",
                    text: "Your investigator account has been disabled. Please contact the admin for access.",
                    html: "<p>Your investigator account has been <strong>disabled</strong>. Please contact the admin for access.</p>",
                });
            } catch (mailError) {
                console.error("Failed to send disabled-account email", mailError);
            }
            return res.json({
                message: "Cases transferred and investigator disabled",
                transferred: cases.length,
            });
        }

        await Login.deleteOne({ email: fromInvestigator.email, utype: "Investigator" });
        await Investigator.findByIdAndDelete(fromInvestigator._id);

        return res.json({
            message: "Cases transferred and investigator deleted",
            transferred: cases.length,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get investigator by email
export const getInvestigatorByEmail = async (req, res) => {
    try {
        const investigator = await Investigator.findOne({ email: req.params.email });

        if (!investigator)
            return res.status(404).json({ error: "Investigator not found" });

        res.json(investigator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
