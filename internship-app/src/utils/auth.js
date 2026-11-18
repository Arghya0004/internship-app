/**
 * Centralized Authentication & Session Management
 */

export const AUTH_KEYS = [
  "token",
  "studentToken",
  "adminToken",
  "student",
  "studentId",
  "admin",
  "userRole",
  "currentUser",
  "user",
  "it_current_student",
];

/**
 * Completely clears all authentication tokens and session data from localStorage,
 * and notifies active components across tabs and windows.
 */
export function clearAuthSession() {
  AUTH_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  });

  // Dispatch events so all components in current window & tabs sync immediately
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("db-change"));
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Returns the currently authenticated user object, or null if no valid token exists.
 * Automatically purges any stale session data if tokens are missing.
 */
export function getAuthUser() {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("studentToken");

    // If there is no token, the user is unauthenticated
    if (!token) {
      // Purge leftover stale session flags
      localStorage.removeItem("currentUser");
      localStorage.removeItem("student");
      localStorage.removeItem("admin");
      localStorage.removeItem("userRole");
      localStorage.removeItem("studentId");
      localStorage.removeItem("it_current_student");
      return null;
    }

    // 1. Check currentUser
    const currentStr = localStorage.getItem("currentUser");
    if (currentStr) {
      const parsed = JSON.parse(currentStr);
      if (parsed && (parsed.role || parsed.name || parsed.id)) {
        return parsed;
      }
    }

    // 2. Check Admin session
    const role = localStorage.getItem("userRole");
    if (role === "admin" || localStorage.getItem("adminToken")) {
      const adminStr = localStorage.getItem("admin");
      const admin = adminStr ? JSON.parse(adminStr) : null;
      return {
        role: "admin",
        name: admin?.loginId || admin?.name || "Admin",
      };
    }

    // 3. Check Student session
    const studentStr = localStorage.getItem("student");
    if (studentStr) {
      const student = JSON.parse(studentStr);
      return {
        role: "student",
        name: student?.name || "Student",
        id: student?.id,
      };
    }

    // Fallback if only generic token exists
    return {
      role: role || "student",
      name: "User",
    };
  } catch {
    return null;
  }
}

/**
 * Helper to check if a user session is active.
 */
export function isAuthenticated() {
  return Boolean(getAuthUser());
}
