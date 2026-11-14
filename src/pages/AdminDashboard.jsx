
import { useMemo, useState } from "react";
import "./AdminDashboard.css";

/* ---------- INITIAL DATA ---------- */

const initialPending = [
  {
    id: "INT-2026-9118",
    name: "Sara Chen",
    institution: "Massachusetts Institute of Technology (MIT)",
    domain: "Cloud Architecture & DevOps",
    email: "sara.chen@mit.edu",
    registered: "11/5/2026, 10:10:00 PM",
    term: "2026-11-01 to 2026-12-31",
  },
];

const initialInterns = [
  {
    id: "INT-2026-8821",
    name: "Alex Morgan",
    domain: "Full-Stack Software Engineering",
    institution: "Stanford University",
    term: "2026-10-01 to 2026-12-15",
  },
  {
    id: "INT-2026-4402",
    name: "Rohan Sharma",
    domain: "Artificial Intelligence & Machine Learning",
    institution: "Georgia Tech",
    term: "2026-10-15 to 2026-12-20",
  },
  {
    id: "INT-2026-5590",
    name: "Marcus Vance",
    domain: "Data Analytics & Business Intelligence",
    institution: "UC Berkeley",
    term: "2026-11-01 to 2026-12-30",
  },
];

const initialCertRequests = [
  {
    id: "REQ-1001",
    student: "Marcus Vance",
    internshipId: "INT-2026-5590",
    domain: "Data Analytics & Business Intelligence",
    institution: "UC Berkeley",
    hours: 16.5,
    days: 2,
    requested: "11/5/2026, 7:50:00 PM",
  },
];

const initialCertificates = [
  {
    id: "CERT-INT-2026-8821",
    student: "Alex Morgan",
    domain: "Full-Stack Software Engineering",
    institution: "Stanford University, Dept. of Computer Science",
    grade: "Grade A+ (Outstanding Distinction)",
  },
];

const initialLogs = [
  { date: "2026-10-15", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "09:00", end: "17:30", hours: 8.5, task: "API integration" },
  { date: "2026-10-16", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "09:15", end: "17:45", hours: 8.5, task: "Database schema design" },
  { date: "2026-10-17", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "09:00", end: "18:00", hours: 9, task: "Frontend components" },
  { date: "2026-10-20", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "09:30", end: "17:30", hours: 8, task: "Unit testing" },
  { date: "2026-10-21", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "08:45", end: "17:15", hours: 8.5, task: "Code review" },
  { date: "2026-10-22", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "09:00", end: "17:00", hours: 8, task: "Deployment pipeline" },
  { date: "2026-10-23", student: "Alex Morgan", internshipId: "INT-2026-8821", start: "09:30", end: "18:00", hours: 8.5, task: "Documentation" },
  { date: "2026-10-28", student: "Rohan Sharma", internshipId: "INT-2026-4402", start: "09:00", end: "17:00", hours: 8, task: "Model training" },
  { date: "2026-10-29", student: "Rohan Sharma", internshipId: "INT-2026-4402", start: "09:30", end: "18:00", hours: 8.5, task: "Data cleaning" },
  { date: "2026-10-30", student: "Rohan Sharma", internshipId: "INT-2026-4402", start: "09:00", end: "17:30", hours: 8.5, task: "Evaluation metrics" },
  { date: "2026-11-02", student: "Marcus Vance", internshipId: "INT-2026-5590", start: "09:00", end: "17:00", hours: 8, task: "Dashboard design" },
  { date: "2026-11-03", student: "Marcus Vance", internshipId: "INT-2026-5590", start: "09:15", end: "17:45", hours: 8.5, task: "SQL reporting" },
];

/* ---------- MAIN COMPONENT ---------- */

function App() {
  const [activeTab, setActiveTab] = useState("approvals");
  const [pending, setPending] = useState(initialPending);
  const [interns, setInterns] = useState(initialInterns);
  const [certRequests, setCertRequests] = useState(initialCertRequests);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [logs] = useState(initialLogs);

  const [internFilter, setInternFilter] = useState("All Interns");
  const [logSearch, setLogSearch] = useState("");

  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);
  const totalInterns = interns.length + pending.length;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchIntern =
        internFilter === "All Interns" || log.student === internFilter;
      const matchSearch = `${log.student} ${log.internshipId} ${log.date} ${log.task}`
        .toLowerCase()
        .includes(logSearch.toLowerCase());
      return matchIntern && matchSearch;
    });
  }, [logs, internFilter, logSearch]);

  function approveStudent(student) {
    setInterns((c) => [
      ...c,
      {
        id: student.id,
        name: student.name,
        domain: student.domain,
        institution: student.institution,
        term: student.term,
      },
    ]);
    setPending((c) => c.filter((s) => s.id !== student.id));
  }

  function declineStudent(id) {
    setPending((c) => c.filter((s) => s.id !== id));
  }

  function issueCertificate(req) {
    setCertificates((c) => [
      {
        id: `CERT-${req.internshipId}`,
        student: req.student,
        domain: req.domain,
        institution: req.institution,
        grade: "Grade A (Excellent)",
      },
      ...c,
    ]);
    setCertRequests((c) => c.filter((r) => r.id !== req.id));
  }

  function requestRevision(id) {
    setCertRequests((c) => c.filter((r) => r.id !== id));
  }

  function exportData() {
    const data = { pending, interns, certRequests, certificates, logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interntrack-records.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetDemo() {
    setPending(initialPending);
    setInterns(initialInterns);
    setCertRequests(initialCertRequests);
    setCertificates(initialCertificates);
    setInternFilter("All Interns");
    setLogSearch("");
  }

  /* ---------- LOGOUT ---------- */
  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    // login-er somoy jei key-te data save koro, seta remove koro
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // login page-e pathao (tomar login route onujayi change koro)
    window.location.href = "/";
  }

  const tabs = [
    { key: "approvals", label: "Student Approvals & Directory", icon: "☺", badge: pending.length, badgeType: "amber" },
    { key: "certs", label: "Certificate Endorsements", icon: "✪", badge: certRequests.length, badgeType: "blue" },
    { key: "logs", label: `Daily Timesheet Logs (${logs.length})`, icon: "◷" },
  ];

  return (
    <div className="app">
      {/* HEADER */}
      {/* ADMIN ACTIONS */}
      <div className="admin-top-actions">

         <span className="admin-pill">🛡 Admin Control
          </span>

         <button
          className="logout-btn"
          onClick={handleLogout}
           >
        <span className="logout-text">Logout</span>
        </button>

</div>
      

      <main className="container">
        {/* HERO */}
        <section className="hero">
          <span className="hero-badge">⛨ Program Director Portal</span>
          <h1>Administrative Control &amp; Verification Console</h1>
          <p className="hero-sub">
            Supervising {totalInterns} interns · {totalHours.toFixed(1)} total
            verified practicum hours across all domains.
          </p>

          <div className="hero-actions">
            <button className="hero-btn" onClick={exportData}>
              <span className="teal">▤</span> Export Database
            </button>
            <button className="hero-btn" onClick={resetDemo}>
              <span>↻</span> Reset Demo
            </button>
          </div>

          <div className="hero-divider" />

          <div className="tile-grid">
            <StatTile label="Active Students" value={interns.length} unit="interns" note="Enrolled & logging" />
            <StatTile variant="amber" dot label="Pending ID Approvals" value={pending.length} unit="applicants" note="Requires admin sign-off" />
            <StatTile label="Total Work Logged" value={totalHours.toFixed(1)} unit="hours" note={`${logs.length} timesheets recorded`} noteClass="green" stacked />
            <StatTile variant="blue" label="Pending Certificates" value={certRequests.length} unit="requests" note="Awaiting certification review" />
          </div>
        </section>

        {/* TABS */}
        <nav className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
              {t.badge !== undefined && (
                <span className={`tab-badge ${t.badgeType}`}>{t.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* TAB 1 */}
        {activeTab === "approvals" && (
          <>
            <section className="card">
              <div className="card-head">
                <h3>Pending Registration Endorsement Queue</h3>
                <span className="count-chip amber">{pending.length}</span>
              </div>
              <p className="card-desc">
                New users register and verify email. The admin must click
                “Approve” to activate their Unique Student ID for login.
              </p>

              {pending.length === 0 ? (
                <EmptyState message="No pending registrations." />
              ) : (
                pending.map((s) => (
                  <div className="pending-item" key={s.id}>
                    <div className="pending-top">
                      <h4>{s.name}</h4>
                      <span className="id-chip amber">{s.id}</span>
                      <span className="status-pill awaiting">Awaiting Approval</span>
                    </div>

                    <ul className="meta-list">
                      <li>▯ {s.institution}</li>
                      <li>▣ {s.domain}</li>
                      <li>✉ {s.email}</li>
                    </ul>

                    <p className="mono-note">
                      Registered: {s.registered} · Term: {s.term}
                    </p>

                    <div className="btn-row">
                      <button className="btn btn-green" onClick={() => approveStudent(s)}>
                        ✓ Approve &amp; Activate ID
                      </button>
                      <button className="btn btn-outline" onClick={() => declineStudent(s.id)}>
                        ⊗ Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            <section className="card">
              <h3>Active Enrolled Interns Directory</h3>
              <p className="card-desc">
                Currently active students tracking daily attendance and hours.
              </p>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Domain</th>
                      <th>Institution</th>
                      <th>Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interns.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <strong>{i.name}</strong>
                          <span className="sub-id">{i.id}</span>
                        </td>
                        <td>{i.domain}</td>
                        <td>{i.institution}</td>
                        <td className="mono">{i.term}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* TAB 2 */}
        {activeTab === "certs" && (
          <>
            <section className="card">
              <div className="card-head">
                <h3>
                  <span className="orange-icon">✪</span> Certificate Issuance Requests
                </h3>
                <span className="count-chip blue">{certRequests.length}</span>
              </div>
              <p className="card-desc">
                Review student performance and logged hours. Endorsing here
                generates their official verifiable certificate immediately.
              </p>

              {certRequests.length === 0 ? (
                <EmptyState message="There are no pending certificate requests." />
              ) : (
                certRequests.map((r) => (
                  <div className="cert-request" key={r.id}>
                    <div className="pending-top">
                      <h4>{r.student}</h4>
                      <span className="id-chip grey">{r.internshipId}</span>
                    </div>

                    <p className="line">
                      Domain: <strong>{r.domain}</strong>
                    </p>
                    <p className="line">
                      Institution: <strong>{r.institution}</strong>
                    </p>
                    <p className="hours-line">
                      {r.hours.toFixed(1)} Verified Hours ({r.days} Days)
                    </p>
                    <p className="line small">Requested: {r.requested}</p>

                    <div className="btn-row two">
                      <button className="btn btn-orange" onClick={() => issueCertificate(r)}>
                        ✪ Endorse &amp; Issue Certificate
                      </button>
                      <button className="btn btn-outline" onClick={() => requestRevision(r.id)}>
                        Request Revisions
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            <section className="card">
              <h3>Issued &amp; Verifiable Certificates ({certificates.length})</h3>
              <p className="card-desc">
                Official digital credentials accessible to students and
                verifiable by employers.
              </p>

              {certificates.map((c) => (
                <div className="issued-card" key={c.id}>
                  <div className="issued-top">
                    <span className="id-chip amber-text">{c.id}</span>
                    <span className="endorsed">⊙ Endorsed</span>
                  </div>
                  <h4>{c.student}</h4>
                  <p className="issued-domain">
                    {c.domain} · {c.institution}
                  </p>
                  <div className="issued-bottom">
                    <span>
                      Grade: <strong>{c.grade}</strong>
                    </span>
                    <button className="link-btn">View Full Certificate ↗</button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* TAB 3 */}
        {activeTab === "logs" && (
          <section className="card">
            <h3>All Daily Work Records ({filteredLogs.length})</h3>
            <p className="card-desc">
              “Admin will keep track of all the data” — real-time timesheets
              and task descriptions.
            </p>

            <div className="filters">
              <select
                className="select"
                value={internFilter}
                onChange={(e) => setInternFilter(e.target.value)}
              >
                <option>All Interns</option>
                {interns.map((i) => (
                  <option key={i.id}>{i.name}</option>
                ))}
              </select>

              <div className="search-box">
                <span>⌕</span>
                <input
                  placeholder="Search work logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <EmptyState message="No timesheet logs found." />
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student Name</th>
                      <th>Shift Times</th>
                      <th>Hours</th>
                      <th>Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((l, idx) => (
                      <tr key={`${l.internshipId}-${l.date}-${idx}`}>
                        <td className="mono date-cell">{l.date}</td>
                        <td>
                          <strong>{l.student}</strong>
                          <span className="sub-id">{l.internshipId}</span>
                        </td>
                        <td className="mono">
                          {l.start} – {l.end}
                        </td>
                        <td className="mono">{l.hours.toFixed(1)}h</td>
                        <td>{l.task}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function StatTile({ label, value, unit, note, variant = "", dot, noteClass = "", stacked }) {
  return (
    <div className={`tile ${variant}`}>
      <div className="tile-label">
        <span>{label}</span>
        {dot && <i className="tile-dot" />}
      </div>
      <div className={`tile-value ${stacked ? "stacked" : ""}`}>
        <strong>{value}</strong>
        <em>{unit}</em>
      </div>
      <small className={noteClass}>{note}</small>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}

export default App;
