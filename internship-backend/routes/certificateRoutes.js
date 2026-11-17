import express from "express";
import Certificate from "../models/Certificate.js";
import Student from "../models/Student.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const getUserId = (req) =>
  req.user.id || req.user._id || req.user.studentId;

// ---------- STUDENT ----------

router.get("/status", protect, async (req, res) => {
  try {
    const student = await Student.findById(getUserId(req));
    if (!student) return res.status(404).json({ message: "Student not found" });

    const certificate = await Certificate.findOne({ student: student._id });

    res.json({
      courseCompleted: student.courseCompleted,
      name: student.name,
      loginId: student.loginId,
      certificate,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/request", protect, async (req, res) => {
  try {
    const student = await Student.findById(getUserId(req));
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.courseCompleted)
      return res.status(400).json({ message: "Course is not completed yet." });

    let cert = await Certificate.findOne({ student: student._id });

    if (cert && cert.status !== "rejected")
      return res.status(400).json({ message: "Request already submitted." });

    if (cert) {
      cert.status = "pending";
      cert.requestedAt = new Date();
      await cert.save();
    } else {
      cert = await Certificate.create({ student: student._id });
    }

    res.json(cert);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ---------- PUBLIC VERIFY ----------

router.get("/verify/:certNo", async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      certificateNo: req.params.certNo.trim(),
      status: "approved",
    }).populate("student", "name loginId");

    if (!cert)
      return res.status(404).json({ message: "Certificate not found." });

    res.json({
      name: cert.student.name,
      loginId: cert.student.loginId,
      grade: cert.grade,
      endorsedBy: cert.endorsedBy,
      certificateNo: cert.certificateNo,
      approvedAt: cert.approvedAt,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ---------- ADMIN ----------

router.get("/pending", async (req, res) => {
  try {
    const list = await Certificate.find({ status: "pending" }).populate(
      "student",
      "name email loginId"
    );
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/issued", async (req, res) => {
  try {
    const list = await Certificate.find({ status: "approved" }).populate(
      "student",
      "name email loginId"
    );
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/complete/:studentId", async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(
      req.params.studentId,
      { courseCompleted: true },
      { new: true }
    );
    if (!s) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Course marked completed" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/:id/approve", async (req, res) => {
  try {
    const { grade, endorsedBy } = req.body;
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        grade,
        endorsedBy,
        approvedAt: new Date(),
        certificateNo: "CERT-" + Date.now(),
      },
      { new: true }
    );
    if (!cert) return res.status(404).json({ message: "Request not found" });
    res.json(cert);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/:id/reject", async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!cert) return res.status(404).json({ message: "Request not found" });
    res.json(cert);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;