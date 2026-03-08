import Login from "../../models/Login.js";
import Investigator from "../../models/Investigator.js";
import Register from "../../models/Register.js";
import jwt from "jsonwebtoken";

// Create user login account (Admin might do this)
export const createLogin = async (req, res) => {
    try {
        const { password, utype } = req.body;
        const email = req.body?.email?.trim()?.toLowerCase();

        const user = await Login.create({
            email,
            password,
            utype
        });

        res.status(201).json({
            message: "Account created successfully",
            user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login user (Admin/User)
export const loginUser = async (req, res) => {
    try {
        const password = req.body?.password;
        const email = req.body?.email?.trim()?.toLowerCase();
        // console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await Login.findOne({ email });
        // console.log("User found:", user);

        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const isMatch = await user.comparePassword(password);
        // console.log("Password match:", isMatch);

        if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

        if (user.utype === "Investigator") {
            const investigator = await Investigator.findOne({ email: user.email });
            if (investigator && investigator.status === "Inactive") {
                return res.status(403).json({ error: "Investigator account is disabled. Please contact admin." });
            }
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.utype, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.utype
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Identify role and next login step by email
export const getLoginEmailStatus = async (req, res) => {
    try {
        const email = req.body?.email?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const account = await Login.findOne({ email });
        if (account) {
            if (account.utype === "Investigator") {
                const investigator = await Investigator.findOne({ email });
                if (investigator && investigator.status === "Inactive") {
                    return res.json({ nextStep: "disabled" });
                }
            }
            return res.json({ nextStep: "password" });
        }

        const investigator = await Investigator.findOne({ email });
        if (investigator && investigator.status === "Inactive") {
            return res.json({ nextStep: "disabled" });
        }
        if (investigator) {
            // First-time investigator onboarding always starts with OTP verification.
            return res.json({ nextStep: "verifyEmail" });
        }

        const registeredUser = await Register.findOne({ email });
        if (registeredUser) {
            if (registeredUser.isVerified) {
                return res.json({ nextStep: "setupUserPassword" });
            }
            return res.json({ nextStep: "verifyUserOtp" });
        }

        return res.json({ nextStep: "notFound" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
