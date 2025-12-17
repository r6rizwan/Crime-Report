import Login from "../models/Login.js";
import jwt from "jsonwebtoken";

// Create user login account (Admin might do this)
export const createLogin = async (req, res) => {
    try {
        const { email, password, utype } = req.body;

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
        const { email, password } = req.body;
        // console.log(email, password);

        const user = await Login.findOne({ email });
        // console.log("User found:", user);

        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(password);
        // console.log("Password match:", isMatch);

        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.utype },
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
