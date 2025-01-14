import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const [personalInformation, setPersonalInformation] = useState([]);
  const [role, setRole] = useState("Patient: ");
  const {
    authState: { user },
  } = useAuth();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/find/${user}`,
          {
            withCredentials: true,
          }
        );
        setPersonalInformation(response.data);
        if (response.data.roles.includes("ADMIN")) {
          setRole("Admin: ");
        }
      } catch (error) {
        setPersonalInformation("Something went wrong, try again later.");
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="profileMain">
      <h1>Personal Profile</h1>
      <div className="profileMain1">
        <img src="src\assets\ppic.png" alt="profile picture doctor" />
        <p>
          {role} {user}
        </p>
        <h3>{role === "Dr: " ? "ADMIN" : "PATIENT"}</h3>
      </div>
      <div className="profileMain2">
        <h4>Personal Information:</h4>
        <p>First Name: {personalInformation.firstName}</p>
        <p>Last Name: {personalInformation.lastName}</p>
        <p>Email: {personalInformation.mail}</p>
      </div>
    </div>
  );
};
export default Profile;
