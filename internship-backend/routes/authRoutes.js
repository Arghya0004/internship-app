// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Student from "../models/Student.js";

// const router = express.Router();

// // ================= STUDENT LOGIN =================
// router.post("/student-login", async (req, res) => {
//   try {
//     const { loginId, password } = req.body;

//     if (!loginId || !password) {
//       return res.status(400).json({
//         message: "Login ID and password are required",
//       });
//     }

//     const student = await Student.findOne({
//       loginId: loginId.trim().toUpperCase(),
//       isApproved: true,
//       isActive: true,
//     });

//     if (!student) {
//       return res.status(401).json({
//         message: "Invalid Login ID or student not approved",
//       });
//     }

//     const isMatch = await bcrypt.compare(
//       password,
//       student.password
//     );

//     if (!isMatch) {
//       return res.status(401).json({
//         message: "Invalid password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: student._id,
//         loginId: student.loginId,
//         role: "student",
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         loginId: student.loginId,
//         role: "student",
//       },
//     });
//   } catch (error) {
//     console.error("Student login error:", error);

//     res.status(500).json({
//       message: "Student login failed",
//       error: error.message,
//     });
//   }
// });

// export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const router = express.Router();

// ================= STUDENT LOGIN USING EMAIL =================

router.post("/student-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email address and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const student = await Student.findOne({
      email: normalizedEmail,
      isApproved: true,
      isActive: true,
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or student account not approved",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        loginId: student.loginId,
        role: "student",
      },
    });

  } catch (error) {
    console.error("Student login error:", error);

    return res.status(500).json({
      message: "Student login failed",
      error: error.message,
    });
  }
});

// ================= RESET PASSWORD (STUDENT & ADMIN) =================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, role } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const envAdminId = (process.env.ADMIN_LOGIN_ID || "admin").toLowerCase();

    // Check if admin reset
    const isAdmin =
      role === "admin" ||
      normalizedEmail === "admin@interntrack.com" ||
      normalizedEmail === envAdminId ||
      normalizedEmail === "admin";

    if (isAdmin) {
      global.ADMIN_PASSWORD_OVERRIDE = newPassword;
      return res.status(200).json({
        message: "Admin password reset successfully. You can now log in with your new password.",
      });
    }

    // Student password reset
    let student = await Student.findOne({ email: normalizedEmail });

    if (!student) {
      // Check if student exists by loginId
      student = await Student.findOne({
        loginId: email.trim().toUpperCase(),
      });
    }

    if (!student) {
      return res.status(404).json({
        message: "No student account found with this email address.",
      });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    return res.status(200).json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Password reset failed. Please try again.",
      error: error.message,
    });
  }
});

export default router;

