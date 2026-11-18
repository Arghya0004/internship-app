import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/certificates";
const LOGIN_API = "http://localhost:5000/api/auth/student-login";

const css = `
.cp-wrap{max-width:1000px;margin:0 auto;padding:40px 16px 60px;font-family:Inter,system-ui,sans-serif;color:#0f172a}
.cp-center{text-align:center}
.cp-badge{display:inline-block;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700}
.cp-title{font-size:34px;font-weight:800;margin:18px auto 10px;max-width:640px;line-height:1.2}
.cp-sub{color:#64748b;max-width:620px;margin:0 auto 24px;font-size:15px}
.cp-tabs{display:inline-flex;background:#eef1f6;border-radius:10px;padding:5px;margin-bottom:28px}
.cp-tab{border:0;background:transparent;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer}
.cp-tab.active{background:#fff;color:#0f172a;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.cp-card{background:#fff;border:1px solid #e5e9f0;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(15,23,42,.05);margin-bottom:20px}
.cp-narrow{max-width:420px;margin:0 auto 20px}
.cp-icon{width:52px;height:52px;border-radius:14px;background:#e8efff;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:22px}
.cp-icon.gold{background:#fef3c7}
.cp-label{display:block;font-size:11px;font-weight:700;color:#475569;letter-spacing:.05em;margin:14px 0 6px;text-align:left}
.cp-input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;font-size:14px}
.cp-btn{border:0;border-radius:10px;padding:13px 20px;font-weight:700;font-size:14px;cursor:pointer;background:#1d4ed8;color:#fff}
.cp-btn.full{width:100%;margin-top:18px}
.cp-btn.green{background:#047857;padding:9px 16px;font-size:12px}
.cp-btn.outline{background:#fff;color:#0f172a;border:1px solid #cbd5e1}
.cp-btn:disabled{opacity:.6;cursor:not-allowed}
.cp-err{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;border-radius:10px;padding:10px 12px;font-size:13px;margin-top:14px}
.cp-info{background:#f8fafc;border:1px solid #e5e9f0;border-radius:12px;padding:14px 16px;text-align:left;font-size:13px;margin:18px auto;max-width:380px}
.cp-info li{list-style:none;margin:6px 0;color:#334155}
.cp-info li:before{content:"✓ ";color:#059669;font-weight:700}
.cp-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.cp-head h3{margin:0;font-size:20px}
.cp-pill{display:inline-block;background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3;font-family:monospace;font-size:12px;padding:3px 8px;border-radius:6px;margin-left:8px}
.cp-banner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#ecfdf5;border:1px solid #6ee7b7;border-radius:14px;padding:14px 18px;margin-bottom:20px}
.cp-banner b{display:block;font-size:14px}
.cp-banner small{color:#047857;font-size:12px}
.cert-outer{border:3px solid #ea8a3b;border-radius:6px;padding:8px;background:#fff;max-width:760px;margin:0 auto}
.cert-inner{border:1.5px solid #f2b887;padding:36px 40px 26px;text-align:center;background:linear-gradient(#fffdf8,#fff8ee);font-family:"Playfair Display",Georgia,serif}
.cert-top{font-family:Inter,sans-serif;font-size:10px;letter-spacing:.2em;color:#92400e;font-weight:700}
.cert-h{font-size:42px;font-weight:800;line-height:1.05;margin:10px 0 8px;letter-spacing:.03em;color:#0b1730}
.cert-line{height:2px;width:90px;margin:0 auto 14px;background:#ea8a3b}
.cert-it{font-style:italic;font-size:13px;color:#64748b}
.cert-name{display:inline-block;font-size:34px;font-weight:700;margin:8px 0;border-bottom:2px solid #ea8a3b;padding:0 10px 4px}
.cert-body{font-family:Inter,sans-serif;font-size:14px;line-height:1.7;color:#334155;max-width:520px;margin:12px auto}
.cert-grade{display:inline-block;background:#fef9c3;border:1px solid #facc15;border-radius:999px;padding:6px 14px;font-family:Inter,sans-serif;font-size:12px;font-weight:600;margin:10px 0 24px}
.cert-sign{display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;font-family:Inter,sans-serif}
.cert-sign > div{width:30%;text-align:center}
.cert-sign .sg{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-size:20px;font-weight:700;border-bottom:1.5px solid #94a3b8;padding-bottom:4px;margin-bottom:6px}
.cert-sign small{font-size:11px;color:#64748b;display:block}
.cert-seal{width:70px;height:70px;border-radius:50%;background:radial-gradient(#fcd34d,#d97706);margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;border:3px solid #fde68a}
.cert-foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-top:22px;padding-top:12px;border-top:1px dashed #f2b887;font-family:monospace;font-size:10px;color:#475569}
@media print{
  body *{visibility:hidden}
  .cert-print,.cert-print *{visibility:visible}
  .cert-print{position:absolute;left:0;top:0;width:100%}
  @page{size:landscape;margin:10mm}
}
`;

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

export default function CertificatePortal() {
  const [tab, setTab] = useState("portal");

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [verifyNo, setVerifyNo] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  const auth = (t) => ({ headers: { Authorization: `Bearer ${t}` } });

  async function loadStatus(t) {
    const res = await axios.get(`${API}/status`, auth(t));
    setData(res.data);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(LOGIN_API, { loginId, password });
      setToken(res.data.token);
      await loadStatus(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check backend.");
    } finally {
      setLoading(false);
    }
  }

  async function submitRequest() {
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/request`, {}, auth(token));
      await loadStatus(token);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setData(null);
    setPassword("");
    setError("");
  }

  async function handleVerify(e) {
    e.preventDefault();
    setVerifyResult(null);
    setVerifyError("");
    try {
      const res = await axios.get(
        `${API}/verify/${encodeURIComponent(verifyNo.trim())}`
      );
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyError(err.response?.data?.message || "Certificate not found.");
    }
  }

  const cert = data?.certificate;
  const status = cert?.status;

  return (
    <div className="cp-wrap">
      <style>{css}</style>

      <div className="cp-center">
        <span className="cp-badge">🏅 Official Endorsement Portal</span>
        <h1 className="cp-title">Internship Certificate Generator &amp; Verifier</h1>
        <p className="cp-sub">
          Authenticate with your Student ID and Password to request an official
          certificate, track administrative endorsement, and view your
          verifiable credential.
        </p>

        <div className="cp-tabs">
          <button
            className={`cp-tab ${tab === "portal" ? "active" : ""}`}
            onClick={() => setTab("portal")}
          >
            Certificate Portal
          </button>
          <button
            className={`cp-tab ${tab === "verify" ? "active" : ""}`}
            onClick={() => setTab("verify")}
          >
            Public Credential Check
          </button>
        </div>
      </div>

      {/* PUBLIC VERIFY */}
      {tab === "verify" && (
        <div className="cp-card cp-narrow cp-center">
          <div className="cp-icon">🔍</div>
          <h3 style={{ margin: 0 }}>Verify a Certificate</h3>
          <form onSubmit={handleVerify}>
            <label className="cp-label">CERTIFICATE ID</label>
            <input
              className="cp-input"
              placeholder="e.g. CERT-1731700000000"
              value={verifyNo}
              onChange={(e) => setVerifyNo(e.target.value)}
              required
            />
            <button className="cp-btn full">Verify Certificate</button>
          </form>

          {verifyError && <div className="cp-err">{verifyError}</div>}

          {verifyResult && (
            <div className="cp-banner" style={{ marginTop: 18, textAlign: "left" }}>
              <div>
                <b>✔ Valid Certificate</b>
                <small>
                  {verifyResult.name} ({verifyResult.loginId}) · {verifyResult.grade}
                  <br />
                  Issued {fmtDate(verifyResult.approvedAt)} · Endorsed by{" "}
                  {verifyResult.endorsedBy}
                </small>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOGIN */}
      {tab === "portal" && !data && (
        <div className="cp-card cp-narrow cp-center">
          <div className="cp-icon">🔒</div>
          <h3 style={{ margin: 0 }}>Authenticate Student ID</h3>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            Please enter your unique Student Login ID and Password to view or
            submit your certificate request.
          </p>

          <form onSubmit={handleLogin}>
            <label className="cp-label">STUDENT LOGIN ID</label>
            <input
              className="cp-input"
              placeholder="e.g. IT5DCC68"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />

            <label className="cp-label">PASSWORD</label>
            <input
              className="cp-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="cp-err">{error}</div>}

            <button className="cp-btn full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Credentials & Enter →"}
            </button>
          </form>
        </div>
      )}

      {/* LOGGED IN */}
      {tab === "portal" && data && (
        <>
          <div className="cp-card cp-head" style={{ padding: "18px 24px" }}>
            <div>
              <h3>
                {data.name}
                <span className="cp-pill">{data.loginId}</span>
              </h3>
              <small style={{ color: "#64748b" }}>Internship Program</small>
            </div>
            <button className="cp-btn outline" onClick={logout}>
              Logout
            </button>
          </div>

          {!data.courseCompleted && !cert && (
            <div className="cp-card cp-narrow cp-center">
              <div className="cp-icon gold">🏅</div>
              <h3 style={{ margin: 0 }}>Course Not Completed Yet</h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Your internship course has not been marked as completed by the
                administrator. You can request a certificate once it is
                completed.
              </p>
            </div>
          )}

          {data.courseCompleted && (!cert || status === "rejected") && (
            <div className="cp-card cp-center" style={{ maxWidth: 560, margin: "0 auto 20px" }}>
              <div className="cp-icon gold">🏅</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>
                Request Official Internship Certificate
              </h3>

              {status === "rejected" && (
                <div className="cp-err">
                  Your previous request needs revision. Please review your
                  records and submit again.
                </div>
              )}

              <p style={{ color: "#64748b", fontSize: 14 }}>
                When you submit this request, the administrator will review your
                timesheets and endorse your digital certificate.
              </p>

              <div className="cp-info">
                <b>Pre-Request Verification Checklist:</b>
                <ul style={{ padding: 0, margin: "8px 0 0" }}>
                  <li>All entry &amp; exit times logged accurately</li>
                  <li>Daily tasks and milestones manually recorded</li>
                  <li>Internship duration verified</li>
                </ul>
              </div>

              {error && <div className="cp-err">{error}</div>}

              <button
                className="cp-btn"
                style={{ marginTop: 16 }}
                onClick={submitRequest}
                disabled={loading}
              >
                {loading ? "Submitting..." : "✈ Submit Certificate Request to Admin"}
              </button>
            </div>
          )}

          {status === "pending" && (
            <div className="cp-card cp-narrow cp-center">
              <div className="cp-icon gold">⏳</div>
              <h3 style={{ margin: 0 }}>Awaiting Admin Endorsement</h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Your request was submitted on {fmtDate(cert.requestedAt)}. The
                administrator is reviewing it. Please check back later.
              </p>
              <button className="cp-btn outline" onClick={() => loadStatus(token)}>
                ↻ Refresh Status
              </button>
            </div>
          )}

          {status === "approved" && (
            <>
              <div className="cp-banner">
                <div>
                  <b>✔ Certificate Issued &amp; Verified</b>
                  <small>
                    Officially endorsed by {cert.endorsedBy} · Grade: {cert.grade}
                  </small>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="cp-btn outline"
                    style={{ padding: "9px 16px", fontSize: 12 }}
                    onClick={() => {
                      navigator.clipboard?.writeText(cert.certificateNo);
                      alert("Certificate ID copied: " + cert.certificateNo);
                    }}
                  >
                    Copy Cert ID
                  </button>
                  <button className="cp-btn green" onClick={() => window.print()}>
                    🖨 Print / Save PDF
                  </button>
                </div>
              </div>

              <div className="cert-print">
                <div className="cert-outer">
                  <div className="cert-inner">
                    <div className="cert-top">
                      OFFICIAL CERTIFICATION OF ACHIEVEMENT &amp; EXCELLENCE
                    </div>
                    <div className="cert-h">
                      CERTIFICATE OF
                      <br />
                      INTERNSHIP
                    </div>
                    <div className="cert-line" />

                    <div className="cert-it">This credential is duly conferred upon</div>
                    <div className="cert-name">{data.name}</div>

                    <div className="cert-body">
                      for having successfully completed the professional
                      practicum of the <b>Internship Program</b>, fulfilling all
                      requirements of daily work documentation and technical
                      reviews.
                    </div>

                    <div className="cert-grade">✔ Awarded Standing: {cert.grade}</div>

                    <div className="cert-sign">
                      <div>
                        <b style={{ fontSize: 12 }}>{cert.endorsedBy}</b>
                        <small>Endorsing Authority</small>
                      </div>

                      <div>
                        <div className="cert-seal">VERIFIED</div>
                        <small style={{ fontWeight: 700 }}>OFFICIAL VERIFIED SEAL</small>
                      </div>

                      <div>
                        <b style={{ fontSize: 12 }}>Program Director</b>
                        <small>Academic Verification Council</small>
                      </div>
                    </div>

                    <div className="cert-foot">
                      <span>Certificate ID: {cert.certificateNo}</span>
                      <span>Student ID: {data.loginId}</span>
                      <span>Issue Date: {fmtDate(cert.approvedAt)}</span>
                      <span>✔ Cryptographically Endorsed</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
