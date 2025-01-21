import React, { useState, useEffect } from "react";
import "./Footer.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/check`,
        { withCredentials: true }
      );
      setRole(response.data.roles ? response.data.roles[0] : undefined);
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (!loading && role === undefined) {
      setLoading(true);
      fetchRole();
    }
  }, [role, loading]);

  if (["/login", "/signup", , "/"].includes(location.pathname)) return null;

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) return <div>Loading footer...</div>;

  const doctorButtons = [
    { name: "Home", path: "/doctor/dashboard" },
    { name: "Profile", path: "/profile" },

    { name: "Calendar", path: "/calendar" },
    {
      name: "Schedule",
      path: "/schedule",
    },
    {
      name: "Appointments",
      path: "/appointment",
    },
    {
      name: "Feedback",
      path: "/feedback",
    },
  ];
  const adminButtons = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Admin-Profile", path: "/profile" },

    { name: "Register Admin", path: "/AdminSignup" },
    {
      name: "Register Caregiver",
      path: "/CargiverSignup",
    },
    
  ];

  const userButtons = [
    { name: "Home", path: "/user/dashboard" },
    { name: "Profile", path: "/profile" },
    {
      name: "Book Doctor",
      path: "/calendar",
    },
    {
      name: "Meetings",
      path: "/appointment",
    },
    {
      name: "Feedback",
      path: "/feedback",
    },
  ];

  const buttons =
    role === "ADMIN" ? adminButtons : role === "USER" ? userButtons : role === "DOCTOR" ? doctorButtons : [];

  return (
    <div className="footer">
      <nav className="footer-nav">
        {buttons
          .filter((button) => button.path !== location.pathname) // Exclude current path
          .map((button) => (
            <button
              key={button.name}
              onClick={() => handleNavigate(button.path)}
              className="footer-link"
            >
              <span className="label">{button.name}</span>
            </button>
          ))}
      </nav>
    </div>
  );
};

export default Footer;
