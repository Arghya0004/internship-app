/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [tab, setTab] = useState(null); // null | "student" | "register" | "admin"

  const openAuth = (t = "student") => setTab(t);
  const closeAuth = () => setTab(null);

  return (
    <AuthModalContext.Provider value={{ tab, setTab, openAuth, closeAuth }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);
