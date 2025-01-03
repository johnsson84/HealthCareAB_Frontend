import React from "react";
import "./Footer.css";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const UserLinks = [{ name: "Something1", path: "/underconstruction" }];

  const doctorLinks = [
    { name: "Hem", path: "/admin/dashboard" },
    { name: "Something2", path: "/underconstruction" },
    { name: "Something3", path: "/underconstruction" },
    { name: "Profile", path: "/caregiverprofile" },
  ];

  const patientLinks = [
    { name: "Hem", path: "/user/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Something4", path: "/underconstruction" },
    { name: "Something5", path: "/underconstruction" },
  ];

  const links = [
    ...UserLinks,
    ...(userType === "doctor" ? doctorLinks : []),
    ...(userType === "patient" ? patientLinks : []),
  ];

  const handleNavigate = (e) => {
    navigate(e);
  };

  return (
    <footer className="footer">
      <nav className="footer-nav">
      {links
          .filter((link) => link.path !== location.pathname) 
          .map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigate(link.path)}
              className="footer-link"
            >
              <span className="label">{link.name}</span>
            </button>
          ))}
      </nav>
    </footer>
  );
};

export default Footer;

/// <Footer userType="doctor" /> This for the doctor
/// <Footer userType="patient" /> for the patient
