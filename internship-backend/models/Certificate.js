import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    grade: String,
    endorsedBy: String,
    certificateNo: String,
    requestedAt: { type: Date, default: Date.now },
    approvedAt: Date,

    // Student submitted details for certificate
    name: String,
    rollNo: String,
    course: String,
    courseCategory: String,
    college: String,
    projectTitle: String,
    projectDescription: String,
    technologyUsed: String,
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);