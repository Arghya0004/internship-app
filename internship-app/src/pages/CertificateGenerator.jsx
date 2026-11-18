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
.cg-embedded{max-width:100%;padding:10px 0 40px}
.cg-embedded-header{margin-bottom:24px}
.cg-embedded-header h2{font-size:24px;font-weight:800;color:#111827;margin:10px 0 6px}
.cg-embedded-header p{color:#64748b;font-size:14px;margin:0}

/* Certificate Request Details Modal */
.cg-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: cgFadeIn 0.2s ease;
}
@keyframes cgFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.cg-modal-box {
  background: #ffffff;
  border-radius: 18px;
  max-width: 620px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  border: 1px solid #e2e8f0;
  animation: cgPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
@keyframes cgPopIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.cg-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
}
.cg-modal-head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}
.cg-modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.cg-modal-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.cg-modal-form {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}
.cg-modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cg-modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 580px) {
  .cg-modal-grid {
    grid-template-columns: 1fr;
  }
}
.cg-modal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}
.cg-modal-field span {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}
.cg-modal-field input,
.cg-modal-field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
  color: #0f172a;
  font-family: inherit;
  transition: all 0.15s ease;
}
.cg-modal-field input:focus,
.cg-modal-field textarea:focus {
  border-color: #2563eb;
  background: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.cg-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

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

export default function CertificateGenerator({ embedded = false }) {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    name: "",
    rollNo: "",
    course: "",
    courseCategory: "",
    college: "",
    projectTitle: "",
    projectDescription: "",
    technologyUsed: "",
  });

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

  // Synchronize student certificate details into form
  useEffect(() => {
    if (data) {
      const c = data.certificate;
      setDetailsForm((prev) => ({
        name: c?.name || prev.name || data.name || "",
        rollNo: c?.rollNo || prev.rollNo || data.loginId || "",
        course: c?.course || prev.course || "B.Tech",
        courseCategory:
          c?.courseCategory ||
          prev.courseCategory ||
          "Electronics & Communication (ECE)",
        college: c?.college || prev.college || "MAKAUT (WBUT)",
        projectTitle:
          c?.projectTitle ||
          prev.projectTitle ||
          "Telecom Customer Churn Analysis & Prediction Using Machine Learning",
        projectDescription:
          c?.projectDescription ||
          prev.projectDescription ||
          "Machine learning project predicting telecom customer churn using SMOTE-ENN and models like Random Forest, Gradient Boosting, and XGBoost.",
        technologyUsed:
          c?.technologyUsed ||
          prev.technologyUsed ||
          "Data Science & Artificial Intelligence",
      }));
    }
  }, [data]);

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

  async function submitRequest(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/request`, detailsForm, auth(token));
      setShowModal(false);
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

  function handlePrint() {
    if (!certRef.current) {
      window.print();
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const certHtml = certRef.current.outerHTML;

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <style>
            @page {
              size: portrait;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              font-family: Arial, sans-serif;
              color: #1e293b;
            }
            ${css}
          </style>
        </head>
        <body>
          ${certHtml}
        </body>
      </html>
    `);
    iframe.contentWindow.document.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }, 200);
  }

  const cert = data?.certificate;
  const status = cert?.status;

  // Dynamic values updated according to student's submitted details
  const studentName = cert?.name || detailsForm.name || data?.name || "Student";
  const studentRoll = cert?.rollNo || detailsForm.rollNo || data?.rollNo || data?.roll || data?.loginId || "—";
  const studentCourse = cert?.course || detailsForm.course || data?.course || data?.program || data?.degree || "B.Tech";
  const studentCategory = cert?.courseCategory || detailsForm.courseCategory || data?.courseCategory || data?.branch || data?.domain || cert?.domain || "Electronics & Communication (ECE)";
  const studentCollege = cert?.college || detailsForm.college || data?.college || data?.institution || "MAKAUT (WBUT)";
  const projectTitle = cert?.projectTitle || detailsForm.projectTitle || "Telecom Customer Churn Analysis & Prediction Using Machine Learning";
  const projectDescription = cert?.projectDescription || detailsForm.projectDescription || "Machine learning project predicting telecom customer churn using SMOTE-ENN and models like Random Forest, Gradient Boosting, and XGBoost.";
  const technologyUsed = cert?.technologyUsed || detailsForm.technologyUsed || cert?.technologies || "Data Science & Artificial Intelligence";

  return (
    <div className={`cg-wrap ${embedded ? "cg-embedded" : ""}`}>
      <style>{css}</style>

      {!embedded ? (
        <div className="cg-center">
          <span className="cg-badge">🏅 Official Endorsement Portal</span>
          <h1 className="cg-title">Internship Certificate Generator &amp; Verifier</h1>
          <p className="cg-sub">
            Authenticate with your Student ID and Password to request an official
            certificate, track administrative endorsement, and view your
            verifiable credential.
          </p>
        </div>
      ) : (
        <div className="cg-embedded-header">
          <span className="cg-badge">🏅 Official Endorsement Portal</span>
          <h2>Internship Certificate &amp; Verification</h2>
          <p>
            Request official certificate endorsement, track administrative approval, and view or download your verifiable credential.
          </p>
        </div>
      )}

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
                onClick={() => setShowModal(true)}
              >
                Fill Details to Request Certificate
              </button>
            </div>
          )}

          {/* ===================================================
              DIALOG / MODAL: FILL DETAILS TO REQUEST CERTIFICATE
          =================================================== */}
          {showModal && (
            <div className="cg-modal-backdrop" onClick={() => setShowModal(false)}>
              <div className="cg-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="cg-modal-head">
                  <div>
                    <h3>Certificate Request Details</h3>
                    <small style={{ color: "#64748b" }}>
                      Fill in your details for official certificate generation
                    </small>
                  </div>
                  <button
                    type="button"
                    className="cg-modal-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>

                <form className="cg-modal-form" onSubmit={submitRequest}>
                  <div className="cg-modal-body">
                    {error && <div className="cg-err">{error}</div>}

                    <div className="cg-modal-grid">
                      <label className="cg-modal-field">
                        <span>Name *</span>
                        <input
                          type="text"
                          placeholder="Name"
                          value={detailsForm.name}
                          onChange={(e) =>
                            setDetailsForm({ ...detailsForm, name: e.target.value })
                          }
                          required
                        />
                      </label>

                      <label className="cg-modal-field">
                        <span>Roll no. *</span>
                        <input
                          type="text"
                          placeholder="Roll no."
                          value={detailsForm.rollNo}
                          onChange={(e) =>
                            setDetailsForm({ ...detailsForm, rollNo: e.target.value })
                          }
                          required
                        />
                      </label>
                    </div>

                    <div className="cg-modal-grid">
                      <label className="cg-modal-field">
                        <span>Course *</span>
                        <input
                          type="text"
                          placeholder="Course"
                          value={detailsForm.course}
                          onChange={(e) =>
                            setDetailsForm({ ...detailsForm, course: e.target.value })
                          }
                          required
                        />
                      </label>

                      <label className="cg-modal-field">
                        <span>Course category *</span>
                        <input
                          type="text"
                          placeholder="Course category"
                          value={detailsForm.courseCategory}
                          onChange={(e) =>
                            setDetailsForm({
                              ...detailsForm,
                              courseCategory: e.target.value,
                            })
                          }
                          required
                        />
                      </label>
                    </div>

                    <label className="cg-modal-field">
                      <span>College *</span>
                      <input
                        type="text"
                        placeholder="College"
                        value={detailsForm.college}
                        onChange={(e) =>
                          setDetailsForm({ ...detailsForm, college: e.target.value })
                        }
                        required
                      />
                    </label>

                    <label className="cg-modal-field">
                      <span>Project title *</span>
                      <input
                        type="text"
                        placeholder="Project title"
                        value={detailsForm.projectTitle}
                        onChange={(e) =>
                          setDetailsForm({
                            ...detailsForm,
                            projectTitle: e.target.value,
                          })
                        }
                        required
                      />
                    </label>

                    <label className="cg-modal-field">
                      <span>Project description *</span>
                      <textarea
                        rows={3}
                        placeholder="Project description"
                        value={detailsForm.projectDescription}
                        onChange={(e) =>
                          setDetailsForm({
                            ...detailsForm,
                            projectDescription: e.target.value,
                          })
                        }
                        required
                      />
                    </label>

                    <label className="cg-modal-field">
                      <span>Technology used *</span>
                      <input
                        type="text"
                        placeholder="Technology used"
                        value={detailsForm.technologyUsed}
                        onChange={(e) =>
                          setDetailsForm({
                            ...detailsForm,
                            technologyUsed: e.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>

                  <div className="cg-modal-footer">
                    <button
                      type="button"
                      className="cg-btn outline"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cg-btn blue"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Certificate Request to Admin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="cg-card cg-mid cg-center">
              <div className="cg-icon gold">⏳</div>
              <h3 style={{ margin: "0 0 6px" }}>Awaiting Admin Endorsement</h3>
              <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 16px" }}>
                Your request was submitted on {fmtDate(cert?.requestedAt || new Date())}. The
                administrator is reviewing your submitted details in the Certificate Endorsements queue.
              </p>

              <div
                style={{
                  textAlign: "left",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 18,
                  fontSize: 13,
                }}
              >
                <b style={{ display: "block", marginBottom: 8, color: "#1e293b" }}>
                  📋 Submitted Details for Certificate:
                </b>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px" }}>
                  <div><span style={{ color: "#64748b" }}>Name:</span> <strong>{studentName}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Roll No:</span> <strong>{studentRoll}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Course:</span> <strong>{studentCourse}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Category:</span> <strong>{studentCategory}</strong></div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "#64748b" }}>College:</span> <strong>{studentCollege}</strong></div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "#64748b" }}>Project:</span> <strong>{projectTitle}</strong></div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "#64748b" }}>Technologies:</span> <strong>{technologyUsed}</strong></div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="cg-btn outline"
                  onClick={() => setShowModal(true)}
                >
                  ✏ Edit Submitted Details
                </button>
                <button
                  type="button"
                  className="cg-btn blue"
                  onClick={() => setPreviewTemplate(!previewTemplate)}
                >
                  {previewTemplate ? "Hide Certificate Preview" : "👁 Preview Certificate Template"}
                </button>
                <button
                  type="button"
                  className="cg-btn outline"
                  onClick={() => loadStatus(token)}
                >
                  ↻ Refresh Status
                </button>
              </div>
            </div>
          )}

          {(status === "approved" || (status === "pending" && previewTemplate)) && (
            <>
              {status === "approved" ? (
                <div className="cg-banner">
                  <div>
                    <b>✔ Certificate Issued &amp; Verified</b>
                    <small>
                      Officially endorsed by {cert?.endorsedBy || "Administrator"} · Standing: {cert?.grade || "Grade A"}
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className="cg-btn outline"
                      style={{ padding: "9px 16px", fontSize: 12 }}
                      onClick={() => {
                        navigator.clipboard?.writeText(cert?.certificateNo || "");
                        alert("Certificate ID copied: " + cert?.certificateNo);
                      }}
                    >
                      Copy Cert ID
                    </button>
                    <button className="cg-btn green" onClick={handlePrint}>
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
              ) : (
                <div
                  className="cg-banner"
                  style={{ background: "#eff6ff", borderColor: "#93c5fd" }}
                >
                  <div>
                    <b style={{ color: "#1d4ed8" }}>
                      👁 Certificate Template Preview (Pending Endorsement)
                    </b>
                    <small style={{ color: "#2563eb" }}>
                      This template is rendered with your submitted details and will be finalized upon admin approval.
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="cg-btn outline"
                      style={{ padding: "9px 16px", fontSize: 12 }}
                      onClick={() => setShowModal(true)}
                    >
                      ✏ Edit Details
                    </button>
                  </div>
                </div>
              )}

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
                      Date: {status === "approved" ? (fmtDate(cert?.approvedAt) || "1st August 2026") : `${fmtDate(new Date())} (Draft Preview)`}
                    </div>

                    {/* Student Info - Fully Dynamic with student details */}
                    <div className="cert-student-info">
                      <div><b>Name:</b> {studentName}</div>
                      <div><b>Id No:</b> {studentRoll}</div>
                      <div><b>Course:</b> {studentCourse}</div>
                      <div><b>Course Category:</b> {studentCategory}</div>
                      <div><b>College:</b> {studentCollege}</div>
                    </div>

                    {/* Title */}
                    <div className="cert-title-main">CERTIFICATE OF INTERNSHIP</div>

                    {/* Body Paragraph 1 */}
                    <div className="cert-para">
                      This is to certify that <b>{studentName}</b>, a student of <b>{studentCourse} ({studentCategory})</b> from <b>{studentCollege}</b>, has successfully completed his industrial training with project at PCS Global (Perennation Computer Solutions Global Pvt. Ltd.) from {fmtDate(cert?.startDate || cert?.requestedAt || "2026-06-01")} to {fmtDate(cert?.approvedAt || cert?.endDate || "2026-08-01")}.
                    </div>

                    {/* Body Paragraph 2 */}
                    <div className="cert-para">
                      During the training period, he underwent rigorous and structured training with a focus on <b>{projectTitle}</b>, covering multiple concepts, practical implementations, and real-world use cases. He successfully completed all assigned tasks and demonstrated strong technical understanding and problem-solving skills.
                    </div>

                    {/* Project Details Box */}
                    <div className="cert-project-box">
                      <div><b>Project Title:</b> {projectTitle}</div>
                      <div style={{ margin: "6px 0" }}><b>Project Description:</b> {projectDescription}</div>
                      <div><b>Technologies Used:</b> {technologyUsed}</div>
                    </div>

                    {/* Body Paragraph 3 */}
                    <div className="cert-para">
                      Throughout the training, <b>{studentName}</b> was found to be sincere, hardworking, disciplined, and punctual. His conduct and performance during the training period were commendable.
                    </div>

                    {/* Body Paragraph 4 */}
                    <div className="cert-para">
                      We wish his every success in future academic and professional endeavors.
                    </div>

                    {/* Bottom Section: ID & QR on left, Signature on right */}
                    <div className="cert-footer-section">
                      <div>
                        <div className="cert-id-text">
                          Certificate ID: {status === "approved" ? cert?.certificateNo : "PENDING ENDORSEMENT"}
                        </div>
                        <div className="cert-qr-area">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${cert?.certificateNo || "PENDING"}`}
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
                        <div className="cert-sig-name">{cert?.endorsedBy || "Alok Halder"}</div>
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