import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const [personalInformation, setPersonalInformation] = useState(null);
  const [role, setRole] = useState(null);
  const [doctorGrade, setDoctorGrade] = useState(undefined);
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
        console.log(response.data);
        setPersonalInformation(response.data);
        setRole(response.data.roles);
        if (response.data.roles === "DOCTOR") {
          getGradeForDoctor(response.data.username);
        }
      } catch (error) {
        setPersonalInformation("Something went wrong, try again later.");
      }
    };
    checkAuth();
  }, []);

  

  const getGradeForDoctor = async (username) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/feedback/find/average-grade/${username}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setDoctorGrade(response.data);
    } catch (error) {
      setPersonalInformation("Something went wrong, try again later.");
    }
  };

  const DoctorProfile = () => (
    <div className="profileMain">
      <h1>Doctor Profile</h1>
      <div className="profileMain1">
        <img src="src/assets/ppic.png" alt="profile picture doctor" />
        <p>
          {role} {user}
        </p>
        <h3>Doctor</h3>
        <h2>
          Your Average Grade: <br />
          <br /> <div className="doctorGrade">{doctorGrade}</div>
        </h2>
      </div>
      <div className="profileMain2">
        <h4>Personal Information:</h4>
        <p>First Name: {personalInformation?.firstName}</p>
        <p>Last Name: {personalInformation?.lastName}</p>
        <p>Email: {personalInformation?.mail}</p>
      </div>
    </div>
  );

  const UserProfile = () => (
    <div className="profileMain">
      <h1>Personal Profile</h1>
      <div className="profileMain1">
        <img src="src/assets/ppic.png" alt="profile picture user" />

        <h3>PATIENT</h3>
      </div>
      <div className="profileMain2">
        <h4>Personal Information:</h4>
        <p>First Name: {personalInformation?.firstName}</p>
        <p>Last Name: {personalInformation?.lastName}</p>
        <p>Email: {personalInformation?.mail}</p>
      </div>
    </div>
  );

  const AdminProfile = () => (
    <div className="profileMain">
      <h1>Admin Profile</h1>
      <div className="profileMain1">
        <img src="src/assets/ppic.png" alt="profile picture admin" />
        <p>
          {role}
        </p>
        <h3>ADMIN</h3>
      </div>
      <div className="profileMain2">
        <h4>Personal Information:</h4>
        <p>First Name: {personalInformation?.firstName}</p>
        <p>Last Name: {personalInformation?.lastName}</p>
        <p>Email: {personalInformation?.mail}</p>
      </div>
    </div>
  );

  const profiles = {
    ADMIN: AdminProfile,
    USER: UserProfile,
    DOCTOR: DoctorProfile,
  };

  const SelectedProfile = profiles[role] ?? UserProfile;

  return (
    <div className="profileMain">
      {role && personalInformation ? <SelectedProfile /> : <p>Loading data... Consider load home and return.</p>}
      <div className="footerSpace"></div>
    </div>
  );
};

export default Profile;
