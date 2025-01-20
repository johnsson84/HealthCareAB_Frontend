import axios from "axios";
import React, { useState} from "react";
import "./AdminSignup.css";

const AdminSignup = () => {
  const [error, setError] = useState("");
  const [Message, setMessage] = useState("");


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
    setMessage("");

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
         "An error occurred while signing up."
      );
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div>
        <h2 className="title">Create an Admin Account</h2>
        <form onSubmit={handlarSubmit} className="formWrapper">
          <label>* Username (3-20 chars, alphanumeric only): </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="styledInput"
            minLength="3"
            maxLength="20"
            pattern="^[a-zA-Z0-9]+$"
            title="Username should be 3-20 characters and alphanumeric only."
            required
          />
          <label>
            * Password (8-20 chars, include upper, lower, and number):{" "}
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="styledInput"
            minLength="8"
            maxLength="20"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$"
            title="Password must be 8-20 characters, include uppercase, lowercase, and a number."
            required
          />
           <label>* Mail:</label>
          <input
            type="email"
            name="mail"
            placeholder="Email"
            value={formData.mail}
            onChange={handleChange}
            className="styledInput"
            maxLength="50"
            required
          />
          <label>* First Name (2-30 chars, letters only):</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="styledInput"
            minLength="2"
            maxLength="30"
            pattern="^[a-zA-ZÀ-ÿñÑ'\\-\\s]+$"
            title="First name should be 2-30 characters and contain only letters, no numbers."
            required
          />
          <label>* Last Name (2-30 chars, letters only):</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="styledInput"
            minLength="2"
            maxLength="30"
            pattern="^[a-zA-ZÀ-ÿñÑ'\\-\\s]+$"
            title="Last name should be 2-30 characters and contain only letters, no numbers."
            required
          
          />
          <button type="submit" className="loginButton">
          Create an Admin
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {Message && <p style={{ color: "green" }}>{Message}</p>}
      </div>
    </div>
  );
};

export default AdminSignup;
