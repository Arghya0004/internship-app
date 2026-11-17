import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthModalProvider } from "./context/authModalContext";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
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

  // Dashboard page gulo te Navbar ebong Footer hide korar condition
  const hideNavFooter =
    location.pathname.includes("/student-dashboard") ||
    location.pathname.includes("/admin-dashboard");

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <AuthModal />

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