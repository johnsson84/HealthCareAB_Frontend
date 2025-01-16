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
    { name: "Doctor-Something3", path: "/underconstruction" },
    {
      name: "Doctor-Something4",
      path: "/underconstruction",
    },
    {
      name: "Doctor-Something5",
      path: "/underconstruction",
    },
    { name: "Profile", path: "/caregiverprofile" },
  ];
  const adminButtons = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Register Admin", path: "/underconstruction" },
    {
      name: "Register Caregiver",
      path: "/underconstruction",
    },
    {
      name: "Delete Feedback",
      path: "/underconstruction",
    },
    { name: "Admin-Profile", path: "/caregiverprofile" },
  ];

  const userButtons = [
    { name: "Home", path: "/user/dashboard" },
    { name: "Profile", path: "/profile" },
    {
      name: "Book Doctor",
      path: "/calendar",
    },
    {
      name: "My Meetings",
      path: "/appointment",
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
