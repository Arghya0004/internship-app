
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import "./AdminDashboard.css";

// import useDbSync from "../utils/useDbSync";

// import {
//   getStudents,
//   getAllRequests,
//   getLogs,
//   getStats,
//   approveRequest,
//   rejectRequest,
//   markCourseCompleted,
//   isCourseCompleted,
// } from "../utils/db";

// // ================= API URLS =================

// const API = "http://localhost:5000/api/admin";
// const CERT_API = "http://localhost:5000/api/certificates";
// const ATTENDANCE_API = "http://localhost:5000/api/attendance";

// // ================= ADMIN AUTHENTICATION =================

// const getAdminToken = () => {
//   const role = localStorage.getItem("userRole");

//   if (role && role !== "admin") {
//     return "";
//   }

//   return (
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("token") ||
//     ""
//   );
// };

// const getAuthConfig = () => {
//   const token = getAdminToken();

//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// };

// // ================= RESPONSE HELPERS =================

// const getStudentArray = (data) => {
//   if (Array.isArray(data)) return data;

//   if (Array.isArray(data?.students)) return data.students;
//   if (Array.isArray(data?.activeStudents)) return data.activeStudents;
//   if (Array.isArray(data?.pendingStudents)) return data.pendingStudents;
//   if (Array.isArray(data?.data)) return data.data;

//   return [];
// };

// const getCertificateArray = (data) => {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.certificates)) return data.certificates;
//   if (Array.isArray(data?.data)) return data.data;
//   return [];
// };

// const GRADES = [
//   "A+ (Outstanding Distinction)",
//   "A (Excellent)",
//   "B+ (Very Good)",
//   "B (Good)",
//   "C (Satisfactory)",
// ];

// const fmtDateTime = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   return isNaN(date.getTime())
//     ? value
//     : date.toLocaleString();
// };

// // ================= ADMIN DASHBOARD =================

// function AdminDashboard() {
//   useDbSync();

//   const [activeTab, setActiveTab] = useState("approvals");
//   const [internFilter, setInternFilter] = useState("All Interns");
//   const [logSearch, setLogSearch] = useState("");
//   const [adminName, setAdminName] = useState("");
//   const [grades, setGrades] = useState({});

//   const [resetStudentId, setResetStudentId] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [resetLoading, setResetLoading] = useState(false);

//   const [refreshing, setRefreshing] = useState(false);

//   // ================= STUDENTS =================

//   const [backendPending, setBackendPending] = useState([]);
//   const [backendActive, setBackendActive] = useState([]);
//   const [loadingStudents, setLoadingStudents] = useState(true);
//   const [refreshError, setRefreshError] = useState("");

//   const fetchStudents = useCallback(async () => {
//     try {
//       setRefreshError("");

//       const token = getAdminToken();

//       if (!token) {
//         throw new Error(
//           "Admin token not found. Please logout and login again."
//         );
//       }

//       const config = getAuthConfig();

//       const [pendingResponse, activeResponse] = await Promise.all([
//         axios.get(`${API}/pending-students`, config),
//         axios.get(`${API}/active-students`, config),
//       ]);

//       const pendingData = getStudentArray(pendingResponse.data);
//       const activeData = getStudentArray(activeResponse.data);

//       setBackendPending(pendingData);
//       setBackendActive(activeData);

//       console.log("MongoDB Pending Students:", pendingData);
//       console.log("MongoDB Active Students:", activeData);
//     } catch (error) {
//       console.error("Student fetch error:", error);

//       setRefreshError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load students."
//       );

//       setBackendPending([]);
//       setBackendActive([]);
//     } finally {
//       setLoadingStudents(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchStudents();
//   }, [fetchStudents]);

//   // ================= CERTIFICATES =================

//   const [mongoCertPending, setMongoCertPending] = useState([]);
//   const [mongoCertIssued, setMongoCertIssued] = useState([]);

//   const fetchCerts = useCallback(async () => {
//     try {
//       const token = getAdminToken();

//       if (!token) {
//         throw new Error("Admin token not found.");
//       }

//       const config = getAuthConfig();

//       const [pendingResponse, issuedResponse] = await Promise.all([
//         axios.get(`${CERT_API}/pending`, config),
//         axios.get(`${CERT_API}/issued`, config),
//       ]);

//       setMongoCertPending(
//         getCertificateArray(pendingResponse.data)
//       );

//       setMongoCertIssued(
//         getCertificateArray(issuedResponse.data)
//       );

//       console.log(
//         "MongoDB Pending Certificates:",
//         pendingResponse.data
//       );
//     } catch (error) {
//       console.error("Certificate fetch error:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCerts();
//   }, [fetchCerts]);

//   // ================= ATTENDANCE =================

//   const [mongoLogs, setMongoLogs] = useState([]);
//   const [loadingLogs, setLoadingLogs] = useState(false);
//   const [logsError, setLogsError] = useState("");

//   const fetchAttendance = useCallback(async () => {
//     try {
//       setLoadingLogs(true);
//       setLogsError("");

//       const token = getAdminToken();

//       if (!token) {
//         throw new Error("Admin token not found. Please login again.");
//       }

//       const response = await axios.get(
//         `${ATTENDANCE_API}/admin-logs`,
//         getAuthConfig()
//       );

//       const attendanceData = Array.isArray(response.data)
//         ? response.data
//         : response.data?.logs || [];

//       setMongoLogs(attendanceData);

//       console.log("MongoDB Attendance Logs:", attendanceData);
//     } catch (error) {
//       console.error("Attendance fetch error:", error);

//       setLogsError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load MongoDB attendance records."
//       );

//       setMongoLogs([]);
//     } finally {
//       setLoadingLogs(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAttendance();
//   }, [fetchAttendance]);

//   // ================= OLD LOCAL DATA =================

//   const students = getStudents() || [];
//   const requests = getAllRequests() || [];

//   // ================= PENDING STUDENTS =================

//   const pending = backendPending.map((s) => ({
//     id: s._id,
//     name: s.name || "Unknown",
//     institution: s.university || "—",
//     domain: s.role || "—",
//     email: s.email || "—",
//     registered: fmtDateTime(s.createdAt),
//     term: `${s.termStart || "—"} to ${s.termEnd || "—"}`,
//   }));

//   // ================= ACTIVE STUDENTS =================

//   const activeStudents = backendActive.map((s) => ({
//     id: s._id,
//     name: s.name || "Unknown",
//     email: s.email || "—",
//     loginId: s.loginId || "—",
//     courseCompleted: s.courseCompleted,
//     institution: s.university || "—",
//     domain: s.role || "—",
//     term: `${s.termStart || "—"} to ${s.termEnd || "—"}`,
//   }));

//   // ================= LOCAL INTERNS =================

//   const interns = students
//     .filter((s) => s.status === "active")
//     .map((s) => ({
//       id: s.id,
//       name: s.name,
//       domain: s.role,
//       institution: s.university,
//       term: `${s.termStart} to ${s.termEnd}`,
//       completed: isCourseCompleted(s),
//     }));

//   // ================= LOCAL CERTIFICATE REQUESTS =================

//   const certRequests = requests
//     .filter((r) => r.status === "pending")
//     .map((r) => {
//       const student = students.find(
//         (s) => s.id === r.studentId
//       );

//       if (!student) return null;

//       const stats = getStats(getLogs(student.id));

//       return {
//         id: r.certId,
//         studentId: student.id,
//         student: student.name,
//         internshipId: student.id,
//         domain: student.role,
//         institution: student.university,
//         hours: Number(stats.total || 0),
//         days: Number(stats.days || 0),
//         requested: fmtDateTime(r.requestedAt),
//       };
//     })
//     .filter(Boolean);

//   // ================= LOCAL ISSUED CERTIFICATES =================

//   const certificates = requests
//     .filter((r) => r.status === "approved")
//     .map((r) => {
//       const student = students.find(
//         (s) => s.id === r.studentId
//       );

//       if (!student) return null;

//       return {
//         id: r.certId,
//         student: student.name,
//         domain: student.role,
//         institution: student.university,
//         grade: `Grade ${r.grade}`,
//       };
//     })
//     .filter(Boolean);

//   // ================= MONGODB ATTENDANCE LOGS =================

//   const mongodbAttendanceLogs = mongoLogs.map((l) => {
//     const studentObject =
//       l.student && typeof l.student === "object"
//         ? l.student
//         : null;

//     const studentName =
//       studentObject?.name ||
//       (typeof l.student === "string" ? l.student : "") ||
//       "Unknown Student";

//     const studentLoginId =
//       l.loginId ||
//       studentObject?.loginId ||
//       "—";

//     return {
//       id: l._id,
//       date: l.date || "—",
//       student: studentName,
//       internshipId: studentLoginId,
//       start: l.entryTime || "—",
//       end: l.exitTime || "Not exited",
//       hours: Number(l.totalWorkingHours || 0),
//       task: l.dailyWork || "—",
//       status: l.status || "—",
//     };
//   });

//   // ================= LOCAL ATTENDANCE LOGS =================

//   const localAttendanceLogs = students.flatMap((s) =>
//     (getLogs(s.id) || []).map((l) => ({
//       id: `${s.id}-${l.date}`,
//       date: l.date,
//       student: s.name,
//       internshipId: s.id,
//       start: l.entry || "—",
//       end: l.exit || "—",
//       hours: Number(l.hours || 0),
//       task: l.text || "—",
//       status: "Local",
//     }))
//   );

//   // ================= COMBINED LOGS =================

//   const logs = [
//     ...mongodbAttendanceLogs,
//     ...localAttendanceLogs,
//   ].sort((a, b) =>
//     String(b.date).localeCompare(String(a.date))
//   );

//   // ================= TOTAL HOURS =================

//   const totalHours = logs.reduce(
//     (sum, log) => sum + Number(log.hours || 0),
//     0
//   );

//   const totalInterns =
//     activeStudents.length + pending.length;

//   // ================= LOG FILTERS =================

//   const logStudentNames = [
//     ...new Set(
//       logs.map((log) => log.student).filter(Boolean)
//     ),
//   ];

//   const filteredLogs = logs.filter((log) => {
//     const matchIntern =
//       internFilter === "All Interns" ||
//       log.student === internFilter;

//     const searchText =
//       `${log.student} ${log.internshipId} ${log.date} ${log.task}`
//         .toLowerCase();

//     const matchSearch = searchText.includes(
//       logSearch.toLowerCase()
//     );

//     return matchIntern && matchSearch;
//   });

//   const totalPendingCerts =
//     certRequests.length + mongoCertPending.length;

//   // ================= REFRESH ALL =================

//   async function handleRefreshAll() {
//     try {
//       setRefreshing(true);

//       await Promise.all([
//         fetchStudents(),
//         fetchCerts(),
//         fetchAttendance(),
//       ]);
//     } finally {
//       setRefreshing(false);
//     }
//   }

//   // ================= RESET STUDENT PASSWORD =================

//   async function handleResetPassword(student) {
//     if (!newPassword || newPassword.length < 6) {
//       alert("Password must be at least 6 characters.");
//       return;
//     }

//     if (!window.confirm(`Reset password for ${student.name}?`)) {
//       return;
//     }

//     try {
//       setResetLoading(true);

//       await axios.patch(
//         `${API}/reset-password/${student.id}`,
//         { password: newPassword },
//         getAuthConfig()
//       );

//       alert(`Password reset successfully for ${student.name}.`);

//       setResetStudentId("");
//       setNewPassword("");
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Password reset failed. Please check the backend API."
//       );
//     } finally {
//       setResetLoading(false);
//     }
//   }

//   // ================= APPROVE STUDENT =================

//   async function handleApproveStudent(student) {
//     try {
//       const response = await axios.patch(
//         `${API}/approve/${student.id}`,
//         {},
//         getAuthConfig()
//       );

//       const loginId = response.data?.loginId || "Generated";

//       alert(
//         `Student Approved Successfully!\n\nStudent: ${student.name}\nLogin ID: ${loginId}`
//       );

//       await fetchStudents();
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Student approval failed."
//       );
//     }
//   }

//   // ================= DECLINE STUDENT =================

//   async function handleDeclineStudent(student) {
//     if (!window.confirm(`Decline registration of ${student.name}?`)) {
//       return;
//     }

//     try {
//       await axios.patch(
//         `${API}/decline/${student.id}`,
//         {},
//         getAuthConfig()
//       );

//       alert("Student registration declined.");

//       await fetchStudents();
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Decline failed. Backend decline route may be missing."
//       );
//     }
//   }

//   // ================= APPROVE MONGODB CERTIFICATE =================

//   async function approveMongoCert(certificate) {
//     if (!adminName.trim()) {
//       alert("Please enter the Endorsing Authority name first.");
//       return;
//     }

//     try {
//       await axios.patch(
//         `${CERT_API}/${certificate._id}/approve`,
//         {
//           grade: grades[certificate._id] || GRADES[0],
//           endorsedBy: adminName.trim(),
//         },
//         getAuthConfig()
//       );

//       alert(
//         `Certificate issued for ${
//           certificate.student?.name || "student"
//         }`
//       );

//       await fetchCerts();
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Certificate approval failed."
//       );
//     }
//   }

//   // ================= REJECT MONGODB CERTIFICATE =================

//   async function rejectMongoCert(certificate) {
//     if (
//       !window.confirm(
//         "Reject this request? Student can request again."
//       )
//     ) {
//       return;
//     }

//     try {
//       await axios.patch(
//         `${CERT_API}/${certificate._id}/reject`,
//         {},
//         getAuthConfig()
//       );

//       alert("Certificate request rejected.");

//       await fetchCerts();
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Certificate rejection failed."
//       );
//     }
//   }

//   // ================= MARK COURSE COMPLETED =================

//   async function markMongoCourseCompleted(student) {
//     try {
//       await axios.patch(
//         `${CERT_API}/complete/${student.id}`,
//         {},
//         getAuthConfig()
//       );

//       await fetchStudents();

//       alert(`${student.name}: course marked completed.`);
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Failed to update course status."
//       );
//     }
//   }

//   // ================= OLD LOCAL CERTIFICATE =================

//   function issueCertificate(request) {
//     if (!adminName.trim()) {
//       alert("Please enter the Endorsing Authority name first.");
//       return;
//     }

//     approveRequest(request.studentId, {
//       grade: grades[request.studentId] || GRADES[0],
//       endorsedBy: adminName.trim(),
//     });
//   }

//   function requestRevision(studentId) {
//     if (
//       window.confirm(
//         "Reject this request? Student can request again later."
//       )
//     ) {
//       rejectRequest(studentId);
//     }
//   }

//   // ================= EXPORT DATABASE =================

//   function exportData() {
//     const safeStudents = students.map(
//       ({ password, ...rest }) => rest
//     );

//     const data = {
//       students: safeStudents,
//       mongodbStudents: activeStudents,
//       pendingStudents: backendPending,
//       requests,
//       logs,
//     };

//     const blob = new Blob(
//       [JSON.stringify(data, null, 2)],
//       { type: "application/json" }
//     );

//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");

//     anchor.href = url;
//     anchor.download = "interntrack-records.json";
//     anchor.click();

//     URL.revokeObjectURL(url);
//   }

//   // ================= LOGOUT =================

//   function handleLogout() {
//     if (!window.confirm("Are you sure you want to log out?")) {
//       return;
//     }

//     localStorage.removeItem("user");
//     localStorage.removeItem("student");
//     localStorage.removeItem("admin");
//     localStorage.removeItem("studentId");
//     localStorage.removeItem("studentToken");
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("token");
//     localStorage.removeItem("currentUser");

//     window.location.href = "/";
//   }

//   // ================= SIDEBAR TABS =================

//   const tabs = [
//     {
//       key: "approvals",
//       label: "Student Approvals & Directory",
//       icon: "♙",
//       badge: pending.length,
//       badgeType: "amber",
//     },
//     {
//       key: "certs",
//       label: "Certificate Endorsements",
//       icon: "✦",
//       badge: totalPendingCerts,
//       badgeType: "blue",
//     },
//     {
//       key: "logs",
//       label: `Daily Timesheet Logs (${logs.length})`,
//       icon: "◷",
//     },
//   ];

//   // ================= DASHBOARD UI =================

//   return (
//     <div className="app admin-layout">

//       {/* LEFT SIDEBAR */}

//       <aside className="admin-sidebar">
//         <div className="sidebar-brand">
//           <div className="sidebar-brand-mark">IT</div>

//           <div>
//             <strong>InternTrack</strong>
//             <span>Admin Workspace</span>
//           </div>
//         </div>

//         <p className="sidebar-section-label">WORKSPACE</p>

//         <nav className="sidebar-nav">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               className={`sidebar-link ${
//                 activeTab === tab.key ? "active" : ""
//               }`}
//               onClick={() => setActiveTab(tab.key)}
//             >
//               <span className="sidebar-link-icon">
//                 {tab.icon}
//               </span>

//               <span className="sidebar-link-text">
//                 {tab.key === "approvals"
//                   ? "Student Approvals"
//                   : tab.key === "certs"
//                     ? "Certificate Enrollments"
//                     : "Daily Timesheet Logs"}
//               </span>

//               {tab.badge !== undefined && (
//                 <span
//                   className={`sidebar-badge ${tab.badgeType || ""}`}
//                 >
//                   {tab.badge}
//                 </span>
//               )}
//             </button>
//           ))}

//           <button
//             className={`sidebar-link ${
//               activeTab === "settings" ? "active" : ""
//             }`}
//             onClick={() => setActiveTab("settings")}
//           >
//             <span className="sidebar-link-icon">⚙</span>
//             <span className="sidebar-link-text">Settings</span>
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <span className="sidebar-status-dot" />
//           <span>System operational</span>
//         </div>
//       </aside>

//       {/* MAIN DASHBOARD */}

//       <div className="admin-main">

//         <div className="admin-top-actions">
//           <span className="admin-pill">🛡 Admin Control</span>

//           <button
//             className="logout-btn"
//             onClick={handleLogout}
//           >
//             <span className="logout-text">Logout</span>
//           </button>
//         </div>

//         <main className="container">

//           {/* HERO SECTION */}

//           <section className="hero">
//             <span className="hero-badge">
//               ⛨ Program Director Portal
//             </span>

//             <h1>
//               Administrative Control &amp; Verification Console
//             </h1>

//             <p className="hero-sub">
//               Supervising {totalInterns} interns ·{" "}
//               {totalHours.toFixed(1)} total verified practicum
//               hours across all domains.
//             </p>

//             <div className="hero-actions">
//               <button
//                 className="hero-btn"
//                 onClick={exportData}
//               >
//                 <span className="teal">▤</span>
//                 Export Database
//               </button>

//               <button
//                 className="hero-btn"
//                 onClick={handleRefreshAll}
//                 disabled={refreshing}
//               >
//                 {refreshing
//                   ? "Refreshing..."
//                   : "↻ Refresh All Data"}
//               </button>
//             </div>

//             <div className="hero-divider" />

//             <div className="tile-grid">
//               <StatTile
//                 label="Active Students"
//                 value={activeStudents.length}
//                 unit="students"
//                 note="MongoDB approved students"
//               />

//               <StatTile
//                 variant="amber"
//                 dot
//                 label="Pending ID Approvals"
//                 value={pending.length}
//                 unit="applicants"
//                 note="Requires admin sign-off"
//               />

//               <StatTile
//                 label="Total Work Logged"
//                 value={totalHours.toFixed(1)}
//                 unit="hours"
//                 note={`${logs.length} timesheets recorded`}
//                 noteClass="green"
//                 stacked
//               />

//               <StatTile
//                 variant="blue"
//                 label="Pending Certificates"
//                 value={totalPendingCerts}
//                 unit="requests"
//                 note="Awaiting certification review"
//               />
//             </div>
//           </section>

//           {/* TAB 1: STUDENT APPROVALS */}

//           {activeTab === "approvals" && (
//             <>
//               <section className="card">
//                 <div className="card-head">
//                   <h3>Pending Registration Endorsement Queue</h3>

//                   <span className="count-chip amber">
//                     {pending.length}
//                   </span>
//                 </div>

//                 <p className="card-desc">
//                   New registrations from MongoDB.
//                   Admin approval activates the Student Login ID.
//                 </p>

//                 {refreshError && (
//                   <p style={{ color: "red", margin: "12px 0" }}>
//                     {refreshError}
//                   </p>
//                 )}

//                 {loadingStudents ? (
//                   <EmptyState message="Loading pending registrations..." />
//                 ) : pending.length === 0 ? (
//                   <EmptyState message="No pending registrations." />
//                 ) : (
//                   pending.map((student) => (
//                     <div className="pending-item" key={student.id}>
//                       <div className="pending-top">
//                         <h4>{student.name}</h4>

//                         <span className="id-chip amber">
//                           {student.id}
//                         </span>

//                         <span className="status-pill awaiting">
//                           Awaiting Approval
//                         </span>
//                       </div>

//                       <ul className="meta-list">
//                         <li>▯ {student.institution}</li>
//                         <li>▣ {student.domain}</li>
//                         <li>✉ {student.email}</li>
//                       </ul>

//                       <p className="mono-note">
//                         Registered: {student.registered} · Term:{" "}
//                         {student.term}
//                       </p>

//                       <div className="btn-row">
//                         <button
//                           className="btn btn-green"
//                           onClick={() =>
//                             handleApproveStudent(student)
//                           }
//                         >
//                           ✓ Approve &amp; Activate ID
//                         </button>

//                         <button
//                           className="btn btn-outline"
//                           onClick={() =>
//                             handleDeclineStudent(student)
//                           }
//                         >
//                           ⊗ Decline
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </section>

//               {/* ACTIVE STUDENTS DIRECTORY */}

//               <section className="card">
//                 <h3>Active Enrolled Interns Directory</h3>

//                 <p className="card-desc">
//                   Approved students registered in MongoDB.
//                 </p>

//                 {refreshError && (
//                   <p style={{ color: "red", margin: "12px 0" }}>
//                     Could not load student data: {refreshError}
//                   </p>
//                 )}

//                 {loadingStudents ? (
//                   <EmptyState message="Loading active students..." />
//                 ) : activeStudents.length === 0 ? (
//                   <EmptyState message="No active MongoDB students found." />
//                 ) : (
//                   <div className="table-scroll">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>Student</th>
//                           <th>Login ID</th>
//                           <th>Email</th>
//                           <th>Institution</th>
//                           <th>Course</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {activeStudents.map((student) => (
//                           <tr key={student.id}>
//                             <td>
//                               <strong>{student.name}</strong>
//                             </td>

//                             <td className="mono">
//                               {student.loginId}
//                             </td>

//                             <td>{student.email}</td>
//                             <td>{student.institution}</td>

//                             <td>
//                               {student.courseCompleted ? (
//                                 <span className="count-chip blue">
//                                   Completed
//                                 </span>
//                               ) : (
//                                 <button
//                                   className="btn btn-outline"
//                                   onClick={() =>
//                                     markMongoCourseCompleted(student)
//                                   }
//                                 >
//                                   Mark Completed
//                                 </button>
//                               )}
//                             </td>

//                             <td>
//                               {resetStudentId === student.id ? (
//                                 <div style={{ minWidth: 190 }}>
//                                   <input
//                                     type="password"
//                                     value={newPassword}
//                                     onChange={(e) =>
//                                       setNewPassword(e.target.value)
//                                     }
//                                     placeholder="New password (min 6)"
//                                     minLength={6}
//                                     style={{
//                                       width: "100%",
//                                       padding: "8px",
//                                       marginBottom: "6px",
//                                       border: "1px solid #ccc",
//                                       borderRadius: "6px",
//                                     }}
//                                   />

//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       gap: 6,
//                                     }}
//                                   >
//                                     <button
//                                       className="btn btn-green"
//                                       disabled={resetLoading}
//                                       onClick={() =>
//                                         handleResetPassword(student)
//                                       }
//                                     >
//                                       {resetLoading
//                                         ? "Saving..."
//                                         : "Confirm"}
//                                     </button>

//                                     <button
//                                       className="btn btn-outline"
//                                       disabled={resetLoading}
//                                       onClick={() => {
//                                         setResetStudentId("");
//                                         setNewPassword("");
//                                       }}
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <button
//                                   className="btn btn-outline"
//                                   onClick={() => {
//                                     setResetStudentId(student.id);
//                                     setNewPassword("");
//                                   }}
//                                 >
//                                   Reset Password
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </section>

//               {/* OLD LOCAL DIRECTORY */}

//               <section className="card">
//                 <h3>Legacy Local Intern Directory</h3>

//                 {interns.length === 0 ? (
//                   <EmptyState message="No old local interns." />
//                 ) : (
//                   <div className="table-scroll">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>Student</th>
//                           <th>Domain</th>
//                           <th>Institution</th>
//                           <th>Term</th>
//                           <th>Course</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {interns.map((intern) => (
//                           <tr key={intern.id}>
//                             <td>
//                               <strong>{intern.name}</strong>
//                               <span className="sub-id">
//                                 {intern.id}
//                               </span>
//                             </td>

//                             <td>{intern.domain}</td>
//                             <td>{intern.institution}</td>
//                             <td className="mono">{intern.term}</td>

//                             <td>
//                               {intern.completed ? (
//                                 <span className="count-chip blue">
//                                   Completed
//                                 </span>
//                               ) : (
//                                 <button
//                                   className="btn btn-outline"
//                                   onClick={() =>
//                                     markCourseCompleted(intern.id)
//                                   }
//                                 >
//                                   Mark Completed
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </section>
//             </>
//           )}

//           {/* TAB 2: CERTIFICATES */}

//           {activeTab === "certs" && (
//             <>
//               <section className="card">
//                 <div className="card-head">
//                   <h3>
//                     <span className="orange-icon">✪</span>
//                     Certificate Issuance Requests
//                   </h3>

//                   <span className="count-chip blue">
//                     {totalPendingCerts}
//                   </span>
//                 </div>

//                 <p className="card-desc">
//                   Review student performance and logged hours.
//                 </p>

//                 <label className="admin-field">
//                   Endorsing Authority

//                   <input
//                     value={adminName}
//                     onChange={(e) =>
//                       setAdminName(e.target.value)
//                     }
//                     placeholder="Enter admin name"
//                   />
//                 </label>

//                 {mongoCertPending.map((certificate) => (
//                   <div
//                     className="cert-request"
//                     key={certificate._id}
//                   >
//                     <div className="pending-top">
//                       <h4>
//                         {certificate.student?.name || "Student"}
//                       </h4>

//                       <span className="id-chip grey">
//                         {certificate.student?.loginId || "—"}
//                       </span>
//                     </div>

//                     <p className="line">
//                       Email:{" "}
//                       <strong>
//                         {certificate.student?.email || "—"}
//                       </strong>
//                     </p>

//                     <p className="line small">
//                       Requested: {fmtDateTime(certificate.requestedAt)}
//                     </p>

//                     <label className="admin-field">
//                       Grade

//                       <select
//                         value={grades[certificate._id] || GRADES[0]}
//                         onChange={(e) =>
//                           setGrades((prev) => ({
//                             ...prev,
//                             [certificate._id]: e.target.value,
//                           }))
//                         }
//                       >
//                         {GRADES.map((grade) => (
//                           <option key={grade} value={grade}>
//                             {grade}
//                           </option>
//                         ))}
//                       </select>
//                     </label>

//                     <div className="btn-row two">
//                       <button
//                         className="btn btn-orange"
//                         onClick={() =>
//                           approveMongoCert(certificate)
//                         }
//                       >
//                         ✪ Endorse &amp; Issue Certificate
//                       </button>

//                       <button
//                         className="btn btn-outline"
//                         onClick={() =>
//                           rejectMongoCert(certificate)
//                         }
//                       >
//                         Request Revisions
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 {certRequests.length === 0 &&
//                 mongoCertPending.length === 0 ? (
//                   <EmptyState message="There are no pending certificate requests." />
//                 ) : (
//                   certRequests.map((request) => (
//                     <div className="cert-request" key={request.id}>
//                       <div className="pending-top">
//                         <h4>{request.student}</h4>

//                         <span className="id-chip grey">
//                           {request.internshipId}
//                         </span>
//                       </div>

//                       <p className="line">
//                         Domain: <strong>{request.domain}</strong>
//                       </p>

//                       <p className="line">
//                         Institution:{" "}
//                         <strong>{request.institution}</strong>
//                       </p>

//                       <p className="hours-line">
//                         {request.hours.toFixed(1)} Verified Hours (
//                         {request.days} Days)
//                       </p>

//                       <p className="line small">
//                         Requested: {request.requested}
//                       </p>

//                       <label className="admin-field">
//                         Grade

//                         <select
//                           value={grades[request.studentId] || GRADES[0]}
//                           onChange={(e) =>
//                             setGrades((prev) => ({
//                               ...prev,
//                               [request.studentId]: e.target.value,
//                             }))
//                           }
//                         >
//                           {GRADES.map((grade) => (
//                             <option key={grade} value={grade}>
//                               {grade}
//                             </option>
//                           ))}
//                         </select>
//                       </label>

//                       <div className="btn-row two">
//                         <button
//                           className="btn btn-orange"
//                           onClick={() =>
//                             issueCertificate(request)
//                           }
//                         >
//                           ✪ Endorse &amp; Issue Certificate
//                         </button>

//                         <button
//                           className="btn btn-outline"
//                           onClick={() =>
//                             requestRevision(request.studentId)
//                           }
//                         >
//                           Request Revisions
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </section>

//               {/* ISSUED CERTIFICATES */}

//               <section className="card">
//                 <h3>
//                   Issued &amp; Verifiable Certificates (
//                   {certificates.length + mongoCertIssued.length})
//                 </h3>

//                 {certificates.length === 0 &&
//                   mongoCertIssued.length === 0 && (
//                     <EmptyState message="No certificates issued yet." />
//                   )}

//                 {mongoCertIssued.map((certificate) => (
//                   <div
//                     className="issued-card"
//                     key={certificate._id}
//                   >
//                     <div className="issued-top">
//                       <span className="id-chip amber-text">
//                         {certificate.certificateNo || "Certificate"}
//                       </span>

//                       <span className="endorsed">⊙ Endorsed</span>
//                     </div>

//                     <h4>
//                       {certificate.student?.name || "Student"}
//                     </h4>

//                     <p className="issued-domain">
//                       {certificate.student?.loginId || "—"}
//                     </p>

//                     <div className="issued-bottom">
//                       <span>
//                         Grade:{" "}
//                         <strong>{certificate.grade || "—"}</strong>
//                       </span>
//                     </div>
//                   </div>
//                 ))}

//                 {certificates.map((certificate) => (
//                   <div
//                     className="issued-card"
//                     key={certificate.id}
//                   >
//                     <div className="issued-top">
//                       <span className="id-chip amber-text">
//                         {certificate.id}
//                       </span>

//                       <span className="endorsed">⊙ Endorsed</span>
//                     </div>

//                     <h4>{certificate.student}</h4>

//                     <p className="issued-domain">
//                       {certificate.domain} · {certificate.institution}
//                     </p>

//                     <div className="issued-bottom">
//                       <span>
//                         Grade: <strong>{certificate.grade}</strong>
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </section>
//             </>
//           )}

//           {/* TAB 3: ATTENDANCE LOGS */}

//           {activeTab === "logs" && (
//             <section className="card">
//               <h3>
//                 All Daily Work Records ({filteredLogs.length})
//               </h3>

//               <p className="card-desc">
//                 MongoDB attendance records and old local timesheet records.
//               </p>

//               {logsError && (
//                 <p style={{ color: "red", margin: "12px 0" }}>
//                   {logsError}
//                 </p>
//               )}

//               <div className="filters">
//                 <select
//                   className="select"
//                   value={internFilter}
//                   onChange={(e) =>
//                     setInternFilter(e.target.value)
//                   }
//                 >
//                   <option>All Interns</option>

//                   {logStudentNames.map((name) => (
//                     <option key={name} value={name}>
//                       {name}
//                     </option>
//                   ))}
//                 </select>

//                 <div className="search-box">
//                   <span>⌕</span>

//                   <input
//                     placeholder="Search work logs..."
//                     value={logSearch}
//                     onChange={(e) =>
//                       setLogSearch(e.target.value)
//                     }
//                   />
//                 </div>

//                 <button
//                   className="btn btn-outline"
//                   onClick={fetchAttendance}
//                   disabled={loadingLogs}
//                 >
//                   {loadingLogs ? "Loading..." : "↻ Refresh Logs"}
//                 </button>
//               </div>

//               {loadingLogs ? (
//                 <EmptyState message="Loading MongoDB attendance records..." />
//               ) : filteredLogs.length === 0 ? (
//                 <EmptyState message="No timesheet logs found." />
//               ) : (
//                 <div className="table-scroll">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Student Name</th>
//                         <th>Shift Times</th>
//                         <th>Hours</th>
//                         <th>Task</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredLogs.map((log, index) => (
//                         <tr
//                           key={`${log.internshipId}-${log.date}-${index}`}
//                         >
//                           <td className="mono date-cell">
//                             {log.date}
//                           </td>

//                           <td>
//                             <strong>{log.student}</strong>
//                             <span className="sub-id">
//                               {log.internshipId}
//                             </span>
//                           </td>

//                           <td className="mono">
//                             {log.start} – {log.end}
//                           </td>

//                           <td className="mono">
//                             {log.hours.toFixed(1)}h
//                           </td>

//                           <td>{log.task}</td>
//                           <td>{log.status}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}

//           {/* TAB 4: SETTINGS */}

//           {activeTab === "settings" && (
//             <section className="card">
//               <h3>Admin Settings</h3>

//               <p className="card-desc">
//                 Manage your administrative workspace.
//               </p>

//               <label className="admin-field">
//                 Endorsing Authority

//                 <input
//                   value={adminName}
//                   onChange={(e) =>
//                     setAdminName(e.target.value)
//                   }
//                   placeholder="Enter admin name"
//                 />
//               </label>

//               <p className="settings-note">
//                 This name is used when endorsing and issuing student certificates.
//               </p>
//             </section>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// // ================= SMALL COMPONENTS =================

// function StatTile({
//   label,
//   value,
//   unit,
//   note,
//   variant = "",
//   dot,
//   noteClass = "",
//   stacked,
// }) {
//   return (
//     <div className={`tile ${variant}`}>
//       <div className="tile-label">
//         <span>{label}</span>
//         {dot && <i className="tile-dot" />}
//       </div>

//       <div className={`tile-value ${stacked ? "stacked" : ""}`}>
//         <strong>{value}</strong>
//         <em>{unit}</em>
//       </div>

//       <small className={noteClass}>{note}</small>
//     </div>
//   );
// }

// function EmptyState({ message }) {
//   return <div className="empty-state">{message}</div>;
// }

// export default AdminDashboard;


import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import useDbSync from "../utils/useDbSync";
import { useAuthModal } from "../context/authModalContext";
import { clearAuthSession } from "../utils/auth";

import {
  getStudents,
  getAllRequests,
  getLogs,
  getStats,
  approveRequest,
  rejectRequest,
  markCourseCompleted,
  isCourseCompleted,
} from "../utils/db";

// ================= API URLS =================

const API = "http://localhost:5000/api/admin";
const CERT_API = "http://localhost:5000/api/certificates";
const ATTENDANCE_API = "http://localhost:5000/api/attendance";

// ================= ADMIN AUTHENTICATION =================

const getAdminToken = () => {
  const role = localStorage.getItem("userRole");

  if (role && role !== "admin") return "";

  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    ""
  );
};

const getAuthConfig = () => {
  const token = getAdminToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// ================= RESPONSE HELPERS =================

const getStudentArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.students)) return data.students;
  if (Array.isArray(data?.activeStudents)) return data.activeStudents;
  if (Array.isArray(data?.pendingStudents)) return data.pendingStudents;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getCertificateArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.certificates)) return data.certificates;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getAttendanceArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.logs)) return data.logs;
  if (Array.isArray(data?.attendance)) return data.attendance;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const GRADES = [
  "A+ (Outstanding Distinction)",
  "A (Excellent)",
  "B+ (Very Good)",
  "B (Good)",
  "C (Satisfactory)",
];

const fmtDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN");
};

const formatHours = (value) => {
  const hours = Number(value || 0);
  return Number.isFinite(hours) ? hours : 0;
};

// ================= ADMIN DASHBOARD =================

function AdminDashboard() {
  useDbSync();
  const { requestLogout } = useAuthModal();

  const [activeTab, setActiveTab] = useState("approvals");
  const [internFilter, setInternFilter] = useState("All Interns");
  const [logSearch, setLogSearch] = useState("");
  const [adminName, setAdminName] = useState("");
  const [grades, setGrades] = useState({});

  const [resetStudentId, setResetStudentId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ================= STUDENTS =================

  const [backendPending, setBackendPending] = useState([]);
  const [backendActive, setBackendActive] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [refreshError, setRefreshError] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      setRefreshError("");

      if (!getAdminToken()) {
        throw new Error(
          "Admin token not found. Please logout and login again."
        );
      }

      const config = getAuthConfig();

      const [pendingResponse, activeResponse] = await Promise.all([
        axios.get(`${API}/pending-students`, config),
        axios.get(`${API}/active-students`, config),
      ]);

      setBackendPending(getStudentArray(pendingResponse.data));
      setBackendActive(getStudentArray(activeResponse.data));
    } catch (error) {
      console.error("Student fetch error:", error);

      setRefreshError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ================= CERTIFICATES =================

  const [mongoCertPending, setMongoCertPending] = useState([]);
  const [mongoCertIssued, setMongoCertIssued] = useState([]);

  const fetchCerts = useCallback(async () => {
    try {
      if (!getAdminToken()) {
        throw new Error("Admin token not found.");
      }

      const config = getAuthConfig();

      const [pendingResponse, issuedResponse] = await Promise.all([
        axios.get(`${CERT_API}/pending`, config),
        axios.get(`${CERT_API}/issued`, config),
      ]);

      setMongoCertPending(getCertificateArray(pendingResponse.data));
      setMongoCertIssued(getCertificateArray(issuedResponse.data));
    } catch (error) {
      console.error("Certificate fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchCerts();
  }, [fetchCerts]);

  // ================= MONGODB ATTENDANCE =================

  const [mongoLogs, setMongoLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState("");

  const fetchAttendance = useCallback(async () => {
    try {
      setLoadingLogs(true);
      setLogsError("");

      if (!getAdminToken()) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await axios.get(
        `${ATTENDANCE_API}/admin-logs`,
        getAuthConfig()
      );

      const attendanceData = getAttendanceArray(response.data);

      setMongoLogs(attendanceData);

      console.log("MongoDB Attendance Logs:", attendanceData);
      console.log("Total MongoDB attendance records:", attendanceData.length);
    } catch (error) {
      console.error("Attendance fetch error:", error);

      setLogsError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load MongoDB attendance records."
      );

      setMongoLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ================= OLD LOCAL DATA =================

  const students = getStudents() || [];
  const requests = getAllRequests() || [];

  // ================= PENDING STUDENTS =================

  const pending = backendPending.map((s) => ({
    id: s._id,
    name: s.name || "Unknown",
    institution: s.university || "—",
    domain: s.role || "—",
    email: s.email || "—",
    registered: fmtDateTime(s.createdAt),
    term: `${s.termStart || "—"} to ${s.termEnd || "—"}`,
  }));

  // ================= ACTIVE STUDENTS =================

  const activeStudents = backendActive.map((s) => ({
    id: s._id,
    name: s.name || "Unknown",
    email: s.email || "—",
    loginId: s.loginId || "—",
    courseCompleted: s.courseCompleted,
    institution: s.university || "—",
    domain: s.role || "—",
    term: `${s.termStart || "—"} to ${s.termEnd || "—"}`,
  }));

  // ================= LOCAL INTERNS =================

  const interns = students
    .filter((s) => s.status === "active")
    .map((s) => ({
      id: s.id,
      name: s.name,
      domain: s.role,
      institution: s.university,
      term: `${s.termStart} to ${s.termEnd}`,
      completed: isCourseCompleted(s),
    }));

  // ================= LOCAL CERTIFICATE REQUESTS =================

  const certRequests = requests
    .filter((r) => r.status === "pending")
    .map((r) => {
      const student = students.find((s) => s.id === r.studentId);

      if (!student) return null;

      const stats = getStats(getLogs(student.id));

      return {
        id: r.certId,
        studentId: student.id,
        student: student.name,
        internshipId: student.id,
        domain: student.role,
        institution: student.university,
        hours: Number(stats.total || 0),
        days: Number(stats.days || 0),
        requested: fmtDateTime(r.requestedAt),
      };
    })
    .filter(Boolean);

  // ================= LOCAL ISSUED CERTIFICATES =================

  const certificates = requests
    .filter((r) => r.status === "approved")
    .map((r) => {
      const student = students.find((s) => s.id === r.studentId);

      if (!student) return null;

      return {
        id: r.certId,
        student: student.name,
        domain: student.role,
        institution: student.university,
        grade: `Grade ${r.grade}`,
      };
    })
    .filter(Boolean);

  // ================= MONGODB ATTENDANCE LOGS =================
  // Backend returns student as a STRING and studentId separately.

  const mongodbAttendanceLogs = mongoLogs.map((record) => {
    const studentObject =
      record.student && typeof record.student === "object"
        ? record.student
        : null;

    const studentName =
      studentObject?.name ||
      (typeof record.student === "string" ? record.student : "") ||
      record.studentName ||
      "Unknown Student";

    const studentLoginId =
      record.loginId ||
      studentObject?.loginId ||
      record.studentId ||
      "—";

    return {
      id: record._id || `${studentLoginId}-${record.date}`,
      date: record.date || "—",
      student: studentName,
      internshipId: studentLoginId,
      start: record.entryTime || "—",
      end: record.exitTime || "Not exited",
      hours: formatHours(record.totalWorkingHours),
      task: record.dailyWork || "—",
      status: record.status || "Present",
      source: "MongoDB",
    };
  });

  // ================= LOCAL ATTENDANCE LOGS =================

  const localAttendanceLogs = students.flatMap((student) =>
    (getLogs(student.id) || []).map((record) => ({
      id: `${student.id}-${record.date}`,
      date: record.date || "—",
      student: student.name || "Unknown Student",
      internshipId: student.id || "—",
      start: record.entry || "—",
      end: record.exit || "—",
      hours: formatHours(record.hours),
      task: record.text || "—",
      status: "Local",
      source: "Local",
    }))
  );

  // ================= REMOVE DUPLICATE LOCAL LOGS =================
  // If MongoDB already has the same student's record for the same date,
  // show the MongoDB record only.

  const mongoDuplicateKeys = new Set(
    mongodbAttendanceLogs.map(
      (log) =>
        `${String(log.student).trim().toLowerCase()}-${String(log.date).trim()}`
    )
  );

  const uniqueLocalLogs = localAttendanceLogs.filter((log) => {
    const key = `${String(log.student).trim().toLowerCase()}-${String(
      log.date
    ).trim()}`;

    return !mongoDuplicateKeys.has(key);
  });

  // ================= COMBINED LOGS =================

  const logs = [
    ...mongodbAttendanceLogs,
    ...uniqueLocalLogs,
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  // ================= TOTAL HOURS =================

  const totalHours = logs.reduce(
    (sum, log) => sum + formatHours(log.hours),
    0
  );

  const totalInterns = activeStudents.length + pending.length;

  // ================= LOG FILTERS =================

  const logStudentNames = [
    ...new Set(logs.map((log) => log.student).filter(Boolean)),
  ];

  const filteredLogs = logs.filter((log) => {
    const matchIntern =
      internFilter === "All Interns" || log.student === internFilter;

    const searchText =
      `${log.student} ${log.internshipId} ${log.date} ${log.task} ${log.status}`
        .toLowerCase();

    const matchSearch = searchText.includes(logSearch.toLowerCase());

    return matchIntern && matchSearch;
  });

  const totalPendingCerts = certRequests.length + mongoCertPending.length;

  // ================= REFRESH ALL =================

  async function handleRefreshAll() {
    try {
      setRefreshing(true);

      await Promise.all([
        fetchStudents(),
        fetchCerts(),
        fetchAttendance(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }

  // ================= RESET STUDENT PASSWORD =================

  async function handleResetPassword(student) {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!window.confirm(`Reset password for ${student.name}?`)) return;

    try {
      setResetLoading(true);

      await axios.patch(
        `${API}/reset-password/${student.id}`,
        { password: newPassword },
        getAuthConfig()
      );

      alert(`Password reset successfully for ${student.name}.`);

      setResetStudentId("");
      setNewPassword("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Password reset failed. Please check the backend API."
      );
    } finally {
      setResetLoading(false);
    }
  }

  // ================= APPROVE STUDENT =================

  async function handleApproveStudent(student) {
    try {
      const response = await axios.patch(
        `${API}/approve/${student.id}`,
        {},
        getAuthConfig()
      );

      const loginId = response.data?.loginId || "Generated";

      alert(
        `Student Approved Successfully!\n\nStudent: ${student.name}\nLogin ID: ${loginId}`
      );

      await fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Student approval failed.");
    }
  }

  // ================= DECLINE STUDENT =================

  async function handleDeclineStudent(student) {
    if (!window.confirm(`Decline registration of ${student.name}?`)) return;

    try {
      await axios.patch(
        `${API}/decline/${student.id}`,
        {},
        getAuthConfig()
      );

      alert("Student registration declined.");
      await fetchStudents();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Decline failed. Backend decline route may be missing."
      );
    }
  }

  // ================= APPROVE MONGODB CERTIFICATE =================

  async function approveMongoCert(certificate) {
    if (!adminName.trim()) {
      alert("Please enter the Endorsing Authority name first.");
      return;
    }

    try {
      await axios.patch(
        `${CERT_API}/${certificate._id}/approve`,
        {
          grade: grades[certificate._id] || GRADES[0],
          endorsedBy: adminName.trim(),
        },
        getAuthConfig()
      );

      alert(
        `Certificate issued for ${
          certificate.student?.name || "student"
        }`
      );

      await fetchCerts();
    } catch (error) {
      alert(
        error.response?.data?.message || "Certificate approval failed."
      );
    }
  }

  // ================= REJECT MONGODB CERTIFICATE =================

  async function rejectMongoCert(certificate) {
    if (
      !window.confirm(
        "Reject this request? Student can request again."
      )
    ) {
      return;
    }

    try {
      await axios.patch(
        `${CERT_API}/${certificate._id}/reject`,
        {},
        getAuthConfig()
      );

      alert("Certificate request rejected.");
      await fetchCerts();
    } catch (error) {
      alert(
        error.response?.data?.message || "Certificate rejection failed."
      );
    }
  }

  // ================= MARK COURSE COMPLETED =================

  async function markMongoCourseCompleted(student) {
    try {
      await axios.patch(
        `${CERT_API}/complete/${student.id}`,
        {},
        getAuthConfig()
      );

      await fetchStudents();
      alert(`${student.name}: course marked completed.`);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update course status."
      );
    }
  }

  // ================= OLD LOCAL CERTIFICATE =================

  function issueCertificate(request) {
    if (!adminName.trim()) {
      alert("Please enter the Endorsing Authority name first.");
      return;
    }

    approveRequest(request.studentId, {
      grade: grades[request.studentId] || GRADES[0],
      endorsedBy: adminName.trim(),
    });
  }

  function requestRevision(studentId) {
    if (
      window.confirm(
        "Reject this request? Student can request again later."
      )
    ) {
      rejectRequest(studentId);
    }
  }

  // ================= EXPORT DATABASE =================

  function exportData() {
    const safeStudents = students.map(({ password, ...rest }) => rest);

    const data = {
      students: safeStudents,
      mongodbStudents: activeStudents,
      pendingStudents: backendPending,
      requests,
      logs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "interntrack-records.json";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  // ================= LOGOUT =================

  function handleLogout() {
    requestLogout({
      title: "Confirm Logout",
      message: "Are you sure you want to log out of the admin console?",
      onConfirm: () => {
        clearAuthSession();
        window.location.href = "/";
      },
    });
  }

  // ================= SIDEBAR TABS =================

  const tabs = [
    {
      key: "approvals",
      label: "Student Approvals & Directory",
      icon: "♙",
      badge: pending.length,
      badgeType: "amber",
    },
    {
      key: "certs",
      label: "Certificate Endorsements",
      icon: "✦",
      badge: totalPendingCerts,
      badgeType: "blue",
    },
    {
      key: "logs",
      label: `Daily Timesheet Logs (${mongoLogs.length})`,
      icon: "◷",
    },
  ];

  // ================= DASHBOARD UI =================

  return (
    <div className="app admin-layout">
      {/* LEFT SIDEBAR */}

      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">IT</div>

          <div>
            <strong>InternTrack</strong>
            <span>Admin Workspace</span>
          </div>
        </div>

        <p className="sidebar-section-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`sidebar-link ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="sidebar-link-icon">{tab.icon}</span>

              <span className="sidebar-link-text">
                {tab.key === "approvals"
                  ? "Student Approvals"
                  : tab.key === "certs"
                    ? "Certificate Enrollments"
                    : "Daily Timesheet Logs"}
              </span>

              {tab.badge !== undefined && (
                <span className={`sidebar-badge ${tab.badgeType || ""}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}

          <button
            className={`sidebar-link ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <span className="sidebar-link-icon">⚙</span>
            <span className="sidebar-link-text">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-status-dot" />
          <span>System operational</span>
        </div>
      </aside>

      {/* MAIN DASHBOARD */}

      <div className="admin-main">
        <div className="admin-top-actions">
          <span className="admin-pill">🛡 Admin Control</span>

          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-text">Logout</span>
          </button>
        </div>

        <main className="container">
          {/* HERO SECTION */}

          <section className="hero">
            <span className="hero-badge">⛨ Program Director Portal</span>

            <h1>Administrative Control &amp; Verification Console</h1>

            <p className="hero-sub">
              Supervising {totalInterns} interns · {totalHours.toFixed(1)} total
              verified practicum hours across all domains.
            </p>

            <div className="hero-actions">
              <button className="hero-btn" onClick={exportData}>
                <span className="teal">▤</span>
                Export Database
              </button>

              <button
                className="hero-btn"
                onClick={handleRefreshAll}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "↻ Refresh All Data"}
              </button>
            </div>

            <div className="hero-divider" />

            <div className="tile-grid">
              <StatTile
                label="Active Students"
                value={activeStudents.length}
                unit="students"
                note="MongoDB approved students"
              />

              <StatTile
                variant="amber"
                dot
                label="Pending ID Approvals"
                value={pending.length}
                unit="applicants"
                note="Requires admin sign-off"
              />

              <StatTile
                label="Total Work Logged"
                value={totalHours.toFixed(1)}
                unit="hours"
                note={`${logs.length} timesheets recorded`}
                noteClass="green"
                stacked
              />

              <StatTile
                variant="blue"
                label="Pending Certificates"
                value={totalPendingCerts}
                unit="requests"
                note="Awaiting certification review"
              />
            </div>
          </section>

          {/* TAB 1: STUDENT APPROVALS */}

          {activeTab === "approvals" && (
            <>
              <section className="card">
                <div className="card-head">
                  <h3>Pending Registration Endorsement Queue</h3>
                  <span className="count-chip amber">{pending.length}</span>
                </div>

                <p className="card-desc">
                  New registrations from MongoDB. Admin approval activates the
                  Student Login ID.
                </p>

                {refreshError && (
                  <p className="error-message">{refreshError}</p>
                )}

                {loadingStudents ? (
                  <EmptyState message="Loading pending registrations..." />
                ) : pending.length === 0 ? (
                  <EmptyState message="No pending registrations." />
                ) : (
                  pending.map((student) => (
                    <div className="pending-item" key={student.id}>
                      <div className="pending-top">
                        <h4>{student.name}</h4>

                        <span className="id-chip amber">{student.id}</span>

                        <span className="status-pill awaiting">
                          Awaiting Approval
                        </span>
                      </div>

                      <ul className="meta-list">
                        <li>▯ {student.institution}</li>
                        <li>▣ {student.domain}</li>
                        <li>✉ {student.email}</li>
                      </ul>

                      <p className="mono-note">
                        Registered: {student.registered} · Term: {student.term}
                      </p>

                      <div className="btn-row">
                        <button
                          className="btn btn-green"
                          onClick={() => handleApproveStudent(student)}
                        >
                          ✓ Approve &amp; Activate ID
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() => handleDeclineStudent(student)}
                        >
                          ⊗ Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </section>

              {/* ACTIVE STUDENTS DIRECTORY */}

              <section className="card">
                <h3>Active Enrolled Interns Directory</h3>

                <p className="card-desc">
                  Approved students registered in MongoDB.
                </p>

                {refreshError && (
                  <p className="error-message">
                    Could not load student data: {refreshError}
                  </p>
                )}

                {loadingStudents ? (
                  <EmptyState message="Loading active students..." />
                ) : activeStudents.length === 0 ? (
                  <EmptyState message="No active MongoDB students found." />
                ) : (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Login ID</th>
                          <th>Email</th>
                          <th>Institution</th>
                          <th>Course</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {activeStudents.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <strong>{student.name}</strong>
                            </td>

                            <td className="mono">{student.loginId}</td>
                            <td>{student.email}</td>
                            <td>{student.institution}</td>

                            <td>
                              {student.courseCompleted ? (
                                <span className="count-chip blue">
                                  Completed
                                </span>
                              ) : (
                                <button
                                  className="btn btn-outline"
                                  onClick={() =>
                                    markMongoCourseCompleted(student)
                                  }
                                >
                                  Mark Completed
                                </button>
                              )}
                            </td>

                            <td>
                              {resetStudentId === student.id ? (
                                <div className="reset-password-box">
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                    placeholder="New password (min 6)"
                                    minLength={6}
                                  />

                                  <div className="reset-actions">
                                    <button
                                      className="btn btn-green"
                                      disabled={resetLoading}
                                      onClick={() =>
                                        handleResetPassword(student)
                                      }
                                    >
                                      {resetLoading ? "Saving..." : "Confirm"}
                                    </button>

                                    <button
                                      className="btn btn-outline"
                                      disabled={resetLoading}
                                      onClick={() => {
                                        setResetStudentId("");
                                        setNewPassword("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  className="btn btn-outline"
                                  onClick={() => {
                                    setResetStudentId(student.id);
                                    setNewPassword("");
                                  }}
                                >
                                  Reset Password
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* OLD LOCAL DIRECTORY */}

              <section className="card">
                <h3>Legacy Local Intern Directory</h3>

                {interns.length === 0 ? (
                  <EmptyState message="No old local interns." />
                ) : (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Domain</th>
                          <th>Institution</th>
                          <th>Term</th>
                          <th>Course</th>
                        </tr>
                      </thead>

                      <tbody>
                        {interns.map((intern) => (
                          <tr key={intern.id}>
                            <td>
                              <strong>{intern.name}</strong>
                              <span className="sub-id">{intern.id}</span>
                            </td>

                            <td>{intern.domain}</td>
                            <td>{intern.institution}</td>
                            <td className="mono">{intern.term}</td>

                            <td>
                              {intern.completed ? (
                                <span className="count-chip blue">
                                  Completed
                                </span>
                              ) : (
                                <button
                                  className="btn btn-outline"
                                  onClick={() =>
                                    markCourseCompleted(intern.id)
                                  }
                                >
                                  Mark Completed
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          {/* TAB 2: CERTIFICATES */}

          {activeTab === "certs" && (
            <>
              <section className="card">
                <div className="card-head">
                  <h3>
                    <span className="orange-icon">✪</span>
                    Certificate Issuance Requests
                  </h3>

                  <span className="count-chip blue">{totalPendingCerts}</span>
                </div>

                <p className="card-desc">
                  Review student performance and logged hours.
                </p>

                <label className="admin-field">
                  Endorsing Authority
                  <input
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter admin name"
                  />
                </label>

                {mongoCertPending.map((certificate) => (
                  <div className="cert-request" key={certificate._id}>
                    <div className="pending-top">
                      <h4>{certificate.student?.name || "Student"}</h4>

                      <span className="id-chip grey">
                        {certificate.student?.loginId || "—"}
                      </span>
                    </div>

                    <p className="line">
                      Email:{" "}
                      <strong>{certificate.student?.email || "—"}</strong>
                    </p>

                    <p className="line small">
                      Requested: {fmtDateTime(certificate.requestedAt)}
                    </p>

                    <label className="admin-field">
                      Grade
                      <select
                        value={grades[certificate._id] || GRADES[0]}
                        onChange={(e) =>
                          setGrades((prev) => ({
                            ...prev,
                            [certificate._id]: e.target.value,
                          }))
                        }
                      >
                        {GRADES.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="btn-row two">
                      <button
                        className="btn btn-orange"
                        onClick={() => approveMongoCert(certificate)}
                      >
                        ✪ Endorse &amp; Issue Certificate
                      </button>

                      <button
                        className="btn btn-outline"
                        onClick={() => rejectMongoCert(certificate)}
                      >
                        Request Revisions
                      </button>
                    </div>
                  </div>
                ))}

                {certRequests.length === 0 &&
                mongoCertPending.length === 0 ? (
                  <EmptyState message="There are no pending certificate requests." />
                ) : (
                  certRequests.map((request) => (
                    <div className="cert-request" key={request.id}>
                      <div className="pending-top">
                        <h4>{request.student}</h4>

                        <span className="id-chip grey">
                          {request.internshipId}
                        </span>
                      </div>

                      <p className="line">
                        Domain: <strong>{request.domain}</strong>
                      </p>

                      <p className="line">
                        Institution: <strong>{request.institution}</strong>
                      </p>

                      <p className="hours-line">
                        {request.hours.toFixed(1)} Verified Hours (
                        {request.days} Days)
                      </p>

                      <p className="line small">
                        Requested: {request.requested}
                      </p>

                      <label className="admin-field">
                        Grade
                        <select
                          value={grades[request.studentId] || GRADES[0]}
                          onChange={(e) =>
                            setGrades((prev) => ({
                              ...prev,
                              [request.studentId]: e.target.value,
                            }))
                          }
                        >
                          {GRADES.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="btn-row two">
                        <button
                          className="btn btn-orange"
                          onClick={() => issueCertificate(request)}
                        >
                          ✪ Endorse &amp; Issue Certificate
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() => requestRevision(request.studentId)}
                        >
                          Request Revisions
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </section>

              {/* ISSUED CERTIFICATES */}

              <section className="card">
                <h3>
                  Issued &amp; Verifiable Certificates (
                  {certificates.length + mongoCertIssued.length})
                </h3>

                {certificates.length === 0 &&
                  mongoCertIssued.length === 0 && (
                    <EmptyState message="No certificates issued yet." />
                  )}

                {mongoCertIssued.map((certificate) => (
                  <div className="issued-card" key={certificate._id}>
                    <div className="issued-top">
                      <span className="id-chip amber-text">
                        {certificate.certificateNo || "Certificate"}
                      </span>

                      <span className="endorsed">⊙ Endorsed</span>
                    </div>

                    <h4>{certificate.student?.name || "Student"}</h4>

                    <p className="issued-domain">
                      {certificate.student?.loginId || "—"}
                    </p>

                    <div className="issued-bottom">
                      <span>
                        Grade: <strong>{certificate.grade || "—"}</strong>
                      </span>
                    </div>
                  </div>
                ))}

                {certificates.map((certificate) => (
                  <div className="issued-card" key={certificate.id}>
                    <div className="issued-top">
                      <span className="id-chip amber-text">
                        {certificate.id}
                      </span>

                      <span className="endorsed">⊙ Endorsed</span>
                    </div>

                    <h4>{certificate.student}</h4>

                    <p className="issued-domain">
                      {certificate.domain} · {certificate.institution}
                    </p>

                    <div className="issued-bottom">
                      <span>
                        Grade: <strong>{certificate.grade}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}

          {/* TAB 3: ATTENDANCE LOGS */}

          {activeTab === "logs" && (
            <section className="card">
              <div className="card-head">
                <h3>All Daily Work Records ({filteredLogs.length})</h3>
                <span className="count-chip blue">
                  {mongoLogs.length} MongoDB
                </span>
              </div>

              <p className="card-desc">
                Attendance records saved in MongoDB, along with older local
                timesheet records that do not already exist in MongoDB.
              </p>

              {logsError && (
                <p className="error-message">{logsError}</p>
              )}

              <div className="filters">
                <select
                  className="select"
                  value={internFilter}
                  onChange={(e) => setInternFilter(e.target.value)}
                >
                  <option>All Interns</option>

                  {logStudentNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
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

                <button
                  className="btn btn-outline"
                  onClick={fetchAttendance}
                  disabled={loadingLogs}
                >
                  {loadingLogs ? "Loading..." : "↻ Refresh Logs"}
                </button>
              </div>

              {loadingLogs ? (
                <EmptyState message="Loading MongoDB attendance records..." />
              ) : filteredLogs.length === 0 ? (
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
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredLogs.map((log, index) => (
                        <tr
                          key={`${log.id}-${log.date}-${index}`}
                        >
                          <td className="mono date-cell">{log.date}</td>

                          <td>
                            <strong>{log.student}</strong>
                            <span className="sub-id">
                              Login ID: {log.internshipId}
                            </span>
                          </td>

                          <td className="mono">
                            {log.start} – {log.end}
                          </td>

                          <td className="mono">
                            {formatHours(log.hours).toFixed(2)}h
                          </td>

                          <td className="task-cell">{log.task}</td>

                          <td>
                            <span
                              className={`attendance-status ${
                                log.status === "Completed"
                                  ? "completed"
                                  : "present"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* TAB 4: SETTINGS */}

          {activeTab === "settings" && (
            <section className="card">
              <h3>Admin Settings</h3>

              <p className="card-desc">
                Manage your administrative workspace.
              </p>

              <label className="admin-field">
                Endorsing Authority
                <input
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Enter admin name"
                />
              </label>

              <p className="settings-note">
                This name is used when endorsing and issuing student
                certificates.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

// ================= SMALL COMPONENTS =================

function StatTile({
  label,
  value,
  unit,
  note,
  variant = "",
  dot,
  noteClass = "",
  stacked,
}) {
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

export default AdminDashboard;
