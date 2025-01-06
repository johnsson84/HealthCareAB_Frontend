import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Title = styled.h2`
  font-size: 22px;
`;

function Signup() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    mail: "",
    firstName: "",
    lastName: "",
  });
  const resetForm = () => {
    setCredentials({
      username: "",
      password: "",
      mail: "",
      firstName: "",
      lastName: "",
    });
  };

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNavigateToLogin = () => {
    navigate("/home");
    window.location.reload();
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { username, roles } = response.data;

      setAuthState({
        isAuthenticated: true,
        user: username,
        roles: roles,
        loading: false,
      });

      // redirect based on role
      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
        window.location.reload();
      } else {
        navigate("/user/dashboard", { replace: true });
        window.location.reload();
      }
      resetForm();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setError(data.message || "Invalid input. Check details.");
        } else if (status === 401) {
          setError("Unauthorized. Check credentials.");
        } else if (status === 500) {
          setError("Server error, Try again later. :(");
        } else {
          setError("An unexpected error occurred, please try again. :(");
        }
      } else if (error.request) {
        setError(
          "No response from server, check internet connection or try again later. :("
        );
      } else {
        setError("An error occurred, try again later. :(");
      }
    }
  };

  return (
    <div className="loginContainer">
      <Title>Register</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="formWrapper" onSubmit={handleSignup}>
        <p>* = Mandatory</p>
        <label>* Username (3-20 chars, alphanumeric only): </label>
        <input
          className="styledInput"
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange}
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
          className="styledInput"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          minLength="8"
          maxLength="20"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$"
          title="Password must be 8-20 characters, include uppercase, lowercase, and a number."
          required
        />
        <label>* Mail:</label>
        <input
          className="styledInput"
          name="mail"
          type="mail"
          value={credentials.mail}
          onChange={handleInputChange}
          maxLength="50"
          required
        />
        <label>* First Name (2-30 chars, letters only):</label>
        <input
          className="styledInput"
          name="firstName"
          type="text"
          value={credentials.firstName}
          onChange={handleInputChange}
          minLength="2"
          maxLength="30"
          pattern="^[a-zA-ZÀ-ÿñÑ'\\-\\s]+$"
          title="First name should be 2-30 characters and contain only letters, no numbers."
          required
        />
        <label>* Last Name (2-30 chars, letters only):</label>
        <input
          className="styledInput"
          name="lastName"
          type="text"
          value={credentials.lastName}
          onChange={handleInputChange}
          minLength="2"
          maxLength="30"
          pattern="^[a-zA-ZÀ-ÿñÑ'\\-\\s]+$"
          title="Last name should be 2-30 characters and contain only letters, no numbers."
          required
        />
        <button className="loginButton" type="submit">
          Sign Up
        </button>
      </form>
      <div className="haveAccountContainer">
        <button className="haveAccountButton" onClick={handleNavigateToLogin}>
          Already have an account?
        </button>
      </div>
    </div>
  );
}

export default Signup;
