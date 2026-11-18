import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Eye, EyeOff } from "lucide-react";

const API = "http://localhost:5000/api/certificates";
const LOGIN_API = "http://localhost:5000/api/auth/student-login";

const css = `
.cg-wrap{max-width:1000px;margin:0 auto;padding:40px 16px 60px;font-family:Inter,system-ui,sans-serif;color:#0f172a}
.cg-center{text-align:center}
.cg-badge{display:inline-block;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700}
.cg-title{font-size:34px;font-weight:800;margin:18px auto 10px;max-width:640px;line-height:1.2}
.cg-sub{color:#64748b;max-width:640px;margin:0 auto 28px;font-size:15px}
.cg-card{background:#fff;border:1px solid #e5e9f0;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(15,23,42,.05);margin:0 auto 20px}
.cg-narrow{max-width:420px}
.cg-mid{max-width:560px}
.cg-icon{width:52px;height:52px;border-radius:14px;background:#e8efff;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:22px}
.cg-icon.gold{background:#fef3c7}
.cg-label{display:block;font-size:11px;font-weight:700;color:#475569;letter-spacing:.05em;margin:14px 0 6px;text-align:left}
.cg-input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;font-size:14px}
.cg-btn{border:0;border-radius:10px;padding:13px 20px;font-weight:700;font-size:14px;cursor:pointer;background:#1d4ed8;color:#fff}
.cg-btn.full{width:100%;margin-top:18px}
.cg-btn.green{background:#047857;padding:9px 16px;font-size:12px}
.cg-btn.blue{background:#1d4ed8;padding:9px 16px;font-size:12px}
.cg-btn.outline{background:#fff;color:#0f172a;border:1px solid #cbd5e1}
.cg-btn:disabled{opacity:.6;cursor:not-allowed}
.cg-err{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;border-radius:10px;padding:10px 12px;font-size:13px;margin-top:14px}
.cg-info{background:#f8fafc;border:1px solid #e5e9f0;border-radius:12px;padding:14px 16px;text-align:left;font-size:13px;margin:18px auto;max-width:380px}
.cg-info li{list-style:none;margin:6px 0;color:#334155}
.cg-info li:before{content:"✓ ";color:#059669;font-weight:700}
.cg-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:18px 24px}
.cg-head h3{margin:0;font-size:22px}
.cg-pill{display:inline-block;background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3;font-family:monospace;font-size:12px;padding:3px 8px;border-radius:6px;margin-left:8px;vertical-align:middle}
.cg-chip{font-size:12px;font-weight:700;padding:8px 14px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8}
.cg-chip.grey{background:#f8fafc;border-color:#e2e8f0;color:#64748b}
.cg-banner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#ecfdf5;border:1px solid #6ee7b7;border-radius:14px;padding:14px 18px;margin-bottom:20px}
.cg-banner b{display:block;font-size:14px}
.cg-banner small{color:#047857;font-size:12px}

/* PCS Global Certificate Template CSS */
.cert-outer {
  background: #fff;
  border-top: 6px solid #0284c7;
  border-radius: 4px;
  box-shadow: 0 4px 25px rgba(0,0,0,0.08);
  max-width: 780px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: #1e293b;
  position: relative;
  overflow: hidden;
}
.cert-inner {
  padding: 36px 40px 30px;
}
.cert-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #0284c7;
  padding-bottom: 14px;
  margin-bottom: 22px;
}
.cert-company-left {
  font-size: 11px;
  line-height: 1.6;
  color: #334155;
}
.cert-company-right {
  text-align: right;
}
.cert-logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #0284c7;
  letter-spacing: -0.5px;
}
.cert-logo-sub {
  font-size: 8px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 2px;
}
.cert-date-row {
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 18px;
  color: #0f172a;
}
.cert-student-info {
  font-size: 13.5px;
  line-height: 1.8;
  margin-bottom: 22px;
  color: #0f172a;
}
.cert-student-info b {
  color: #020617;
}
.cert-title-main {
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.05em;
  margin: 24px 0;
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 2px;
}
.cert-para {
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
  margin-bottom: 16px;
  text-align: justify;
}
.cert-project-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 14px 18px;
  margin: 18px 0;
  font-size: 13px;
  line-height: 1.6;
}
.cert-project-box b {
  color: #0f172a;
}
.cert-footer-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 35px;
  padding-top: 15px;
}
.cert-qr-area {
  text-align: center;
}
.cert-qr-img {
  width: 75px;
  height: 75px;
  border: 1px solid #cbd5e1;
  padding: 3px;
  background: #fff;
  display: block;
  margin: 0 auto 4px;
}
.cert-qr-label {
  font-size: 10px;
  color: #64748b;
  font-weight: 700;
}
.cert-id-text {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}
.cert-sig-area {
  text-align: right;
}
.cert-sig-line {
  font-family: "Brush Script MT", cursive, serif;
  font-size: 24px;
  color: #1e3a8a;
  margin-bottom: 2px;
}
.cert-sig-name {
  font-weight: 700;
  font-size: 13px;
  color: #0f172a;
}
.cert-sig-title {
  font-size: 11px;
  color: #64748b;
}
.cert-company-footer {
  margin-top: 28px;
  border-top: 2px solid #0284c7;
  padding-top: 10px;
  text-align: center;
}
.cert-foot-title {
  font-size: 13px;
  font-weight: 800;
  color: #0284c7;
  margin-bottom: 4px;
}
.cert-foot-addr {
  font-size: 9.5px;
  color: #475569;
  line-height: 1.5;
}
.cert-foot-branches {
  font-size: 9px;
  color: #0284c7;
  margin-top: 4px;
  font-weight: 700;
}

@media print{
  body *{visibility:hidden}
  .cert-print,.cert-print *{visibility:visible}
  .cert-print{position:absolute;left:0;top:0;width:100%}
  @page{size:portrait;margin:10mm}
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

export default function CertificateGenerator() {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const certRef = useRef(null);

  const auth = (t) => ({ headers: { Authorization: `Bearer ${t}` } });

  async function loadStatus(t) {
    const res = await axios.get(`${API}/status`, auth(t));
    setData(res.data);
  }

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      setChecking(false);
      return;
    }
    setToken(t);
    loadStatus(t)
      .catch(() => setData(null))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(LOGIN_API, { loginId, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
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

  async function downloadPDF() {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const ratio = Math.min(
        (pageW - margin * 2) / canvas.width,
        (pageH - margin * 2) / canvas.height
      );
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;

      pdf.addImage(imgData, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      pdf.save(`Certificate-${data?.loginId || "internship"}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const cert = data?.certificate;
  const status = cert?.status;

  // Dynamic values with fallback if backend properties differ
  const studentRoll = data?.rollNo || data?.roll || data?.loginId || "—";
  const studentCourse = data?.course || data?.program || data?.degree || "B.Tech";
  const studentCategory = data?.courseCategory || data?.branch || data?.domain || cert?.domain || "Electronics & Communication (ECE)";
  const studentCollege = data?.college || data?.institution || "MAKAUT (WBUT)";

  return (
    <div className="cg-wrap">
      <style>{css}</style>

      <div className="cg-center">
        <span className="cg-badge">🏅 Official Endorsement Portal</span>
        <h1 className="cg-title">Internship Certificate Generator &amp; Verifier</h1>
        <p className="cg-sub">
          Authenticate with your Student ID and Password to request an official
          certificate, track administrative endorsement, and view your
          verifiable credential.
        </p>
      </div>

      {checking && (
        <div className="cg-card cg-narrow cg-center">Loading...</div>
      )}

      {!checking && !data && (
        <div className="cg-card cg-narrow cg-center">
          <div className="cg-icon">🔒</div>
          <h3 style={{ margin: 0 }}>Authenticate Student ID</h3>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            Please enter your unique Student Login ID and Password to view or
            submit your certificate request.
          </p>

          <form onSubmit={handleLogin}>
            <label className="cg-label">STUDENT LOGIN ID</label>
            <input
              className="cg-input"
              placeholder="e.g. IT5DCC68"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />

            <label className="cg-label">PASSWORD</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                className="cg-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <div className="cg-err">{error}</div>}

            <button className="cg-btn full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Credentials & Enter →"}
            </button>
          </form>
        </div>
      )}

      {!checking && data && (
        <>
          <div className="cg-card cg-head">
            <div>
              <h3>
                {data.name}
                <span className="cg-pill">{data.loginId}</span>
              </h3>
              <small style={{ color: "#64748b", fontWeight: 600 }}>
                Program: Internship Program
              </small>
            </div>
            <span className={`cg-chip ${data.courseCompleted ? "" : "grey"}`}>
              {data.courseCompleted ? "Course Completed" : "Course In Progress"}
            </span>
          </div>

          {!data.courseCompleted && !cert && (
            <div className="cg-card cg-mid cg-center">
              <div className="cg-icon gold">🏅</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>
                Course Not Completed Yet
              </h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Your internship course has not been marked as completed by the
                administrator. You can request a certificate once it is
                completed.
              </p>
            </div>
          )}

          {data.courseCompleted && (!cert || status === "rejected") && (
            <div className="cg-card cg-mid cg-center">
              <div className="cg-icon gold">🏅</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>
                Request Official Internship Certificate
              </h3>

              {status === "rejected" && (
                <div className="cg-err">
                  Your previous request needs revision. Please review your
                  records and submit again.
                </div>
              )}

              <p style={{ color: "#64748b", fontSize: 14 }}>
                When you submit this request, the administrator will review your
                timesheets and endorse your digital certificate.
              </p>

              <div className="cg-info">
                <b>Pre-Request Verification Checklist:</b>
                <ul style={{ padding: 0, margin: "8px 0 0" }}>
                  <li>All entry &amp; exit times logged accurately</li>
                  <li>Daily tasks and milestones manually recorded</li>
                  <li>Internship duration verified</li>
                </ul>
              </div>

              {error && <div className="cg-err">{error}</div>}

              <button
                className="cg-btn"
                style={{ marginTop: 16 }}
                onClick={submitRequest}
                disabled={loading}
              >
                {loading ? "Submitting..." : "✈ Submit Certificate Request to Admin"}
              </button>
            </div>
          )}

          {status === "pending" && (
            <div className="cg-card cg-mid cg-center">
              <div className="cg-icon gold">⏳</div>
              <h3 style={{ margin: 0 }}>Awaiting Admin Endorsement</h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Your request was submitted on {fmtDate(cert.requestedAt)}. The
                administrator is reviewing it. Please check back later.
              </p>
              <button className="cg-btn outline" onClick={() => loadStatus(token)}>
                ↻ Refresh Status
              </button>
            </div>
          )}

          {status === "approved" && (
            <>
              <div className="cg-banner">
                <div>
                  <b>✔ Certificate Issued &amp; Verified</b>
                  <small>
                    Officially endorsed by {cert.endorsedBy} · Standing: {cert.grade}
                  </small>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    className="cg-btn outline"
                    style={{ padding: "9px 16px", fontSize: 12 }}
                    onClick={() => {
                      navigator.clipboard?.writeText(cert.certificateNo);
                      alert("Certificate ID copied: " + cert.certificateNo);
                    }}
                  >
                    Copy Cert ID
                  </button>
                  <button className="cg-btn green" onClick={() => window.print()}>
                    🖨 Print
                  </button>
                  <button
                    className="cg-btn blue"
                    onClick={downloadPDF}
                    disabled={downloading}
                  >
                    {downloading ? "Preparing PDF..." : "⬇ Download PDF"}
                  </button>
                </div>
              </div>

              <div className="cert-print">
                <div className="cert-outer" ref={certRef}>
                  <div className="cert-inner">
                    {/* Top Header */}
                    <div className="cert-header-top">
                      <div className="cert-company-left">
                        <div>www.pcsgpl.com / www.pcsglobal.in</div>
                        <div>Email: hr@pcsglobal.in</div>
                        <div>GST No : 19AAHCP4199F1ZZ</div>
                      </div>
                      <div className="cert-company-right">
                        <div className="cert-logo-text">✔✔ PCS Global</div>
                        <div className="cert-logo-sub">WEB DEVELOPMENT . CONSULTING . IT SECURITY</div>
                        <div style={{ fontSize: "8px", color: "#64748b", marginTop: "2px" }}>An ISO 9001 : 2008 Certified Company</div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="cert-date-row">
                      Date: {fmtDate(cert.approvedAt) || "1st August 2026"}
                    </div>

                    {/* Student Info - Fully Dynamic with multiple fallback checks */}
                    <div className="cert-student-info">
                      <div><b>Name:</b> {data.name}</div>
                      <div><b>Id No:</b> {studentRoll}</div>
                      <div><b>Course:</b> {studentCourse}</div>
                      <div><b>Course Category:</b> {studentCategory}</div>
                      <div><b>College:</b> {studentCollege}</div>
                    </div>

                    {/* Title */}
                    <div className="cert-title-main">CERTIFICATE OF INTERNSHIP</div>

                    {/* Body Paragraph 1 */}
                    <div className="cert-para">
                      This is to certify that <b>{data.name}</b>, a student of <b>{studentCourse} ({studentCategory})</b> from <b>{studentCollege}</b>, has successfully completed his industrial training with project at PCS Global (Perennation Computer Solutions Global Pvt. Ltd.) from {fmtDate(cert.startDate || "2026-06-01")} to {fmtDate(cert.endDate || "2026-08-01")}.
                    </div>

                    {/* Body Paragraph 2 */}
                    <div className="cert-para">
                      During the training period, he underwent rigorous and structured training with a focus on <b>{cert.projectTitle || "Telecom Customer Churn Analysis & Prediction Using Machine Learning"}</b>, covering multiple concepts, practical implementations, and real-world use cases. He successfully completed all assigned tasks and demonstrated strong technical understanding and problem-solving skills.
                    </div>

                    {/* Project Details Box */}
                    <div className="cert-project-box">
                      <div><b>Project Title:</b> {cert.projectTitle || "Telecom Customer Churn Analysis & Prediction Using Machine Learning"}</div>
                      <div style={{ margin: "6px 0" }}><b>Project Description:</b> {cert.projectDescription || "Machine learning project predicting telecom customer churn using SMOTE-ENN and models like Random Forest, Gradient Boosting, and XGBoost."}</div>
                      <div><b>Technologies Used:</b> {cert.technologies || "Data Science & Artificial Intelligence"}</div>
                    </div>

                    {/* Body Paragraph 3 */}
                    <div className="cert-para">
                      Throughout the training, <b>{data.name}</b> was found to be sincere, hardworking, disciplined, and punctual. His conduct and performance during the training period were commendable.
                    </div>

                    {/* Body Paragraph 4 */}
                    <div className="cert-para">
                      We wish his every success in future academic and professional endeavors.
                    </div>

                    {/* Bottom Section: ID & QR on left, Signature on right */}
                    <div className="cert-footer-section">
                      <div>
                        <div className="cert-id-text">Certificate ID: {cert.certificateNo}</div>
                        <div className="cert-qr-area">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${cert.certificateNo}`}
                            alt="Scan to Verify"
                            className="cert-qr-img"
                          />
                          <div className="cert-qr-label">Scan to Verify</div>
                        </div>
                      </div>

                      <div className="cert-sig-area">
                        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Yours Sincerely,</div>
                        <div style={{ fontSize: "10px", color: "#334155", fontWeight: 700, marginBottom: "8px" }}>For Perennation Computer Solutions Global Pvt Ltd</div>
                        <div className="cert-sig-line">Alalder</div>
                        <div className="cert-sig-name">{cert.endorsedBy || "Alok Halder"}</div>
                        <div className="cert-sig-title">Chief Executive Officer (CEO)</div>
                      </div>
                    </div>

                    {/* Company Footer */}
                    <div className="cert-company-footer">
                      <div className="cert-foot-title">Perennation Computer Solutions GLobal Private Limited</div>
                      <div className="cert-foot-addr">
                        <b>Registered Office :</b> 145E, Swinhoe Lane, Kolkata - 700042 &nbsp;|&nbsp; <b>Head Office :</b> 55/65, Chikku Lakshmaiah Road, Adugodi, Bengaluru, Karnataka - 560029
                      </div>
                      <div className="cert-foot-branches">
                        * Kolkata &nbsp;&nbsp; * Noida &nbsp;&nbsp; * Pune/Mumbai &nbsp;&nbsp; * Indore &nbsp;&nbsp; * Guwahati
                      </div>
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