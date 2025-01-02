import React from "react";
import "./Footer.css";

const Footer = ({ userType }) => {
  const UserLinks = [
    { name: "Hem", path: "/" },
    { name: "Something1", path: "/something" },
  ];

  const doctorLinks = [
    { name: "Something2", path: "/" },
    { name: "Something3", path: "/" },
    { name: "Profile", path: "/caregiverprofile" },
  ];

  const patientLinks = [
    { name: "Profile", path: "/profile" },
    { name: "Something4", path: "/" },
    { name: "Something5", path: "/" },
  ];

  const links = [
    ...UserLinks,
    ...(userType === "doctor" ? doctorLinks : []),
    ...(userType === "patient" ? patientLinks : []),
  ];

  return (
    <footer className="footer">
      <nav className="footer-nav">
        {links.map((link) => (
          <a key={link.name} href={link.path} className="footer-link">
            <span className="label">{link.name}</span>
          </a>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;

/// <Footer userType="doctor" /> This for the doctor
/// <Footer userType="patient" /> for the patient
