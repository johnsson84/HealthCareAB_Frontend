import axios from "axios";
import React, { useState, useEffect } from "react";

const CargiverSignup = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [faciltys, setFaciltys] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  
  useEffect(() => {
    const getFacilityList = async () => {
      try {
        const responses = await axios.get(
          `${import.meta.env.VITE_API_URL}/facility/all`,
         // setFaciltys(responses.data),
          { withCredentials: true },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setFaciltys(responses.data),
        console.log(facilty);
      } catch (err) {
        err;
      }
    };
    getFacilityList();
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    mail: "",
    firstName: "",
    lastName: "",
    specialities: "",
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
        `${import.meta.env.VITE_API_URL}/auth/register/caregiver`,
        formData,
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("caregiver account created successfully!");
      setFormData({
        username: "",
        password: "",
        mail: "",
        firstName: "",
        lastName: "",
        specialities: "",
      });
    } catch (err) {
      setError("An error occurred while signing up.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div>
        <h2 className="title">Signup Caregiver </h2>
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
            // required
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
            //required
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
            //required
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
            //required
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
            // required
          />
          <label>*Specialities :</label>
          <input
            type="test"
            name="specialities"
            placeholder="specialities"
            value={formData.specialities}
            onChange={handleChange}
            className="styledInput"
          />
          <div>
            <label >facilities:</label>
            <select id="facility" value={selectedFacilityId} onChange={handleChange} required>
            <option value="">Choose a facility</option>
            {faciltys.map((facilty)=>(
            <option key={faciltys.id} value={faciltys.id}>
                {facilty.facilityName}
            </option>
            ))}

            </select>
          </div>
          <button type="submit" className="loginButton">
            Signup Caregiver
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
};
export default CargiverSignup;
