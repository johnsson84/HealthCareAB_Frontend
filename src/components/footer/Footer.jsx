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
    {
      name: "Edit schedule",
      path: "/schedule",
    },
    {
      name: "Incoming appointments",
      path: "/dappointment",
    },
    {
      name: "Appointments history",
      path: "/appointment/history",
    },
    {
      name: "Feedback",
      path: "/feedback",
    },
    {
      name: "Change profile picture",
      path: "/change-profile-picture",
    },
  ];
  const adminButtons = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Admin profile", path: "/profile" },

    { name: "Register Admin", path: "/AdminSignup" },
    {
      name: "Register Caregiver",
      path: "/CargiverSignup",
    },
    {
      name: "Feedback",
      path: "/feedback",
    },
    {
      name: "Add condition",
      path: "/add/condition",
    },
    {
      name: "Edit coworkers location",
      path: "/edit/coworker/location",
    },
    {
      name: "Change profile picture",
      path: "/change-profile-picture",
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
      name: "Upcoming appointments",
      path: "/appointment",
    },
    {
      name: "Appointment history",
      path: "/appointment/history",
    },
    {
      name: "Give feedback",
      path: "/feedback",
    },
    {
      name: "Change profile picture",
      path: "/change-profile-picture",
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
