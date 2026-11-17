
import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Award,
  Sparkles,
  User,
  ShieldCheck,
  UserPlus,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";

import { useAuthModal } from "../context/authModalContext";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const { openAuth } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();

  // Student Dashboard detect
  const isStudentDashboard =
    location.pathname.toLowerCase().includes("student") &&
    location.pathname.toLowerCase().includes("dashboard");

  // Dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Login dropdown
  const choose = (tab) => {
    setOpen(false);
    openAuth(tab);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");

    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" className="logo">
        <span className="logo-icon">
          <Award size={16} />
        </span>
        Intern<span className="logo-blue">Track</span>
      </Link>

      {/* NAVIGATION */}
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>

        <NavLink to="/about">About</NavLink>

        <NavLink to="/contact">Contact Us</NavLink>

        <NavLink to="/certificate">
          Certificate Generator
          <Sparkles size={13} className="spark" />
        </NavLink>
      </div>

      {/* RIGHT SIDE */}
      {isStudentDashboard ? (
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      ) : (
        <div className="login-wrap" ref={wrapRef}>
          <button
            className="login-btn"
            onClick={() => setOpen(!open)}
          >
            <User size={14} />
            Login
            {open ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {/* LOGIN DROPDOWN */}
          {open && (
            <div className="dropdown">
              <p className="dd-title">SELECT PORTAL ACCESS</p>

              <button
                className="dd-item"
                onClick={() => choose("student")}
              >
                <span className="dd-icon blue">
                  <User size={16} />
                </span>
                <div>
                  <b>Student Login</b>
                  <small>ID & Password access</small>
                </div>
              </button>

              <button
                className="dd-item"
                onClick={() => choose("admin")}
              >
                <span className="dd-icon yellow">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <b>Admin Login</b>
                  <small>Track data & approvals</small>
                </div>
              </button>

              <div className="dd-footer">
                <button onClick={() => choose("register")}>
                  <UserPlus size={14} />
                  New Student? Register here
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
