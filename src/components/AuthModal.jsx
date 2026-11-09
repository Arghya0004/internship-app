import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound, X, User, Sparkles, ShieldCheck, Lock, Mail,
  GraduationCap, ArrowRight, UserPlus,
} from "lucide-react";
import { useAuthModal } from "../context/authModalContext";
import "./AuthModal.css";

// ===== Demo data (pore MongoDB theke ashbe) =====
const demoStudents = [
  { id: "INT-2026-8821", email: "alex@university.edu", password: "password123",
    name: "Alex Morgan", status: "approved" },
  { id: "INT-2026-4402", email: "rohan@university.edu", password: "password123",
    name: "Rohan Sharma", status: "approved" },
];
const demoAdmin = { email: "admin@interntrack.com", password: "admin123", name: "Eleanor Sterling" };

const getAllStudents = () => {
  const saved = JSON.parse(localStorage.getItem("registeredStudents") || "[]");
  return [...demoStudents, ...saved];
};

export default function AuthModal() {
  const { tab, setTab, closeAuth } = useAuthModal();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reg, setReg] = useState({ name: "", email: "", university: "", password: "" });

  // Tab change / modal khulle form reset
  useEffect(() => {
    setLoginId("");
    setPassword("");
    setError("");
    setSuccess("");
  }, [tab]);

  // ESC chaple bondho
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAuth]);

  // Modal khola thakle background scroll bondho
  useEffect(() => {
    document.body.style.overflow = tab ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [tab]);

  if (!tab) return null; // bondho thakle kichu dekhabe na

  // ===== STUDENT LOGIN =====
  const handleStudentLogin = (e) => {
    e.preventDefault();
    const input = loginId.trim().toLowerCase();
    const found = getAllStudents().find(
      (s) => (s.id.toLowerCase() === input || s.email.toLowerCase() === input) &&
             s.password === password
    );

    if (!found) return setError("Invalid Student ID/Email or Password.");
    if (found.status === "pending")
      return setError("Your registration is pending admin approval.");

    localStorage.setItem("currentUser", JSON.stringify({ id: found.id, name: found.name, role: "student" }));
    closeAuth();
    navigate("/student-dashboard");
  };

  // ===== ADMIN LOGIN =====
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginId.trim().toLowerCase() === demoAdmin.email && password === demoAdmin.password) {
      localStorage.setItem("currentUser", JSON.stringify({ name: demoAdmin.name, role: "admin" }));
      closeAuth();
      navigate("/admin-dashboard");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  // ===== REGISTER =====
  const handleRegister = (e) => {
    e.preventDefault();
    const exists = getAllStudents().some((s) => s.email.toLowerCase() === reg.email.toLowerCase());
    if (exists) return setError("This email is already registered.");

    const newId = "INT-2026-" + Math.floor(1000 + Math.random() * 9000);
    const saved = JSON.parse(localStorage.getItem("registeredStudents") || "[]");
    saved.push({ ...reg, id: newId, status: "pending" });
    localStorage.setItem("registeredStudents", JSON.stringify(saved));

    setError("");
    setSuccess(`Registration submitted! Your Login ID is ${newId}. You can sign in after admin approval.`);
    setReg({ name: "", email: "", university: "", password: "" });
  };

  const handleRegChange = (e) => setReg({ ...reg, [e.target.name]: e.target.value });

  const fill = (id, pass) => { setLoginId(id); setPassword(pass); setError(""); };

  return (
    <div className="am-overlay" onClick={closeAuth}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="am-head">
          <div className="am-head-left">
            <span className="am-key"><KeyRound size={20} /></span>
            <div>
              <h2>Portal Authentication</h2>
              <p>Access student workspace or administrative console</p>
            </div>
          </div>
          <button className="am-close" onClick={closeAuth}><X size={20} /></button>
        </div>

        {/* TABS */}
        <div className="am-tabs">
          <button className={tab === "student" ? "active" : ""} onClick={() => setTab("student")}>
            <User size={14} /> Student Login
          </button>
          <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>
            <Sparkles size={14} className="orange" /> New Registration
          </button>
          <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")}>
            <ShieldCheck size={14} className="orange" /> Admin
          </button>
        </div>

        <div className="am-body">

          {/* ========== STUDENT TAB ========== */}
          {tab === "student" && (
            <form onSubmit={handleStudentLogin}>
              <label>STUDENT LOGIN ID OR EMAIL</label>
              <div className="am-input">
                <User size={16} />
                <input
                  className="mono"
                  placeholder="e.g. INT-2026-8821 or email"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>
              <small className="am-hint">Provided during registration after administrative confirmation.</small>

              <label>PASSWORD</label>
              <div className="am-input">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="am-error">{error}</p>}

              <button type="submit" className="am-btn">
                Sign In to Student Workspace <ArrowRight size={16} />
              </button>

              <div className="am-quick">
                <small>QUICK TEST ACCOUNTS (CLICK TO FILL):</small>
                <div className="am-quick-grid">
                  <div onClick={() => fill("INT-2026-8821", "password123")}>
                    <b>Alex Morgan</b>
                    <code>INT-2026-8821</code>
                    <span className="green">Certified & Approved</span>
                  </div>
                  <div onClick={() => fill("INT-2026-4402", "password123")}>
                    <b>Rohan Sharma</b>
                    <code>INT-2026-4402</code>
                    <span className="blue">Active (Logging Hours)</span>
                  </div>
                </div>
              </div>

              <p className="am-switch" onClick={() => setTab("register")}>
                Need an account? Register new student profile →
              </p>
            </form>
          )}

          {/* ========== REGISTER TAB ========== */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <label>FULL NAME</label>
              <div className="am-input">
                <User size={16} />
                <input name="name" placeholder="Your full name"
                  value={reg.name} onChange={handleRegChange} required />
              </div>

              <label>EMAIL ADDRESS</label>
              <div className="am-input">
                <Mail size={16} />
                <input type="email" name="email" placeholder="name@university.edu"
                  value={reg.email} onChange={handleRegChange} required />
              </div>

              <label>UNIVERSITY / INSTITUTION</label>
              <div className="am-input">
                <GraduationCap size={16} />
                <input name="university" placeholder="Your university name"
                  value={reg.university} onChange={handleRegChange} required />
              </div>

              <label>CREATE PASSWORD</label>
              <div className="am-input">
                <Lock size={16} />
                <input type="password" name="password" placeholder="Minimum 6 characters"
                  minLength={6} value={reg.password} onChange={handleRegChange} required />
              </div>

              {error && <p className="am-error">{error}</p>}
              {success && <p className="am-success">{success}</p>}

              <button type="submit" className="am-btn">
                <UserPlus size={16} /> Submit Registration
              </button>

              <p className="am-switch" onClick={() => setTab("student")}>
                Already approved? Sign in here →
              </p>
            </form>
          )}

          {/* ========== ADMIN TAB ========== */}
          {tab === "admin" && (
            <form onSubmit={handleAdminLogin}>
              <label>ADMIN EMAIL</label>
              <div className="am-input">
                <ShieldCheck size={16} />
                <input
                  placeholder="e.g. admin@interntrack.com"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              <label>PASSWORD</label>
              <div className="am-input">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="am-error">{error}</p>}

              <button type="submit" className="am-btn dark">
                Sign In to Admin Console <ArrowRight size={16} />
              </button>

              <div className="am-quick">
                <small>QUICK TEST ACCOUNT (CLICK TO FILL):</small>
                <div className="am-quick-grid single">
                  <div onClick={() => fill("admin@interntrack.com", "admin123")}>
                    <b>Eleanor Sterling</b>
                    <code>admin@interntrack.com</code>
                    <span className="yellow">Administrator (Approve Everything)</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

