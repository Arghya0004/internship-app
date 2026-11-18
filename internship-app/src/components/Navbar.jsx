import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Award,
  User,
  ShieldCheck,
  UserPlus,
  ChevronDown,
  ChevronUp,
  LogOut,
  Home,
  Info,
  Mail,
} from "lucide-react";

import { useAuthModal } from "../context/authModalContext";
import GooeyNav from "./GooeyNav";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const wrapRef = useRef(null);

  const { openAuth } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll detection for glassmorphism shape morphing
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 15;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Student Dashboard detect
  const isStudentDashboard =
    location.pathname.toLowerCase().includes("student") &&
    location.pathname.toLowerCase().includes("dashboard");

  // Sync authentication state from localStorage
  useEffect(() => {
    const syncAuth = () => {
      try {
        const currentStr = localStorage.getItem("currentUser");
        if (currentStr) {
          const parsed = JSON.parse(currentStr);
          if (parsed && (parsed.role || parsed.name || parsed.id)) {
            setAuthUser(parsed);
            return;
          }
        }

        const role = localStorage.getItem("userRole");
        if (role === "admin" || localStorage.getItem("adminToken")) {
          const adminStr = localStorage.getItem("admin");
          const admin = adminStr ? JSON.parse(adminStr) : null;
          setAuthUser({
            role: "admin",
            name: admin?.loginId || admin?.name || "Admin",
          });
          return;
        }

        const studentStr = localStorage.getItem("student");
        if (studentStr || localStorage.getItem("token")) {
          const student = studentStr ? JSON.parse(studentStr) : null;
          setAuthUser({
            role: "student",
            name: student?.name || "Student",
            id: student?.id,
          });
          return;
        }

        setAuthUser(null);
      } catch {
        setAuthUser(null);
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [location.pathname]);

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

  // Login modal trigger
  const choose = (tab) => {
    setOpen(false);
    openAuth(tab);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");

    setOpen(false);
    setAuthUser(null);
    navigate("/");
  };

  // Primary navigation items
  const navItems = useMemo(
    () => [
      { label: "Home", href: "/", icon: <Home size={15} /> },
      { label: "About", href: "/about", icon: <Info size={15} /> },
      { label: "Contact Us", href: "/contact", icon: <Mail size={15} /> },
    ],
    []
  );

  // Calculate active index synchronized with current route
  const activeIndex = useMemo(() => {
    const path = location.pathname;
    const index = navItems.findIndex((item) => {
      if (item.href === "/") {
        return path === "/";
      }
      return path === item.href || (item.href !== "/" && path.startsWith(item.href));
    });
    return index !== -1 ? index : 0;
  }, [location.pathname, navItems]);

  // Handle SPA navigation on item selection
  const handleNavChange = (index, item) => {
    if (item?.href && item.href !== "#" && item.href !== location.pathname) {
      navigate(item.href);
    }
  };

  // Prevent default anchor reloads on left clicks so SPA state is preserved
  const handleNavClick = (e) => {
    const anchor = e.target.closest("a");
    if (anchor && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className={`navbar ${scrolled ? "navbar--scrolled" : "navbar--top"}`}
        aria-label="Main Navigation"
      >
        {/* BRAND LOGO */}
        <Link to="/" className="logo">
          <span className="logo-icon">
            <Award size={16} />
          </span>
          Intern<span className="logo-blue">Track</span>
        </Link>

        {/* PRIMARY NAVIGATION WITH GOOEYNAV */}
        <div className="nav-gooey-container" onClickCapture={handleNavClick}>
          <GooeyNav
            items={navItems}
            activeIndex={activeIndex}
            onChange={handleNavChange}
            theme="light"
            color="#1d4ed8"
            colors={["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa"]}
            size="sm"
            style={{
              "--gn-frame": "rgba(255, 255, 255, 0.42)",
              "--gn-frame-edge": "rgba(255, 255, 255, 0.4)",
            }}
          />
        </div>

        {/* SECONDARY ACTIONS (LOGOUT / PROFILE / LOGIN) */}
        <div className="nav-actions">
          {authUser || isStudentDashboard ? (
            <div className="auth-user-section">
              <div className="user-profile-badge">
                <span className="user-avatar-icon">
                  {authUser?.role === "admin" ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <User size={14} />
                  )}
                </span>
                <span className="user-profile-name">
                  {authUser?.name ||
                    (authUser?.role === "admin" ? "Admin" : "Student")}
                </span>
              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <div className="login-wrap" ref={wrapRef}>
              <button
                className="login-btn"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="true"
              >
                <User size={14} />
                Login
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
        </div>
      </nav>
    </header>
  );
}
