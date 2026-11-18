/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm({ role }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const isStudent = role === "student";

      const url = isStudent
        ? "http://localhost:5000/api/students/login"
        : "http://localhost:5000/api/admin/login";

      const response = await axios.post(url, {
        loginId: form.loginId.trim(),
        password: form.password,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error("Login successful but token was not received.");
      }

      if (isStudent) {
        const student = response.data.student || response.data.user;

        if (!student) {
          throw new Error("Student information was not received.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("studentToken", token);
        localStorage.setItem("student", JSON.stringify(student));
        localStorage.setItem(
          "studentId",
          student.id || student._id || ""
        );
        localStorage.setItem("userRole", "student");

        navigate("/student-dashboard");
      } else {
        const user = response.data.user;

        if (!user || user.role !== "admin") {
          throw new Error("Invalid admin login response.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(user));
        localStorage.setItem("userRole", "admin");

        console.log("Admin login successful.");
        console.log("Admin token saved:", Boolean(localStorage.getItem("token")));

        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{role === "admin" ? "Admin" : "Student"} Login</h2>

        <input
          name="loginId"
          type="text"
          placeholder="Login ID"
          value={form.loginId}
          onChange={handleChange}
          required
        />

        <div style={{ position: "relative", width: "100%" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
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

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { resetStudentPassword } from "../utils/db";

export default function LoginForm({ role }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    loginId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [isForgot, setIsForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!newPassword) {
      setError("Please create a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      let resetDone = false;

      try {
        const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
          email: forgotEmail.trim().toLowerCase(),
          newPassword,
          role,
        });
        if (response.data) resetDone = true;
      } catch (apiErr) {
        if (apiErr.response?.data?.message) {
          if (apiErr.response.status === 404 || apiErr.response.status === 400) {
            throw new Error(apiErr.response.data.message);
          }
        }
      }

      if (role === "student") {
        const localResult = resetStudentPassword(forgotEmail, newPassword);
        if (localResult.ok) resetDone = true;
        else if (!resetDone) throw new Error("No student account found with this email address.");
      } else {
        localStorage.setItem("admin_custom_password", newPassword);
        resetDone = true;
      }

      setSuccess("Password updated successfully! Redirecting to login...");
      setForm((prev) => ({
        ...prev,
        password: newPassword,
        email: role === "student" ? forgotEmail : prev.email,
        loginId: role === "admin" ? forgotEmail : prev.loginId,
      }));

      setTimeout(() => {
        setIsForgot(false);
        setSuccess("");
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const isStudent = role === "student";

      const url = isStudent
        ? "http://localhost:5000/api/students/login"
        : "http://localhost:5000/api/admin/login";

      const payload = isStudent
        ? {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }
        : {
            loginId: form.loginId.trim(),
            password: form.password,
          };

      const response = await axios.post(url, payload);

      const token = response.data?.token;

      if (!token) {
        throw new Error("Login successful but token was not received.");
      }

      if (isStudent) {
        const student = response.data.student || response.data.user;

        if (!student) {
          throw new Error("Student information was not received.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("studentToken", token);
        localStorage.setItem("student", JSON.stringify(student));
        localStorage.setItem(
          "studentId",
          student.id || student._id || ""
        );
        localStorage.setItem("userRole", "student");

        navigate("/student-dashboard");
      } else {
        const user = response.data.user;

        if (!user || user.role !== "admin") {
          throw new Error("Invalid admin login response.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(user));
        localStorage.setItem("userRole", "admin");

        console.log("Admin login successful.");
        console.log(
          "Admin token saved:",
          Boolean(localStorage.getItem("token"))
        );

        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isForgot) {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleResetPassword}>
          <h2>Reset {role === "admin" ? "Admin" : "Student"} Password</h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "-6px 0 16px" }}>
            Enter your registered email and create a new password.
          </p>

          <input
            type={role === "admin" ? "text" : "email"}
            placeholder={role === "admin" ? "Admin Login ID / Email" : "Registered Email Address"}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />

          <div style={{ position: "relative", width: "100%", marginTop: "12px" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Create a new password (min. 6 chars)"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              title={showNewPassword ? "Hide password" : "Show password"}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
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
                padding: "4px",
              }}
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div style={{ position: "relative", width: "100%", marginTop: "12px" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password for confirmation"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              title={showConfirmPassword ? "Hide password" : "Show password"}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
                padding: "4px",
              }}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p style={{ color: "#dc2626", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", marginTop: "12px" }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "#16a34a", background: "#f0fdf4", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", marginTop: "12px" }}>
              {success}
            </p>
          )}

          <button type="submit" disabled={loading} style={{ marginTop: "16px" }}>
            {loading ? "Updating Password..." : "Confirm & Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsForgot(false);
              setError("");
              setSuccess("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "14px",
              display: "block",
              width: "100%",
              textAlign: "center",
            }}
          >
            ← Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{role === "admin" ? "Admin" : "Student"} Login</h2>

        {role === "student" ? (
          <input
            name="email"
            type="email"
            placeholder="Registered Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        ) : (
          <input
            name="loginId"
            type="text"
            placeholder="Admin Login ID"
            value={form.loginId}
            onChange={handleChange}
            required
          />
        )}

        <div style={{ position: "relative", width: "100%" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
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

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setForgotEmail(role === "student" ? form.email : form.loginId);
              setIsForgot(true);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "2px 0",
            }}
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
