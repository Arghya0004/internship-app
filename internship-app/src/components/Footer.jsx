
import { Link } from "react-router-dom";
import {
  Award,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  Mail,
  ChevronRight,
} from "lucide-react";

import { useAuthModal } from "../context/authModalContext";
import "./Footer.css";

export default function Footer() {
  const { openAuth } = useAuthModal();

  return (
    <footer className="footer">

      <div className="footer-gradient-line"></div>

      <div className="footer-container">

        <div className="footer-main">

          {/* BRAND SECTION */}
          <div className="footer-brand">

            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">
                <Award size={23} />
              </span>

              <span>
                Intern<span className="footer-logo-highlight">Track</span>
              </span>
            </Link>

            <p className="footer-description">
              Empowering students through structured internship
              management, smart attendance tracking, and verified
              digital certifications.
            </p>

            <div className="footer-trust">
              <span>
                <ShieldCheck size={15} />
                Secure Platform
              </span>

              <span>
                <GraduationCap size={16} />
                Student Focused
              </span>
            </div>

            {/* SOCIAL LINKS */}
            <div className="footer-socials">

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>

              <a
                href="mailto:support@interntrack.com"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>

            </div>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">

            <h4>QUICK LINKS</h4>

            <Link to="/">
              <ChevronRight size={15} /> Home
            </Link>

            <Link to="/about">
              <ChevronRight size={15} /> About Us
            </Link>

            <Link to="/contact">
              <ChevronRight size={15} /> Contact Us
            </Link>

          </div>

          {/* STUDENT AND ADMIN */}
          <div className="footer-column">

            <h4>STUDENT & ADMIN</h4>

            <button onClick={() => openAuth("student")}>
              <ChevronRight size={15} /> Student Login
            </button>

            <button onClick={() => openAuth("register")}>
              <ChevronRight size={15} /> Student Registration
            </button>

            <button onClick={() => openAuth("admin")}>
              <ChevronRight size={15} /> Admin Login
            </button>

          </div>

          {/* CTA CARD */}
          <div className="footer-cta">

            <div className="footer-cta-icon">
              <GraduationCap size={26} />
            </div>

            <h3>Start Your Journey</h3>

            <p>
              Manage your internship journey with InternTrack.
              Track your progress and build your professional future.
            </p>

            <button
              className="footer-cta-button"
              onClick={() => openAuth("register")}
            >
              Get Started
              <ArrowUpRight size={17} />
            </button>

          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} InternTrack.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/contact">Support</Link>
            <span>•</span>
            <Link to="/about">About</Link>
          </div>

          <p className="footer-made">
            Designed for a smarter internship experience.
          </p>

        </div>

      </div>

    </footer>
  );
}
