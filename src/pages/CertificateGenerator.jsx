import { useState } from "react";
import { Award, Lock, User, ArrowRight, Search, CheckCircle, XCircle, Printer, LogOut } from "lucide-react";
import "./CertificateGenerator.css";

// Demo data (pore backend/MongoDB theke ashbe)
const students = [
  {
    id: "INT-2026-8821",
    password: "password123",
    name: "Alex Morgan",
    track: "Full-Stack Software Engineering",
    hours: 480,
    grade: "A",
    status: "approved", // approved | none | pending
    certId: "CERT-INT-2026-8821",
    badge: "Ready to View",
    badgeType: "green",
  },
  {
    id: "INT-2026-4402",
    password: "password123",
    name: "Rohan Sharma",
    track: "Data Analytics & BI",
    hours: 120,
    grade: "-",
    status: "none",
    certId: "",
    badge: "Submit Request",
    badgeType: "blue",
  },
];

export default function CertificateGenerator() {
  const [tab, setTab] = useState("portal"); // portal | check

  // portal states
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // public check states
  const [checkId, setCheckId] = useState("");
  const [result, setResult] = useState(null); // null | student | "notfound"

  const handleLogin = (e) => {
    e.preventDefault();
    const found = students.find(
      (s) => s.id === loginId.trim() && s.password === password
    );
    if (found) {
      setUser(found);
      setError("");
    } else {
      setError("Invalid Student ID or Password");
    }
  };

  const logout = () => {
    setUser(null);
    setLoginId("");
    setPassword("");
  };

  const requestCertificate = () => {
    setUser({ ...user, status: "pending" });
  };

  const handleCheck = (e) => {
    e.preventDefault();
    const found = students.find(
      (s) => s.certId && s.certId.toLowerCase() === checkId.trim().toLowerCase()
    );
    setResult(found || "notfound");
  };

  return (
    <div className="cert-page">

      {/* ===== HEADER ===== */}
      <section className="cert-header cert-no-print">
        <span className="cert-badge">
          <Award size={13} /> Official Endorsement Portal
        </span>
        <h1>Internship Certificate Generator & Verifier</h1>
        <p>
          Authenticate with your Student ID and Password to request an official
          certificate, track administrative endorsement, and view your verifiable
          credential.
        </p>

        {/* TABS */}
        <div className="cert-tabs">
          <button
            className={tab === "portal" ? "active" : ""}
            onClick={() => setTab("portal")}
          >
            Certificate Portal
          </button>
          <button
            className={tab === "check" ? "active" : ""}
            onClick={() => setTab("check")}
          >
            Public Credential Check
          </button>
        </div>
      </section>

      {/* ===================== TAB 1: PORTAL ===================== */}
      {tab === "portal" && !user && (
        <div className="cert-card cert-no-print">
          <div className="cert-lock">
            <Lock size={22} />
          </div>
          <h2>Authenticate Student ID</h2>
          <p className="cert-sub">
            Please enter your unique Student Login ID and Password to view or
            submit your certificate request.
          </p>

          <form onSubmit={handleLogin}>
            <label>STUDENT LOGIN ID</label>
            <div className="cert-input">
              <User size={15} />
              <input
                type="text"
                placeholder="e.g. INT-2026-8821"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            <label>PASSWORD</label>
            <div className="cert-input">
              <Lock size={15} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="cert-error">{error}</p>}

            <button type="submit" className="cert-btn">
              Verify Credentials & Enter <ArrowRight size={15} />
            </button>
          </form>

          <div className="cert-samples">
            <small>SAMPLE LOGINS:</small>
            {students.map((s) => (
              <div
                className="cert-sample"
                key={s.id}
                onClick={() => {
                  setLoginId(s.id);
                  setPassword(s.password);
                  setError("");
                }}
              >
                <div>
                  <b>
                    {s.name} (
                    {s.status === "approved"
                      ? "Has Approved Certificate"
                      : "Can Request Certificate"}
                    )
                  </b>
                  <code>{s.id} · {s.password}</code>
                </div>
                <span className={`cert-tag ${s.badgeType}`}>{s.badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PORTAL: LOGGED IN VIEW ===== */}
      {tab === "portal" && user && (
        <div className="cert-dash">
          <div className="cert-dash-top cert-no-print">
            <div>
              <h2>Welcome, {user.name}</h2>
              <p>{user.id} · {user.track}</p>
            </div>
            <button className="cert-logout" onClick={logout}>
              <LogOut size={14} /> Logout
            </button>
          </div>

          <div className="cert-stats cert-no-print">
            <div><small>Total Hours</small><b>{user.hours} hrs</b></div>
            <div><small>Track</small><b>{user.track}</b></div>
            <div>
              <small>Status</small>
              <b className={`cert-status ${user.status}`}>
                {user.status === "approved" && "Approved"}
                {user.status === "pending" && "Pending Admin Approval"}
                {user.status === "none" && "Not Requested"}
              </b>
            </div>
          </div>

          {/* APPROVED: certificate */}
          {user.status === "approved" && (
            <>
              <div className="cert-paper">
                <Award size={40} className="cert-paper-icon" />
                <p className="cert-paper-small">CERTIFICATE OF COMPLETION</p>
                <h1>InternTrack</h1>
                <p>This is to certify that</p>
                <h2 className="cert-paper-name">{user.name}</h2>
                <p>
                  has successfully completed <b>{user.hours} hours</b> of internship
                  in <b>{user.track}</b> with performance grade <b>{user.grade}</b>.
                </p>
                <div className="cert-paper-id">Certificate ID: {user.certId}</div>
              </div>
              <button className="cert-btn cert-no-print" onClick={() => window.print()}>
                <Printer size={15} /> Print / Download Certificate
              </button>
            </>
          )}

          {/* NOT REQUESTED */}
          {user.status === "none" && (
            <div className="cert-box cert-no-print">
              <p>You haven't requested a certificate yet.</p>
              <button className="cert-btn" onClick={requestCertificate}>
                Request Certificate <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* PENDING */}
          {user.status === "pending" && (
            <div className="cert-box cert-no-print">
              <p>
                ✅ Your request has been submitted. Please wait for admin
                endorsement.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: PUBLIC CHECK ===================== */}
      {tab === "check" && (
        <div className="cert-card cert-no-print">
          <div className="cert-lock">
            <Search size={22} />
          </div>
          <h2>Verify a Certificate</h2>
          <p className="cert-sub">
            Employers and universities can enter a certificate ID to confirm
            authenticity.
          </p>

          <form onSubmit={handleCheck}>
            <label>CERTIFICATE ID</label>
            <div className="cert-input">
              <Search size={15} />
              <input
                type="text"
                placeholder="e.g. CERT-INT-2026-8821"
                value={checkId}
                onChange={(e) => setCheckId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="cert-btn">
              Verify Credential <ArrowRight size={15} />
            </button>
          </form>

          {result && result !== "notfound" && (
            <div className="cert-result ok">
              <CheckCircle size={18} />
              <div>
                <b>Valid Certificate</b>
                <p>{result.name} · {result.track}</p>
                <p>{result.hours} hours · Grade {result.grade}</p>
              </div>
            </div>
          )}
          {result === "notfound" && (
            <div className="cert-result bad">
              <XCircle size={18} />
              <div>
                <b>Not Found</b>
                <p>No certificate matches this ID.</p>
              </div>
            </div>
          )}

          <div className="cert-samples">
            <small>TRY SAMPLE:</small>
            <div className="cert-sample" onClick={() => setCheckId("CERT-INT-2026-8821")}>
              <code>CERT-INT-2026-8821 (Alex Morgan)</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}