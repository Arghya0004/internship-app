import express from "express";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// GET INDIA DATE AND TIME
// =====================================

const getIndiaDateTime = () => {
  const now = new Date();

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);

  return { date, time };
};

// =====================================
// STUDENT ENTRY TIME
// =====================================

router.post("/entry", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Student access only.",
      });
    }

    const studentId = req.user.id;
    const { dailyWork = "", technologies = [] } = req.body;

    const student = await Student.findById(studentId);

    if (!student || !student.isApproved || !student.isActive) {
      return res.status(403).json({
        message: "Student is not approved or inactive.",
      });
    }

    // Automatically get date and time from server
    const { date, time: entryTime } = getIndiaDateTime();

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date,
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance already exists for today.",
      });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date,
      entryTime,
      dailyWork: (dailyWork || "").trim(),
      technologies: Array.isArray(technologies) ? technologies : [],
      isLogConfirmed: false,
      status: "Present",
    });

    return res.status(201).json({
      message: "Entry time recorded successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Entry Error:", error);

    // Handle duplicate attendance records
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Attendance already exists for today.",
      });
    }

    return res.status(500).json({
      message: "Entry failed.",
      error: error.message,
    });
  }
});

// =====================================
// CONFIRM DAILY WORK LOG
// =====================================

router.post("/confirm-log", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Student access only.",
      });
    }

    const studentId = req.user.id;
    const { dailyWork, technologies } = req.body;

    if (!dailyWork || !dailyWork.trim()) {
      return res.status(400).json({
        message: "Daily work log cannot be empty.",
      });
    }

    const { date } = getIndiaDateTime();

    const attendance = await Attendance.findOne({
      student: studentId,
      date,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Entry time not recorded for today. Please mark entry first.",
      });
    }

    attendance.dailyWork = dailyWork.trim();
    if (Array.isArray(technologies)) {
      attendance.technologies = technologies;
    }
    attendance.isLogConfirmed = true;
    await attendance.save();

    return res.status(200).json({
      message: "Daily work log confirmed successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Confirm Log Error:", error);
    return res.status(500).json({
      message: "Failed to confirm work log.",
      error: error.message,
    });
  }
});

// =====================================
// STUDENT EXIT TIME
// =====================================

router.post("/exit", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Student access only.",
      });
    }

    const studentId = req.user.id;

    const student = await Student.findById(studentId);

    if (!student || !student.isApproved || !student.isActive) {
      return res.status(403).json({
        message: "Student is not approved or inactive.",
      });
    }

    // Automatically get exit time from server
    const { date, time: exitTime } = getIndiaDateTime();

    const attendance = await Attendance.findOne({
      student: studentId,
      date,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Entry time not recorded.",
      });
    }

    if (attendance.exitTime) {
      return res.status(400).json({
        message: "Exit time already recorded.",
      });
    }

    const [entryHour, entryMinute] = attendance.entryTime
      .split(":")
      .map(Number);

    const [exitHour, exitMinute] = exitTime
      .split(":")
      .map(Number);

    const entryMinutes = entryHour * 60 + entryMinute;
    const exitMinutes = exitHour * 60 + exitMinute;

    if (exitMinutes < entryMinutes) {
      return res.status(400).json({
        message: "Exit time must be after entry time.",
      });
    }

    const totalMinutes = Math.max(1, exitMinutes - entryMinutes);

    attendance.exitTime = exitTime;

    attendance.totalWorkingHours = Number(
      (totalMinutes / 60).toFixed(2)
    );

    attendance.status = "Completed";

    await attendance.save();

    return res.status(200).json({
      message: "Exit time recorded successfully.",
      totalWorkingHours: attendance.totalWorkingHours,
      attendance,
    });
  } catch (error) {
    console.error("Exit Error:", error);

    return res.status(500).json({
      message: "Exit failed.",
      error: error.message,
    });
  }
});

// =====================================
// STUDENT ATTENDANCE HISTORY
// =====================================

router.get(
  "/my-attendance/:studentId",
  protect,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res.status(403).json({
          message: "Student access only.",
        });
      }

      const studentId = req.user.id;

      if (req.params.studentId !== String(studentId)) {
        return res.status(403).json({
          message: "You cannot access another student's attendance.",
        });
      }

      const attendance = await Attendance.find({
        student: studentId,
      }).sort({ date: -1, createdAt: -1 });

      return res.status(200).json({
        message: "Attendance history fetched successfully.",
        attendance,
      });
    } catch (error) {
      console.error("History Error:", error);

      return res.status(500).json({
        message: "Failed to fetch attendance.",
        error: error.message,
      });
    }
  }
);

// =====================================
// ADMIN - ALL STUDENTS ATTENDANCE LOGS
// =====================================

router.get(
  "/admin-logs",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const attendance = await Attendance.find()
        .populate(
          "student",
          "name email loginId university role"
        )
        .sort({ date: -1, createdAt: -1 });

      const logs = attendance.map((record) => ({
        _id: record._id,

        date: record.date,

        student: record.student?.name || "Unknown Student",

        studentId: record.student?._id || null,

        loginId: record.student?.loginId || "—",

        email: record.student?.email || "—",

        university: record.student?.university || "—",

        role: record.student?.role || "student",

        entryTime: record.entryTime || "—",

        exitTime: record.exitTime || "Not exited",

        totalWorkingHours: Number(
          record.totalWorkingHours || 0
        ),

        dailyWork: record.dailyWork || "—",

        status: record.status || "Present",
      }));

      return res.status(200).json({
        message: "All attendance logs fetched successfully.",
        total: logs.length,
        logs,
      });
    } catch (error) {
      console.error("Admin Attendance Error:", error);

      return res.status(500).json({
        message: "Failed to fetch admin attendance logs.",
        error: error.message,
      });
    }
  }
);

export default router;