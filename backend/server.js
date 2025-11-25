import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import registerRoutes from "./routes/registerRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
// import complaintRoutes from "./routes/complaintRoutes.js";
// import investigatorRoutes from "./routes/investigatorRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.error("❌ DB ERROR:", err));


app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
// app.use("/api", complaintRoutes);
// app.use("/api", investigatorRoutes);
// app.use("/api", profileRoutes);
// app.use("/api", feedbackRoutes);

app.get("/", (req, res) => res.send("API Working"));


const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
