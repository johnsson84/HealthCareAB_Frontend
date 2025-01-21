import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import ButtonLink from "./dashboard/ButtonLink";
import axios from "axios";
import "./Dashboard.css";
// admin page, can only visit if you have role ADMIN

const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;
const IMGHolder = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem 0 1rem 0;
  max-width: 300px;
  max-height: 300px;
`;
const FooterSpace = styled.div`
  height: 4rem;
  width: 100%;
`;

function AdminDashboard() {

  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [profilePictureURL, setProfilePictureURL] = useState("");


  useEffect(() => {
    const getUserPictureURL = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/find/userURL/${user}`, {
          withCredentials: true,
        });
        setProfilePictureURL(import.meta.env.VITE_BUCKET_URL + response.data);
      } catch (error) {
        setProfilePictureURL("Error loading profile picture");
      }
    };
    if (user) getUserPictureURL(); 
  }, [user]); 

  const checkProfilePicture = () => {
    if (profilePictureURL === "") {
      return "Loading profile picture...";
    } else if (profilePictureURL === "Error loading profile picture") {
      return "Error loading profile picture";
    } else {
      return profilePictureURL;
    }
  };

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <IMGHolder src = {checkProfilePicture()} alt="Profile Picture"/>
      <div className="dbButtonContainer">
        <ButtonLink
          picture="/src/assets/Message Chat 01.svg"
          linkName="Appointment"
          link="/Dappointment"
        ></ButtonLink>
        
        <ButtonLink
          picture="/src/assets/User Profile Add 01.svg"
          linkName="Register Admin"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/User Profile Add 01.svg"
          linkName="Register Caregiver"
          link="/underconstruction"
        ></ButtonLink>
        
        <ButtonLink
          picture="/src/assets/Annotation Information.svg"
          linkName="All Feedbacks"
          link="/feedback"
        ></ButtonLink>
        <ButtonLink
        picture="/src/assets/pfp.svg"
          linkName="Change Profile picture"
          link="/change-profile-picture"
        ></ButtonLink>
        <ButtonLink
        picture="/src/assets/pfp.svg"
          linkName="Edit Coworkers Location"
          link="/edit/coworker/location"
        ></ButtonLink>
      </div>
      <Logout />
      <FooterSpace/>

    </AdminContainer>
  );
}

export default AdminDashboard;
