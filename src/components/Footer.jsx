import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { useAuthModal } from "../context/authModalContext";
import "./Footer.css";

export default function Footer() {
  const { openAuth } = useAuthModal();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* TOP */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon"><Award size={18} /></span>
              Intern<span>Track</span>
            </Link>
            <p>
              Standardized practicum timesheet monitoring, administrative
              authorization pipelines, and cryptographic certification
              generation for professional interns.
            </p>
            <div className="footer-tags">
              <span>IEEE & ABET Aligned</span>
              <i>·</i>
              <span>Tamper-Proof Verification</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4>NAVIGATION</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Organization</Link>
            <Link to="/contact">Contact & Support</Link>
            <Link to="/certificate">Certificate Generator</Link>
          </div>

          {/* Portals */}
          <div className="footer-col">
            <h4>PORTALS</h4>
            <button onClick={() => openAuth("student")}>Student Workspace Login</button>
            <button onClick={() => openAuth("register")}>New Student Registration</button>
            <button onClick={() => openAuth("admin")}>Admin Control Console</button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} InternTrack Consortium. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Framework</a>
            <i>·</i>
            <a href="#">Credential Verification Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
}