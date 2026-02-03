import Login from "../models/Login.js";
import Register from "../models/Register.js";
import Profile from "../models/Profile.js";

export const createPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ error: "User not verified!" });
        }

        const existingLogin = await Login.findOne({ email });
        if (existingLogin) {
            return res.status(409).json({ error: "Password already set for this account" });
        }

        // Create login entry
        const login = await Login.create({
            email,
            password,
            utype: "User"
        });

        // Create profile also (if not already created)
        await Profile.updateOne(
            { email },
            {
                $setOnInsert: {
                    email,
                    fullName: user.fullName,
                    utype: "User"
                }
            },
            { upsert: true }
        );

        return res.json({
            message: "Password created successfully",
            login
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
