import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

dotenv.config();

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// MONGODB CONNECTION
// =====================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// =====================================
// API ROUTES
// =====================================

// Student Routes
app.use("/api/students", studentRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Attendance Routes
app.use("/api/attendance", attendanceRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

// Certificate Routes
app.use("/api/certificates", certificateRoutes);
console.log("✅ Certificate routes loaded");

// =====================================
// TEST API
// =====================================

app.get("/", (req, res) => {
  res.send("InternTrack Backend is Running Successfully!");
});

// =====================================
// SERVER PORT
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
