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

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

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

export default function LoginForm({ role }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
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

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

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
