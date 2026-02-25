import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

import registerRoutes from "./routes/auth/registerRoutes.js";
import loginRoutes from "./routes/auth/loginRoutes.js";
import passwordRoutes from "./routes/auth/passwordRoutes.js";
import complaintRoutes from "./routes/core/complaintRoutes.js";
import investigatorRoutes from "./routes/investigator/investigatorRoutes.js";
import profileRoutes from "./routes/user/profileRoutes.js";
import feedbackRoutes from "./routes/user/feedbackRoutes.js";
import caseFileRoutes from "./routes/core/caseFileRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js";
import caseActivityRoutes from "./routes/core/caseActivityRoutes.js";
import superAdminRoutes from "./routes/auth/superAdminRoutes.js";


dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests or same-origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS: origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files from /uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing in .env");
  process.exit(1);
}

if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD || !process.env.SUPER_ADMIN_JWT_SECRET) {
  console.error("❌ SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD / SUPER_ADMIN_JWT_SECRET missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.error("❌ DB ERROR:", err));


// Route grouping is by module/domain, while role access is enforced inside each route.
app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api", passwordRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/investigators", investigatorRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", feedbackRoutes);
app.use("/api/case-files", caseFileRoutes);
app.use("/api", adminRoutes);
app.use("/api/case-activity", caseActivityRoutes);
app.use("/api", superAdminRoutes);


app.get("/", (req, res) => res.send("API Working"));


const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
