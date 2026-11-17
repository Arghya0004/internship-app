import { useState } from "react";
import { MapPin, Mail, Phone, Clock, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import "./Contact.css";

const faqs = [
  {
    q: "How does the automatic shift hour calculation work?",
    a: "When an intern inputs their entry time (e.g. 09:30) and exit time (e.g. 17:45), InternTrack automatically converts both timestamps to cumulative minutes, computes the net elapsed duration, handles overnight shifts if applicable, and updates both the total hours and daily average in real-time.",
  },
  {
    q: "Why does the Admin need to approve student registration before login?",
    a: "Admin approval ensures only genuine, verified university students get access. After approval, the student receives an active Login ID (INT-2026-XXXX).",
  },
  {
    q: "How are certificates requested and endorsed?",
    a: "Students submit an issuance request from the Certificate Generator tab. Program directors review hours and task quality, assign a grade, and digitally endorse the certificate.",
  },
  {
    q: "How can employers or universities verify a certificate?",
    a: "Enter the unique certificate ID (e.g. CERT-INT-2026-8821) in the Verification box on the Home page to instantly validate authenticity.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="contact-page">

      {/* ===== HEADER ===== */}
      <section className="contact-header">
        <h1>Contact Us & Support Center</h1>
        <p>
          Have questions regarding student onboarding, timesheet verification, or
          institutional partnerships? Our administrative registrar is ready to assist.
        </p>
      </section>

      {/* ===== CENTERED CONTAINER ===== */}
      <div className="contact-container">
        <div className="contact-side">

          {/* Registrar Office */}
          <div className="contact-card">
            <h2>Registrar Office</h2>
            <ul className="contact-info">
              <li>
                <MapPin size={16} />
                <div>
                  <b>InternTrack Consortium</b><br />
                  450 Serra Mall, Innovation Pavilion Suite 300<br />
                  Stanford, CA 94305, United States
                </div>
              </li>
              <li>
                <Mail size={16} />
                <div>
                  <b>Direct Email:</b>{" "}
                  <a href="mailto:registrar@certitrack.io">registrar@certitrack.io</a>
                </div>
              </li>
              <li>
                <Phone size={16} />
                <div><b>Verification Desk:</b> +1 (555) 782-9010</div>
              </li>
              <li>
                <Clock size={16} />
                <div><b>Office Hours:</b> Mon – Fri, 9:00 AM – 5:00 PM PST</div>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="contact-card">
            <h2 className="contact-faq-title">
              <HelpCircle size={18} /> Frequently Asked Questions
            </h2>

            {faqs.map((f, i) => (
              <div className="contact-faq" key={i}>
                <button
                  className="contact-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  {openFaq === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                {openFaq === i && <p className="contact-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}