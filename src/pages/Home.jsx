import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const steps = [
  { n: 1, title: "Registration & ID", bg: "#dbeafe", color: "#1d4ed8",
    desc: "New students provide academic details, verify email, and receive a unique Login ID (INT-2026-XXXX)." },
  { n: 2, title: "Admin Approval", bg: "#fef3c7", color: "#b45309",
    desc: "Admin reviews candidate details and officially approves their registration to activate login ID." },
  { n: 3, title: "Hours & Work Logs", bg: "#e0e7ff", color: "#4338ca",
    desc: "Interns pick dates on the calendar, input entry and exit times, and record manual task summaries." },
  { n: 4, title: "Verifiable Certificate", bg: "#d1fae5", color: "#047857",
    desc: "Student requests endorsement via the Certificate Generator tab. Once approved, a printable diploma is generated." },
];

const tracks = [
  { title: "Full-Stack Software Engineering", desc: "Modern frontend frameworks (React, Next), backend microservices, SQL/NoSQL schema modeling, and production cloud deploys." },
  { title: "Artificial Intelligence & ML", desc: "Model training, fine-tuning, computer vision with PyTorch, NLP pipelines, vector database, and scalable inference API deployment." },
  { title: "Cloud Architecture & DevOps", desc: "Docker containerization, Kubernetes orchestration, CI/CD automated test pipelines, and enterprise infrastructure-as-code." },
  { title: "Data Analytics & BI", desc: "Data warehousing, advanced ETL pipelines, executive KPI forecasting, and real-time visualization dashboards." },
  { title: "Cybersecurity & Defense", desc: "Vulnerability assessment, network penetration auditing, zero-trust access architecture, and cryptographic key rotation." },
  { title: "Mobile App Development", desc: "Cross-platform mobile applications with React Native and Flutter, offline SQLite caching, and native hardware API integrations." },
];

export default function Home() {
  const [certId, setCertId] = useState("");

  const verify = () => {
    if (!certId.trim()) return alert("Please enter a Certificate ID");
    alert("Verifying: " + certId); // pore backend API connect hobe
  };

  return (
    <div className="home">

      {/* ===== HERO ===== */}
      <section className="hero">
        <span className="badge">MERN Stack Architecture · MongoDB Document Store & Express REST API</span>

        <h1>
          Track Daily Internship Hours.<br />
          <span className="blue">Generate Verifiable Credentials.</span>
        </h1>

        <p className="hero-sub">
          The premier platform for university interns and program administrators.
          Automated shift calculation, manual task logs, administrative approval
          pipelines, and cryptographic digital certificates.
        </p>

        <div className="hero-btns">
          <Link to="/student-login" className="btn btn-primary">Student Workspace →</Link>
          <Link to="/admin-login" className="btn btn-dark">Admin Console</Link>
          <Link to="/certificate" className="btn btn-outline">Certificate Generator</Link>
        </div>

        <small className="short-title">1-CLICK FAST EVALUATOR SHORTCUTS:</small>
        <div className="chips">
          <button className="chip green">Alex Morgan (Approved Cert)</button>
          <button className="chip blue">Rohan Sharma (Log Hours & Request)</button>
          <button className="chip yellow">Admin Eleanor Sterling (Approve Everything)</button>
        </div>
      </section>

      {/* ===== WORKFLOW ===== */}
      <section className="section">
        <p className="eyebrow">SYSTEM WORKFLOW</p>
        <h2>Engineered Exactly for Your Requirements</h2>

        <div className="grid grid-4">
          {steps.map((s) => (
            <div className="card" key={s.n}>
              <span className="num" style={{ background: s.bg, color: s.color }}>{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VERIFY BOX ===== */}
      <section className="verify-wrap">
        <div className="verify-box">
          <div className="verify-top">
            <div>
              <small className="engine">⚙ Instant Verification Engine</small>
              <h3>Verify Any Intern Certificate Instantly</h3>
              <p>Employers, recruiters, and university deans can validate credential authenticity in real-time.</p>
            </div>
            <span className="db">Database: <b>LIVE</b></span>
          </div>

          <div className="verify-form">
            <input
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. CERT-INT-2026-8821 or Student ID"
            />
            <button onClick={verify}>🔍 Verify Credential</button>
          </div>

          <div className="verify-foot">
            <span>Try sample certificate:</span>
            <a onClick={() => setCertId("CERT-INT-2026-8821")}>CERT-INT-2026-8821 (Alex Morgan)</a>
          </div>
        </div>
      </section>

      {/* ===== TRACKS ===== */}
      <section className="section">
        <h2>Supported Internship Tracks</h2>
        <p className="muted">Standardized technical curriculum templates with automated practicum verification.</p>

        <div className="grid grid-3">
          {tracks.map((t) => (
            <div className="card" key={t.title}>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}