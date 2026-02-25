import Register from "../../models/Register.js";
import Login from "../../models/Login.js";
import Investigator from "../../models/Investigator.js";
import { sendEmail } from "../../utils/sendEmail.js";

// STEP 1: Register User + Generate OTP
export const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            gender,
            dob,
            city,
            address,
            pincode,
            mobileNo
        } = req.body;
        const email = (req.body?.email || "").trim().toLowerCase();

        const existingLogin = await Login.findOne({ email });
        if (existingLogin) {
            return res.status(409).json({ error: "Email already used by another account" });
        }

        const existingInvestigator = await Investigator.findOne({ email });
        if (existingInvestigator) {
            return res.status(409).json({ error: "Email already used by another account" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Create or update user if already exists (important)
        let user = await Register.findOne({ email });

        if (user) {
            // If user already exists but not verified → update OTP only
            user.fullName = fullName;
            user.gender = gender;
            user.dob = dob;
            user.city = city;
            user.address = address;
            user.pincode = pincode;
            user.mobileNo = mobileNo;
            user.otp = otp;
            user.otpExpires = otpExpires;
            user.isVerified = false;

            await user.save();
        } else {
            // Create new record
            user = await Register.create({
                fullName,
                gender,
                dob,
                city,
                address,
                pincode,
                email,
                mobileNo,
                otp,
                otpExpires,
                isVerified: false
            });
        }

        const subject = "Your Crime Report OTP";
        const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
        const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;

        await sendEmail({ to: email, subject, text, html });

        res.status(201).json({
            message: "User registered. OTP sent to email.",
            email: user.email
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// STEP 2: Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Register.findOne({ email });

        if (!user)
            return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ error: "Invalid OTP" });

        if (user.otpExpires < Date.now())
            return res.status(400).json({ error: "OTP expired" });

        // Mark verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // ⭐ IMPORTANT: return email so frontend redirects correctly
        res.json({
            message: "OTP verified successfully",
            email: user.email
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// STEP 1.5: Resend OTP for existing pending user
export const resendRegisterOtp = async (req, res) => {
    try {
        const email = (req.body?.email || "").trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User is already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const subject = "Your Crime Report OTP";
        const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
        const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
        await sendEmail({ to: email, subject, text, html });

        return res.json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
