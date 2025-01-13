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
    <UserContainer>
      <LogoContainer src={Logo} />
      <Title>User Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <IMGHolder src = {checkProfilePicture()} alt="Profile Picture"/>
      <div className="dbButtonContainer">
        <ButtonLink
          picture="/vite.svg"
          linkName="Appointment"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Book Doctor"
          link="/calendar"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Appointment History"
          link="/appointment/history"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Give Feedback"
          link="/underconstruction"
        ></ButtonLink>
        <ButtonLink
          picture="/vite.svg"
          linkName="Change Profile picture"
          link="/bucket"
        ></ButtonLink>
      </div>
      <Logout />
    </UserContainer>

    /*  
   Så här hade det sett ut utan styled components
   då hade vi kanske lagt homeContainer som en css klass med samma styles 
   som ovan osv.
   <div>
     <img src={Logo} />
     <h2>User Dashboard</h2>    
     <p>Welcome, {user}</p>
     <button>Logout</button>
   </div> */
  );
}

export default UserDashboard;
