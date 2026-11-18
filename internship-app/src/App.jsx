import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { AuthModalProvider, useAuthModal } from "./context/authModalContext";
import { clearAuthSession, isAuthenticated } from "./utils/auth";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import LogoutDialog from "./components/LogoutDialog";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CertificateGenerator from "./pages/CertificateGenerator";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutDialog, confirmLogout, cancelLogout, requestLogout } = useAuthModal();

  // Dashboard pages where Navbar and Footer are hidden
  const hideNavFooter =
    location.pathname.includes("/student-dashboard") ||
    location.pathname.includes("/admin-dashboard");

  // Intercept browser back arrow on protected dashboard pages
  useEffect(() => {
    const isProtected =
      location.pathname.includes("/student-dashboard") ||
      location.pathname.includes("/admin-dashboard");

    if (isProtected && isAuthenticated()) {
      // Push history trap state to intercept popstate
      window.history.pushState({ protectedTrap: true }, "", window.location.href);

      const onPopState = () => {
        // Immediately retain current location in history while prompt is open
        window.history.pushState({ protectedTrap: true }, "", window.location.href);

        requestLogout({
          title: "Log out?",
          message: "You are currently signed in. Are you sure you want to log out?",
          onConfirm: () => {
            clearAuthSession();
            window.location.href = "/";
          },
        });
      };

      window.addEventListener("popstate", onPopState);
      return () => window.removeEventListener("popstate", onPopState);
    }
  }, [location.pathname, requestLogout, navigate]);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <AuthModal />
      <LogoutDialog
        isOpen={logoutDialog.isOpen}
        title={logoutDialog.title}
        message={logoutDialog.message}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Student Login */}
        <Route path="/login/student" element={<StudentLogin />} />

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* Certificate Generator */}
        <Route
          path="/certificate"
          element={<CertificateGenerator />}
        />
        <Route
          path="/certificate-generator"
          element={<CertificateGenerator />}
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div style={{ padding: 60, textAlign: "center" }}>
              <h1>404 - Page Not Found</h1>
              <p>এই পেজটি খুঁজে পাওয়া যায়নি।</p>
              <a href="/">Go to Home</a>
            </div>
          }
        />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthModalProvider>
        <Layout />
      </AuthModalProvider>
    </BrowserRouter>
  );
}