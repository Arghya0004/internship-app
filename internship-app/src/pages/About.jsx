import { Link } from "react-router-dom";
import { Clock, ShieldCheck, Award, ArrowRight } from "lucide-react";
import "./About.css";

const features = [
  {
    icon: <Clock size={20} />,
    bg: "#dbeafe",
    color: "#1d4ed8",
    title: "Automated Shift Math",
    desc: "Eliminating guesswork and inflated hour claims. When interns enter entry and exit times, the engine dynamically computes exact work durations with minute-level precision.",
  },
  {
    icon: <ShieldCheck size={20} />,
    bg: "#fef3c7",
    color: "#d97706",
    title: "Administrative Oversight",
    desc: "Every candidate registration must be validated and authorized by an approved administrator before access is granted. Mentors review daily deliverables prior to certificate generation.",
  },
  {
    icon: <Award size={20} />,
    bg: "#d1fae5",
    color: "#059669",
    title: "Tamper-Proof Verification",
    desc: "Each endorsed certificate receives a unique, collision-free identification code. External recruiters and admissions committees can verify student achievements instantly.",
  },
];

export default function About() {
  return (
    <div className="about-page">

      {/* ===== HEADER ===== */}
      <section className="about-header">
        <span className="about-badge">
          <Award size={12} /> Academic & Industry Standards
        </span>
        <h1>About InternTrack</h1>
        <p>
          InternTrack was founded to establish absolute credibility and transparent
          tracking for professional university internships and practicum programs.
        </p>
      </section>

      {/* ===== 3 FEATURE CARDS ===== */}
      <section className="about-container">
        <div className="about-grid">
          {features.map((f) => (
            <div className="about-card" key={f.title}>
              <div className="about-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GOVERNANCE BOX ===== */}
      <section className="about-container">
        <div className="about-gov">
          <h2>The Two-Tier Governance Model</h2>

          <div className="about-gov-cols">
            <div>
              <h4>
                <span className="about-step blue">1</span>
                Candidate Admission & Work Logging
              </h4>
              <p>
                Students begin by submitting verified email contact details and
                educational affiliations. The central administrative directorate
                inspects applicant credentials and activates their Student Login ID.
                From their first day on site, interns record shift timings and detail
                specific technical milestones achieved.
              </p>
            </div>

            <div>
              <h4>
                <span className="about-step yellow">2</span>
                Practicum Review & Endorsement
              </h4>
              <p>
                Upon completing their required tenure, students formally submit an
                issuance request via the Certificate Generator tab. Program directors
                evaluate cumulative hours, review task quality, assign a final
                performance grade, and digitally endorse the certificate.
              </p>
            </div>
          </div>

          <div className="about-gov-footer">
            <small>
              Adhering to IEEE and ABET university practicum guidelines for
              experiential engineering education.
            </small>
            <Link to="/certificate" className="about-btn">
              Test Certificate Generator <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );

}