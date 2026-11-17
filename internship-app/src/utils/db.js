// ================= DATABASE (localStorage) =================
// Kono demo data nei. Pore backend ashle ei function gulo API call hobe.

const K = {
  students: "it_students",
  logs: "it_logs",
  requests: "it_requests",
  current: "it_current_student",
};

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("db-change")); // same tab-e live update
};

export const todayStr = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// ---------------- Students ----------------
export const getStudents = () => read(K.students, []);

// purano student-der status na thakle "active" dhora hobe
export const getStudentStatus = (s) => s.status || "active";

export function registerStudent(data) {
  // data = { name, email, password, role, university, termStart, termEnd }
  const students = getStudents();
  const year = new Date().getFullYear();

  let id;
  do {
    id = `INT-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (students.some((s) => s.id === id));

  const student = {
    id,
    name: data.name.trim(),
    email: (data.email || "").trim(),
    password: data.password,
    role: data.role.trim(),
    university: data.university.trim(),
    termStart: data.termStart,
    termEnd: data.termEnd,
    status: "pending", // admin approve korle "active" hobe
    courseCompleted: false,
    createdAt: new Date().toISOString(),
  };

  write(K.students, [...students, student]);

  const logs = read(K.logs, {});
  logs[id] = [];
  write(K.logs, logs);

  return student;
}

export function approveStudent(studentId) {
  write(
    K.students,
    getStudents().map((s) => (s.id === studentId ? { ...s, status: "active" } : s))
  );
}

export function declineStudent(studentId) {
  write(
    K.students,
    getStudents().map((s) => (s.id === studentId ? { ...s, status: "declined" } : s))
  );
}

// ---------------- Auth ----------------
// Error message soho result dey: { ok, student, error }
export function checkLogin({ id, password, name }) {
  const s = getStudents().find(
    (x) => x.id.toLowerCase() === String(id || "").trim().toLowerCase()
  );

  if (
    !s ||
    s.password !== password ||
    (name && s.name.toLowerCase() !== String(name).trim().toLowerCase())
  ) {
    return { ok: false, error: "Invalid Name, Student ID or Password." };
  }

  const status = getStudentStatus(s);
  if (status === "pending")
    return { ok: false, error: "Your registration is awaiting admin approval." };
  if (status === "declined")
    return { ok: false, error: "Your registration was declined by the admin." };

  localStorage.setItem(K.current, s.id);
  window.dispatchEvent(new Event("db-change"));
  return { ok: true, student: s };
}

// Purano code-er jonno: student ba null return kore
export const loginStudent = (creds) => {
  const r = checkLogin(creds);
  return r.ok ? r.student : null;
};

export const getCurrentStudent = () => {
  const id = localStorage.getItem(K.current);
  return id ? getStudents().find((s) => s.id === id) || null : null;
};

export const logoutStudent = () => {
  localStorage.removeItem(K.current);
  window.dispatchEvent(new Event("db-change"));
};

export const isCourseCompleted = (student) =>
  !!student && (student.courseCompleted || todayStr() >= student.termEnd);

export function markCourseCompleted(studentId) {
  write(
    K.students,
    getStudents().map((s) => (s.id === studentId ? { ...s, courseCompleted: true } : s))
  );
}

// ---------------- Logs ----------------
export const getLogs = (studentId) => read(K.logs, {})[studentId] || [];

export function addLog(studentId, log) {
  const all = read(K.logs, {});
  const list = [log, ...(all[studentId] || [])].sort((a, b) => b.date.localeCompare(a.date));
  all[studentId] = list;
  write(K.logs, all);
  return list;
}

export function getStats(logs) {
  const total = +logs.reduce((sum, l) => sum + l.hours, 0).toFixed(2);
  const days = new Set(logs.map((l) => l.date)).size;
  return { total, days, avg: days ? (total / days).toFixed(1) : "0.0" };
}

// ---------------- Certificate Requests ----------------
export const getAllRequests = () => read(K.requests, []);

export const getRequest = (studentId) =>
  getAllRequests().find((r) => r.studentId === studentId) || null;

export function submitRequest(studentId) {
  const others = getAllRequests().filter((r) => r.studentId !== studentId);
  const req = {
    certId: `CERT-${studentId}`,
    studentId,
    status: "pending",
    requestedAt: new Date().toISOString(),
    approvedAt: null,
    grade: null,
    endorsedBy: null,
    totalHours: null,
    daysRecorded: null,
  };
  write(K.requests, [...others, req]);
  return req;
}

export function approveRequest(studentId, { grade, endorsedBy }) {
  const stats = getStats(getLogs(studentId));
  write(
    K.requests,
    getAllRequests().map((r) =>
      r.studentId === studentId
        ? {
            ...r,
            status: "approved",
            approvedAt: todayStr(),
            grade,
            endorsedBy,
            totalHours: stats.total,
            daysRecorded: stats.days,
          }
        : r
    )
  );
}

export function rejectRequest(studentId) {
  write(
    K.requests,
    getAllRequests().map((r) => (r.studentId === studentId ? { ...r, status: "rejected" } : r))
  );
}

// Public credential check
export function verifyCertificate(certId) {
  const req = getAllRequests().find(
    (r) => r.certId.toLowerCase() === String(certId).trim().toLowerCase() && r.status === "approved"
  );
  if (!req) return null;
  const student = getStudents().find((s) => s.id === req.studentId);
  return student ? { request: req, student } : null;
}

