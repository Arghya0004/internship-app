/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { clearAuthSession } from "../utils/auth";

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [tab, setTab] = useState(null); // null | "student" | "register" | "admin" | "forgot"
  const [logoutDialog, setLogoutDialog] = useState({
    isOpen: false,
    title: "Confirm Logout",
    message: "Are you sure you want to log out of your account?",
    onConfirm: null,
    onCancel: null,
  });

  const openAuth = (t = "student") => setTab(t);
  const closeAuth = () => setTab(null);

  const requestLogout = useCallback(
    ({ title, message, onConfirm, onCancel } = {}) => {
      setLogoutDialog({
        isOpen: true,
        title: title || "Confirm Logout",
        message: message || "Are you sure you want to log out of your account?",
        onConfirm: onConfirm || null,
        onCancel: onCancel || null,
      });
    },
    []
  );

  const closeLogout = useCallback(() => {
    setLogoutDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const confirmLogout = useCallback(() => {
    if (typeof logoutDialog.onConfirm === "function") {
      logoutDialog.onConfirm();
    } else {
      clearAuthSession();
      window.location.href = "/";
    }
    closeLogout();
  }, [logoutDialog, closeLogout]);

  const cancelLogout = useCallback(() => {
    if (typeof logoutDialog.onCancel === "function") {
      logoutDialog.onCancel();
    }
    closeLogout();
  }, [logoutDialog, closeLogout]);

  return (
    <AuthModalContext.Provider
      value={{
        tab,
        setTab,
        openAuth,
        closeAuth,
        logoutDialog,
        requestLogout,
        closeLogout,
        confirmLogout,
        cancelLogout,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);
