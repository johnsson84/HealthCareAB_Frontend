import axios from "axios";
import React, { useState, useEffect } from "react";
import "./AdminSignup.css";

const AdminSignup = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setloading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    mail: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      setloading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register/admin`,
        formData,
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Admin account created successfully!");
      setFormData({
        username: "",
        password: "",
        mail: "",
        firstName: "",
        lastName: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while signing up."
      );
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <h2>Admin Signup</h2>
        <form onSubmit={handlarSubmit} className="signup-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="email"
            name="mail"
            placeholder="Email"
            value={formData.mail}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Create Admin Account
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default AdminSignup;
