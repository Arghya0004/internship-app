
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import {
//   KeyRound,
//   X,
//   User,
//   Sparkles,
//   ShieldCheck,
//   Lock,
//   Mail,
//   GraduationCap,
//   ArrowRight,
//   UserPlus,
// } from "lucide-react";

// import { useAuthModal } from "../context/authModalContext";
// import "./AuthModal.css";

// const API = "http://localhost:5000/api";

// const demoAdmin = {
//   email: "admin@interntrack.com",
//   password: "admin123",
//   name: "Eleanor Sterling",
// };

// export default function AuthModal() {
//   const { tab, setTab, closeAuth } = useAuthModal();
//   const navigate = useNavigate();

//   const [loginId, setLoginId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [reg, setReg] = useState({
//     name: "",
//     email: "",
//     university: "",
//     password: "",
//   });

//   useEffect(() => {
//     setLoginId("");
//     setPassword("");
//     setError("");
//     setSuccess("");
//   }, [tab]);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") closeAuth();
//     };

//     document.addEventListener("keydown", onKey);

//     return () => document.removeEventListener("keydown", onKey);
//   }, [closeAuth]);

//   useEffect(() => {
//     document.body.style.overflow = tab ? "hidden" : "";

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [tab]);

//   if (!tab) return null;

//   // ================= STUDENT LOGIN =================
//   const handleStudentLogin = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${API}/auth/student-login`,
//         {
//           loginId: loginId.trim(),
//           password,
//         }
//       );

//       const { token, user } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("student", JSON.stringify(user));
//       localStorage.setItem("studentId", user.id);

//       localStorage.setItem(
//         "currentUser",
//         JSON.stringify({
//           id: user.id,
//           name: user.name,
//           role: "student",
//         })
//       );

//       closeAuth();
//       navigate("/student-dashboard");
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Login failed. Please check your Login ID and Password."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= ADMIN LOGIN =================
//   const handleAdminLogin = async (e) => {
//   e.preventDefault();
//   setError("");
//   setLoading(true);

//   try {
//     const { data } = await axios.post(`${API}/admin/login`, {
//       loginId: loginId.trim(),
//       password,
//     });

//     if (!data.token || data.user?.role !== "admin") {
//       throw new Error("The server did not return a valid admin login.");
//     }

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("adminToken", data.token);
//     localStorage.setItem("userRole", "admin");
//     localStorage.setItem("admin", JSON.stringify(data.user));
//     localStorage.setItem(
//       "currentUser",
//       JSON.stringify({ id: data.user.id, name: data.user.loginId, role: "admin" })
//     );

//     closeAuth();
//     navigate("/admin-dashboard");
//   } catch (err) {
//     setError(
//       err.response?.data?.message || err.message || "Admin login failed."
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   // ================= STUDENT REGISTRATION =================
//   const handleRegister = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${API}/students/register`,
//         {
//           name: reg.name.trim(),
//           email: reg.email.trim().toLowerCase(),
//           university: reg.university.trim(),
//           password: reg.password,
//         }
//       );

//       setSuccess(
//         response.data.message ||
//           "Registration successful! Please wait for Admin Approval."
//       );

//       setReg({
//         name: "",
//         email: "",
//         university: "",
//         password: "",
//       });
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Registration failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegChange = (e) => {
//     setReg({
//       ...reg,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const fill = (id, pass) => {
//     setLoginId(id);
//     setPassword(pass);
//     setError("");
//   };

//   return (
//     <div className="am-overlay" onClick={closeAuth}>
//       <div className="am-modal" onClick={(e) => e.stopPropagation()}>
//         {/* HEADER */}
//         <div className="am-head">
//           <div className="am-head-left">
//             <span className="am-key">
//               <KeyRound size={20} />
//             </span>

//             <div>
//               <h2>Portal Authentication</h2>
//               <p>
//                 Access student workspace or administrative console
//               </p>
//             </div>
//           </div>

//           <button className="am-close" onClick={closeAuth}>
//             <X size={20} />
//           </button>
//         </div>

//         {/* TABS */}
//         <div className="am-tabs">
//           <button
//             className={tab === "student" ? "active" : ""}
//             onClick={() => setTab("student")}
//           >
//             <User size={14} /> Student Login
//           </button>

//           <button
//             className={tab === "register" ? "active" : ""}
//             onClick={() => setTab("register")}
//           >
//             <Sparkles size={14} className="orange" /> New Registration
//           </button>

//           <button
//             className={tab === "admin" ? "active" : ""}
//             onClick={() => setTab("admin")}
//           >
//             <ShieldCheck size={14} className="orange" /> Admin
//           </button>
//         </div>

//         <div className="am-body">
//           {/* STUDENT LOGIN */}
//           {tab === "student" && (
//             <form onSubmit={handleStudentLogin}>
//               <label>STUDENT LOGIN ID</label>

//               <div className="am-input">
//                 <User size={16} />

//                 <input
//                   className="mono"
//                   placeholder="e.g. IT4F2E83"
//                   value={loginId}
//                   onChange={(e) => setLoginId(e.target.value)}
//                   required
//                 />
//               </div>

//               <small className="am-hint">
//                 Login ID is provided after admin approval.
//               </small>

//               <label>PASSWORD</label>

//               <div className="am-input">
//                 <Lock size={16} />

//                 <input
//                   type="password"
//                   placeholder="Enter your account password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               {error && <p className="am-error">{error}</p>}

//               <button type="submit" className="am-btn" disabled={loading}>
//                 {loading ? "Signing In..." : "Sign In to Student Workspace"}
//                 {!loading && <ArrowRight size={16} />}
//               </button>

//               <p className="am-switch" onClick={() => setTab("register")}>
//                 Need an account? Register new student profile →
//               </p>
//             </form>
//           )}

//           {/* STUDENT REGISTRATION */}
//           {tab === "register" && (
//             <form onSubmit={handleRegister}>
//               <label>FULL NAME</label>

//               <div className="am-input">
//                 <User size={16} />

//                 <input
//                   name="name"
//                   placeholder="Your full name"
//                   value={reg.name}
//                   onChange={handleRegChange}
//                   required
//                 />
//               </div>

//               <label>EMAIL ADDRESS</label>

//               <div className="am-input">
//                 <Mail size={16} />

//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="name@university.edu"
//                   value={reg.email}
//                   onChange={handleRegChange}
//                   required
//                 />
//               </div>

//               <label>UNIVERSITY / INSTITUTION</label>

//               <div className="am-input">
//                 <GraduationCap size={16} />

//                 <input
//                   name="university"
//                   placeholder="Your university name"
//                   value={reg.university}
//                   onChange={handleRegChange}
//                   required
//                 />
//               </div>

//               <label>CREATE PASSWORD</label>

//               <div className="am-input">
//                 <Lock size={16} />

//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Minimum 6 characters"
//                   minLength={6}
//                   value={reg.password}
//                   onChange={handleRegChange}
//                   required
//                 />
//               </div>

//               {error && <p className="am-error">{error}</p>}
//               {success && <p className="am-success">{success}</p>}

//               <button type="submit" className="am-btn" disabled={loading}>
//                 <UserPlus size={16} />
//                 {loading ? "Registering..." : "Submit Registration"}
//               </button>

//               <p className="am-switch" onClick={() => setTab("student")}>
//                 Already approved? Sign in here →
//               </p>
//             </form>
//           )}

//           {/* ADMIN LOGIN */}
//           {tab === "admin" && (
//             <form onSubmit={handleAdminLogin}>
//               <label>ADMIN EMAIL</label>

//               <div className="am-input">
//                 <ShieldCheck size={16} />

//                 <input
//                   placeholder="admin@interntrack.com"
//                   value={loginId}
//                   onChange={(e) => setLoginId(e.target.value)}
//                   required
//                 />
//               </div>

//               <label>PASSWORD</label>

//               <div className="am-input">
//                 <Lock size={16} />

//                 <input
//                   type="password"
//                   placeholder="Enter admin password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               {error && <p className="am-error">{error}</p>}

//               <button type="submit" className="am-btn dark">
//                 Sign In to Admin Console <ArrowRight size={16} />
//               </button>

//               <div className="am-quick">
//                 <small>QUICK TEST ACCOUNT (CLICK TO FILL):</small>

//                 <div className="am-quick-grid single">
//                   <div
//                     onClick={() =>
//                       fill("admin@interntrack.com", "admin123")
//                     }
//                   >
//                     <b>Eleanor Sterling</b>
//                     <code>admin@interntrack.com</code>
//                     <span className="yellow">Administrator</span>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
 


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  KeyRound,
  X,
  User,
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  GraduationCap,
  ArrowRight,
  UserPlus,
} from "lucide-react";

import { useAuthModal } from "../context/authModalContext";
import "./AuthModal.css";

const API = "http://localhost:5000/api";

export default function AuthModal() {
  const { tab, setTab, closeAuth } = useAuthModal();
  const navigate = useNavigate();

  const [studentEmail, setStudentEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [reg, setReg] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
  });

  useEffect(() => {
    setStudentEmail("");
    setLoginId("");
    setPassword("");
    setError("");
    setSuccess("");
  }, [tab]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAuth();
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [closeAuth]);

  useEffect(() => {
    document.body.style.overflow = tab ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [tab]);

  if (!tab) return null;

  // ================= STUDENT LOGIN =================
  const handleStudentLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/auth/student-login`,
        {
          email: studentEmail.trim().toLowerCase(),
          password,
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid student login response.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("student", JSON.stringify(user));
      localStorage.setItem("studentId", user.id || user._id);

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id || user._id,
          name: user.name,
          role: "student",
        })
      );

      closeAuth();
      navigate("/student-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your Email Address and Password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= ADMIN LOGIN =================
  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/admin/login`, {
        loginId: loginId.trim(),
        password,
      });

      if (!data.token || data.user?.role !== "admin") {
        throw new Error("The server did not return a valid admin login.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("admin", JSON.stringify(data.user));

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: data.user.id,
          name: data.user.loginId,
          role: "admin",
        })
      );

      closeAuth();
      navigate("/admin-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Admin login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= STUDENT REGISTRATION =================
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/students/register`,
        {
          name: reg.name.trim(),
          email: reg.email.trim().toLowerCase(),
          university: reg.university.trim(),
          password: reg.password,
        }
      );

      setSuccess(
        response.data.message ||
          "Registration successful! Please wait for Admin Approval."
      );

      setReg({
        name: "",
        email: "",
        university: "",
        password: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegChange = (e) => {
    setReg({
      ...reg,
      [e.target.name]: e.target.value,
    });
  };

  const fill = (id, pass) => {
    setLoginId(id);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="am-overlay" onClick={closeAuth}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="am-head">
          <div className="am-head-left">
            <span className="am-key">
              <KeyRound size={20} />
            </span>

            <div>
              <h2>Portal Authentication</h2>
              <p>
                Access student workspace or administrative console
              </p>
            </div>
          </div>

          <button className="am-close" onClick={closeAuth}>
            <X size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="am-tabs">
          <button
            className={tab === "student" ? "active" : ""}
            onClick={() => setTab("student")}
          >
            <User size={14} /> Student Login
          </button>

          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            <Sparkles size={14} className="orange" /> New Registration
          </button>

          <button
            className={tab === "admin" ? "active" : ""}
            onClick={() => setTab("admin")}
          >
            <ShieldCheck size={14} className="orange" /> Admin
          </button>
        </div>

        <div className="am-body">

          {/* STUDENT LOGIN */}
          {tab === "student" && (
            <form onSubmit={handleStudentLogin}>
              <label>REGISTERED EMAIL ADDRESS</label>

              <div className="am-input">
                <Mail size={16} />

                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>

              <small className="am-hint">
                Use the email address you provided during registration.
              </small>

              <label>PASSWORD</label>

              <div className="am-input">
                <Lock size={16} />

                <input
                  type="password"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="am-error">{error}</p>}

              <button
                type="submit"
                className="am-btn"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In to Student Workspace"}
                {!loading && <ArrowRight size={16} />}
              </button>

              <p
                className="am-switch"
                onClick={() => setTab("register")}
              >
                Need an account? Register new student profile →
              </p>
            </form>
          )}

          {/* STUDENT REGISTRATION */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <label>FULL NAME</label>

              <div className="am-input">
                <User size={16} />

                <input
                  name="name"
                  placeholder="Your full name"
                  value={reg.name}
                  onChange={handleRegChange}
                  required
                />
              </div>

              <label>EMAIL ADDRESS</label>

              <div className="am-input">
                <Mail size={16} />

                <input
                  type="email"
                  name="email"
                  placeholder="name@university.edu"
                  value={reg.email}
                  onChange={handleRegChange}
                  required
                />
              </div>

              <label>UNIVERSITY / INSTITUTION</label>

              <div className="am-input">
                <GraduationCap size={16} />

                <input
                  name="university"
                  placeholder="Your university name"
                  value={reg.university}
                  onChange={handleRegChange}
                  required
                />
              </div>

              <label>CREATE PASSWORD</label>

              <div className="am-input">
                <Lock size={16} />

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  value={reg.password}
                  onChange={handleRegChange}
                  required
                />
              </div>

              {error && <p className="am-error">{error}</p>}
              {success && <p className="am-success">{success}</p>}

              <button
                type="submit"
                className="am-btn"
                disabled={loading}
              >
                <UserPlus size={16} />
                {loading ? "Registering..." : "Submit Registration"}
              </button>

              <p
                className="am-switch"
                onClick={() => setTab("student")}
              >
                Already approved? Sign in here →
              </p>
            </form>
          )}

          {/* ADMIN LOGIN */}
          {tab === "admin" && (
            <form onSubmit={handleAdminLogin}>
              <label>ADMIN EMAIL / LOGIN ID</label>

              <div className="am-input">
                <ShieldCheck size={16} />

                <input
                  placeholder="admin@interntrack.com"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              <label>PASSWORD</label>

              <div className="am-input">
                <Lock size={16} />

                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="am-error">{error}</p>}

              <button type="submit" className="am-btn dark">
                Sign In to Admin Console <ArrowRight size={16} />
              </button>

              <div className="am-quick">
                <small>QUICK TEST ACCOUNT (CLICK TO FILL):</small>

                <div className="am-quick-grid single">
                  <div
                    onClick={() =>
                      fill("admin@interntrack.com", "admin123")
                    }
                  >
                    <b>Eleanor Sterling</b>
                    <code>admin@interntrack.com</code>
                    <span className="yellow">Administrator</span>
                  </div>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

