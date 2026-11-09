import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Award, Sparkles, User, ShieldCheck, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import { useAuthModal } from "../context/authModalContext";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const { openAuth } = useAuthModal();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const choose = (tab) => {
    setOpen(false);
    openAuth(tab);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon"><Award size={16} /></span>
        Intern<span className="logo-blue">Track</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact Us</NavLink>
        <NavLink to="/certificate">
          Certificate Generator <Sparkles size={13} className="spark" />
        </NavLink>
      </div>

      <div className="login-wrap" ref={wrapRef}>
        <button className="login-btn" onClick={() => setOpen(!open)}>
          <User size={14} /> Login
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {open && (
          <div className="dropdown">
            <p className="dd-title">SELECT PORTAL ACCESS</p>

            <button className="dd-item" onClick={() => choose("student")}>
              <span className="dd-icon blue"><User size={16} /></span>
              <div>
                <b>Student Login</b>
                <small>ID & Password access</small>
              </div>
            </button>

            <button className="dd-item" onClick={() => choose("admin")}>
              <span className="dd-icon yellow"><ShieldCheck size={16} /></span>
              <div>
                <b>Admin Login</b>
                <small>Track data & approvals</small>
              </div>
            </button>

            <div className="dd-footer">
              <button onClick={() => choose("register")}>
                <UserPlus size={14} /> New Student? Register here
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
