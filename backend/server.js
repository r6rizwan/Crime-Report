import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.urlencoded({ extended: true }));

// Check env var
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set in .env");
  process.exit(1);
}

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✔ MongoDB Connected at ${mongoose.connection.host}`);
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
