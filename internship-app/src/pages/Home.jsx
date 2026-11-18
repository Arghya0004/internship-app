import GlowCursor from "../components/GlowCursor";
import TiltedCard from "../components/TiltedCard";
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
  return (
    <GlowCursor theme="light">
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
        </section>

        {/* ===== WORKFLOW ===== */}
        <section className="section">
          <p className="eyebrow">SYSTEM WORKFLOW</p>
          <h2>Engineered Exactly for Your Requirements</h2>

          <div className="grid grid-4">
            {steps.map((s) => (
              <TiltedCard
                key={s.n}
                className="workflow-tilted-card"
                containerWidth="100%"
                containerHeight="205px"
                imageWidth="100%"
                imageHeight="100%"
                scaleOnHover={1.05}
                rotateAmplitude={12}
                radius={10}
                showTooltip={false}
                glare={0.4}
                glareColor="#ffffff"
                shadow={0.3}
              >
                <div className="card-workflow">
                  <span className="num" style={{ background: s.bg, color: s.color }}>{s.n}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </TiltedCard>
            ))}
          </div>
        </section>

        {/* ===== TRACKS ===== */}
        <section className="section">
          <h2>Supported Internship Tracks</h2>
          <p className="muted">Standardized technical curriculum templates with automated practicum verification.</p>

          <div className="grid grid-3">
            {tracks.title ? null : tracks.map((t) => (
              <div className="card" key={t.title}>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </GlowCursor>
  );
}