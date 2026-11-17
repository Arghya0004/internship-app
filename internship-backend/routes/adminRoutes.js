
import express from "express";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// ADMIN LOGIN
// =====================================

router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        message: "Admin Login ID and Password are required.",
      });
    }

    const adminLoginId = process.env.ADMIN_LOGIN_ID;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminLoginId || !adminPassword || !process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Admin login configuration is missing in server environment.",
      });
    }

    const isLoginIdValid =
      loginId.trim().toUpperCase() === adminLoginId.trim().toUpperCase();

    const isPasswordValid = password === adminPassword;

    if (!isLoginIdValid || !isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Admin Login ID or Password.",
      });
    }

    const token = jwt.sign(
      {
        id: "admin",
        loginId: adminLoginId,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Admin login successful.",
      token,
      user: {
        id: "admin",
        loginId: adminLoginId,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      message: "Admin login failed.",
    });
  }
});

// =====================================
// ALL ROUTES BELOW REQUIRE ADMIN LOGIN
// =====================================

router.use(protect, adminOnly);

// =====================================
// PENDING STUDENTS
// =====================================

router.get("/pending-students", async (req, res) => {
  try {
    const students = await Student.find({
      isApproved: false,
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending students",
      error: error.message,
    });
  }
});

// =====================================
// ACTIVE STUDENTS
// =====================================

router.get("/active-students", async (req, res) => {
  try {
    const students = await Student.find({
      isApproved: true,
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch active students",
      error: error.message,
    });
  }
});

// =====================================
// APPROVE STUDENT
// =====================================

router.patch("/approve/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.isApproved) {
      return res.status(400).json({
        message: "Student already approved",
      });
    }

    const loginId =
      "IT" + student._id.toString().slice(-6).toUpperCase();

    student.isApproved = true;
    student.loginId = loginId;

    await student.save();

    res.status(200).json({
      message: "Student approved successfully",
      loginId,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        loginId: student.loginId,
        isApproved: student.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Approval failed",
      error: error.message,
    });
  }
});

// =====================================
// DECLINE STUDENT
// =====================================

router.patch("/decline/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.isApproved) {
      return res.status(400).json({
        message: "Approved student cannot be declined",
      });
    }

    student.isActive = false;

    await student.save();

    res.status(200).json({
      message: "Student registration declined successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Decline failed",
      error: error.message,
    });
  }
});

// =====================================
// RESET STUDENT PASSWORD
// =====================================

router.patch("/reset-password/:id", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const bcrypt = await import("bcryptjs");

    student.password = await bcrypt.default.hash(password, 10);

    await student.save();

    res.status(200).json({
      message: "Student password reset successfully",
      loginId: student.loginId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
});

export default router;
