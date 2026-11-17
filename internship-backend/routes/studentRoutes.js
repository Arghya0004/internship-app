
// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Student from "../models/Student.js";

// const router = express.Router();

// // =====================================
// // STUDENT REGISTRATION
// // =====================================

// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: "Name, email and password are required",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const existingStudent = await Student.findOne({
//       email: email.toLowerCase(),
//     });

//     if (existingStudent) {
//       return res.status(409).json({
//         message: "Email already registered",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const student = await Student.create({
//       name,
//       email,
//       password: hashedPassword,
//       isApproved: false,
//     });

//     res.status(201).json({
//       message: "Registration successful. Await admin approval.",
//       studentId: student._id,
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// });

// // =====================================
// // STUDENT LOGIN + JWT TOKEN
// // =====================================

// router.post("/login", async (req, res) => {
//   try {
//     const { loginId, password } = req.body;

//     if (!loginId || !password) {
//       return res.status(400).json({
//         message: "Login ID and password are required",
//       });
//     }

//     const student = await Student.findOne({
//       loginId: loginId.trim(),
//     });

//     if (!student) {
//       return res.status(401).json({
//         message: "Invalid Login ID or Password",
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       student.password
//     );

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         message: "Invalid Login ID or Password",
//       });
//     }

//     if (!student.isApproved) {
//       return res.status(403).json({
//         message: "Your account is waiting for admin approval",
//       });
//     }

//     if (!student.isActive) {
//       return res.status(403).json({
//         message: "Your account is inactive",
//       });
//     }

//     // Generate JWT Token
//     const token = jwt.sign(
//       {
//         id: student._id.toString(),
//         role: "student",
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       student: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         loginId: student.loginId,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Login failed",
//       error: error.message,
//     });
//   }
// });

// // =====================================
// // EXPORT ROUTER
// // =====================================

// export default router;


import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const router = express.Router();

// =====================================
// STUDENT REGISTRATION
// =====================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingStudent = await Student.findOne({
      email: normalizedEmail,
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isApproved: false,
    });

    return res.status(201).json({
      message: "Registration successful. Await admin approval.",
      studentId: student._id,
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// =====================================
// STUDENT LOGIN USING REGISTERED EMAIL
// =====================================

router.post("/login", async (req, res) => {
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
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!student.isApproved) {
      return res.status(403).json({
        message: "Your account is waiting for admin approval",
      });
    }

    if (!student.isActive) {
      return res.status(403).json({
        message: "Your account is inactive",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: student._id.toString(),
        email: student.email,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        loginId: student.loginId,
      },
    });

  } catch (error) {
    console.error("Student login error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// =====================================
// EXPORT ROUTER
// =====================================

export default router;
