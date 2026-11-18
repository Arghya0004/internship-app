
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/authModalContext";
import { clearAuthSession } from "../utils/auth";
import CertificateGenerator from "./CertificateGenerator";

import {
  Clock,
  CalendarDays,
  BriefcaseBusiness,
  GraduationCap,
  Award,
  Calculator,
  Send,
  FileText,
  CheckCircle,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

import "./StudentDashboard.css";

const API = "http://localhost:5000/api/attendance";

const technologies = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PyTorch",
  "SQL",
  "Docker",
  "AWS",
  "Git",
  "FastAPI",
  "Tailwind CSS",
  "Figma",
];

// AUTOMATIC CURRENT TIME
const getCurrentTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

function StudentDashboard() {
  const navigate = useNavigate();

  const student = JSON.parse(
    localStorage.getItem("student") || "null"
  );

  const token = localStorage.getItem("token");
  const studentId = student?.id;

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "certificate"

  const [work, setWork] = useState("");
  const [selectedTech, setSelectedTech] = useState(["React"]);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [exitLoading, setExitLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isConfirmedLocal, setIsConfirmedLocal] = useState(false);

  const [message, setMessage] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // =====================================
  // LOAD ATTENDANCE HISTORY
  // =====================================

  const loadHistory = useCallback(async () => {
    if (!studentId || !token) return;

    try {
      const res = await axios.get(
        `${API}/my-attendance/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data.attendance || []);

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Unable to load attendance history."
      );
    }
  }, [studentId, token]);

  useEffect(() => {
    if (!token || !studentId) {
      navigate("/");
      return;
    }

    loadHistory();
  }, [token, studentId, navigate, loadHistory]);

  // =====================================
  // AUTOMATIC ENTRY TIME
  // =====================================

  const submitAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");

      // AUTOMATIC ENTRY TIME
      const currentEntryTime = getCurrentTime();

      const res = await axios.post(
        `${API}/entry`,
        {
          entryTime: currentEntryTime,
          technologies: selectedTech,
        },
        authConfig
      );

      setMessage(
        res.data.message ||
        `Entry recorded successfully at ${currentEntryTime}! You can now type and confirm your daily work log.`
      );

      await loadHistory();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Entry submission failed."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CONFIRM DAILY WORK LOG
  // =====================================

  const submitWorkLog = async () => {
    if (!work.trim()) {
      setMessage("Please enter your daily work log before confirming.");
      return;
    }

    try {
      setConfirmLoading(true);
      setMessage("");

      const res = await axios.post(
        `${API}/confirm-log`,
        {
          dailyWork: work,
          technologies: selectedTech,
        },
        authConfig
      );

      setIsConfirmedLocal(true);
      setMessage(
        res.data.message ||
        "Daily work log confirmed successfully! You can now mark exit when your shift ends."
      );

      await loadHistory();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to confirm daily work log."
      );

    } finally {
      setConfirmLoading(false);
    }
  };

  // =====================================
  // AUTOMATIC EXIT TIME
  // =====================================

  const submitExit = async () => {
    try {
      setExitLoading(true);
      setMessage("");

      // AUTOMATIC EXIT TIME
      const currentExitTime = getCurrentTime();

      const res = await axios.post(
        `${API}/exit`,
        {
          exitTime: currentExitTime,
        },
        authConfig
      );

      setMessage(
        `${res.data.message || "Exit recorded successfully!"} Total: ${res.data.totalWorkingHours} hours`
      );

      await loadHistory();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Exit submission failed."
      );

    } finally {
      setExitLoading(false);
    }
  };

  // =====================================
  // TECHNOLOGY SELECTION
  // =====================================

  const toggleTech = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  // =====================================
  // TOTAL WORKING HOURS
  // =====================================

  const totalHours = history.reduce(
    (sum, item) =>
      sum + (item.totalWorkingHours || 0),
    0
  );

  const activeDays = history.length;

  const average = activeDays
    ? (totalHours / activeDays).toFixed(1)
    : "0";

  const todayAttendance = history.find(
    (item) => item.date === today
  );

  const isEntryMarked = !!todayAttendance;
  const isExitMarked = !!todayAttendance?.exitTime;
  const isLogConfirmed = !!(
    isConfirmedLocal ||
    todayAttendance?.isLogConfirmed ||
    (todayAttendance?.dailyWork && todayAttendance.dailyWork.trim() && todayAttendance?.exitTime)
  );

  // Sync work text and tech tags if already in attendance record
  useEffect(() => {
    if (todayAttendance) {
      if (todayAttendance.dailyWork && (!work || isLogConfirmed)) {
        setWork(todayAttendance.dailyWork);
      }
      if (todayAttendance.isLogConfirmed) {
        setIsConfirmedLocal(true);
      }
      if (Array.isArray(todayAttendance.technologies) && todayAttendance.technologies.length > 0) {
        setSelectedTech(todayAttendance.technologies);
      }
    }
  }, [todayAttendance, isLogConfirmed]);

  // =====================================
  // LOGOUT
  // =====================================

  const { requestLogout } = useAuthModal();

  const handleLogout = () => {
    requestLogout({
      title: "Confirm Logout",
      message: "Are you sure you want to log out of your student workspace?",
      onConfirm: () => {
        clearAuthSession();
        window.location.href = "/";
      },
    });
  };

  if (!student) return null;

  return (
    <div className="modern-dashboard">

      {/* =====================================
          TOP BAR (HAMBURGER & LOGOUT)
      ===================================== */}
      <div className="student-top-nav">
        <div className="student-top-nav-left">
          <button
            type="button"
            className="student-hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation sidebar"
            title="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div className="student-portal-brand">
            <span className="student-brand-icon">
              <Award size={18} />
            </span>
            <span className="student-brand-name">
              Intern<span className="brand-blue">Track</span>
            </span>
            <span className="student-portal-tag">Student Portal</span>
          </div>
        </div>

        <div className="student-top-nav-right">
          <button
            type="button"
            className="student-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* =====================================
          SIDEBAR DRAWER OVERLAY
      ===================================== */}
      {sidebarOpen && (
        <div
          className="student-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="student-sidebar"
            onClick={(e) => e.stopPropagation()}
            aria-label="Student Navigation Drawer"
          >
            <div className="student-sidebar-head">
              <div className="student-sidebar-brand">
                <span className="sidebar-brand-icon">
                  <Award size={20} />
                </span>
                <div>
                  <h3>Intern<span className="brand-blue">Track</span></h3>
                  <small>Student Portal</small>
                </div>
              </div>

              <button
                type="button"
                className="student-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Mini Card in Sidebar */}
            <div className="student-sidebar-profile">
              <div className="sidebar-profile-avatar">
                <GraduationCap size={22} />
              </div>
              <div className="sidebar-profile-meta">
                <strong title={student.name}>{student.name}</strong>
                <span className="sidebar-student-id">{student.loginId}</span>
                <span className="sidebar-student-email" title={student.email}>
                  {student.email}
                </span>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <nav className="student-sidebar-menu">
              <p className="sidebar-section-heading">WORKSPACE</p>

              <button
                type="button"
                className={`sidebar-nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("dashboard");
                  setSidebarOpen(false);
                }}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-btn ${activeTab === "certificate" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("certificate");
                  setSidebarOpen(false);
                }}
              >
                <Award size={18} />
                <span>Certificate Generator</span>
              </button>
            </nav>

            {/* Red Logout Button in Sidebar */}
            <div className="student-sidebar-footer">
              <button
                type="button"
                className="sidebar-logout-btn"
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================
          PROFILE HEADER
      ===================================== */}

      <section className="profile-hero">

        <div className="profile-info">

          <div className="profile-avatar">
            <GraduationCap size={38} />
          </div>

          <div>

            <div className="profile-title">

              <h1>{student.name}</h1>

              <span className="student-id">
                {student.loginId}
              </span>

              <span className="active-badge">
                <CheckCircle size={13} />
                Active Intern
              </span>

            </div>

            <div className="profile-details">

              <span>
                <BriefcaseBusiness size={15} />
                Internship Program
              </span>

              <span>
                <GraduationCap size={15} />
                {student.email}
              </span>

              <span>
                <CalendarDays size={15} />
                Student Workspace
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          VIEW SWITCHER: DASHBOARD VS CERTIFICATE
      ===================================== */}

      {activeTab === "certificate" ? (
        <section className="student-certificate-view">
          <CertificateGenerator embedded={true} />
        </section>
      ) : (
        <>
          {/* =====================================
              STATISTICS
          ===================================== */}

          <section className="stats-grid">

            <div className="stat-card">

              <CalendarDays />

              <small>TOTAL LOGGED</small>

              <h2>
                {totalHours.toFixed(2)}
                <small> hrs</small>
              </h2>

              <p>Automated calculation</p>

            </div>

            <div className="stat-card">

              <CheckCircle />

              <small>DAYS ACTIVE</small>

              <h2>
                {activeDays}
                <small> days</small>
              </h2>

              <p>Attendance records</p>

            </div>

            <div className="stat-card">

              <Clock />

              <small>DAILY AVERAGE</small>

              <h2>
                {average}
                <small> hrs/day</small>
              </h2>

              <p>Productive shift pace</p>

            </div>

            <div
              className="stat-card stat-card--clickable"
              onClick={() => setActiveTab("certificate")}
              title="Click to open Certificate Generator"
              style={{ cursor: "pointer" }}
            >

              <Award />

              <small>CERTIFICATE STATUS</small>

              <h3>Ready to Request</h3>

              <p>ID: {student.loginId} · Open Generator →</p>

            </div>

          </section>


      {/* =====================================
          MAIN WORKSPACE
      ===================================== */}

      <section className="dashboard-workspace">

        {/* DAILY WORK FORM */}

        <div className="workspace-card">

          <div className="section-heading">

            <div>

              <h2>
                <Clock />
                Record Daily Work & Attendance
              </h2>

              <p>
                Entry and Exit time are recorded automatically
              </p>

            </div>

            <span className="selected-date">
              Today: {today}
            </span>

          </div>


          {/* TODAY ATTENDANCE STATUS */}

          <div className="duration-box">

            <div>
              <Calculator />
              <strong>Today's Attendance:</strong>
            </div>

            <div className="duration-value">

              <h2>
                {isExitMarked
                  ? "Completed"
                  : isEntryMarked
                    ? isLogConfirmed
                      ? "Shift Active (Log Confirmed)"
                      : "Shift Active (Log Pending)"
                    : "Not Started"}
              </h2>

              <small>
                {isExitMarked
                  ? `${todayAttendance.entryTime} – ${todayAttendance.exitTime}`
                  : isEntryMarked
                    ? `${todayAttendance.entryTime} – Exit Pending (${isLogConfirmed ? "Log Confirmed" : "Please confirm log"})`
                    : "Click Mark Entry Now button to start"}
              </small>

            </div>

          </div>


          {/* AUTOMATIC TIME INFORMATION */}

          <div className="auto-time-info">

            <Clock size={17} />

            <span>
              Entry time and Exit time will be automatically
              recorded when you click their respective buttons.
            </span>

          </div>


          {/* DAILY WORK */}

          <label className={`work-label ${!isEntryMarked || isLogConfirmed ? "attendance-dimmed" : ""}`}>

            Manual Daily Work Log / Deliverables *

            <textarea
              value={work}
              onChange={(e) => setWork(e.target.value)}
              placeholder="Detail the modules developed, bugs solved, or project work completed today..."
              disabled={!isEntryMarked || isLogConfirmed}
            />

          </label>

          {/* CONFIRM BUTTON UNDER LOG PLACEHOLDER */}
          <div className="work-log-actions">
            <button
              type="button"
              className={`confirm-log-btn ${isLogConfirmed ? "confirmed" : ""} ${!isEntryMarked || isLogConfirmed ? "attendance-dimmed" : ""}`}
              onClick={submitWorkLog}
              disabled={!isEntryMarked || isLogConfirmed || confirmLoading || !work.trim()}
              title={
                !isEntryMarked
                  ? "Mark entry first to unlock work log"
                  : isLogConfirmed
                    ? "Work log already confirmed"
                    : !work.trim()
                      ? "Type your daily log to enable confirmation"
                      : "Confirm your daily work log"
              }
            >
              <CheckCircle size={16} />
              {confirmLoading
                ? "Confirming Work Log..."
                : isLogConfirmed
                  ? "✔ Daily Work Log Confirmed"
                  : "Confirm Daily Work Log"}
            </button>
          </div>


          {/* TECHNOLOGIES */}

          <div className={`tech-section ${!isEntryMarked || isLogConfirmed ? "attendance-dimmed" : ""}`}>

            <p>TECHNOLOGIES / TOOLS ENGAGED:</p>

            <div className="tech-tags">

              {technologies.map((tech) => (

                <button
                  key={tech}
                  className={
                    selectedTech.includes(tech)
                      ? "tech-tag selected"
                      : "tech-tag"
                  }
                  onClick={() => toggleTech(tech)}
                  type="button"
                  disabled={!isEntryMarked || isLogConfirmed}
                >
                  {tech}
                </button>

              ))}

            </div>

          </div>


          {/* =====================================
              ENTRY AND EXIT BUTTONS
          ===================================== */}

          <div className="attendance-buttons">

            {/* GREEN ENTRY BUTTON */}

            <button
              type="button"
              className={`submit-timesheet entry-button ${isEntryMarked ? "attendance-dimmed" : ""}`}
              onClick={submitAttendance}
              disabled={loading || isEntryMarked}
            >

              <Send size={17} />

              {loading
                ? "Recording Entry..."
                : isEntryMarked
                  ? "Entry Already Recorded"
                  : "Mark Entry Now"}

            </button>


            {/* RED EXIT BUTTON */}

            <button
              type="button"
              className={`submit-timesheet exit-button ${!isEntryMarked || !isLogConfirmed || isExitMarked ? "attendance-dimmed" : ""}`}
              onClick={submitExit}
              disabled={
                exitLoading ||
                !isEntryMarked ||
                !isLogConfirmed ||
                isExitMarked
              }
            >

              <Clock size={17} />

              {exitLoading
                ? "Recording Exit..."
                : isExitMarked
                  ? "Exit Already Recorded"
                  : !isEntryMarked
                    ? "Mark Exit Now (Mark Entry First)"
                    : !isLogConfirmed
                      ? "Mark Exit Now (Confirm Log First)"
                      : "Mark Exit Now"}

            </button>

          </div>


          {/* MESSAGE */}

          {message && (

            <p className="dashboard-message">
              {message}
            </p>

          )}

        </div>


        {/* =====================================
            TIMESHEET HISTORY
        ===================================== */}

        <div className="workspace-card history-card">

          <div className="history-heading">

            <h2>
              <FileText />
              Timesheet History ({history.length})
            </h2>

            <span>
              Total: {totalHours.toFixed(2)} hrs
            </span>

          </div>


          {history.length === 0 ? (

            <p className="empty-history">
              No timesheets submitted yet.
            </p>

          ) : (

            history.map((item) => (

              <div
                className="history-item"
                key={item._id}
              >

                <div className="history-top">

                  <strong>{item.date}</strong>

                  <span>
                    {item.entryTime} – {item.exitTime || "Pending"}
                  </span>

                  <b>
                    {item.totalWorkingHours || 0} hrs
                  </b>

                </div>

                <p>{item.dailyWork}</p>

                <span className="history-status">
                  {item.status}
                </span>

              </div>

            ))

          )}

        </div>

      </section>
      </>
      )}

    </div>
  );
}

export default StudentDashboard;
