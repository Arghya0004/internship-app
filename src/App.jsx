import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthModalProvider } from "./context/authModalContext";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";


import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CertificateGenerator from "./pages/CertificateGenerator";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthModalProvider>
        <Navbar />

        <AuthModal />

        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* About Page */}
          <Route path="/about" element={<About />} />

          {/* Contact Page */}
          <Route path="/contact" element={<Contact />} />

          {/* Certificate Generator */}
          <Route
            path="/certificate"
            element={<CertificateGenerator />}
          />

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

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <h1 style={{ padding: 40, textAlign: "center" }}>
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>

        <Footer />
      </AuthModalProvider>
    </BrowserRouter>
  );
}

