import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import ButtonLink from "./dashboard/ButtonLink";
import axios from "axios";
import "./Dashboard.css";


// div with styles
const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const FooterSpace = styled.div`
  height: 6rem;
  width: 100%;
`;
const IMGHolder = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem 0 1rem 0;
  max-width: 200px;
`;
// img with styles
const LogoContainer = styled.img`
  height: 20rem;
`;
// h2 with styles
const Title = styled.h2`
  font-size: 22px;
`;
// p with styles
const Text = styled.p`
  font-size: 18px;
`;

function UserDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  const [profilePictureURL, setProfilePictureURL] = useState("");

  useEffect(() => {
    const getUserPictureURL = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/find/userURL/${user}`,
          {
            withCredentials: true,
          }
        );
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
    <UserContainer>
      <LogoContainer src={Logo} />
      <Title>User Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <IMGHolder src={checkProfilePicture()} alt="Profile Picture" />
      <div className="dbButtonContainer">
        <ButtonLink
          picture="/src/assets/User Profile Check.svg"
          linkName="Book Doctor"
          link="/calendar"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Calendar 02.svg"
          linkName="Upcoming Appointments"
          link="/appointment"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Inbox 02.svg"
          linkName="Appointment History"
          link="/appointment/history"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/Annotation Information.svg"
          linkName="Give Feedback"
          link="/feedback"
        ></ButtonLink>
        <ButtonLink
          picture="/src/assets/pfp.svg"
          linkName="Change Profile picture"
          link="/change-profile-picture"
        ></ButtonLink>
      </div>
      <Logout />
      <FooterSpace/>
    </UserContainer>
  );
}

export default UserDashboard;
