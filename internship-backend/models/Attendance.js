import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    entryTime: {
      type: String,
      required: true,
    },

    exitTime: {
      type: String,
      default: null,
    },

    totalWorkingHours: {
      type: Number,
      default: 0,
    },

    dailyWork: {
      type: String,
      default: "",
      trim: true,
    },

    isLogConfirmed: {
      type: Boolean,
      default: false,
    },

    technologies: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Present", "Completed"],
      default: "Present",
    },
  },
  {
    timestamps: true,
  }
);

// One attendance record per student per date
attendanceSchema.index(
  { student: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);

export default Attendance;