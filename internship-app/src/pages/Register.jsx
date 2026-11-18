import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, CheckCircle2, Copy, Eye, EyeOff } from "lucide-react";
import { registerStudent } from "../utils/db";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    password: "",
    role: "",
    university: "",
    termStart: "",
    termEnd: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(null); // register hole student data
  const [copied, setCopied] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.termEnd <= form.termStart) {
      alert("Term end date must be after start date.");
      return;
    }
    const student = registerStudent(form);
    setRegistered(student);
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(registered.id);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ===== Success screen ===== */
  if (registered) {
    return (
      <div className="reg-page">
        <div className="reg-card reg-success">
          <div className="reg-success-icon">
            <CheckCircle2 size={30} />
          </div>
          <h2>Registration Successful!</h2>
          <p>Welcome, <b>{registered.name}</b>. Please save your Student ID, you need it to login.</p>

          <div className="reg-id-box">
            <span>{registered.id}</span>
            <button type="button" onClick={copyId}>
              <Copy size={13} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <button className="reg-btn" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /* ===== Register form ===== */
  return (
    <div className="reg-page">
      <form className="reg-card" onSubmit={handleSubmit}>
        <div className="reg-head">
          <div className="reg-icon"><UserPlus size={20} /></div>
          <h2>Student Registration</h2>
          <p>Create your intern account to start logging work.</p>
        </div>

        <label>
          Full Name *
          <input name="name" placeholder="e.g. Rohan Sharma" value={form.name} onChange={change} required />
        </label>

        <label>
          Password *
          <div style={{ position: "relative", width: "100%" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={change}
              required
              minLength={6}
              style={{ width: "100%", paddingRight: "38px", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "10px",
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
        </label>

        <label>
          Domain *
          <input name="role" placeholder="e.g. Web Development" value={form.role} onChange={change} required />
        </label>

        <label>
          University / Institution *
          <input name="university" placeholder="e.g. Jadavpur University" value={form.university} onChange={change} required />
        </label>

        <div className="reg-row">
          <label>
            Internship Start *
            <input name="termStart" type="date" value={form.termStart} onChange={change} required />
          </label>
          <label>
            Internship End *
            <input name="termEnd" type="date" value={form.termEnd} onChange={change} required />
          </label>
        </div>

        <button type="submit" className="reg-btn">Register</button>

        <p className="reg-foot">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
